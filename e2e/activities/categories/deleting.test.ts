import { activityCategories } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Activity category deleting", () => {
  it("returns a correct response after deleting", async () => {
    await authorize(users.johnDoe.id)
    const response = await fetchApi(`/api/activities/categories/${activityCategories.reading.id}`, {
      method: "DELETE",
    })
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(activityCategories.reading)
  })

  it("cannot be delete by a user who is not a member of the category's board", async () => {
    await authorize(users.johnDoe.id)
    const response = await fetchApi(`/api/activities/categories/${activityCategories.running.id}`, {
      method: "DELETE",
    })
    expect(response.status).toEqual(403)
    expect(await response.json()).toEqual({ message: "Access denied." })
  })

  it("cannot be delete by a user who does not own this category", async () => {
    await authorize(users.jessicaStark.id)
    const response = await fetchApi(`/api/activities/categories/${activityCategories.reading.id}`, {
      method: "DELETE",
    })
    expect(response.status).toEqual(403)
    expect(await response.json()).toEqual({ message: "Access denied." })
  })

  it("the deleted category is not presented in all categories list", async () => {
    await authorize(users.johnDoe.id)
    await fetchApi(`/api/activities/categories/${activityCategories.reading.id}`, {
      method: "DELETE",
    })
    const getAllCategoriesResponse = await fetchApi("/api/activities/categories/search")
    expect(await getAllCategoriesResponse.json()).toEqual([activityCategories.meditate])
  })
})
