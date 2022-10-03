import { IFinanceCategory } from "#interfaces/finance"

import { boards } from "#e2e/constants/boards"
import { financeCategories, financeCategoryTypes } from "#e2e/constants/finances"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Finance category updating", () => {
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
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
    },
    {
      payload: { name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid category type." } },
      status: 400,
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
    },
    {
      payload: { boardId: 666666 },
      response: { fields: { boardId: "Invalid board." } },
      status: 400,
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
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
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
    },
    {
      payload: { name: "clothes" },
      response: { message: "Access denied." },
      status: 403,
      url: `/api/finances/categories/${financeCategories.giftsIncome.id}`,
    },
    {
      payload: {},
      response: financeCategories.educationExpense,
      status: 200,
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
    },
    {
      payload: { boardId: boards.megaEconomists.id },
      response: { message: "Access denied." },
      status: 403,
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
    },
    {
      payload: { name: "teaching", typeId: financeCategoryTypes.income.id },
      response: {
        board: financeCategories.educationExpense.board,
        id: financeCategories.educationExpense.id,
        name: "teaching",
        type: financeCategoryTypes.income,
      },
      status: 200,
      url: `/api/finances/categories/${financeCategories.educationExpense.id}`,
    },
  ])("Category editing case #%#", async ({ payload, response, status, url }) => {
    const categoryUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(categoryUpdatingResponse.status).toEqual(status)
    expect(await categoryUpdatingResponse.json()).toEqual(response)
  })

  it("updated category is presented in all categories list", async () => {
    await fetchApi(`/api/finances/categories/${financeCategories.educationExpense.id}`, {
      body: JSON.stringify({ name: "drugs" }),
      method: "PATCH",
    })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      board: financeCategories.educationExpense.board,
      id: financeCategories.educationExpense.id,
      name: "drugs",
      type: financeCategoryTypes.expense,
    })
  })

  it("updated category category can be found by ID", async () => {
    await fetchApi("/api/finances/categories/2", { body: JSON.stringify({ typeId: 2 }), method: "PATCH" })
    const getUpdatedCategoryResponse = await fetchApi(
      `/api/finances/categories/${financeCategories.educationExpense.id}`
    )
    expect(await getUpdatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      board: financeCategories.educationExpense.board,
      id: financeCategories.educationExpense.id,
      name: "education",
      type: financeCategoryTypes.income,
    })
  })
})
