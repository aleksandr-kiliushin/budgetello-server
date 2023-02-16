import { IBoard } from "./boards"
import { IUser } from "./user"

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
  author: IUser
  category: IBudgetCategory
  comment: string
  date: string
  id: number
  isTrashed: boolean
}
