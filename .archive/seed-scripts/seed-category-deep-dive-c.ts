/**
 * カテゴリ C の深掘りコンテンツを DB に投入するスクリプト
 * CategoryCDeepDiveBody を HTML に変換して category_deep_dive_contents に挿入
 */
import React from "react"
import ReactDOMServer from "react-dom/server"
import { createClient } from "@supabase/supabase-js"
import { CategoryCDeepDiveBody } from "../app/category/[id]/deep-dive/category-c-deep-dive-content"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321"
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required")
  process.exit(1)
}

const supabase = createClient(url, key)

const TITLE = "中古車流通の構造と現状"
const SUBTITLE = "Symphony営業担当者のための業界深掘りテキスト"

async function main() {
  console.log("=== カテゴリ C 深掘りコンテンツ投入 ===\n")

  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(CategoryCDeepDiveBody, {
      category: { id: "C", name: "業界知識：中古車ビジネス" },
    })
  )

  const { error } = await supabase.from("category_deep_dive_contents").upsert(
    {
      category_id: "C",
      title: TITLE,
      subtitle: SUBTITLE,
      body_html: html,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category_id" }
  )

  if (error) {
    console.error("投入エラー:", error.message)
    process.exit(1)
  }

  console.log("  ✓ category_deep_dive_contents: C を投入しました")
}

main()
