import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance category updating", () => {
  it("returns a correct response after updating", async () => {
    const categoryUpdatingResponse = await fetchApi("/api/finances/categories/2", {
      body: JSON.stringify({ name: "teaching", typeId: 2 }),
      method: "PATCH",
    })
    expect(categoryUpdatingResponse.status).toEqual(200)
    expect(await categoryUpdatingResponse.json()).toEqual<IFinanceCategory>({
      id: 2,
      name: "teaching",
      type: { id: 2, name: "income" },
    })
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
