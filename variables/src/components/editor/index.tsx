import { useEditor, EditorContent, Editor } from "@tiptap/react"; // 1. Importe o tipo 'Editor'
import StarterKit from "@tiptap/starter-kit";
import {
  suggestionRenderer,
  customFindSuggestionMatch,
} from "./utils/suggestion";
import { VariablesExtension } from "./extensions/variableExtension";
import { VariablesContextProvider } from "./context/VariablesProvider";
import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEditorInitData } from "@/api";

function preprocessContent(content: string | undefined): string {
  if (!content) {
    return "";
  }
  const regex = /{{\s*([^{}\s]+)\s*}}/g;
  return content.replace(
    regex,
    (match, path) =>
      `<variable-component id="${path}" label="${path}"></variable-component>`
  );
}

/**
 * Converte o HTML serializado do Tiptap (com <variable-component...>)
 * de volta para o formato Handlebars (com {{...}}) que o backend espera.
 */
function serializeContentForBackend(html: string): string {
  const regex =
    /<variable-component[^>]*data-id="([^"]+)"[^>]*><\/variable-component>/g;

  return html.replace(regex, (match, id) => {
    return `{{${id}}}`;
  });
}

/**
 * Pega o conteúdo atual do editor, serializa para o formato Handlebars
 * e inicia o download de um arquivo .html.
 */
function exportHtmlFile(editor: Editor) {
  const rawHtml = editor.getHTML();
  const contentForBackend = serializeContentForBackend(rawHtml);
  const blob = new Blob([contentForBackend], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "template.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export const TiptapEditor = () => {
  const [parseVariables, setParseVariables] = useState(false);

  const { data: initData, isLoading } = useQuery({
    queryKey: ["editorInitData"],
    queryFn: getEditorInitData,
  });

  const processedContent = useMemo(
    () => preprocessContent(initData?.content),
    [initData?.content]
  );

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        VariablesExtension.configure({
          suggestion: {
            char: "{{",
            findSuggestionMatch: customFindSuggestionMatch,
            ...suggestionRenderer,
          },
        }),
      ],
      content: processedContent,
      editorProps: {
        attributes: {
          class:
            "h-[60vh] w-[60vw] prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
        },
      },
    },
    [processedContent]
  );

  if (isLoading || !editor) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Carregando editor...</p>
      </div>
    );
  }

  return (
    <VariablesContextProvider
      parseVariables={parseVariables}
      variableOptions={initData?.variables}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <EditorContent editor={editor} />

        <div className="flex gap-2 mt-4">
          <Button onClick={() => setParseVariables(!parseVariables)}>
            Toggle preview
          </Button>

          <Button variant="outline" onClick={() => exportHtmlFile(editor)}>
            Exportar HTML
          </Button>
        </div>
      </div>
    </VariablesContextProvider>
  );
};
