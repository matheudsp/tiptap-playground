import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  suggestionRenderer,
  customFindSuggestionMatch,
} from "./utils/suggestion";
import { VariablesExtension } from "./extensions/variableExtension";
import { VariablesContextProvider } from "./context/VariablesProvider";
import { useState } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEditorInitData } from "@/api";

export const TiptapEditor = () => {
  const [parseVariables, setParseVariables] = useState(false);

  const { data: initData, isLoading } = useQuery({
    queryKey: ["editorInitData"],
    queryFn: getEditorInitData,
  });

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

      content: initData?.content ?? "",
      editorProps: {
        attributes: {
          class:
            "h-[60vh] w-[60vw] prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
        },
      },
    },
    [initData?.content]
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
      <div className="w-full h-full flex items-center justify-center">
        <EditorContent editor={editor} />

        <Button onClick={() => setParseVariables(!parseVariables)}>
          Toggle preview
        </Button>
      </div>
    </VariablesContextProvider>
  );
};
