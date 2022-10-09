import { users } from "./users"

export const boardsSubjects = {
  budgeting: { id: 1, name: "budgeting" },
  activities: { id: 2, name: "activities" },
} as const

export const boards = {
  cleverBudgetiers: {
    admins: [users.johnDoe],
    id: 1,
    members: [users.johnDoe, users.jessicaStark],
    name: "clever-budgetiers",
    subject: boardsSubjects.budgeting,
  },
  megaEconomists: {
    admins: [users.jessicaStark],
    id: 2,
    members: [users.jessicaStark],
    name: "mega-economists",
    subject: boardsSubjects.budgeting,
  },
  beautifulSportsmen: {
    admins: [users.jessicaStark],
    id: 3,
    members: [users.jessicaStark],
    name: "beautiful-sportsmen",
    subject: boardsSubjects.activities,
  },
  productivePeople: {
    admins: [users.johnDoe],
    id: 4,
    members: [users.johnDoe, users.jessicaStark],
    name: "productive-people",
    subject: boardsSubjects.activities,
  },
} as const
