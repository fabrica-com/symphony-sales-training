# Archive

このディレクトリには、過去のマイグレーションファイルとシードスクリプトを参照用に保管しています。

## migrations-legacy/

28個のレガシーマイグレーションファイル。現在は `supabase/migrations/20260101000000_init.sql` に統合済み。

## seed-scripts/

| ファイル | 説明 |
|---------|------|
| `seed-category-tests.ts` | カテゴリテストを `category_tests` / `category_test_questions` に投入 |
| `seed-final-exam.ts` | 修了テストを `final_exam_config` / `final_exam_questions` に投入 |
| `seed-deep-dive.ts` | 研修単位の Deep Dive を `deep_dive_contents` に投入 |
| `seed-category-deep-dive-c.ts` | カテゴリ C の Deep Dive を `category_deep_dive_contents` に投入 |
| `export-c-deep-dive-html.ts` | C の Deep Dive を HTML エクスポートするユーティリティ |
| `category-c-deep-dive-content.tsx` | C の Deep Dive コンテンツ（React コンポーネント形式） |
| `update-symphony-training-details.ts` | 研修詳細データの更新スクリプト |

## 注意

- これらのファイルは**参照用**として残しています
- 本番運用では `supabase db reset` で init migration + seed.sql が自動適用されます
- 再シードが必要な場合は `bun run db:reset` を実行してください
