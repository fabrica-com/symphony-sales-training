"use client"

import React from "react"

import { useSearchParams } from "next/navigation"
import { useMemo, Fragment } from "react"

interface SearchHighlightProps {
  text: string
  className?: string
}

export function SearchHighlight({ text, className = "" }: SearchHighlightProps) {
  const searchParams = useSearchParams()
  const highlight = searchParams.get("highlight")

  const highlightedContent = useMemo(() => {
    if (!highlight || !text) return text

    const searchTerms = highlight.split(/\s+/).filter((term) => term.length > 0)
    if (searchTerms.length === 0) return text

    // Create a regex pattern that matches any of the search terms
    const pattern = new RegExp(
      `(${searchTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi"
    )

    const parts = text.split(pattern)

    return parts.map((part, index) => {
      const isMatch = searchTerms.some(
        (term) => part.toLowerCase() === term.toLowerCase()
      )
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-yellow-200 text-yellow-900 px-0.5 rounded"
          >
            {part}
          </mark>
        )
      }
      return <Fragment key={index}>{part}</Fragment>
    })
  }, [text, highlight])

  return <span className={className}>{highlightedContent}</span>
}

// Wrapper component for use in server components
export function HighlightProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
