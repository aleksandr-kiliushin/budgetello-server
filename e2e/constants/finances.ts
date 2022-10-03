import { boards } from "./boards"

export const financeCategoryTypes = {
  expense: { id: 1, name: "expense" },
  income: { id: 2, name: "income" },
} as const

export const financeCategories = {
  clothesExpense: {
    board: { id: boards.cleverFinanciers.id, name: boards.cleverFinanciers.name },
    id: 1,
    name: "clothes",
    type: financeCategoryTypes.expense,
  },
  educationExpense: {
    board: { id: boards.cleverFinanciers.id, name: boards.cleverFinanciers.name },
    id: 2,
    name: "education",
    type: financeCategoryTypes.expense,
  },
  giftsExpense: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 3,
    name: "gifts",
    type: financeCategoryTypes.expense,
  },
  giftsIncome: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 4,
    name: "gifts",
    type: financeCategoryTypes.income,
  },
  salaryIncome: {
    board: { id: boards.megaEconomists.id, name: boards.megaEconomists.name },
    id: 5,
    name: "salary",
    type: financeCategoryTypes.income,
  },
} as const

export const financeRecords = {
  "1st": { amount: 100, category: financeCategories.clothesExpense, date: "2022-08-01", id: 1, isTrashed: true },
  "2nd": { amount: 400, category: financeCategories.educationExpense, date: "2022-08-01", id: 2, isTrashed: true },
  "3rd": { amount: 25, category: financeCategories.clothesExpense, date: "2022-08-01", id: 3, isTrashed: false },
  "4th": { amount: 30, category: financeCategories.giftsExpense, date: "2022-08-02", id: 3, isTrashed: false },
  "5th": { amount: 10, category: financeCategories.giftsExpense, date: "2022-08-02", id: 3, isTrashed: false },
  "6th": { amount: 230, category: financeCategories.giftsIncome, date: "2022-08-03", id: 3, isTrashed: false },
}
