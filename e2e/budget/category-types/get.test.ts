import { budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("get budget category types", () => {
  it("responds with all budget category types list", async () => {
    const response = await fetchGqlApi(`{
      budgetCategoryTypes {
        id,
        name
      }
    }`)
    expect(response).toEqual({
      data: {
        budgetCategoryTypes: [budgetCategoryTypes.expense, budgetCategoryTypes.income],
      },
    })
  })

  it("responds with a budget category type for a given id", async () => {
    const response = await fetchGqlApi(`{
      budgetCategoryType(id: ${budgetCategoryTypes.income.id}) {
        id,
        name
      }
    }`)
    expect(response).toEqual({
      data: {
        budgetCategoryType: budgetCategoryTypes.income,
      },
    })
  })
})
