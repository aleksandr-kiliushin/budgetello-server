import { users } from "./users"

export const boardsSubjects = {
  budget: { id: 1, name: "budget" },
  activities: { id: 2, name: "activities" },
} as const

export const boards = {
  cleverBudgetiers: {
    admins: [users.johnDoe],
    id: 1,
    members: [users.johnDoe, users.jessicaStark],
    name: "clever-budgetiers",
    subject: boardsSubjects.budget,
  },
  megaEconomists: {
    admins: [users.jessicaStark],
    id: 2,
    members: [users.jessicaStark],
    name: "mega-economists",
    subject: boardsSubjects.budget,
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
