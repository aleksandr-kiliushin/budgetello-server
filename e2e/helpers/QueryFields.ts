// TODO: Query all board fields for budget and activity categories in tests.

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
}
