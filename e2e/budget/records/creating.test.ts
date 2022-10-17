import { budgetCategories } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Budget record creating", () => {
  test.each<{
    queryNameAndInput: string
    createdRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createBudgetRecord(input: { amount: 200, categoryId: 666666, date: "2022-08-05" })`,
      createdRecord: undefined,
      responseError: { fields: { categoryId: "Invalid value." } },
    },
    {
      queryNameAndInput: `createBudgetRecord(input: { amount: -200, categoryId: ${budgetCategories.clothesExpense.id}, date: "2022|08|05" })`,
      createdRecord: undefined,
      responseError: {
        fields: {
          amount: "Should be positive.",
          date: "Should have format YYYY-MM-DD.",
        },
      },
    },
    {
      queryNameAndInput: `createBudgetRecord(input: { amount: 200, categoryId: ${budgetCategories.clothesExpense.id}, date: "2022-08-05" })`,
      createdRecord: {
        amount: 200,
        category: budgetCategories.clothesExpense,
        date: "2022-08-05",
        id: 7,
        isTrashed: false,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation CREATE_BUDGET_RECORD {
      ${queryNameAndInput} {
        ${QueryFields.budgetRecord}
      }
    }`)
    expect(responseBody.data?.createBudgetRecord).toEqual(createdRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("created record fetched successfully", async () => {
    await fetchGqlApi(`mutation CREATE_BUDGET_RECORD {
      createBudgetRecord(input: { amount: 200, categoryId: ${budgetCategories.clothesExpense.id}, date: "2022-08-05" }) {
        ${QueryFields.budgetRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      budgetRecord(id: 7) {
        ${QueryFields.budgetRecord}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetRecord: {
        amount: 200,
        category: budgetCategories.clothesExpense,
        date: "2022-08-05",
        id: 7,
        isTrashed: false,
      },
    })
  })
})
