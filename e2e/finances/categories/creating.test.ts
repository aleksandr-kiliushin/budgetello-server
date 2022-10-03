import { IFinanceCategory } from "#interfaces/finance"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance category creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { boardId: 1, name_WITH_A_TYPO: "food", typeId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: 1, name: "", typeId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: 1, name: "food", typeId_WITH_A_TYPO: 1 },
      response: { fields: { typeId: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: 1, name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid category type." } },
      status: 400,
    },
    {
      payload: { name: "education", typeId: 2 },
      response: { fields: { boardId: "Required field." } },
      status: 400,
    },
    {
      payload: { boardId: 1, name: "education", typeId: 1 },
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
      payload: { boardId: 1, name: "education", typeId: 2 },
      response: {
        board: { id: 1, name: "clever-financiers" },
        id: 6,
        name: "education",
        type: { id: 2, name: "income" },
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
      body: JSON.stringify({ boardId: 1, name: "food", typeId: 1 }),
      method: "POST",
    })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      board: { id: 1, name: "clever-financiers" },
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category can be found by ID", async () => {
    await fetchApi("/api/finances/categories", {
      body: JSON.stringify({ boardId: 1, name: "food", typeId: 1 }),
      method: "POST",
    })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/finances/categories/6")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      board: { id: 1, name: "clever-financiers" },
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })
})
