import { IBudgetingCategory } from "#interfaces/budgeting"

import { boards } from "#e2e/constants/boards"
import { budgetingCategories, budgetingCategoryTypes } from "#e2e/constants/budgeting"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Budgeting category creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: {
        boardId: boards.cleverBudgetiers.id,
        name_WITH_A_TYPO: "food",
        typeId: budgetingCategoryTypes.expense.id,
      },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverBudgetiers.id, name: "", typeId: budgetingCategoryTypes.expense.id },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: {
        boardId: boards.cleverBudgetiers.id,
        name: "food",
        typeId_WITH_A_TYPO: budgetingCategoryTypes.expense.id,
      },
      response: { fields: { typeId: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverBudgetiers.id, name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid category type." } },
      status: 400,
    },
    {
      payload: { name: "education", typeId: budgetingCategoryTypes.income.id },
      response: { fields: { boardId: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverBudgetiers.id, name: "education", typeId: budgetingCategoryTypes.expense.id },
      response: {
        fields: {
          boardId: '"education" expense category already exists in this board.',
          name: '"education" expense category already exists in this board.',
          typeId: '"education" expense category already exists in this board.',
        },
      },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverBudgetiers.id, name: "education", typeId: budgetingCategoryTypes.income.id },
      response: {
        board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
        id: 6,
        name: "education",
        type: budgetingCategoryTypes.income,
      },
      status: 201,
    },
  ])("Category creating case #%#", async ({ payload, response, status }) => {
    const categoryCreatingResponse = await fetchApi("/api/budgeting/categories", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(status)
    expect(await categoryCreatingResponse.json()).toEqual(response)
  })

  it("a newly created category is presented in all categories list", async () => {
    await fetchApi("/api/budgeting/categories", {
      body: JSON.stringify({
        boardId: boards.cleverBudgetiers.id,
        name: "food",
        typeId: budgetingCategoryTypes.expense.id,
      }),
      method: "POST",
    })
    const getAllCategoriesResponse = await fetchApi("/api/budgeting/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IBudgetingCategory>({
      board: budgetingCategories.educationExpense.board,
      id: 6,
      name: "food",
      type: budgetingCategoryTypes.expense,
    })
  })

  it("a newly created category can be found by ID", async () => {
    await fetchApi("/api/budgeting/categories", {
      body: JSON.stringify({
        boardId: boards.cleverBudgetiers.id,
        name: "food",
        typeId: budgetingCategoryTypes.expense.id,
      }),
      method: "POST",
    })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/budgeting/categories/6")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual({
      board: budgetingCategories.educationExpense.board,
      id: 6,
      name: "food",
      type: budgetingCategoryTypes.expense,
    })
  })
})
