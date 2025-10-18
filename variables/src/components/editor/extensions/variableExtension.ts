import { default as MentionExtension } from "@tiptap/extension-mention";
import {
  ReactNodeViewRenderer,
  mergeAttributes,
  nodeInputRule,
} from "@tiptap/react";
import { Variable } from "../components/Variable";

const inputRegex = /({{\s*([^{}\s]+)\s*}})$/;

export const VariablesExtension = MentionExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Variable);
  },

  parseHTML() {
    return [
      {
        tag: "variable-component",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          const id = element.getAttribute("id");
          const label = element.getAttribute("label");

          return { id, label };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["variable-component", mergeAttributes(HTMLAttributes)];
  },
  renderText({ node }) {
    return `{{${node.attrs.id}}}`;
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const path = match[2];
          return { id: path, label: path };
        },
      }),
    ];
  },
});
