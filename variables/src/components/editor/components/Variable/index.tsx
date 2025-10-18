import { cn } from "@/lib/utils";
import { NestedVariableData } from "@/types";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useVariablesContext } from "../../context/useVariablesContext";

// Função auxiliar (sem alterações)
function getValueByPath(
  obj: NestedVariableData,
  path: string
): string | undefined {
  const keys = path.split(".");

  let result: any = obj;

  for (const key of keys) {
    if (result === null || typeof result !== "object" || !(key in result)) {
      return undefined;
    }
    result = result[key];
  }

  return typeof result === "string" ? result : undefined;
}

export function Variable(props: NodeViewProps) {
  const { parseVariables, values } = useVariablesContext();
  const variableIdPath = props.node.attrs.id;

  // O label (caminho completo)
  const variableLabel = `{{${props.node.attrs.label}}}`;

  // getDisplayValue agora retorna um objeto
  const getDisplayValue = (): { text: string; isError: boolean } => {
    if (parseVariables) {
      if (!values) return { text: "loading...", isError: false };

      const foundValue = getValueByPath(values, variableIdPath);

      if (foundValue === undefined) {
        // Erro: Variável não encontrada. Retorna o label e o status de erro.
        return { text: variableLabel, isError: true };
      }

      // Sucesso: Retorna o valor encontrado
      return { text: foundValue, isError: false };
    } else {
      // Modo de edição: Retorna o label
      return { text: variableLabel, isError: false };
    }
  };

  const display = getDisplayValue();

  return (
    <NodeViewWrapper className="inline w-fit">
      <span
        className={cn(
          "rounded bg-neutral-700 px-1 py-0.5 text-custom-primary-100",

          // Aplica classes de erro condicionalmente
          display.isError &&
            "border border-red-600 text-destructive bg-destructive/20"
        )}
      >
        {display.text}
      </span>
    </NodeViewWrapper>
  );
}
