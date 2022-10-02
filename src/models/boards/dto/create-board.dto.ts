import { BoardEntity } from "#models/boards/entities/board.entity"

export class CreateBoardDto {
  name: BoardEntity["name"]
  subjectId: BoardEntity["subject"]["id"]
}
