import { boards } from "./boards"
import { currencies } from "./currencies"
import { users } from "./users"

export const budgetCategoryTypes = {
  expense: { id: 1, name: "expense" },
  income: { id: 2, name: "income" },
} as const

export const budgetCategories = {
  clothesExpense: {
    board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
    id: 1,
    name: "clothes",
    type: budgetCategoryTypes.expense,
  },
  educationExpense: {
    board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
    id: 2,
    name: "education",
    type: budgetCategoryTypes.expense,
  },
  giftsExpense: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 3,
    name: "gifts",
    type: budgetCategoryTypes.expense,
  },
  giftsIncome: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 4,
    name: "gifts",
    type: budgetCategoryTypes.income,
  },
  salaryIncome: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 5,
    name: "salary",
    type: budgetCategoryTypes.income,
  },
} as const

export const budgetRecords = {
  "1st": {
    amount: 100,
    author: users.johnDoe,
    category: budgetCategories.clothesExpense,
    comment: "I really need it.",
    currency: currencies.usd,
    date: "2022-08-01",
    id: 1,
    isTrashed: true,
  },
  "2nd": {
    amount: 400,
    author: users.jessicaStark,
    category: budgetCategories.educationExpense,
    comment: "A gift for John Doe.",
    currency: currencies.usd,
    date: "2022-08-01",
    id: 2,
    isTrashed: true,
  },
  "3rd": {
    amount: 25,
    author: users.johnDoe,
    category: budgetCategories.educationExpense,
    comment: "",
    currency: currencies.usd,
    date: "2022-08-01",
    id: 3,
    isTrashed: false,
  },
  "4th": {
    amount: 30,
    author: users.jessicaStark,
    category: budgetCategories.giftsExpense,
    comment: "",
    currency: currencies.gel,
    date: "2022-08-02",
    id: 4,
    isTrashed: false,
  },
  "5th": {
    amount: 10.5,
    author: users.jessicaStark,
    category: budgetCategories.giftsExpense,
    comment: "I did not plan to buy that.",
    currency: currencies.gel,
    date: "2022-08-02",
    id: 5,
    isTrashed: false,
  },
  "6th": {
    amount: 230,
    author: users.jessicaStark,
    category: budgetCategories.giftsIncome,
    comment: "I bought it with 40% off.",
    currency: currencies.gel,
    date: "2022-08-03",
    id: 6,
    isTrashed: false,
  },
} as const
