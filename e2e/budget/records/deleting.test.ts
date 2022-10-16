import { IBudgetRecord } from "#interfaces/budget"

import { budgetRecords } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Budget record deleting", () => {
  it("returns a correct response after deleting", async () => {
    await authorize(users.jessicaStark)
    const recordDeletingResponse = await fetchApi(`/api/budget/records/${budgetRecords["5th"].id}`, {
      method: "DELETE",
    })
    expect(recordDeletingResponse.status).toEqual(200)
    expect(await recordDeletingResponse.json()).toEqual<IBudgetRecord>(budgetRecords["5th"])
  })

  it("the deleted records are not presented in all records list", async () => {
    await authorize(users.jessicaStark)
    await fetchApi(`/api/budget/records/${budgetRecords["1st"].id}`, { method: "DELETE" })
    await fetchApi(`/api/budget/records/${budgetRecords["2nd"].id}`, { method: "DELETE" })
    await fetchApi(`/api/budget/records/${budgetRecords["3rd"].id}`, { method: "DELETE" })
    await fetchApi(`/api/budget/records/${budgetRecords["6th"].id}`, { method: "DELETE" })
    const getAllRecordsResponse = await fetchApi("/api/budget/records/search")
    expect(await getAllRecordsResponse.json()).toEqual<IBudgetRecord[]>([budgetRecords["5th"], budgetRecords["4th"]])
  })

  test("the user cannot delete a record of a board that they is not a member of", async () => {
    await authorize(users.johnDoe)
    const recordUpdatingResponse = await fetchApi(`/api/budget/records/${budgetRecords["5th"].id}`, {
      method: "DELETE",
    })
    expect(recordUpdatingResponse.status).toEqual(403)
    expect(await recordUpdatingResponse.json()).toEqual({ message: "Access denied." })
  })
})
