import { budgetCategories } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.jessicaStark.id)
})

describe("Budget category deleting", () => {
  it("restricts deleting categories in boards that you are not an admin of", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_BUDGET_CATEGORY {
      deleteBudgetCategory(id: ${budgetCategories.educationExpense.id}) {
        ${QueryFields.budgetCategory}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
  })

  it("deleting returns a correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_BUDGET_CATEGORY {
      deleteBudgetCategory(id: ${budgetCategories.salaryIncome.id}) {
        ${QueryFields.budgetCategory}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteBudgetCategory: budgetCategories.salaryIncome })
  })

  it("the deleted board is not found", async () => {
    await fetchGqlApi(`mutation DELETE_BUDGET_CATEGORY {
      deleteBudgetCategory(id: ${budgetCategories.salaryIncome.id}) {
        ${QueryFields.budgetCategory}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      budgetCategory(id: ${budgetCategories.salaryIncome.id}) {
        ${QueryFields.budgetCategory}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})
