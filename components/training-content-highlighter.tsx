"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, Fragment, Suspense, type ReactNode } from "react"

/** Escape special regex characters in a string */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, (match) => "\\" + match)
}

/**
 * Search highlight core logic.
 * Shared by both HighlightText and HighlightListItem via this hook.
 */
function useHighlightedContent(text: string): string | ReactNode[] {
  const searchParams = useSearchParams()
  const highlight = searchParams.get("highlight")

  return useMemo(() => {
    if (!highlight || !text) return text

    const searchTerms = highlight.split(/\s+/).filter((term) => term.length > 0)
    if (searchTerms.length === 0) return text

    const escapedTerms = searchTerms.map(escapeRegex)
    const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi")
    const parts = text.split(pattern)

    return parts.map((part, index) => {
      const isMatch = searchTerms.some(
        (term) => part.toLowerCase() === term.toLowerCase()
      )
      if (isMatch) {
        return (
          <mark key={index} className="bg-yellow-300 text-yellow-900 px-0.5 rounded-sm">
            {part}
          </mark>
        )
      }
      return <Fragment key={index}>{part}</Fragment>
    })
  }, [text, highlight])
}

// --- HighlightText ---

interface HighlightTextProps {
  text: string
  className?: string
  as?: "span" | "p" | "div" | "li"
}

function HighlightTextInner({ text, className = "", as: Component = "span" }: HighlightTextProps) {
  const content = useHighlightedContent(text)
  return <Component className={className}>{content}</Component>
}

export function HighlightText(props: HighlightTextProps) {
  return (
    <Suspense fallback={<span className={props.className}>{props.text}</span>}>
      <HighlightTextInner {...props} />
    </Suspense>
  )
}

// --- HighlightListItem ---

interface HighlightListItemProps {
  text: string
  className?: string
}

function HighlightListItemInner({ text, className = "" }: HighlightListItemProps) {
  const content = useHighlightedContent(text)
  return <span className={className}>{content}</span>
}

export function HighlightListItem(props: HighlightListItemProps) {
  return (
    <Suspense fallback={<span className={props.className}>{props.text}</span>}>
      <HighlightListItemInner {...props} />
    </Suspense>
  )
}
