export interface VariableOption {
  id: string;
  label: string;
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
