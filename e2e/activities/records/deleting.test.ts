import { activityRecords } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Activity record deleting", () => {
  it("deleting returns correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_ACTIVITY_RECORD {
      deleteActivityRecord(id: ${activityRecords["5th"].id}) {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteActivityRecord: activityRecords["5th"] })
  })

  it("deleted record can't be found by ID", async () => {
    await fetchGqlApi(`mutation DELETE_ACTIVITY_RECORD {
      deleteActivityRecord(id: ${activityRecords["5th"].id}) {
        ${QueryFields.activityRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      activityRecord(id: ${activityRecords["5th"].id}) {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Not found." })
  })

  test("user cannot delete a record of a board that they is not a member of", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_ACTIVITY_RECORD {
      deleteActivityRecord(id: ${activityRecords["1st"].id}) {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Access denied." })
  })
})
