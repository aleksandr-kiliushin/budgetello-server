export const pickFields = {
  user: "id, password, username",
  boardSubject: "id, name",
  board: `
    admins { id, password, username }
    defaultCurrency { name, slug, symbol }
    id
    members { id, password, username }
    name
    subject { id, name }
  `,
  budgetCategoryType: "id, name",
  budgetCategory: `
    board { id, name }
    id
    name
    type { id, name }
  `,
  budgetRecord: `
    amount
    author { id, password, username }
    category {
      board { id, name }
      id
      name
      type { id, name }
    }
    comment
    currency { name, slug, symbol }
    date
    id
    isTrashed
  `,
  currency: `
    name
    slug
    symbol
  `,
}
