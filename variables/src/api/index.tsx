import { VariableOption, type NestedVariableData } from "@/types";
import { faker } from "@faker-js/faker";

export async function getVariables(): Promise<VariableOption[]> {
  return new Promise<VariableOption[]>((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: "landlord.name", label: "landlord.name" },
          { id: "landlord.cpfCnpj", label: "landlord.cpfCnpj" },
          { id: "landlord.email", label: "landlord.email" },
          { id: "tenant.name", label: "tenant.name" },
          { id: "tenant.cpfCnpj", label: "tenant.cpfCnpj" },
          { id: "tenant.email", label: "tenant.email" },
          { id: "contract.rentAmount", label: "contract.rentAmount" },
          {
            id: "contract.durationInMonths",
            label: "contract.durationInMonths",
          },
        ]),
      1000
    )
  );
}

export async function getVariablesValues(): Promise<NestedVariableData> {
  return new Promise<NestedVariableData>((resolve) =>
    setTimeout(
      () =>
        resolve({
          landlord: {
            name: faker.person.fullName(),
            cpfCnpj: "111.222.333-44",
            email: faker.internet.email(),
          },
          tenant: {
            name: faker.person.fullName(),
            cpfCnpj: "555.666.777-88",
            email: faker.internet.email(),
          },
          contract: {
            rentAmount: faker.finance.amount(1000, 2000, 2, "R$ "),
            durationInMonths: faker.number.int({ min: 12, max: 36 }).toString(),
          },
        }),
      1000
    )
  );
}
