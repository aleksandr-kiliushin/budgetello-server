import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance category creating", () => {
  test.each<{
    payload: Record<string, string | number>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { name_WITH_A_TYPO: "food", typeId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "", typeId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", typeId_WITH_A_TYPO: 1 },
      response: { fields: { typeId: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid category type." } },
      status: 400,
    },
    {
      payload: { name: "education", typeId: 1 },
      response: {
        fields: {
          name: '"education" expense category already exists.',
          typeId: '"education" expense category already exists.',
        },
      },
      status: 400,
    },
    {
      payload: { name: "education", typeId: 2 },
      response: { id: 6, name: "education", type: { id: 2, name: "income" } },
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
    await fetchApi("/api/finances/categories", { body: JSON.stringify({ name: "food", typeId: 1 }), method: "POST" })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category can be found by ID", async () => {
    await fetchApi("/api/finances/categories", { body: JSON.stringify({ name: "food", typeId: 1 }), method: "POST" })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/finances/categories/6")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })
})
