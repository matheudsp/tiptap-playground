import { NestedVariableData } from "@/types";
import { createContext } from "react";

interface VariablesContextProps {
  values: NestedVariableData | undefined;
  parseVariables: boolean;
}

export const VariablesContext = createContext<
  VariablesContextProps | undefined
>(undefined);
