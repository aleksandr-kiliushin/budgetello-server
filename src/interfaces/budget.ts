import { IBoard } from "./boards"

export interface IBudgetCategory {
  board: {
    id: IBoard["id"]
    name: IBoard["name"]
  }
  id: number
  name: string
  type: IBudgetCategoryType
}

export interface IBudgetCategoryType {
  id: number
  name: string
}

export interface IBudgetRecord {
  amount: number
  category: IBudgetCategory
  date: string
  id: number
  isTrashed: boolean
}
