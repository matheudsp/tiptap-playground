import {
  VariableOptionNode,
  NestedVariableData,
  EditorInitData,
} from "@/types";
import { faker } from "@faker-js/faker";

export async function getEditorInitData(): Promise<EditorInitData> {
  const variablesTree = [
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
  ];

  return new Promise<EditorInitData>((resolve) =>
    setTimeout(
      () =>
        resolve({
          // O conteúdo personalizado que você pediu
          content:
            "<p>Olá, {{landlord.name}}! Este é o seu contrato.</p>" +
            "<p>O locatário é {{tenant.name}}, portador do CPF/CNPJ {{tenant.cpfCnpj}}.</p>" +
            "<p>O valor do aluguel é de {{contract.rentAmount}} mensais.</p>" +
            "<p>A duração total do contrato é de {{contract.durationInMonths}} meses.</p>" +
            "<p>Enviaremos a cópia final para os e-mails: {{landlord.email}} e {{tenant.email}}.</p>",
          variables: variablesTree,
        }),
      1000
    )
  );
}

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
