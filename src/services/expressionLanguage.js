import * as monaco from "monaco-editor";
import { parse } from "@/services/expressionParser";
import { variables } from "@/helpers/monacoVariableList";

let openAIService = null;

/**
 * OpenAI servisini ayarlar.
 * @param {OpenAIService} service
 */
export function setOpenAIService(service) {
  openAIService = service;
}

/**
 * Expression dilimizin konfigürasyonunu gerçekleştiren fonksiyon.
 * @param {monaco.editor.IStandaloneCodeEditor} editor
 */
export function configureLanguage(editor) {
  // 1. Değişken listesini hazırla
  const variableList = Object.values(variables).flat();
  const variableRegexPattern = variableList
    .map((v) => v.replace(/\s/g, "\\s"))
    .join("|");

  // 2. Dili ve temayı kaydet
  monaco.languages.register({ id: "expressionLanguage" });

  // 3. Monarch Tokenizer yapılandırması
  monaco.languages.setMonarchTokensProvider("expressionLanguage", {
    defaultToken: "",
    tokenizer: {
      root: [
        [/\b(eğer|ise|veya|ve|değilse)\b/i, "keyword"],
        [/==|!=|>=|<=|>|</, "operator"],
        [/\d+/, "number"],
        [/'[^']*'/, "string"],
        [new RegExp(`\\b(${variableRegexPattern})\\b`, "i"), "variable"],
        [/\(/, "delimiter.parenthesis"],
        [/\)/, "delimiter.parenthesis"],
        [/\s+/, "white"],
      ],
    },
  });

  // 4. Gelişmiş IntelliSense (Completion) sağlayıcısını ekle
  monaco.languages.registerCompletionItemProvider("expressionLanguage", {
    triggerCharacters: ["(", ")", " ", ".", "'", '"', "=", ">", "<"],

    async provideCompletionItems(model, position) {
      // Mevcut kelime bilgisini ve pozisyonunu elde et
      const wordInfo = model.getWordUntilPosition(position);
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);

      const suggestions = [];

      // Değişken önerileri
      suggestions.push(
        ...variableList.map((variable) => ({
          label: variable,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: variable,
          detail: "Değişken",
          documentation: { value: `**${variable}** değişkeni` },
          sortText: "1",
          filterText: variable.toLowerCase(),
          range: {
            startLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: wordInfo.endColumn,
          },
        }))
      );

      // Keyword önerileri
      const keywords = ["eğer", "ise", "veya", "ve", "değilse"];
      suggestions.push(
        ...keywords.map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: "Anahtar Kelime",
          documentation: { value: `**${keyword}** anahtar kelimesi` },
          sortText: "2",
          filterText: keyword.toLowerCase(),
          range: {
            startLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: wordInfo.endColumn,
          },
        }))
      );

      // Operatör önerileri
      const operators = ["==", "!=", ">", "<", ">=", "<="];
      suggestions.push(
        ...operators.map((op) => ({
          label: op,
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: op,
          detail: "Operatör",
          documentation: { value: `**${op}** operatörü` },
          sortText: "3",
          filterText: op,
          range: {
            startLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: wordInfo.endColumn,
          },
        }))
      );

      // Bağlam tabanlı kod parçacıkları (snippets)
      if (textUntilPosition.trim() === "" || textUntilPosition.endsWith(" ")) {
        suggestions.push({
          label: "eğer koşul",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "eğer (${1:değişken} == ${2:değer})",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Koşul Şablonu",
          documentation: { value: "Basit bir koşul ifadesi oluşturur" },
          sortText: "0",
          range: {
            startLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: wordInfo.endColumn,
          },
        });
      }

      // OpenAI önerileri (eğer servis mevcutsa) - asenkron olarak yükle, başlangıç önerilerini geciktirme
      let aiSuggestions = [];
      if (openAIService) {
        try {
          const context = textUntilPosition.slice(-100);

          // Önce mevcut önerileri döndür, sonra AI önerilerini ekleyelim
          setTimeout(async () => {
            try {
              const aiResponse = await openAIService.generateCompletion(
                "Devamı için koşullu ifade önerisi yap",
                context
              );

              aiSuggestions = aiResponse
                .split("\n")
                .map((suggestion) => suggestion.trim())
                .filter((suggestion) => suggestion.length > 0)
                .map((suggestion, index) => ({
                  label: suggestion,
                  kind: monaco.languages.CompletionItemKind.Text,
                  insertText: suggestion,
                  detail: "AI Önerisi",
                  documentation: { value: "OpenAI tarafından önerildi" },
                  sortText: `4${index.toString().padStart(2, "0")}`,
                  preselect: index === 0,
                  range: {
                    startLineNumber: position.lineNumber,
                    startColumn: wordInfo.startColumn,
                    endLineNumber: position.lineNumber,
                    endColumn: wordInfo.endColumn,
                  },
                }));

              // Editörün öneri listesini güncelle
              if (aiSuggestions.length > 0) {
                editor.trigger("keyboard", "editor.action.triggerSuggest", {});
              }
            } catch (error) {
              console.warn("OpenAI öneri hatası:", error);
            }
          }, 10);
        } catch (error) {
          console.warn("OpenAI öneri hatası:", error);
        }
      }

      return {
        suggestions,
        incomplete: openAIService !== null, // Eğer OpenAI varsa, daha fazla öneri gelebilir
      };
    },

    resolveCompletionItem(item) {
      // Detaylı bilgileri asenkron olarak doldur
      if (
        item.documentation &&
        typeof item.documentation.value === "string" &&
        item.documentation.value.indexOf("**") !== -1
      ) {
        // Markdown formatını zenginleştir
        const enhanced = item.documentation.value.replace(
          /\*\*(.*?)\*\*/g,
          "**$1**\n\n"
        );
        item.documentation = { value: enhanced, isTrusted: true };
      }
      return item;
    },
  });

  // 5. Hover sağlayıcı ekle
  monaco.languages.registerHoverProvider("expressionLanguage", {
    async provideHover(model, position) {
      if (!openAIService) return;
      const word = model.getWordAtPosition(position);
      if (!word) return;

      try {
        const explanation = await openAIService.generateCompletion(
          "Bu terimi koşullu ifadeler bağlamında açıkla",
          word.word
        );
        return {
          contents: [{ value: `**${word.word}**` }, { value: explanation }],
        };
      } catch (error) {
        console.warn("OpenAI hover hatası:", error);
        return null;
      }
    },
  });

  // 6. Hata kontrolü ve marker ekleme
  editor.onDidChangeModelContent(() => {
    const model = editor.getModel();
    const value = model.getValue();
    const markers = [];
    const lines = value.split("\n");

    lines.forEach((line, lineIndex) => {
      if (line.toLowerCase().includes("eğer")) {
        try {
          const parseResult = parse(line);
          console.log(parseResult);

          if (!parseResult.success) {
            const errorDetails = parseResult.errors[0];
            let errorMessage = "Geçersiz ifade yapısı. ";
            if (errorDetails) {
              if (errorDetails.name === "NoViableAltException") {
                errorMessage += "Beklenmeyen terim kullanıldı.";
              } else if (errorDetails.name === "MismatchedTokenException") {
                errorMessage += "Eksik veya hatalı terim.";
              } else {
                errorMessage += errorDetails.message || "Sözdizimi hatası.";
              }
            }
            markers.push({
              severity: monaco.MarkerSeverity.Error,
              message: errorMessage,
              startLineNumber: lineIndex + 1,
              startColumn: 1,
              endLineNumber: lineIndex + 1,
              endColumn: line.length + 1,
            });
          }
        } catch (error) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: `Hata: ${error.message}`,
            startLineNumber: lineIndex + 1,
            startColumn: 1,
            endLineNumber: lineIndex + 1,
            endColumn: line.length + 1,
          });
        }
      }
    });

    monaco.editor.setModelMarkers(model, "expressionLanguage", markers);
  });

  // 7. Dilin yapılandırılması (brackets ve otomatik kapama çiftleri)
  monaco.languages.setLanguageConfiguration("expressionLanguage", {
    brackets: [["(", ")"]],
    autoClosingPairs: [
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });

  // 8. Yeniden tokenizasyon için model update mantığı
  editor.onDidChangeModelContent((event) => {
    if (event.isFlush) return;
    // Tokenizasyon otomatik olarak yapılır,
    // herhangi bir manuel müdahaleye gerek yoktur.
    // Monaco Editor son sürümlerinde tokenization.tokenizeViewport metodu kaldırıldı.
  });
}
