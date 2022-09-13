import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance category updating", () => {
  test.each<{
    payload: Record<string, string | number>
    response: Record<string, unknown>
    status: number
    url: string
  }>([
    // {
    //   payload: { name: "", typeId: 1 },
    //   response: { fields: { name: "Required field." } },
    //   status: 400,
    // },
    // {
    //   payload: { name: "food", typeId_WITH_A_TYPO: 1 },
    //   response: { fields: { typeId: "Required field." } },
    //   status: 400,
    // },
    // {
    //   payload: { name: "food", typeId: 1234123 },
    //   response: { fields: { typeId: "Invalid category type." } },
    //   status: 400,
    // },
    // {
    //   payload: { name: "education", typeId: 1 },
    //   response: {
    //     fields: {
    //       name: '"education" expense category already exists.',
    //       typeId: '"education" expense category already exists.',
    //     },
    //   },
    //   status: 400,
    // },
    // {
    //   payload: { name: "education", typeId: 2 },
    //   response: { id: 6, name: "education", type: { id: 2, name: "income" } },
    //   status: 201,
    // },
    {
      payload: { name: "teaching", typeId: 2 },
      response: { id: 2, name: "teaching", type: { id: 2, name: "income" } },
      status: 200,
      url: "/api/finances/categories/2",
    },
  ])("Category editing case #%#", async ({ payload, response, status, url }) => {
    const categoryUpdatingResponse = await fetchApi(url, {
      body: JSON.stringify(payload),
      method: "PATCH",
    })
    expect(categoryUpdatingResponse.status).toEqual(status)
    expect(await categoryUpdatingResponse.json()).toEqual(response)
  })

  it("updated category is presented in all categories list", async () => {
    await fetchApi("/api/finances/categories/2", { body: JSON.stringify({ name: "drugs" }), method: "PATCH" })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      id: 2,
      name: "drugs",
      type: { id: 1, name: "expense" },
    })
  })

  it("updated category category can be found by ID", async () => {
    await fetchApi("/api/finances/categories/2", { body: JSON.stringify({ typeId: 2 }), method: "PATCH" })
    const getUpdatedCategoryResponse = await fetchApi("/api/finances/categories/2")
    expect(await getUpdatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      id: 2,
      name: "education",
      type: { id: 2, name: "income" },
    })
  })
})
