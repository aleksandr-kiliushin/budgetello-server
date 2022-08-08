- Rename DB tables columns from camelCase to snake_case to prevent errors like that:
  `column "typeid" of relation "finance_category" does not exist`.
- Add meningful feedback message to 400 and 404 response when a finance category (or something else) not found by ID, or when provided data is invalid.
- Make logIn easier in code: use something like `logIn("john-doe")` with returned `authToken` assigned to some global variable. This global varialbe will be used in fetch. Without direct using `authToken` within tests.
- Add `board` table (id, name, creatorId, creationDate, users).
- Add `boardUser` table (id, userId, boardId, userRole: participant | admin)
- Move my records from another board.
- Add unit tests for records search service `toHaveBeenCalledWith()` against `FinanceRecordService.prototype.search`.
- Test finance records updating.
- Test finance records deleting.
