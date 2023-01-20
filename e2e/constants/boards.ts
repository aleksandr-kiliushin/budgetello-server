import { currencies } from "./currencies"
import { users } from "./users"

export const boardSubjects = {
  budget: { id: 1, name: "budget" },
  activities: { id: 2, name: "activities" },
} as const

export const boards = {
  cleverBudgetiers: {
    admins: [users.johnDoe],
    defaultCurrency: currencies.gel,
    id: 1,
    members: [users.johnDoe, users.jessicaStark],
    name: "clever-budgetiers",
    subject: boardSubjects.budget,
  },
  megaEconomists: {
    admins: [users.jessicaStark],
    defaultCurrency: currencies.usd,
    id: 2,
    members: [users.jessicaStark],
    name: "mega-economists",
    subject: boardSubjects.budget,
  },
  beautifulSportsmen: {
    admins: [users.jessicaStark],
    defaultCurrency: null,
    id: 3,
    members: [users.jessicaStark],
    name: "beautiful-sportsmen",
    subject: boardSubjects.activities,
  },
  productivePeople: {
    admins: [users.johnDoe],
    defaultCurrency: null,
    id: 4,
    members: [users.johnDoe, users.jessicaStark],
    name: "productive-people",
    subject: boardSubjects.activities,
  },
} as const
