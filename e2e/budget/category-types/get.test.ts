import { IBudgetCategoryType } from "#interfaces/budget"

import { budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("get budget category types", () => {
  it("responds with all budget category types list", async () => {
    const response = await fetchApi("/api/budget/category-types")
    expect(await response.json()).toEqual<IBudgetCategoryType[]>([
      budgetCategoryTypes.expense,
      budgetCategoryTypes.income,
    ])
  })

  it("responds with a budget category type for a given id", async () => {
    const response = await fetchApi("/api/budget/category-types/2")
    expect(await response.json()).toEqual<IBudgetCategoryType>({ id: 2, name: "income" })
  })
})
