import { users } from "./users"

export const boardsSubjects = {
  budgeting: { id: 1, name: "budgeting" },
  habits: { id: 2, name: "habits" },
} as const

export const boards = {
  cleverBudgetiers: {
    admins: [users.johnDoe],
    id: 1,
    name: "clever-budgetiers",
    subject: boardsSubjects.budgeting,
    members: [users.johnDoe, users.jessicaStark],
  },
  megaEconomists: {
    admins: [users.jessicaStark],
    id: 2,
    name: "mega-economists",
    subject: boardsSubjects.budgeting,
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
