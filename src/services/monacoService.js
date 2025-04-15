import * as monaco from "monaco-editor";
import { useTheme } from "@/composables/useTheme";
import { configureLanguage } from "./expressionLanguage.js";
import { watch } from "vue";

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
  // Tema tanımlamalarını önceden yapılandır
  // Light tema tanımı
  monaco.editor.defineTheme("expressionLanguage-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "functionName", foreground: "ec4899", fontStyle: "bold" }, // Pembe renk (light mode)
    ],
    colors: {},
  });

  // Dark tema tanımı
  monaco.editor.defineTheme("expressionLanguage-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "functionName", foreground: "fc8eac", fontStyle: "bold" }, // Pembe renk (dark mode)
    ],
    colors: {},
  });

  // İlk yüklemede tema ayarı
  const editorTheme = isDark.value
    ? "expressionLanguage-dark"
    : "expressionLanguage-light";

  // Tema ayarını hemen uygula
  monaco.editor.setTheme(editorTheme);

  const editorInstance = monaco.editor.create(editor, {
    value,
    language,
    theme: editorTheme,
    automaticLayout: true, // editor boyutu değiştiğinde otomatik yeniden düzenleme
    minimap: { enabled: false }, // Minimap'ı etkinleştirme
    wordWrap: "on", // Kelime sarma
    lineNumbers: "on", // Satır numaralarını gösterme
    contextmenu: true, // Sağ tık menüsünü aktifleştirme

    // Geri alma ve ileri alma desteği için ayarlar
    undoRedoOptions: { undoRedoLimit: 100 },

    // IntelliSense Ayarları
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on",
    tabCompletion: "on",

    // Parametre ipuçları ve imzalar
    parameterHints: {
      enabled: true,
      cycle: true,
    },

    // Öneri kutusu davranışı ve görünümü
    suggest: {
      showIcons: true,
      filterGraceful: true,
      localityBonus: true,
      shareSuggestSelections: true,
      snippetsPreventQuickSuggestions: false,
      showMethods: true,
      showFunctions: true,
      showVariables: true,
      showKeywords: true,
    },
  });

  // Dil konfigürasyonunu ayarla
  configureLanguage(editorInstance);

  // Tema değişikliğini dinle ve editör temasını güncelle
  watch(isDark, (newValue) => {
    const newTheme = newValue
      ? "expressionLanguage-dark"
      : "expressionLanguage-light";
    monaco.editor.setTheme(newTheme);
  });

  return editorInstance;
}
