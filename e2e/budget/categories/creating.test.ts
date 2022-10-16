import { boards } from "#e2e/constants/boards"
import { budgetCategories, budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Budget category creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { name: "" },
      response: {
        fields: { boardId: "Required.", name: "Required.", typeId: "Required." },
      },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverBudgetiers.id, name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid value." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverBudgetiers.id, name: "education", typeId: budgetCategoryTypes.expense.id },
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
      payload: { boardId: boards.cleverBudgetiers.id, name: "education", typeId: budgetCategoryTypes.income.id },
      response: {
        board: { id: boards.cleverBudgetiers.id, name: boards.cleverBudgetiers.name },
        id: 6,
        name: "education",
        type: budgetCategoryTypes.income,
      },
      status: 201,
    },
  ])("Category creating case #%#", async ({ payload, response, status }) => {
    const categoryCreatingResponse = await fetchApi("/api/budget/categories", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(status)
    expect(await categoryCreatingResponse.json()).toEqual(response)
  })

  it("a newly created category can be found by ID", async () => {
    await fetchApi("/api/budget/categories", {
      body: JSON.stringify({
        boardId: boards.cleverBudgetiers.id,
        name: "food",
        typeId: budgetCategoryTypes.expense.id,
      }),
      method: "POST",
    })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/budget/categories/6")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual({
      board: budgetCategories.educationExpense.board,
      id: 6,
      name: "food",
      type: budgetCategoryTypes.expense,
    })
  })
})
