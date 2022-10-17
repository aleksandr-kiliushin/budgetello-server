import { budgetCategories, budgetRecords } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Budget record updating", () => {
  test.each<{
    queryNameAndInput: string
    updatedRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `updateBudgetRecord(input: { id: ${budgetRecords["1st"].id}, categoryId: 666666 })`,
      updatedRecord: undefined,
      responseError: { fields: { categoryId: "Invalid value." } },
    },
    {
      queryNameAndInput: `updateBudgetRecord(input: { id: ${budgetRecords["5th"].id} })`,
      updatedRecord: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndInput: `updateBudgetRecord(input: { id: ${budgetRecords["1st"].id} })`,
      updatedRecord: budgetRecords["1st"],
      responseError: undefined,
    },
    {
      queryNameAndInput: `updateBudgetRecord(input: { id: ${budgetRecords["1st"].id}, amount: 80000, categoryId: ${budgetCategories.educationExpense.id}, date: "2030-01-02", isTrashed: false })`,
      updatedRecord: {
        amount: 80000,
        category: budgetCategories.educationExpense,
        date: "2030-01-02",
        id: budgetRecords["1st"].id,
        isTrashed: false,
      },
      responseError: undefined,
    },
    // {
    //   payload: { amount: 0, categoryId: budgetCategories.clothesExpense.id, date: "2022-08-05" },
    //   response: { fields: { amount: "Should be a positive number." } },
    //   status: 400,
    // },
    // {
    //   payload: { date: "2022/08/05" },
    //   response: { fields: { date: "Should have format YYYY-MM-DD." } },
    //   status: 400,
    // },
  ])("$queryNameAndInput", async ({ queryNameAndInput, updatedRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_BUDGET_RECORD {
      ${queryNameAndInput} {
        ${QueryFields.budgetRecord}
      }
    }`)
    expect(responseBody.data?.updateBudgetRecord).toEqual(updatedRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})
