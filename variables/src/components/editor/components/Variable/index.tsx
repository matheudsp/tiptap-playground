import { cn } from "@/lib/utils";
import { NestedVariableData } from "@/types";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useVariablesContext } from "../../context/useVariablesContext";

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
  const variableLabel = `{{${props.node.attrs.label}}}`;

  let foundValue: string | undefined;
  let isError = false;
  const isLoading = !values;

  if (values) {
    foundValue = getValueByPath(values, variableIdPath);
    isError = foundValue === undefined;
  }

  let displayText: string;
  if (parseVariables) {
    if (isLoading) {
      displayText = "carregando...";
    } else if (isError) {
      displayText = variableLabel;
    } else {
      displayText = foundValue!;
    }
  } else {
    displayText = variableLabel;
  }

  const showErrorStyle = !isLoading && isError;

  return (
    <NodeViewWrapper className="inline w-fit">
      <span
        className={cn(
          "rounded bg-neutral-700 px-1 py-0.5 text-custom-primary-100",

          showErrorStyle &&
            "border border-red-600 text-destructive bg-destructive/20"
        )}
      >
        {displayText}
      </span>
    </NodeViewWrapper>
  );
}
