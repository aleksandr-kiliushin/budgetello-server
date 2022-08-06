- Rename DB tables columns from camelCase to snake_case to prevent errors like that:
  `column "typeid" of relation "finance_category" does not exist`.
- Replace unreliable checks like `.not.toContain` in tests.
- Add message to 404 response when a finance category (or something else) not found by ID.
- Rename files like: `finance-category/finance-category.controller.ts` -> `finance-category/controller.ts`.
- Simplify methods names like: `createFinanceCategory` -> `create` (it is already obvious what the method creates because it is defined within finance category controller / service).
