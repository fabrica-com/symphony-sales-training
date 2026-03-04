/**
 * C カテゴリ深掘りコンテンツを静的 HTML に変換して標準出力へ。
 * 実行: bun run scripts/export-c-deep-dive-html.ts
 * 出力を seed で DB に投入する想定。
 */
import React from "react"
import ReactDOMServer from "react-dom/server"
import { CategoryCDeepDiveBody } from "../app/category/[id]/deep-dive/category-c-deep-dive-content"

const html = ReactDOMServer.renderToStaticMarkup(
  React.createElement(CategoryCDeepDiveBody, {
    category: { id: "C", name: "業界知識：中古車ビジネス" },
  })
)
console.log(html)
