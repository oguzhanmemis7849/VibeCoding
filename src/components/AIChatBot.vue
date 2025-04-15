<script setup>
import { ref, onMounted, nextTick } from "vue";
import openAIService from "@/services/openaiService";
import { useTheme } from "@/composables/useTheme";
import chatbot from "@/prompts/chatbot.txt";
// Tema bilgisini al
const { isDark } = useTheme();

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
  const chatbotPrompt = await fetch(chatbot).then((res) => res.text());

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
};

// Mesajı gönder (enter tuşu)
const handleKeydown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
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

// Mesaj içeriğini markdown/kod olarak formatla
const formatMessageContent = (content) => {
  // Kod bloklarını işle
  content = content.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="code-block"><code>${code}</code></pre>`;
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
</script>

<template>
  <div class="ai-chatbot" :class="{ 'ai-chatbot--dark': isDark }">
    <div class="ai-chatbot__header">
      <h3 class="ai-chatbot__title">AI Asistan</h3>
      <Button
        icon="pi pi-refresh"
        class="p-button-rounded p-button-text"
        title="Yeni Chat"
        @click="startNewChat"
      />
    </div>

    <div ref="chatContainerRef" class="ai-chatbot__messages">
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
        class="ai-chatbot__input"
        placeholder="Mesajınızı yazın..."
        :disabled="isLoading"
        :autoResize="true"
        rows="1"
        @keydown="handleKeydown"
      />
      <Button
        icon="pi pi-send"
        class="ai-chatbot__send-button"
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
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  height: 100%;
  max-height: 500px;
  overflow-y: auto;
  transition: all 0.3s ease;

  &__empty-message {
    text-align: center;
    color: $sompo-dark-platinum;
    font-size: 14px;
    padding: 16px;
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
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__message-container {
    display: flex;
    flex-direction: column;
    max-width: 80%;

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
    padding: 12px 16px;
    border-radius: 18px;
    word-break: break-word;

    &--user {
      background-color: $sompo-red;
      box-shadow: 0 1px 2px $sompo-dark-platinum;
      color: white;
      border-bottom-right-radius: 4px;
    }

    &--assistant {
      box-shadow: 0 1px 2px $sompo-dark-platinum;
      background-color: $sompo-light-platinum;
      color: #1a202c;
      border-bottom-left-radius: 4px;
    }

    &--error {
      background-color: #ef4444;
      color: white;
    }

    &--typing::after {
      content: "▌";
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
    padding: 16px;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 8px;
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

:deep(.code-block) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 8px 12px;
  margin: 8px 0;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre;
  width: 100%;

  .ai-chatbot--dark & {
    background-color: rgba(0, 0, 0, 0.3);
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
