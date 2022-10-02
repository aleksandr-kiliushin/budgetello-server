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
      payload: { groupId: 666666 },
      response: { fields: { groupId: "Invalid group." } },
      status: 400,
      url: "/api/finances/categories/2",
    },
    {
      payload: { name: "clothes" },
      response: {
        fields: {
          groupId: '"clothes" expense category already exists in this group.',
          name: '"clothes" expense category already exists in this group.',
          typeId: '"clothes" expense category already exists in this group.',
        },
      },
      status: 400,
      url: "/api/finances/categories/2",
    },
    {
      payload: { groupId: 2, name: "teaching", typeId: 2 },
      response: { group: { id: 2, name: "mega-economists" }, id: 2, name: "teaching", type: { id: 2, name: "income" } },
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
      group: { id: 1, name: "clever-financiers" },
      id: 2,
      name: "drugs",
      type: { id: 1, name: "expense" },
    })
  })

  it("updated category category can be found by ID", async () => {
    await fetchApi("/api/finances/categories/2", { body: JSON.stringify({ typeId: 2 }), method: "PATCH" })
    const getUpdatedCategoryResponse = await fetchApi("/api/finances/categories/2")
    expect(await getUpdatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      group: { id: 1, name: "clever-financiers" },
      id: 2,
      name: "education",
      type: { id: 2, name: "income" },
    })
  })
})
