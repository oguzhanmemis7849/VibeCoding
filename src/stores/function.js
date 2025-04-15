import { defineStore } from "pinia";

/**
 * @typedef {Object} Function
 * @property {string} name - Fonksiyon ismi
 * @property {string} code - Fonksiyon kodu
 * @property {Date} createdAt - Oluşturulma tarihi
 * @property {string} [description] - Fonksiyon açıklaması (opsiyonel)
 */

// Başlangıç fonksiyonları
const initialFunctions = [
  {
    name: "SMSGönder",
    code: "eğer (müşteri telefon numarası == 'Evet' ve müşteri mesajı == 'Evet') ",
    createdAt: new Date(),
  },
  {
    name: "EmailGönder",
    code: "eğer (müşteri email adresi == 'Evet' ve müşteri mesajı == 'Evet') ",
    createdAt: new Date(Date.now() - 86400000), // 1 gün önce
  },
];

export const useFunctionStore = defineStore("function", {
  state: () => ({
    functions: [...initialFunctions],
  }),
  getters: {
    /**
     * Fonksiyonları isme göre alfabetik olarak sıralar
     * @returns {Function[]}
     */
    sortedFunctions: (state) => {
      return [...state.functions].sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * İsme göre fonksiyon bulur
     * @param {string} name - Fonksiyon ismi
     * @returns {Function|undefined}
     */
    findByName: (state) => (name) => {
      return state.functions.find((f) => f.name === name);
    },
  },
  actions: {
    /**
     * Yeni fonksiyon ekler
     * @param {Function} func - Eklenecek fonksiyon
     */
    addFunction(func) {
      // createdAt değeri yoksa ekle
      if (!func.createdAt) {
        func.createdAt = new Date();
      }

      this.functions.push(func);
    },

    /**
     * Fonksiyonu kaldırır
     * @param {Function|string} func - Kaldırılacak fonksiyon veya fonksiyon ismi
     */
    removeFunction(func) {
      if (typeof func === "string") {
        // Eğer string (isim) gönderilmişse, isime göre kaldır
        this.functions = this.functions.filter((f) => f.name !== func);
      } else {
        // Fonksiyon objesi gönderilmişse
        this.functions = this.functions.filter((f) => f !== func);
      }
    },

    /**
     * Fonksiyonu günceller
     * @param {string} functionName - Güncellenecek fonksiyonun ismi
     * @param {Function} newFunc - Yeni fonksiyon bilgileri
     */
    updateFunction(functionName, newFunc) {
      const index = this.functions.findIndex((f) => f.name === functionName);
      if (index !== -1) {
        this.functions[index] = newFunc;
      }
    },
  },
});
