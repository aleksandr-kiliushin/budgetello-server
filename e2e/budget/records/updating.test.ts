import { budgetCategories, budgetRecords } from "#e2e/constants/budget"
import { currencies } from "#e2e/constants/currencies"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

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
      queryNameAndInput: `updateBudgetRecord(input: { id: ${budgetRecords["1st"].id}, amount: -100, date: "2022/08/05" })`,
      updatedRecord: undefined,
      responseError: {
        fields: {
          amount: "Should be positive.",
          date: "Should have format YYYY-MM-DD.",
        },
      },
    },
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
      queryNameAndInput: `updateBudgetRecord(input: { id: ${budgetRecords["1st"].id}, amount: 80000, categoryId: ${budgetCategories.educationExpense.id}, currencySlug: "${currencies.gel.slug}", date: "2030-01-02", isTrashed: false })`,
      updatedRecord: {
        amount: 80000,
        author: users.johnDoe,
        category: budgetCategories.educationExpense,
        currency: currencies.gel,
        date: "2030-01-02",
        id: budgetRecords["1st"].id,
        isTrashed: false,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, updatedRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_BUDGET_RECORD {
      ${queryNameAndInput} {
        ${pickFields.budgetRecord}
      }
    }`)
    expect(responseBody.data?.updateBudgetRecord).toEqual(updatedRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})
