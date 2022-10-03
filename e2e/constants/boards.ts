import { users } from "./users"

export const boardsSubjects = {
  finances: { id: 1, name: "finances" },
  habits: { id: 2, name: "habits" },
} as const

export const boards = {
  cleverFinanciers: {
    admins: [users.johnDoe],
    id: 1,
    name: "clever-financiers",
    subject: boardsSubjects.finances,
    members: [users.johnDoe, users.jessicaStark],
  },
  megaEconomists: {
    admins: [users.jessicaStark],
    id: 2,
    name: "mega-economists",
    subject: boardsSubjects.finances,
    members: [users.jessicaStark],
  },
  beautifulSportsmen: {
    admins: [users.jessicaStark],
    id: 3,
    name: "beautiful-sportsmen",
    subject: boardsSubjects.habits,
    members: [users.jessicaStark],
  },
} as const
