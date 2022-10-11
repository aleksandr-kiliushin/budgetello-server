export class SearchBoardsQueryDto {
  iAmAdminOf?: "false" | "true"
  iAmMemberOf?: "false" | "true"
  id?: string
  name?: string
  subjectId?: string
}
