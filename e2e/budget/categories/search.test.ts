import { boards } from "#e2e/constants/boards"
import { budgetCategories } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Find budget category", () => {
  test.each<{
    queryNameAndArgs: string
    foundCategory: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `budgetCategory(id: ${budgetCategories.clothesExpense.id})`,
      foundCategory: budgetCategories.clothesExpense,
      responseError: undefined,
    },
    {
      queryNameAndArgs: `budgetCategory(id: ${budgetCategories.giftsExpense.id})`,
      foundCategory: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndArgs: `budgetCategory(id: 666666)`,
      foundCategory: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundCategory, responseError }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.budgetCategory}
      }
    }`)
    expect(responseBody.data?.budgetCategory).toEqual(foundCategory)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search budget categories", () => {
  test.each<{
    queryNameAndArgs: string
    foundCategories: unknown[]
  }>([
    {
      queryNameAndArgs: `budgetCategories(ids: [${budgetCategories.clothesExpense.id}])`,
      foundCategories: [budgetCategories.clothesExpense],
    },
    {
      queryNameAndArgs: `budgetCategories(boardsIds: [${boards.cleverBudgetiers.id}])`,
      foundCategories: [budgetCategories.clothesExpense, budgetCategories.educationExpense],
    },
    {
      queryNameAndArgs: `budgetCategories(ids: [${budgetCategories.educationExpense.id}, ${budgetCategories.giftsExpense.id}])`,
      foundCategories: [budgetCategories.educationExpense],
    },
    {
      queryNameAndArgs: `budgetCategories(ids: [${budgetCategories.salaryIncome.id}, 666666])`,
      foundCategories: [],
    },
    {
      queryNameAndArgs: `budgetCategories`,
      foundCategories: [budgetCategories.clothesExpense, budgetCategories.educationExpense],
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundCategories }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.budgetCategory}
      }
    }`)
    expect(responseBody.data?.budgetCategories).toEqual(foundCategories)
  })
})
