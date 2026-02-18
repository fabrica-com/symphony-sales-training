# Archive

このディレクトリには、DB 移行完了後に不要となったシードスクリプトやハードコードデータを保管しています。

## seed-scripts/

| ファイル | 説明 |
|---------|------|
| `seed-category-tests.ts` | カテゴリテストを `category_tests` / `category_test_questions` に投入 |
| `seed-final-exam.ts` | 修了テストを `final_exam_config` / `final_exam_questions` に投入 |
| `seed-deep-dive.ts` | 研修単位の Deep Dive を `deep_dive_contents` に投入 |
| `seed-category-deep-dive-c.ts` | カテゴリ C の Deep Dive を `category_deep_dive_contents` に投入 |
| `export-c-deep-dive-html.ts` | C の Deep Dive を HTML エクスポートするユーティリティ |
| `category-c-deep-dive-content.tsx` | C の Deep Dive コンテンツ（React コンポーネント形式） |

## 注意

- これらのファイルは**参照用**として残しています
- 本番運用では DB のデータを直接使用してください
- 再シードが必要な場合は、このディレクトリからスクリプトを復元して実行できます
