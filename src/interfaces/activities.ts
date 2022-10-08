import { IBoard } from "./boards"

export interface IActivityCategory {
  board: {
    id: IBoard["id"]
    name: IBoard["name"]
  }
  id: number
  name: string
}
