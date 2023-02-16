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
    currency { name, slug, symbol }
    date
    id
    isTrashed
  `,
  activityCategoryMeasurementType: "id, name",
  activityCategory: `
    board { id, name }
    id
    name
    measurementType { id, name }
    owner { id, password, username }
    unit
  `,
  activityRecord: `
    booleanValue
    category {
      board { id, name }
      id
      measurementType { id, name }
      name
      owner { id, password, username }
      unit
    }
    comment
    date
    id
    quantitativeValue
  `,
  currency: `
    name
    slug
    symbol
  `,
}
