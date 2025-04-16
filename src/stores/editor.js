import { defineStore } from "pinia";

/**
 * Editor Store - Kod editör ve AI Chatbot arasında iletişimi sağlar
 * Chatbot'tan gelen kodların editöre aktarılmasını yönetir
 */
export const useEditorStore = defineStore("editor", {
  state: () => ({
    // Formatlanmış ve editöre aktarılmaya hazır kod
    formattedCode: "",
    // Kodun kaynağı (örn: "chatbot")
    codeSource: "",
    // Yeni kod eklendiğinde true olur, uygulama sonrası false yapılır
    hasPendingCode: false,
    // Kod uygulama işlemi başarılıysa true olur
    isApplied: false,
    // Herhangi bir hata durumu
    error: null,
  }),

  actions: {
    /**
     * AI Chatbot'tan gelen kodu store'a ekler
     * @param {string} code - Formatlanmış kod
     * @param {string} source - Kodun kaynağı (örn: "chatbot")
     */
    setCodeFromAI(code, source = "chatbot") {
      this.formattedCode = code;
      this.codeSource = source;
      this.hasPendingCode = true;
      this.isApplied = false;
      this.error = null;
    },

    /**
     * Kodun uygulandığını işaretle
     * @param {boolean} success - İşlem başarılı mı?
     * @param {string|null} error - Varsa hata mesajı
     */
    markAsApplied(success = true, error = null) {
      this.isApplied = success;
      this.hasPendingCode = false;
      this.error = error;

      // Eğer başarılıysa, bir süre sonra isApplied'ı sıfırla
      if (success) {
        setTimeout(() => {
          this.isApplied = false;
        }, 3000);
      }
    },

    /**
     * Store'u temizle
     */
    clearPendingCode() {
      this.formattedCode = "";
      this.codeSource = "";
      this.hasPendingCode = false;
      this.isApplied = false;
      this.error = null;
    },
  },
});
