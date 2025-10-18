import { getVariables } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { VariableOptionNode } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="font-mono rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
    {children}
  </kbd>
);

export const VariablesList = forwardRef<
  ReturnType<NonNullable<SuggestionOptions["render"]>>,
  SuggestionProps<VariableOptionNode>
>(({ command, query }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [navPath, setNavPath] = useState<VariableOptionNode[]>([]);

  const { data: variablesTree, isLoading } = useQuery({
    queryKey: ["variable-options"],
    queryFn: getVariables,
  });

  const currentLevelNodes =
    navPath.length > 0 ? navPath[navPath.length - 1].children : variablesTree;

  const items = (currentLevelNodes ?? []).filter((item) =>
    item.label.toLowerCase().startsWith(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [items.length, navPath.length]);

  const navigateBack = () => {
    if (navPath.length > 0) {
      setNavPath(navPath.slice(0, -1));
    }
  };

  const selectItem = (index: number) => {
    const item = items[index];

    if (item) {
      if (item.children) {
        setNavPath([...navPath, item]);
      } else {
        command({
          id: item.id,
          label: item.id,
        });
      }
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

      if (event.key === "Backspace" && navPath.length > 0) {
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
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </>
        ) : (
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
