import { IActivityRecord } from "#interfaces/activities"

import { activityRecords } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Activity record deleting", () => {
  it("returns a correct response after deleting", async () => {
    await authorize(users.johnDoe)
    const recordDeletingResponse = await fetchApi(`/api/activities/records/${activityRecords["5th"].id}`, {
      method: "DELETE",
    })
    expect(recordDeletingResponse.status).toEqual(200)
    expect(await recordDeletingResponse.json()).toEqual<IActivityRecord>(activityRecords["5th"])
  })

  it("the deleted records are not presented in all records list", async () => {
    await authorize(users.jessicaStark)
    await fetchApi(`/api/activities/records/${activityRecords["1st"].id}`, { method: "DELETE" })
    await fetchApi(`/api/activities/records/${activityRecords["2nd"].id}`, { method: "DELETE" })
    await fetchApi(`/api/activities/records/${activityRecords["3rd"].id}`, { method: "DELETE" })
    await fetchApi(`/api/activities/records/${activityRecords["6th"].id}`, { method: "DELETE" })
    const getAllRecordsResponse = await fetchApi("/api/activities/records/search")
    expect(await getAllRecordsResponse.json()).toEqual<IActivityRecord[]>([
      activityRecords["7th"],
      activityRecords["5th"],
      activityRecords["4th"],
    ])
  })

  test("a user cannot delete a record of a board that they is not a member of", async () => {
    await authorize(users.johnDoe)
    const response = await fetchApi(`/api/activities/records/${activityRecords["1st"].id}`, { method: "DELETE" })
    expect(response.status).toEqual(403)
    expect(await response.json()).toEqual({ message: "Access denied." })
  })
})
