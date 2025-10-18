import { cn } from "@/lib/utils";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useVariablesContext } from "../../context/useVariablesContext";
import { NestedVariableData } from "@/types";

function getValueByPath(
  obj: NestedVariableData,
  path: string
): string | undefined {
  // Converte "landlord.name" para ["landlord", "name"]
  const keys = path.split(".") as Array<keyof NestedVariableData>;

  // Use 'reduce' para navegar no objeto de forma segura
  const result = keys.reduce<NestedVariableData | string | undefined>(
    (current, key) => {
      // Verifica se o nível atual é um objeto válido antes de prosseguir
      if (current && typeof current === "object" && key in current) {
        return (current as any)[key];
      }
      return undefined;
    },
    obj
  );

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
