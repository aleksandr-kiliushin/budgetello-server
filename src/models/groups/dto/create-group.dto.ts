import { GroupEntity } from "#models/groups/entities/group.entity"

export class CreateGroupDto {
  name: GroupEntity["name"]
  subjectId: GroupEntity["subject"]["id"]
}
