// TODO: Query all board fields for budget and activity categories in tests.
// TODO: class -> object, remove links.

export class QueryFields {
  static user = `
    id,
    password,
    username
  `
  static boardSubject = `
    id,
    name
  `
  static board = `
    admins { ${this.user} },
    id,
    members { ${this.user} },
    name,
    subject { ${this.boardSubject} }
  `
  static budgetCategoryType = `
    id,
    name
  `
  static budgetCategory = `
    board { id, name },
    id,
    name,
    type { id, name }
  `
  static budgetRecord = `
    amount,
    category { ${this.budgetCategory} },
    date,
    id,
    isTrashed
  `
  static activityCategoryMeasurementType = `
    id,
    name
  `
  static activityCategory = `
    board { id, name }
    id,
    name,
    measurementType { id, name },
    owner { id, password, username },
    unit
  `
}
