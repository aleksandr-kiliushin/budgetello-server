import { budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get budget category types", () => {
  it("Find", async () => {
    const responseBody = await fetchGqlApi(`{
      budgetCategoryType(id: ${budgetCategoryTypes.income.id}) {
        ${QueryFields.budgetCategoryType}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetCategoryType: budgetCategoryTypes.income,
    })
  })

  it("Get all", async () => {
    const responseBody = await fetchGqlApi(`{
      budgetCategoryTypes {
        ${QueryFields.budgetCategoryType}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetCategoryTypes: [budgetCategoryTypes.expense, budgetCategoryTypes.income],
    })
  })
})
