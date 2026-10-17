import { cn } from "@/lib/cn";

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code
          key={i}
          className="rounded-sm bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-medium text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function MessageBody({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/```/);
  return (
    <div className={cn("hina-copy space-y-3 text-sm leading-relaxed text-fg", className)}>
      {blocks.map((block, i) => {
        if (i % 2 === 1) {
          const nl = block.indexOf("\n");
          const code = nl === -1 ? block : block.slice(nl + 1);
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg bg-elevated p-3 font-mono text-xs text-fg"
            >
              <code>{code.replace(/\n$/, "")}</code>
            </pre>
          );
        }
        return block.split("\n").map((line, j) => {
          if (!line.trim()) return <div key={`${i}-${j}`} className="h-2" />;
          return (
            <p key={`${i}-${j}`} className="whitespace-pre-wrap">
              {renderInline(line)}
            </p>
          );
        });
      })}
    </div>
  );
}
