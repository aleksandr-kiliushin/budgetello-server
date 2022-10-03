import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance category deleting", () => {
  it("returns a correct response after deleting", async () => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories/2", { method: "DELETE" })
    expect(categoryCreatingResponse.status).toEqual(200)
    expect(await categoryCreatingResponse.json()).toEqual<IFinanceCategory>({
      board: { id: 1, name: "clever-financiers" },
      id: 2,
      name: "education",
      type: { id: 1, name: "expense" },
    })
  })

  it("the deleted category is not presented in all categories list", async () => {
    await fetchApi("/api/finances/categories/2", { method: "DELETE" })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toEqual<IFinanceCategory[]>([
      { board: { id: 1, name: "clever-financiers" }, id: 1, name: "clothes", type: { id: 1, name: "expense" } },
    ])
  })
})
