-- Remove AS-NET references from training ID 14 (シンフォニーワンプラ)
UPDATE trainings
SET detail = jsonb_set(
  jsonb_set(
    detail,
    '{sections,0,content}',
    '"シンフォニーワンプラは、全国の中古車販売店をつなぐ在庫共有・業販プラットフォームです。「在庫を流動化、コストを最小化」をコンセプトに、7万台の共有在庫から仕入れ、売れない在庫は業販で売却できます。業界最安水準の手数料で、在庫リスクとコストを大幅削減します。"'::jsonb
  ),
  '{purpose}',
  '"シンフォニーワンプラのサービス内容と料金体系を理解し、仕入れ・在庫処分の課題を持つ顧客に適切な提案ができるようになります。"'::jsonb
)
WHERE id = 14;
