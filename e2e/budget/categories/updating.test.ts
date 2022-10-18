import { boards } from "#e2e/constants/boards"
import { budgetCategories, budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Budget category updating", () => {
  test.each<{
    queryNameAndInput: string
    updatedCategory: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id}, name: "" })`,
      updatedCategory: undefined,
      responseError: { fields: { name: "Required." } },
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id}, typeId: 666666 })`,
      updatedCategory: undefined,
      responseError: { fields: { typeId: "Invalid value." } },
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id}, boardId: 666666 })`,
      updatedCategory: undefined,
      responseError: { fields: { boardId: "Invalid value." } },
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id}, name: "${budgetCategories.clothesExpense.name}" })`,
      updatedCategory: undefined,
      responseError: {
        fields: {
          boardId: '"clothes" expense category already exists in this board.',
          name: '"clothes" expense category already exists in this board.',
          typeId: '"clothes" expense category already exists in this board.',
        },
      },
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.giftsIncome.id}, name: "toys" })`,
      updatedCategory: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.giftsIncome.id}, boardId: ${boards.megaEconomists.id} })`,
      updatedCategory: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id} })`,
      updatedCategory: budgetCategories.educationExpense,
      responseError: undefined,
    },
    {
      queryNameAndInput: `updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id}, name: "teaching", typeId: ${budgetCategoryTypes.income.id} })`,
      updatedCategory: {
        board: budgetCategories.educationExpense.board,
        id: budgetCategories.educationExpense.id,
        name: "teaching",
        type: budgetCategoryTypes.income,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, updatedCategory, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_BUDGET_CATEGORY {
      ${queryNameAndInput} {
        ${pickFields.budgetCategory}
      }
    }`)
    expect(responseBody.data?.updateBudgetCategory).toEqual(updatedCategory)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("updated category can be found by ID", async () => {
    await fetchGqlApi(`mutation UPDATE_BUDGET_CATEGORY {
      updateBudgetCategory(input: { id: ${budgetCategories.educationExpense.id}, name: "teaching", typeId: ${budgetCategoryTypes.income.id} }) {
        ${pickFields.budgetCategory}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      budgetCategory(id: ${budgetCategories.educationExpense.id}) {
        ${pickFields.budgetCategory}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetCategory: {
        board: budgetCategories.educationExpense.board,
        id: budgetCategories.educationExpense.id,
        name: "teaching",
        type: budgetCategoryTypes.income,
      },
    })
  })
})
