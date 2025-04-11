export function useGlobalToast(app) {
  const toast = app.config.globalProperties.$toast;
  /**
   * @param {Object} options
   * @param {string} options.severity
   * @param {string} options.summary
   * @param {string} options.detail
   * @param {number} options.life
   * @returns {void}
   * @example
   * import { getCurrentInstance } from 'vue';
   *
   * const { proxy } = getCurrentInstance();
   *
   * proxy.$toast.showToast({
   *  severity: "success",
   *  summary: "Success Message",
   *  detail: "Message Content",
   *  life: 3000
   * });
   *
   */
  const showToast = ({ severity, summary, detail, life }) => {
    toast.emit("add", {
      severity: severity || "info", // info | success | warn | error | secondary | contrast
      summary: summary || "",
      detail: detail || "",
      life: life,
    });
  };

  return {
    showToast,
  };
}
