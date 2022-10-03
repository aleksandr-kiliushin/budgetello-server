import { IFinanceCategoryType } from "#interfaces/finance"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("get finance category types", () => {
  it("responds with all finance category types list", async () => {
    const fetchAllFinanceCategoryTypesResponse = await fetchApi("/api/finances/category-types")
    expect(await fetchAllFinanceCategoryTypesResponse.json()).toEqual<IFinanceCategoryType[]>([
      { id: 1, name: "expense" },
      { id: 2, name: "income" },
    ])
  })

  it("responds with a finance category type for a given id", async () => {
    const getFinanceCategoryTypeWithIdOf2 = await fetchApi("/api/finances/category-types/2")
    expect(await getFinanceCategoryTypeWithIdOf2.json()).toEqual<IFinanceCategoryType>({ id: 2, name: "income" })
  })
})
