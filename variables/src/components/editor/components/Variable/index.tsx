import { cn } from "@/lib/utils";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useVariablesContext } from "../../context/useVariablesContext";
import { NestedVariableData } from "@/types";

function getValueByPath(
  obj: NestedVariableData,
  path: string
): string | undefined {
  const keys = path.split(".");

  let result: any = obj;

  for (const key of keys) {
    if (result === null || typeof result !== "object" || !(key in result)) {
      return undefined; // Caminho inválido ou valor não encontrado
    }
    result = result[key];
  }

  return typeof result === "string" ? result : undefined;
}

export function Variable(props: NodeViewProps) {
  const { parseVariables, values } = useVariablesContext();
  const variableIdPath = props.node.attrs.id;

  const getDisplayValue = () => {
    if (parseVariables) {
      if (!values) return "loading...";

      const foundValue = getValueByPath(values, variableIdPath);
      return foundValue ?? `variable not found`;
    } else {
      return `{{${props.node.attrs.label}}}`;
    }
  };

  return (
    <NodeViewWrapper className="inline w-fit">
      <span
        className={cn(
          "rounded bg-neutral-700 px-1 py-0.5 text-custom-primary-100"
        )}
      >
        {getDisplayValue()}
      </span>
    </NodeViewWrapper>
  );
}
