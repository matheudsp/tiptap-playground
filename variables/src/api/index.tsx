import { VariableOptionNode, NestedVariableData } from "@/types";
import { faker } from "@faker-js/faker";

export async function getVariables(): Promise<VariableOptionNode[]> {
  return new Promise<VariableOptionNode[]>((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: "landlord",
            label: "landlord",
            children: [
              { id: "landlord.name", label: "name" },
              { id: "landlord.cpfCnpj", label: "cpfCnpj" },
              { id: "landlord.email", label: "email" },
            ],
          },
          {
            id: "tenant",
            label: "tenant",
            children: [
              { id: "tenant.name", label: "name" },
              { id: "tenant.cpfCnpj", label: "cpfCnpj" },
              { id: "tenant.email", label: "email" },
            ],
          },
          {
            id: "contract",
            label: "contract",
            children: [
              { id: "contract.rentAmount", label: "rentAmount" },
              { id: "contract.durationInMonths", label: "durationInMonths" },
            ],
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
