import OpenAI from "openai";
import formatter from "../prompts/formatter.txt";

/**
 * OpenAI API ile iletişim kuran servis
 */
class OpenAIService {
  constructor() {
    this.client = null;
    this.abortController = null;
    this.initialize();
  }

  /**
   * OpenAI istemcisini başlatır
   */
  initialize() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn(
        "OpenAI API anahtarı bulunamadı. Env değişkenlerini kontrol edin."
      );
      return;
    }

    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Not: Gerçek uygulamada bu ayarı kullanmayın, API anahtarlarını sunucu tarafında saklayın
    });
  }

  /**
   * API anahtarını manuel olarak ayarlar
   * @param {string} apiKey - OpenAI API anahtarı
   */
  setApiKey(apiKey) {
    if (!apiKey) {
      throw new Error("API anahtarı boş olamaz.");
    }

    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Not: Gerçek uygulamada bu ayarı kullanmayın, API anahtarlarını sunucu tarafında saklayın
    });
  }

  /**
   * OpenAI'ya istek gönderir
   * @param {string} input - Model için girdi
   * @param {string} instructions - Model için talimatlar
   * @param {Object} options - İstek seçenekleri
   * @returns {Promise<string>} - LLM'den alınan yanıt
   */
  async sendRequest(input, instructions, options = {}) {
    if (!this.client) {
      this.initialize();

      if (!this.client) {
        throw new Error(
          "OpenAI istemcisi başlatılamadı. API anahtarını kontrol edin."
        );
      }
    }

    // Önceki isteği iptal et (varsa)
    if (this.abortController) {
      this.abortController.abort();
    }

    // Yeni bir AbortController oluştur
    this.abortController = new AbortController();

    try {
      const defaultOptions = {
        model: "gpt-4o",
        max_tokens: 2000,
      };

      const requestOptions = { ...defaultOptions, ...options };

      const response = await this.client.chat.completions.create({
        model: requestOptions.model,
        temperature: requestOptions.temperature,
        max_tokens: requestOptions.max_tokens,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: input },
        ],
      });

      // Tamamlandığında AbortController'ı temizle
      this.abortController = null;

      // İlk yanıt mesajını döndür
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content;
      }

      return "";
    } catch (error) {
      // Kullanıcı isteği iptal ettiyse özel hata dön
      if (error.name === "AbortError") {
        throw new Error("İstek iptal edildi.");
      }

      // API hata mesajını daha okunabilir hale getir
      if (error.response) {
        throw new Error(
          `OpenAI API Hatası: ${error.response.status} - ${
            error.response.data?.error?.message || "Bilinmeyen hata"
          }`
        );
      }

      // Diğer hatalar için
      throw new Error(`OpenAI isteği başarısız oldu: ${error.message}`);
    }
  }

  /**
   * Metin formatlamak için OpenAI'ya istek gönderir
   * @param {string} text - Formatlanacak metin
   * @param {Object} options - İstek seçenekleri
   * @returns {Promise<string>} - Formatlanmış metin
   */
  async formatText(text, options = {}) {
    const formatPrompt = await fetch(formatter).then((res) => res.text());
    const defaultFormatOptions = {
      model: "gpt-4o",
    };

    const mergedOptions = { ...defaultFormatOptions, ...options };

    try {
      return await this.sendRequest(text, formatPrompt, mergedOptions);
    } catch (error) {
      console.error("Metin formatlama hatası:", error);
      throw new Error(`Metin formatlanırken bir hata oluştu: ${error.message}`);
    }
  }

  /**
   * Mevcut isteği iptal eder
   */
  cancelRequest() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

// Singleton örneği oluştur
const openAIService = new OpenAIService();

export default openAIService;
