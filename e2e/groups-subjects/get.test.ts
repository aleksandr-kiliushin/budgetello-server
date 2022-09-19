import { GroupsSubjectsEntity } from "../../src/models/groups-subjects/entities/groups-subjects.entity"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("get groups subjects", () => {
  it("responds with all groups subjects list", async () => {
    const fetchAllFinanceCategoryTypesResponse = await fetchApi("/api/groups-subjects")
    expect(await fetchAllFinanceCategoryTypesResponse.json()).toEqual<GroupsSubjectsEntity[]>([
      { id: 1, name: "finances" },
      { id: 2, name: "habits" },
    ])
  })

  it("responds with a group subject for a given id", async () => {
    const getGroupsSubjectWithIdOf2Response = await fetchApi("/api/groups-subjects/2")
    expect(await getGroupsSubjectWithIdOf2Response.json()).toEqual<GroupsSubjectsEntity>({ id: 2, name: "habits" })
  })
})
