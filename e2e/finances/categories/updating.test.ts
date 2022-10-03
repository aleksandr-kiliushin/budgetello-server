import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
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
      url: "/api/finances/categories/2",
    },
    {
      payload: { name: "food", typeId: 1234123 },
      response: { fields: { typeId: "Invalid category type." } },
      status: 400,
      url: "/api/finances/categories/2",
    },
    {
      payload: { boardId: 666666 },
      response: { fields: { boardId: "Invalid board." } },
      status: 400,
      url: "/api/finances/categories/2",
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
      url: "/api/finances/categories/2",
    },
    {
      payload: { name: "clothes" },
      response: { message: "Access denied." },
      status: 403,
      url: "/api/finances/categories/4",
    },
    {
      payload: {},
      response: {
        board: { id: 1, name: "clever-financiers" },
        id: 2,
        name: "education",
        type: { id: 1, name: "expense" },
      },
      status: 200,
      url: "/api/finances/categories/2",
    },
    {
      payload: { boardId: 2 },
      response: { message: "Access denied." },
      status: 403,
      url: "/api/finances/categories/2",
    },
    {
      payload: { name: "teaching", typeId: 2 },
      response: {
        board: { id: 1, name: "clever-financiers" },
        id: 2,
        name: "teaching",
        type: { id: 2, name: "income" },
      },
      status: 200,
      url: "/api/finances/categories/2",
    },
  ])("Category editing case #%#", async ({ payload, response, status, url }) => {
    const categoryUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(categoryUpdatingResponse.status).toEqual(status)
    expect(await categoryUpdatingResponse.json()).toEqual(response)
  })

  it("updated category is presented in all categories list", async () => {
    await fetchApi("/api/finances/categories/2", { body: JSON.stringify({ name: "drugs" }), method: "PATCH" })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      board: { id: 1, name: "clever-financiers" },
      id: 2,
      name: "drugs",
      type: { id: 1, name: "expense" },
    })
  })

  it("updated category category can be found by ID", async () => {
    await fetchApi("/api/finances/categories/2", { body: JSON.stringify({ typeId: 2 }), method: "PATCH" })
    const getUpdatedCategoryResponse = await fetchApi("/api/finances/categories/2")
    expect(await getUpdatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      board: { id: 1, name: "clever-financiers" },
      id: 2,
      name: "education",
      type: { id: 2, name: "income" },
    })
  })
})
