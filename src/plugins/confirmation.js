export function useGlobalConfirmation(app) {
  const confirm = app.config.globalProperties.$confirm;

  /**
   * @param {Object} options
   * @param {string} options.header
   * @param {string} options.message
   * @param {string} options.position
   * @param {Object} options.acceptProps
   * @param {Object} options.rejectProps
   * @param {boolean} options.blockScroll
   * @param {Function} options.onAccept
   * @param {Function} options.onReject
   * @returns {void}
   * @example
   * import { getCurrentInstance } from 'vue';
   *
   * const { proxy } = getCurrentInstance();
   *
   * proxy.$confirm.showConfirmation({
   *  header: "Confirm Delete",
   *  message: "Are you sure you want to delete this item?",
   *  onAccept: () => { console.log("Deleted"); },
   *  onReject: () => { console.log("Cancelled"); }
   * });
   */
  const showConfirmation = ({
    header,
    message,
    position = "center", // 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | undefined
    acceptProps = {
      label: "Evet",
      severity: "primary",
    },
    rejectProps = {
      label: "Hayır",
      severity: "contrast",
      variant: "outlined",
    },
    blockScroll = true,
    onAccept,
    onReject,
  }) => {
    confirm.require({
      header,
      message,
      position,
      blockScroll,
      acceptProps,
      rejectProps,
      accept: () => {
        if (onAccept) onAccept();
      },
      reject: () => {
        if (onReject) onReject();
      },
    });
  };

  return {
    showConfirmation,
  };
}
