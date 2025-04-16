<script setup>
import { ref, onMounted, nextTick } from "vue";
import openAIService from "@/services/openaiService";
import { useTheme } from "@/composables/useTheme";
import chatbot from "@/prompts/chatbot.txt";
import { useFunctionStore } from "@/stores/function";
import { useEditorStore } from "@/stores/editor";
import { variables } from "@/helpers/monacoVariableList";
// Tema bilgisini al
const { isDark } = useTheme();

const functionStore = useFunctionStore();
const editorStore = useEditorStore();

// Chat durumu ve mesajlar
const messages = ref([]);
const isLoading = ref(false);
const messageInput = ref("");
const chatContainerRef = ref(null);
const isTyping = ref(false);

// Son mesajı göster
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
  }
};

// Mesaj gönderme
const sendMessage = async () => {
  if (!messageInput.value.trim() || isLoading.value) return;

  // Kullanıcı mesajını ekle
  const userMessage = {
    id: Date.now(),
    role: "user",
    content: messageInput.value,
    timestamp: new Date(),
  };
  messages.value.push(userMessage);
  messageInput.value = "";

  // Otomatik kaydır
  await scrollToBottom();

  // Yükleme durumunu ayarla
  isLoading.value = true;

  try {
    // AI yanıtını hazırla - stream ile direkt gösterilecek
    await getAIResponse();

    // Otomatik kaydır
    await scrollToBottom();
  } catch (error) {
    console.error("AI yanıt hatası:", error);

    // Hata mesajı ekle
    messages.value.push({
      id: Date.now(),
      role: "system",
      content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
      timestamp: new Date(),
      isError: true,
    });

    await scrollToBottom();
  } finally {
    isLoading.value = false;
    isTyping.value = false;
  }
};

// AI yanıtını alma
const getAIResponse = async () => {
  // Chatbot prompt'unu al
  let chatbotPrompt = await fetch(chatbot).then((res) => res.text());

  chatbotPrompt +=
    "\n\n" +
    "Güncel fonksiyonlarımız: " +
    JSON.stringify(functionStore.functions) +
    "\n\n";

  chatbotPrompt +=
    "\n\n" + "Güncel variables: " + JSON.stringify(variables) + "\n\n";

  // Mesaj geçmişini formatla
  const formattedMessages = [
    { role: "system", content: chatbotPrompt },
    ...messages.value
      .map((msg) => ({
        role: msg.role === "system" ? "system" : msg.role,
        content: msg.content,
      }))
      .filter((msg) => !msg.isTyping), // Typing mesajlarını filtrele
  ];

  // Geçici bir mesaj olarak göster
  const messageId = Date.now();
  messages.value.push({
    id: messageId,
    role: "assistant",
    content: "",
    timestamp: new Date(),
    isTyping: true,
  });

  await scrollToBottom();

  // Stream callback - yeni veri geldiğinde çağrılacak
  const handleStreamMessage = (chunk, fullText, isDone) => {
    // Son mesajı bul ve güncelle
    const lastMessage = messages.value.find((m) => m.id === messageId);
    if (lastMessage) {
      lastMessage.content = fullText;
      if (isDone) {
        lastMessage.isTyping = false; // Yazma durumunu kapat
      }
      scrollToBottom();
    }
  };

  // Stream isteği gönder
  try {
    await openAIService.streamChatCompletion(
      formattedMessages,
      handleStreamMessage
    );
  } catch (error) {
    // Son mesajı kaldır
    const index = messages.value.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      messages.value.splice(index, 1);
    }
    throw error;
  }
};

// Yeni chat başlat
const startNewChat = () => {
  messages.value = [];
  isLoading.value = false;
  messageInput.value = "";
  isTyping.value = false;
  editorStore.clearPendingCode();
};

// Mesajı gönder (enter tuşu)
const handleKeydown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Mesaj içeriğini markdown/kod olarak formatla
const formatMessageContent = (content) => {
  // Benzersiz ID ile her kod bloğunu işaretle
  let codeBlockId = 0;

  // Kod bloklarını işle
  content = content.replace(/```([\s\S]*?)```/g, (match, code) => {
    codeBlockId++; // Her kod bloğu için benzersiz ID
    // Kodun başındaki ve sonundaki boşlukları temizle
    const trimmedCode = code.trim();
    return `<div>
              <pre class="code-block"><code>${trimmedCode}</code></pre>
              <button class="code-apply-button" data-code-id="${codeBlockId}" data-code="${encodeURIComponent(
      trimmedCode
    )}">Editöre Uygula</button>
            </div>`;
  });

  // Satır içi kod
  content = content.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  );

  // Basit markdown: kalın
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Basit markdown: italik
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Satır sonlarını <br> ile değiştir
  content = content.replace(/\n/g, "<br>");

  return content;
};

// Kod bloğunu editöre uygula
const applyCodeToEditor = async (codeText) => {
  try {
    isLoading.value = true;

    // Kodu formatla
    const formattedCode = await openAIService.formatText(codeText);

    // Store'a gönder
    editorStore.setCodeFromAI(formattedCode || codeText);

    // Başarı mesajı göster
    messages.value.push({
      id: Date.now(),
      role: "system",
      content:
        "Kod editöre uygulandı! Editör sekmesine geçerek kodu görebilirsiniz.",
      timestamp: new Date(),
    });

    await scrollToBottom();
  } catch (error) {
    console.error("Kod uygulama hatası:", error);

    // Hata mesajı ekle
    messages.value.push({
      id: Date.now(),
      role: "system",
      content:
        "Kod editöre uygulanırken bir hata oluştu. Lütfen tekrar deneyin.",
      timestamp: new Date(),
      isError: true,
    });

    await scrollToBottom();
  } finally {
    isLoading.value = false;
  }
};

// Buton tıklamalarını dinle - olay delegasyonu kullanılıyor
const handleMessageClick = (event) => {
  const target = event.target;
  if (target.classList.contains("code-apply-button")) {
    const codeData = target.getAttribute("data-code");
    if (codeData) {
      // URL kodunu çöz
      const codeText = decodeURIComponent(codeData);
      applyCodeToEditor(codeText);
    }
  }
};

// Komponenti monte et
onMounted(() => {
  // Hoşgeldin mesajı ekle
  messages.value.push({
    id: Date.now(),
    role: "assistant",
    content: "Merhaba! Size nasıl yardımcı olabilirim?",
    timestamp: new Date(),
  });
});

// Tarih formatla
const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="ai-chatbot" :class="{ 'ai-chatbot--dark': isDark }">
    <div class="ai-chatbot__header">
      <h3 class="ai-chatbot__title">AI Asistan</h3>
      <Button
        size="small"
        severity="warn"
        title="Yeni Chat"
        label="Yeni Chat"
        @click="startNewChat"
      />
    </div>

    <div
      ref="chatContainerRef"
      class="ai-chatbot__messages"
      @click="handleMessageClick"
    >
      <template v-if="messages.length > 0">
        <div
          v-for="message in messages"
          :key="message.id"
          class="ai-chatbot__message-container"
          :class="{
            'ai-chatbot__message-container--user': message.role === 'user',
            'ai-chatbot__message-container--assistant':
              message.role === 'assistant',
            'ai-chatbot__message-container--system': message.role === 'system',
          }"
        >
          <div
            class="ai-chatbot__message"
            :class="{
              'ai-chatbot__message--user': message.role === 'user',
              'ai-chatbot__message--assistant': message.role === 'assistant',
              'ai-chatbot__message--error': message.isError,
              'ai-chatbot__message--typing': message.isTyping,
            }"
            v-html="formatMessageContent(message.content)"
          ></div>
          <div class="ai-chatbot__message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </template>
      <template v-else>
        <p class="ai-chatbot__empty-message">Nasıl yardımcı olabilirim?</p>
      </template>
    </div>

    <div class="ai-chatbot__input-container">
      <Textarea
        v-model="messageInput"
        class="w-full"
        placeholder="Herhangi bir şey sor"
        :disabled="isLoading"
        :autoResize="true"
        rows="1"
        @keydown="handleKeydown"
      />
      <Button
        icon="pi pi-send"
        :disabled="isLoading || !messageInput.trim()"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai-chatbot {
  display: flex;
  flex-direction: column;
  background-color: $sompo-light-platinum;
  border-radius: 8px;
  border: 1px solid $sompo-medium-platinum;
  height: $ai-chatbot-height;
  padding: 1rem;
  overflow-y: auto;
  transition: all 0.3s ease;

  &__empty-message {
    text-align: center;
    color: $sompo-dark-platinum;
    font-size: 14px;
  }

  &--dark {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;

    .ai-chatbot__message {
      &--user {
        background-color: $sompo-red;
        color: white;
      }

      &--assistant {
        background-color: #3a4860;
        color: #e2e8f0;
      }

      &--error {
        background-color: #ef4444;
        color: white;
      }
    }

    .ai-chatbot__input {
      background-color: #1a202c;
      border-color: #4a5568;
      color: #e2e8f0;

      &::placeholder {
        color: #a0aec0;
      }
    }

    .ai-chatbot__message-time {
      color: #a0aec0;
    }
  }

  &__header {
    border-bottom: 1px solid $sompo-medium-platinum;
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__message-container {
    display: flex;
    flex-direction: column;
    max-width: 60%;

    &--user {
      align-self: flex-end;
      align-items: flex-end;
    }

    &--assistant {
      align-self: flex-start;
      align-items: flex-start;
    }

    &--system {
      align-self: center;
      align-items: center;
    }
  }

  &__message {
    padding: 10px 12px;
    border-radius: 16px;
    word-break: break-word;

    &--user {
      background-color: $sompo-red;
      box-shadow: 0 1px 2px $sompo-dark-platinum;
      color: white;
      border-bottom-right-radius: 0;
    }

    &--assistant {
      box-shadow: 0 1px 2px $sompo-dark-platinum;
      background-color: $sompo-medium-platinum;
      color: #000;
      border-bottom-left-radius: 0;
    }

    &--error {
      background-color: #ef4444;
      color: white;
    }

    &--typing::after {
      content: "|";
      display: inline-block;
      animation: blink 1s step-start infinite;
    }
  }

  &__message-time {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
    padding: 0 4px;
  }

  &__input-container {
    border-top: 1px solid $sompo-medium-platinum;
    padding-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  &__input {
    flex: 1;
    resize: none;
    max-height: 120px;
  }

  &__send-button {
    align-self: flex-end;
  }
}

.code-apply-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: $sompo-red !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  padding: 4px 8px !important;
  font-size: 12px !important;
  cursor: pointer !important;
  z-index: 10 !important;
  opacity: 0.8 !important;
  transition: opacity 0.2s ease !important;

  &:hover {
    opacity: 1 !important;
  }

  .ai-chatbot--dark & {
    background-color: #3a4860 !important;
  }
}

:deep(.code-block) {
  background-color: $sompo-light-platinum;
  border-radius: 6px;
  padding: 12px !important;
  padding-top: 12px !important; /* Buton için ek padding */
  margin: 0 !important;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre;
  width: 100%;
  display: block;

  .ai-chatbot--dark & {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

:deep(.code-apply-button) {
  padding: 8px 12px !important;
  border-radius: 4px !important;
  background-color: #22c55e !important;
  color: white !important;
  transition: all 0.2s ease !important;

  &:hover {
    background-color: #16a34a !important;
  }

  &:active {
    background-color: #15803d !important;
  }
}

:deep(.inline-code) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 2px 4px;
  font-family: monospace;
  font-size: 0.9em;

  .ai-chatbot--dark & {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
