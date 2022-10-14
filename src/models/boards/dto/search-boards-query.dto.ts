import { IBoard } from "#interfaces/boards"

export class SearchBoardsQueryDto {
  iAmAdminOf?: boolean | undefined
  iAmMemberOf?: boolean | undefined
  ids?: IBoard["id"][] | undefined
  name?: IBoard["name"] | undefined
  subjectsIds?: IBoard["id"][] | undefined
}
