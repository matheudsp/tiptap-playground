import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { VariablesList } from "../components/VariablesList";
import { VariableOptionNode } from "@/types";
import type { Range } from "@tiptap/core";
import type { ResolvedPos } from "@tiptap/pm/model";
export type SuggestionMatch = {
  range: Range;
  query: string;
  text: string;
} | null;

export interface Trigger {
  $position: ResolvedPos;
}

const triggerRegex = /{{\s*([^{}\s]*)$/gm;

export function customFindSuggestionMatch(config: Trigger): SuggestionMatch {
  const { $position } = config;

  const text = $position.nodeBefore?.isText && $position.nodeBefore.text;

  if (!text) {
    return null;
  }

  const textFrom = $position.pos - text.length;
  const match = Array.from(text.matchAll(triggerRegex)).pop();

  if (!match || match.input === undefined || match.index === undefined) {
    return null;
  }

  const from = textFrom + match.index;
  const to = from + match[0].length;

  if (from <= $position.pos && to >= $position.pos) {
    return {
      range: {
        from,
        to,
      },
      query: match[1],
      text: match[0],
    };
  }

  return null;
}

export const suggestionRenderer: Partial<
  SuggestionOptions<VariableOptionNode>
> = {
  render: () => {
    let component: ReactRenderer<
      ReturnType<NonNullable<SuggestionOptions["render"]>>,
      SuggestionProps<VariableOptionNode>
    >;
    let popup: Instance;

    return {
      onStart: (props) => {
        component = new ReactRenderer(VariablesList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy(document.body as Element, {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup.setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup.hide();

          return true;
        }

        return !!component?.ref?.onKeyDown?.(props);
      },

      onExit() {
        popup.destroy();
        component.destroy();
      },
    };
  },
};
