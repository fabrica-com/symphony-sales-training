import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookOpen, Quote } from "lucide-react"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getTrainingByIdFromDb, getDeepDiveContentFromDb } from "@/lib/db/categories"
import { DeepDiveReadMarker } from "@/components/deep-dive-read-marker"

interface DeepDivePageProps {
  params: Promise<{ id: string }>
}

// Disable static generation - these pages depend on database content
export const dynamic = "force-dynamic"

export default async function DeepDivePage({ params }: DeepDivePageProps) {
  const { id } = await params
  const trainingId = Number(id)
  const result = await getTrainingByIdFromDb(trainingId)
  const deepDiveContent = await getDeepDiveContentFromDb(trainingId)

  if (!result || !deepDiveContent) {
    notFound()
  }

  const { training, category } = result

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DeepDiveReadMarker trainingId={trainingId} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-linear-to-b from-blue-50 to-background py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Link
              href={`/training/${training.id}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {training.title}に戻る
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-500 text-white">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700">深掘り読み物</Badge>
                <h1 className="text-3xl font-bold">{deepDiveContent.title}</h1>
                <p className="mt-2 text-muted-foreground">{deepDiveContent.subtitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="border-b border-border bg-secondary/30 py-8">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-4 text-lg font-semibold">目次</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {deepDiveContent.sections.map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-blue-500 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium line-clamp-2">{section.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            {/* Introduction */}
            <div className="mb-12 rounded-lg border border-border bg-secondary/30 p-6">
              <h2 className="mb-4 text-xl font-semibold">はじめに</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {deepDiveContent.introduction.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Sections */}
            {deepDiveContent.sections.map((section, index) => (
              <section key={index} id={`section-${index}`} className="mb-12 scroll-mt-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white font-medium">
                    {index + 1}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n\n').map((block, blockIndex) => {
                        // Handle bold-only lines as subheadings
                        if (block.startsWith('**') && block.endsWith('**')) {
                          return (
                            <h3 key={blockIndex} className="mt-6 mb-3 text-lg font-semibold text-blue-600 first:mt-0">
                              {block.replace(/\*\*/g, '')}
                            </h3>
                          )
                        }

                        // Handle blockquotes
                        if (block.startsWith('>')) {
                          return (
                            <div key={blockIndex} className="my-4 rounded-lg bg-blue-50 border-l-4 border-blue-500 p-4">
                              <div className="text-sm leading-relaxed text-blue-800">
                                {block.split('\n').map((line, lineIndex) => (
                                  <p key={lineIndex} className="mb-1 last:mb-0">
                                    {line.replace(/^>\s*/, '').replace(/\*\*/g, '')}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )
                        }
                        
                        // Handle tables
                        if (block.includes('|') && block.includes('---')) {
                          const lines = block.split('\n').filter(line => line.trim())
                          const headers = lines[0]?.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
                          const rows = lines.slice(2).map(line => 
                            line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
                          )
                          
                          return (
                            <div key={blockIndex} className="my-4 overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-border bg-secondary/50">
                                    {headers?.map((header, i) => (
                                      <th key={i} className="px-4 py-2 text-left font-medium">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={`border-b border-border ${rowIndex % 2 === 1 ? 'bg-secondary/30' : ''}`}>
                                      {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="px-4 py-2 text-muted-foreground">{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )
                        }
                        
                        // Handle lists
                        if (block.match(/^[-•]\s/m) || block.match(/^\d+\.\s/m)) {
                          const items = block.split('\n').filter(line => line.trim())
                          return (
                            <ul key={blockIndex} className="my-4 space-y-2">
                              {items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="text-muted-foreground">
                                    {item.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )
                        }
                        
                        // Regular paragraph with inline bold
                        return (
                          <p key={blockIndex} className="mb-4 leading-relaxed text-muted-foreground last:mb-0">
                            {block.split(/(\*\*[^*]+\*\*)/).map((part, partIndex) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex} className="font-semibold text-foreground">{part.replace(/\*\*/g, '')}</strong>
                              }
                              return part
                            })}
                          </p>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}

            {/* Conclusion */}
            <section className="mb-12">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <Quote className="h-5 w-5 text-blue-500" />
                    まとめ
                  </h2>
                  <div className="prose prose-sm max-w-none">
                    {deepDiveContent.conclusion.split('\n\n').map((block, blockIndex) => {
                      // Bold-only lines as subheadings
                      if (block.startsWith('**') && block.endsWith('**')) {
                        return (
                          <h3 key={blockIndex} className="mt-6 mb-3 text-lg font-semibold text-blue-600 first:mt-0">
                            {block.replace(/\*\*/g, '')}
                          </h3>
                        )
                      }
                      // Blockquotes
                      if (block.startsWith('>')) {
                        return (
                          <div key={blockIndex} className="my-4 rounded-lg bg-blue-100/50 border-l-4 border-blue-500 p-4">
                            <div className="text-sm leading-relaxed text-blue-800">
                              {block.split('\n').map((line, lineIndex) => (
                                <p key={lineIndex} className="mb-1 last:mb-0">
                                  {line.replace(/^>\s*/, '').replace(/\*\*/g, '')}
                                </p>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      // Lists (numbered or bulleted)
                      if (block.match(/^[-•]\s/m) || block.match(/^\d+\.\s/m)) {
                        const items = block.split('\n').filter(line => line.trim())
                        return (
                          <ul key={blockIndex} className="my-4 space-y-2">
                            {items.map((item, itemIndex) => {
                              const text = item.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')
                              return (
                                <li key={itemIndex} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="text-muted-foreground">
                                    {text.split(/(\*\*[^*]+\*\*)/).map((part, pi) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={pi} className="font-semibold text-foreground">{part.replace(/\*\*/g, '')}</strong>
                                      }
                                      return part
                                    })}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        )
                      }
                      // Regular paragraph with inline bold
                      return (
                        <p key={blockIndex} className="mb-4 leading-relaxed text-muted-foreground last:mb-0">
                          {block.split(/(\*\*[^*]+\*\*)/).map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={partIndex} className="font-semibold text-foreground">{part.replace(/\*\*/g, '')}</strong>
                            }
                            return part
                          })}
                        </p>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* References */}
            {deepDiveContent.references && deepDiveContent.references.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-xl font-semibold">参考文献</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {deepDiveContent.references.map((ref, index) => (
                        <li key={index} className="pl-4 border-l-2 border-border">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Back to Training */}
            <div className="text-center">
              <Link
                href={`/training/${training.id}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {training.title}に戻る
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
