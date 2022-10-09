import { IBoard } from "./boards"
import { IUser } from "./user"

export interface IActivityCategoryMeasurementType {
  id: number
  name: string
}

export interface IActivityCategory {
  board: {
    id: IBoard["id"]
    name: IBoard["name"]
  }
  id: number
  measurementType: IActivityCategoryMeasurementType
  name: string
  owner: IUser
  unit: string
}
