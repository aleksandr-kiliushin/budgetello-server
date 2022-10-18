import { boards } from "#e2e/constants/boards"
import { budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Budget category creating", () => {
  test.each<{
    queryNameAndInput: string
    createdCategory: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createBudgetCategory(input: { boardId: ${boards.cleverBudgetiers.id}, name: "food", typeId: 666666 })`,
      createdCategory: undefined,
      responseError: { fields: { typeId: "Invalid value." } },
    },
    {
      queryNameAndInput: `createBudgetCategory(input: { boardId: ${boards.cleverBudgetiers.id}, name: "education", typeId: ${budgetCategoryTypes.expense.id} })`,
      createdCategory: undefined,
      responseError: {
        fields: {
          boardId: '"education" expense category already exists in this board.',
          name: '"education" expense category already exists in this board.',
          typeId: '"education" expense category already exists in this board.',
        },
      },
    },
    {
      queryNameAndInput: `createBudgetCategory(input: { boardId: ${boards.cleverBudgetiers.id}, name: "food", typeId: ${budgetCategoryTypes.expense.id} })`,
      createdCategory: {
        board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
        id: 6,
        name: "food",
        type: budgetCategoryTypes.expense,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdCategory, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation CREATE_BUDGET_CATEGORY {
      ${queryNameAndInput} {
        ${pickFields.budgetCategory}
      }
    }`)
    expect(responseBody.data?.createBudgetCategory).toEqual(createdCategory)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("created category found successfully", async () => {
    await fetchGqlApi(`mutation CREATE_BUDGET_CATEGORY {
      createBudgetCategory(input: { boardId: ${boards.cleverBudgetiers.id}, name: "food", typeId: ${budgetCategoryTypes.expense.id} }) {
        ${pickFields.budgetCategory}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      budgetCategory(id: 6) {
        ${pickFields.budgetCategory}
      }
    }`)
    expect(responseBody.data).toEqual({
      budgetCategory: {
        board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
        id: 6,
        name: "food",
        type: budgetCategoryTypes.expense,
      },
    })
  })
})
