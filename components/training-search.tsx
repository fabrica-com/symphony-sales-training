"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Clock, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Training, Category } from "@/lib/training-data"
import { getAllCategoriesWithTrainingsAction } from "@/app/actions/category-actions"
import Link from "next/link"

interface SearchResult {
  training: Training
  category: Category
  score: number
  matchedFields: string[]
}

interface TrainingSearchProps {
  onResultClick?: () => void
}

function calculateRelevanceScore(
  training: Training,
  category: Category,
  query: string
): { score: number; matchedFields: string[] } {
  const lowerQuery = query.toLowerCase()
  const queryTerms = lowerQuery.split(/\s+/).filter((term) => term.length > 0)
  let score = 0
  const matchedFields: string[] = []

  for (const term of queryTerms) {
    // Title match (highest weight)
    if (training.title.toLowerCase().includes(term)) {
      score += 100
      if (!matchedFields.includes("タイトル")) matchedFields.push("タイトル")
    }

    // Subtitle match
    if (training.subtitle?.toLowerCase().includes(term)) {
      score += 80
      if (!matchedFields.includes("サブタイトル")) matchedFields.push("サブタイトル")
    }

    // Category name match
    if (category.name.toLowerCase().includes(term)) {
      score += 60
      if (!matchedFields.includes("カテゴリ")) matchedFields.push("カテゴリ")
    }

    // Category description match
    if (category.description.toLowerCase().includes(term)) {
      score += 40
      if (!matchedFields.includes("カテゴリ説明")) matchedFields.push("カテゴリ説明")
    }

    // Detail content matches
    if (training.detail) {
      // Purpose match
      if (training.detail.purpose.toLowerCase().includes(term)) {
        score += 50
        if (!matchedFields.includes("目的")) matchedFields.push("目的")
      }

      // Goal match
      if (training.detail.goal.toLowerCase().includes(term)) {
        score += 50
        if (!matchedFields.includes("ゴール")) matchedFields.push("ゴール")
      }

      // Sections content match
      for (const section of training.detail.sections) {
        if (section.title.toLowerCase().includes(term)) {
          score += 30
          if (!matchedFields.includes("セクション")) matchedFields.push("セクション")
        }
        const content = Array.isArray(section.content)
          ? section.content.join(" ")
          : section.content
        if (content.toLowerCase().includes(term)) {
          score += 20
          if (!matchedFields.includes("内容")) matchedFields.push("内容")
        }
      }

      // Summary match
      for (const summary of training.detail.summary) {
        if (summary.toLowerCase().includes(term)) {
          score += 25
          if (!matchedFields.includes("まとめ")) matchedFields.push("まとめ")
        }
      }

      // Quote match
      if (training.detail.quote) {
        if (
          training.detail.quote.text.toLowerCase().includes(term) ||
          training.detail.quote.author.toLowerCase().includes(term)
        ) {
          score += 15
          if (!matchedFields.includes("引用")) matchedFields.push("引用")
        }
      }
    }
  }

  // Bonus for matching all terms
  const allTermsMatched = queryTerms.every(
    (term) =>
      training.title.toLowerCase().includes(term) ||
      training.subtitle?.toLowerCase().includes(term) ||
      category.name.toLowerCase().includes(term) ||
      training.detail?.purpose.toLowerCase().includes(term) ||
      training.detail?.goal.toLowerCase().includes(term)
  )
  if (allTermsMatched && queryTerms.length > 1) {
    score *= 1.5
  }

  return { score, matchedFields }
}

function searchTrainings(cats: Category[], query: string): SearchResult[] {
  if (!query.trim()) return []

  const results: SearchResult[] = []

  for (const category of cats) {
    for (const training of category.trainings) {
      const { score, matchedFields } = calculateRelevanceScore(
        training,
        category,
        query
      )
      if (score > 0) {
        results.push({ training, category, score, matchedFields })
      }
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 10)
}

export function TrainingSearch({ onResultClick }: TrainingSearchProps = {}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [categories, setCategories] = useState<Category[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load categories from DB once
  useEffect(() => {
    getAllCategoriesWithTrainingsAction().then((data) => {
      setCategories(data as Category[])
    })
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchResults = searchTrainings(categories, query)
      setResults(searchResults)
      setSelectedIndex(-1)
    }, 150)

    return () => clearTimeout(timer)
  }, [query, categories])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const result = results[selectedIndex]
            const searchQuery = encodeURIComponent(query)
            window.location.href = `/training/${result.training.id}?highlight=${searchQuery}`
          }
          break
        case "Escape":
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, results, selectedIndex]
  )

  const handleClear = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

const handleResultClick = () => {
  setIsOpen(false)
  setQuery("")
  setResults([])
  onResultClick?.()
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="研修を検索..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 w-[200px] sm:w-[280px] h-9 text-sm bg-muted/50 border-transparent focus:border-border focus:bg-background transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              「{query}」に一致する研修が見つかりませんでした
            </div>
          ) : (
            <div className="py-2">
              <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border">
                {results.length}件の検索結果
              </div>
              {results.map((result, index) => (
                <Link
                  key={`${result.category.id}-${result.training.id}`}
                  href={`/training/${result.training.id}?highlight=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className={`block px-3 py-2.5 hover:bg-muted/50 transition-colors ${
                    index === selectedIndex ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 ${result.category.color}`}
                    >
                      {result.category.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          No.{result.training.id}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                          {result.training.level}
                        </span>
                      </div>
                      <div className="font-medium text-sm mt-0.5 truncate">
                        {result.training.title}
                      </div>
                      {result.training.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">
                          {result.training.subtitle}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {result.category.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.training.duration}分
                        </span>
                      </div>
                      {result.matchedFields.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {result.matchedFields.slice(0, 3).map((field) => (
                            <span
                              key={field}
                              className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {field}で一致
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
