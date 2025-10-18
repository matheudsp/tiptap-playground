export interface VariableOptionNode {
  id: string;
  label: string;
  children?: VariableOptionNode[];
}

export interface NestedVariableData {
  landlord: {
    name: string;
    cpfCnpj: string;
    email: string;
  };
  tenant: {
    name: string;
    cpfCnpj: string;
    email: string;
  };
  contract: {
    rentAmount: string;
    durationInMonths: string;
  };
}

export interface EditorInitData {
  content: string;
  variables: VariableOptionNode[];
}
