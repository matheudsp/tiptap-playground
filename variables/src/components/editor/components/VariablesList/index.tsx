import { cn } from "@/lib/utils";
import { VariableOptionNode } from "@/types";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useVariablesContext } from "../../context/useVariablesContext";
const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="font-mono rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
    {children}
  </kbd>
);

function deriveStateFromQuery(
  tree: VariableOptionNode[],
  query: string
): {
  navPath: VariableOptionNode[];
  currentLevelNodes: VariableOptionNode[];
  searchTerm: string;
} {
  if (!tree) {
    return { navPath: [], currentLevelNodes: [], searchTerm: "" };
  }

  const parts = query.split(".");
  const searchTerm = parts.pop() || "";
  const navPath: VariableOptionNode[] = [];
  let currentLevelNodes = tree;

  for (const part of parts) {
    const node = currentLevelNodes.find((n) => n.label === part);
    if (node && node.children) {
      navPath.push(node);
      currentLevelNodes = node.children;
    } else {
      // Caminho inválido (ex: "landlord.foo"), reseta
      return { navPath: [], currentLevelNodes: tree, searchTerm: query };
    }
  }

  return { navPath, currentLevelNodes, searchTerm };
}

export const VariablesList = forwardRef<
  ReturnType<NonNullable<SuggestionOptions["render"]>>,
  SuggestionProps<VariableOptionNode>
>(({ command, query, editor, range }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { variableOptions } = useVariablesContext();

  const { navPath, currentLevelNodes, searchTerm } = deriveStateFromQuery(
    variableOptions ?? [],
    query
  );

  const items = (currentLevelNodes ?? []).filter((item) =>
    item.label.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setSelectedIndex(0);
  }, [items.length]);

  const navigateBack = () => {
    const parts = query.split(".");
    parts.pop(); // Remove o termo de pesquisa atual
    parts.pop(); // Remove o último nível do caminho

    const newQuery = parts.length > 0 ? parts.join(".") + "." : "";

    editor.chain().focus().insertContentAt(range, newQuery).run();
  };

  const selectItem = (index: number) => {
    const item = items[index];
    if (!item) return;

    if (item.children) {
      const newQuery =
        navPath
          .map((n) => n.label)
          .concat(item.label)
          .join(".") + ".";

      editor
        .chain()
        .focus()
        .insertContentAt(range, "{{" + newQuery)
        .run();
    } else {
      command({
        id: item.id,
        label: item.id,
      });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      if (
        event.key === "Backspace" &&
        searchTerm.length === 0 &&
        navPath.length > 0
      ) {
        navigateBack();
        return true;
      }
      return false;
    },
  }));

  const breadcrumb = navPath.map((node) => node.label).join(" > ");

  return (
    <div className="min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md flex flex-col">
      {navPath.length > 0 && (
        <div className="flex items-center border-b pb-1 mb-1">
          <button
            onClick={navigateBack}
            className="rounded-sm px-2 py-1 text-sm opacity-70 hover:opacity-100"
          >
            &lt; Voltar
          </button>
          <span className="text-sm opacity-50 truncate px-2">{breadcrumb}</span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              className={cn(
                "relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full",
                index === selectedIndex && "bg-accent text-accent-foreground"
              )}
              key={item.id}
              onClick={() => selectItem(index)}
            >
              {item.label}
              {item.children && <span className="opacity-50 ml-2">&gt;</span>}
            </button>
          ))
        ) : (
          <div className="text-sm p-2 text-muted-foreground">
            Sem resultados.
          </div>
        )}
      </div>

      <div className="border-t mt-1 pt-1.5 px-2 flex items-center justify-between text-xs text-muted-foreground space-x-2">
        <div className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span className="">Navegar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          <span className="">Selecionar</span>
        </div>

        {navPath.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Kbd>⌫</Kbd>
            <span className="">Voltar</span>
          </div>
        )}
      </div>
    </div>
  );
});
