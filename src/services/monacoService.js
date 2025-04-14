import * as monaco from "monaco-editor";
import { useTheme } from "@/composables/useTheme";
import { configureLanguage } from "./expressionLanguage.js";

const { isDark } = useTheme();

/**
 * Belirtilen container üzerinde Monaco Editor oluşturur.
 * @param {HTMLElement} container - Editor için DOM elementi.
 * @param {String} value - Başlangıç kodu.
 * @param {String} language - Kod dili (örn: 'javascript').
 * @returns {monaco.editor.IStandaloneCodeEditor}
 */
export function createMonacoEditor(
  editor,
  value = "",
  language = "expressionLanguage"
) {
  const editorInstance = monaco.editor.create(editor, {
    value,
    language,
    theme: isDark.value ? "vs-dark" : "vs-light",
    automaticLayout: true, // editor boyutu değiştiğinde otomatik yeniden düzenleme
    minimap: { enabled: false }, // Minimap'ı etkinleştirme
    wordWrap: "on", // Kelime sarma
    lineNumbers: "on", // Satır numaralarını gösterme
    contextmenu: true, // Sağ tık menüsünü aktifleştirme
    // quickSuggestions: true, // Hızlı önerileri etkinleştirme
    // suggestOnTriggerCharacters: true, // Önerileri tetikleyici karakterlerde gösterme
    // tabCompletion: "on",
    // parameterHints: {
    //   enabled: true, // Fonksiyon parametre ipuçlarını etkinleştirme
    // },
  });

  configureLanguage(editorInstance);

  return editorInstance;
}
