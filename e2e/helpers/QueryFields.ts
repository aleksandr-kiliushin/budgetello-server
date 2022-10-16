export class QueryFields {
  static user = "id, password, username"
  static boardSubject = "id, name"
  static board = `
    admins { ${this.user} },
    id,
    members { ${this.user} },
    name,
    subject { ${this.boardSubject} }
  `
}
