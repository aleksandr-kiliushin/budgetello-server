import { IBudgetCategory } from "#interfaces/budget"

import { boards } from "#e2e/constants/boards"
import { budgetCategories, budgetCategoryTypes } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe)
})

describe("Budget category updating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      payload: { name: "" },
      response: { fields: { name: "Category name cannot be empty." } },
      status: 400,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
    {
      payload: { name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid value." } },
      status: 400,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
    {
      payload: { boardId: 666666 },
      response: { fields: { boardId: "Invalid value." } },
      status: 400,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
    {
      payload: { name: "clothes" },
      response: {
        fields: {
          boardId: '"clothes" expense category already exists in this board.',
          name: '"clothes" expense category already exists in this board.',
          typeId: '"clothes" expense category already exists in this board.',
        },
      },
      status: 400,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
    {
      payload: { name: "clothes" },
      response: { message: "Access denied." },
      status: 403,
      url: `/api/budget/categories/${budgetCategories.giftsIncome.id}`,
    },
    {
      payload: {},
      response: budgetCategories.educationExpense,
      status: 200,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
    {
      payload: { boardId: boards.megaEconomists.id },
      response: { message: "Access denied." },
      status: 403,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
    {
      payload: { name: "teaching", typeId: budgetCategoryTypes.income.id },
      response: {
        board: budgetCategories.educationExpense.board,
        id: budgetCategories.educationExpense.id,
        name: "teaching",
        type: budgetCategoryTypes.income,
      },
      status: 200,
      url: `/api/budget/categories/${budgetCategories.educationExpense.id}`,
    },
  ])("Category editing case #%#", async ({ payload, response, status, url }) => {
    const categoryUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(categoryUpdatingResponse.status).toEqual(status)
    expect(await categoryUpdatingResponse.json()).toEqual(response)
  })

  it("updated category is presented in all categories list", async () => {
    await fetchApi(`/api/budget/categories/${budgetCategories.educationExpense.id}`, {
      body: JSON.stringify({ name: "drugs" }),
      method: "PATCH",
    })
    const getAllCategoriesResponse = await fetchApi("/api/budget/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IBudgetCategory>({
      board: budgetCategories.educationExpense.board,
      id: budgetCategories.educationExpense.id,
      name: "drugs",
      type: budgetCategoryTypes.expense,
    })
  })

  it("updated category category can be found by ID", async () => {
    await fetchApi("/api/budget/categories/2", { body: JSON.stringify({ typeId: 2 }), method: "PATCH" })
    const getUpdatedCategoryResponse = await fetchApi(`/api/budget/categories/${budgetCategories.educationExpense.id}`)
    expect(await getUpdatedCategoryResponse.json()).toEqual<IBudgetCategory>({
      board: budgetCategories.educationExpense.board,
      id: budgetCategories.educationExpense.id,
      name: "education",
      type: budgetCategoryTypes.income,
    })
  })
})
