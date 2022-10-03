import { IFinanceCategory } from "#interfaces/finance"

import { boards } from "#e2e/constants/boards"
import { financeCategories, financeCategoryTypes } from "#e2e/constants/finances"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Finance category creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: {
        boardId: boards.cleverFinanciers.id,
        name_WITH_A_TYPO: "food",
        typeId: financeCategoryTypes.expense.id,
      },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverFinanciers.id, name: "", typeId: financeCategoryTypes.expense.id },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: {
        boardId: boards.cleverFinanciers.id,
        name: "food",
        typeId_WITH_A_TYPO: financeCategoryTypes.expense.id,
      },
      response: { fields: { typeId: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverFinanciers.id, name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid category type." } },
      status: 400,
    },
    {
      payload: { name: "education", typeId: financeCategoryTypes.income.id },
      response: { fields: { boardId: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: boards.cleverFinanciers.id, name: "education", typeId: financeCategoryTypes.expense.id },
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
      payload: { boardId: boards.cleverFinanciers.id, name: "education", typeId: financeCategoryTypes.income.id },
      response: {
        board: { id: boards.cleverFinanciers.id, name: boards.cleverFinanciers.name },
        id: 6,
        name: "education",
        type: financeCategoryTypes.income,
      },
      status: 201,
    },
  ])("Category creating case #%#", async ({ payload, response, status }) => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(status)
    expect(await categoryCreatingResponse.json()).toEqual(response)
  })

  it("a newly created category is presented in all categories list", async () => {
    await fetchApi("/api/finances/categories", {
      body: JSON.stringify({
        boardId: boards.cleverFinanciers.id,
        name: "food",
        typeId: financeCategoryTypes.expense.id,
      }),
      method: "POST",
    })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      board: financeCategories.educationExpense.board,
      id: 6,
      name: "food",
      type: financeCategoryTypes.expense,
    })
  })

  it("a newly created category can be found by ID", async () => {
    await fetchApi("/api/finances/categories", {
      body: JSON.stringify({
        boardId: boards.cleverFinanciers.id,
        name: "food",
        typeId: financeCategoryTypes.expense.id,
      }),
      method: "POST",
    })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/finances/categories/6")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual({
      board: financeCategories.educationExpense.board,
      id: 6,
      name: "food",
      type: financeCategoryTypes.expense,
    })
  })
})
