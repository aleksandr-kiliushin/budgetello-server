import { IBudgetingCategoryType } from "#interfaces/budgeting"

import { budgetingCategoryTypes } from "#e2e/constants/budgeting"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("get budgeting category types", () => {
  it("responds with all budgeting category types list", async () => {
    const fetchAllbudgetingCategoryTypesResponse = await fetchApi("/api/budgeting/category-types")
    expect(await fetchAllbudgetingCategoryTypesResponse.json()).toEqual<IBudgetingCategoryType[]>([
      budgetingCategoryTypes.expense,
      budgetingCategoryTypes.income,
    ])
  })

  it("responds with a budgeting category type for a given id", async () => {
    const getBudgetingCategoryTypeWithIdOf2 = await fetchApi("/api/budgeting/category-types/2")
    expect(await getBudgetingCategoryTypeWithIdOf2.json()).toEqual<IBudgetingCategoryType>({ id: 2, name: "income" })
  })
})
