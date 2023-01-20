import { ICurrency } from "./currencies"
import { IUser } from "./user"

export interface IBoardSubject {
  id: number
  name: string
}

export interface IBoard {
  admins: IUser[]
  defaultCurrency: ICurrency | null
  id: number
  members: IUser[]
  name: string
  subject: IBoardSubject
}
