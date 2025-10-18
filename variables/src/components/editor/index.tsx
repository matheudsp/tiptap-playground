import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  suggestionRenderer,
  customFindSuggestionMatch,
} from "./utils/suggestion";
import { VariablesExtension } from "./extensions/variableExtension";
import { VariablesContextProvider } from "./context/VariablesProvider";
import { useState, useMemo } from "react"; // 1. Importe o useMemo
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEditorInitData } from "@/api";

/**
 * Converte strings do tipo Handlebars (ex: "{{landlord.name}}")
 * para o formato de tag HTML que a extensão do Tiptap entende.
 * (ex: <variable-component id="landlord.name" label="landlord.name"></variable-component>)
 */
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

export const TiptapEditor = () => {
  const [parseVariables, setParseVariables] = useState(false);

  const { data: initData, isLoading } = useQuery({
    queryKey: ["editorInitData"],
    queryFn: getEditorInitData,
  });

  // 2. Use o useMemo para processar o conteúdo recebido
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

      // 3. Use o conteúdo processado aqui
      content: processedContent,
      editorProps: {
        attributes: {
          class:
            "h-[60vh] w-[60vw] prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
        },
      },
    },
    // 4. Atualize a dependência do hook
    [processedContent]
  );

  if (isLoading || !editor) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Carregando editor...</p>
      </div>
    );
  }

  // ... (o resto do seu componente continua igual)
  return (
    <VariablesContextProvider
      parseVariables={parseVariables}
      variableOptions={initData?.variables}
    >
      <div className="w-full h-full flex items-center justify-center">
        <EditorContent editor={editor} />

        <Button onClick={() => setParseVariables(!parseVariables)}>
          Toggle preview
        </Button>
      </div>
    </VariablesContextProvider>
  );
};
