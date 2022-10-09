import { IBoard } from "./boards"

export interface IActivityCategory {
  board: {
    id: IBoard["id"]
    name: IBoard["name"]
  }
  id: number
  name: string
  unit: string
}

export interface IActivityCategoryMeasurementType {
  id: number
  name: string
}
