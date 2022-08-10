- Rename DB tables columns from camelCase to snake_case to prevent errors like that:
  `column "typeid" of relation "finance_category" does not exist`.
- Add meningful feedback message to 400 and 404 response when a finance category (or something else) not found by ID, or when provided data is invalid.
- Add `board` table (id, name, creatorId, creationDate, users).
- Add `boardUser` table (id, userId, boardId, userRole: participant | admin)
- Move my records from another board.
