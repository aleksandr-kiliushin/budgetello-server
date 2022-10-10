import { IBudgetingCategory } from "#interfaces/budgeting"

import { boards } from "#e2e/constants/boards"
import { budgetingCategories, budgetingCategoryTypes } from "#e2e/constants/budgeting"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Budgeting category updating", () => {
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
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
    },
    {
      payload: { name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid value." } },
      status: 400,
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
    },
    {
      payload: { boardId: 666666 },
      response: { fields: { boardId: "Invalid value." } },
      status: 400,
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
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
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
    },
    {
      payload: { name: "clothes" },
      response: { message: "Access denied." },
      status: 403,
      url: `/api/budgeting/categories/${budgetingCategories.giftsIncome.id}`,
    },
    {
      payload: {},
      response: budgetingCategories.educationExpense,
      status: 200,
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
    },
    {
      payload: { boardId: boards.megaEconomists.id },
      response: { message: "Access denied." },
      status: 403,
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
    },
    {
      payload: { name: "teaching", typeId: budgetingCategoryTypes.income.id },
      response: {
        board: budgetingCategories.educationExpense.board,
        id: budgetingCategories.educationExpense.id,
        name: "teaching",
        type: budgetingCategoryTypes.income,
      },
      status: 200,
      url: `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`,
    },
  ])("Category editing case #%#", async ({ payload, response, status, url }) => {
    const categoryUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(categoryUpdatingResponse.status).toEqual(status)
    expect(await categoryUpdatingResponse.json()).toEqual(response)
  })

  it("updated category is presented in all categories list", async () => {
    await fetchApi(`/api/budgeting/categories/${budgetingCategories.educationExpense.id}`, {
      body: JSON.stringify({ name: "drugs" }),
      method: "PATCH",
    })
    const getAllCategoriesResponse = await fetchApi("/api/budgeting/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IBudgetingCategory>({
      board: budgetingCategories.educationExpense.board,
      id: budgetingCategories.educationExpense.id,
      name: "drugs",
      type: budgetingCategoryTypes.expense,
    })
  })

  it("updated category category can be found by ID", async () => {
    await fetchApi("/api/budgeting/categories/2", { body: JSON.stringify({ typeId: 2 }), method: "PATCH" })
    const getUpdatedCategoryResponse = await fetchApi(
      `/api/budgeting/categories/${budgetingCategories.educationExpense.id}`
    )
    expect(await getUpdatedCategoryResponse.json()).toEqual<IBudgetingCategory>({
      board: budgetingCategories.educationExpense.board,
      id: budgetingCategories.educationExpense.id,
      name: "education",
      type: budgetingCategoryTypes.income,
    })
  })
})
