import { budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get budget category types", () => {
  it("Find", async () => {
    const responseBody = await fetchGqlApi(`{
      budgetCategoryType(id: ${budgetCategoryTypes.income.id}) {
        ${pickFields.budgetCategoryType}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetCategoryType: budgetCategoryTypes.income,
    })
  })

  it("Get all", async () => {
    const responseBody = await fetchGqlApi(`{
      budgetCategoryTypes {
        ${pickFields.budgetCategoryType}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetCategoryTypes: [budgetCategoryTypes.expense, budgetCategoryTypes.income],
    })
  })
})
