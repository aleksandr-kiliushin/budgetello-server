- Rename DB tables columns from camelCase to snake_case to prevent errors like that:
  `column "typeid" of relation "finance_category" does not exist`.
- Add message to 404 response when a finance category (or something else) not found by ID.
