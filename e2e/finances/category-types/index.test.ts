import { IFinanceCategoryType } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

describe("finance category types", () => {
  it("responds with all finance category types list", async () => {
    const authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const fetchAllFinanceCategoryTypesResponse = await fetch("http://localhost:3080/api/finances/category-type", {
      headers: { Authorization: "Bearer " + authToken },
    })
    expect(await fetchAllFinanceCategoryTypesResponse.json()).toEqual<IFinanceCategoryType[]>([
      { id: 1, name: "expense" },
      { id: 2, name: "income" },
    ])
  })

  it("responds with a finance category type for a given id", async () => {
    const authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const getFinanceCategoryTypeWithIdOf2 = await fetch("http://localhost:3080/api/finances/category-type/2", {
      headers: { Authorization: "Bearer " + authToken },
    })
    expect(await getFinanceCategoryTypeWithIdOf2.json()).toEqual<IFinanceCategoryType>({ id: 2, name: "income" })
  })
})
