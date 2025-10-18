import { VariablesContext } from "./VariablesContext";
import { useQuery } from "@tanstack/react-query";
import { getVariablesValues } from "@/api";
import { VariableOptionNode } from "@/types";

export function VariablesContextProvider({
  children,
  parseVariables,
  variableOptions,
}: {
  children: React.ReactNode;
  parseVariables: boolean;
  variableOptions: VariableOptionNode[] | undefined;
}) {
  const { data: values } = useQuery({
    queryKey: ["variable-values"],
    queryFn: getVariablesValues,
  });

  return (
    <VariablesContext.Provider
      value={{ values, parseVariables, variableOptions }}
    >
      {children}
    </VariablesContext.Provider>
  );
}
