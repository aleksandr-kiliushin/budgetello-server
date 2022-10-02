import { IBoard } from "./boards"

export interface IFinanceCategory {
  board: {
    id: IBoard["id"]
    name: IBoard["name"]
  }
  id: number
  name: string
  type: IFinanceCategoryType
}

export interface IFinanceCategoryType {
  id: number
  name: string
}

export interface IFinanceRecord {
  amount: number
  category: IFinanceCategory
  date: string
  id: number
  isTrashed: boolean
}
