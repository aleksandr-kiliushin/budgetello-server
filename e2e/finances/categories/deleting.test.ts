import { financeCategories } from "#e2e/constants/finances"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Finance category deleting", () => {
  it("returns a correct response after deleting", async () => {
    const response = await fetchApi(`/api/finances/categories/${financeCategories.educationExpense.id}`, {
      method: "DELETE",
    })
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(financeCategories.educationExpense)
  })

  it("the deleted category is not presented in all categories list", async () => {
    await fetchApi(`/api/finances/categories/${financeCategories.educationExpense.id}`, { method: "DELETE" })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toEqual([financeCategories.clothesExpense])
  })
})
