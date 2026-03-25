import { cn } from "@/lib/utils"

interface RichTextProps {
  content: string
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  const blocks = content.split("\n\n")

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      {blocks.map((block, index) => {
        // Blockquotes
        if (block.startsWith(">")) {
          const quoteText = block
            .split("\n")
            .map((line) => line.replace(/^>\s*/, ""))
            .join("\n")
          return (
            <blockquote
              key={index}
              className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground"
            >
              {quoteText}
            </blockquote>
          )
        }

        // Bold-only lines as subheadings
        if (block.startsWith("**") && block.endsWith("**")) {
          return (
            <h4 key={index} className="font-bold mt-4 mb-2">
              {block.replace(/\*\*/g, "")}
            </h4>
          )
        }

        // Tables
        if (block.includes("|") && block.includes("---")) {
          const lines = block.split("\n").filter((line) => line.trim())
          const headers = lines[0]
            ?.split("|")
            .filter((cell) => cell.trim())
            .map((cell) => cell.trim())
          const rows = lines
            .slice(2)
            .map((line) =>
              line
                .split("|")
                .filter((cell) => cell.trim())
                .map((cell) => cell.trim())
            )
          return (
            <div key={index} className="my-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    {headers?.map((header, i) => (
                      <th key={i} className="px-3 py-2 text-left font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={cn(
                        "border-b border-border",
                        rowIndex % 2 === 1 && "bg-secondary/30"
                      )}
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        // Lists
        if (block.startsWith("- ") || block.includes("\n- ")) {
          const lines = block.split("\n")
          const firstIsItem = lines[0].startsWith("- ")
          const title = firstIsItem ? null : lines[0]
          const items = (firstIsItem ? lines : lines.slice(1)).filter((l) => l.startsWith("- "))
          return (
            <div key={index} className="my-3">
              {title && <p className="font-medium mb-2">{title.replace(/\*\*/g, "")}</p>}
              <ul className="list-disc list-inside space-y-1 text-sm">
                {items.map((item, i) => (
                  <li key={i}>{item.replace(/^-\s*/, "")}</li>
                ))}
              </ul>
            </div>
          )
        }

        // Regular paragraphs with inline bold
        return (
          <p key={index} className="text-sm leading-relaxed my-2">
            {block.split("**").map((part, partIndex) =>
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}
