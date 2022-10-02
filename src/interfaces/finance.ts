import { IGroup } from "./groups"

export interface IFinanceCategory {
  group: IGroup
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
