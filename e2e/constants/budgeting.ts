import { boards } from "./boards"

export const budgetingCategoryTypes = {
  expense: { id: 1, name: "expense" },
  income: { id: 2, name: "income" },
} as const

export const budgetingCategories = {
  clothesExpense: {
    board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
    id: 1,
    name: "clothes",
    type: budgetingCategoryTypes.expense,
  },
  educationExpense: {
    board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
    id: 2,
    name: "education",
    type: budgetingCategoryTypes.expense,
  },
  giftsExpense: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 3,
    name: "gifts",
    type: budgetingCategoryTypes.expense,
  },
  giftsIncome: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 4,
    name: "gifts",
    type: budgetingCategoryTypes.income,
  },
  salaryIncome: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 5,
    name: "salary",
    type: budgetingCategoryTypes.income,
  },
} as const

export const budgetingRecords = {
  "1st": { amount: 100, category: budgetingCategories.clothesExpense, date: "2022-08-01", id: 1, isTrashed: true },
  "2nd": { amount: 400, category: budgetingCategories.educationExpense, date: "2022-08-01", id: 2, isTrashed: true },
  "3rd": { amount: 25, category: budgetingCategories.educationExpense, date: "2022-08-01", id: 3, isTrashed: false },
  "4th": { amount: 30, category: budgetingCategories.giftsExpense, date: "2022-08-02", id: 4, isTrashed: false },
  "5th": { amount: 10, category: budgetingCategories.giftsExpense, date: "2022-08-02", id: 5, isTrashed: false },
  "6th": { amount: 230, category: budgetingCategories.giftsIncome, date: "2022-08-03", id: 6, isTrashed: false },
}
