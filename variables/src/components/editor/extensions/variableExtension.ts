import { default as MentionExtension } from "@tiptap/extension-mention";
import {
  ReactNodeViewRenderer,
  mergeAttributes,
  nodeInputRule,
} from "@tiptap/react";
import { Variable } from "../components/Variable";

// 2. ATUALIZE O REGEX:
// O primeiro grupo (externo) captura TUDO o que será substituído ({{...}})
// O segundo grupo (interno) captura APENAS o caminho (landlord.name)
const inputRegex = /({{\s*([^{}\s]+)\s*}})$/;

export const VariablesExtension = MentionExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Variable);
  },
  parseHTML() {
    return [
      {
        tag: "variable-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["variable-component", mergeAttributes(HTMLAttributes)];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          // 'match[1]' é o texto completo: "{{landlord.name}}"
          // 'match[2]' é o texto interno: "landlord.name"
          const path = match[2]; // <-- Use o segundo grupo (match[2])

          return { id: path, label: path };
        },
      }),
    ];
  },
});
