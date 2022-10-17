import { activityCategories } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Activity category deleting", () => {
  it("returns a correct response after deleting", async () => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`mutation DELETE_ACTIVITY_CATEGORY {
      deleteActivityCategory(id: ${activityCategories.reading.id}) {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteActivityCategory: activityCategories.reading })
  })

  it("cannot be deleted by a user who is not a member of the category's board", async () => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`mutation DELETE_ACTIVITY_CATEGORY {
      deleteActivityCategory(id: ${activityCategories.running.id}) {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Access denied." })
  })

  it("cannot be delete by a user who does not own this category", async () => {
    await authorize(users.jessicaStark.id)
    const responseBody = await fetchGqlApi(`mutation DELETE_ACTIVITY_CATEGORY {
      deleteActivityCategory(id: ${activityCategories.reading.id}) {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Access denied." })
  })

  it("deleted category cannot be found", async () => {
    await authorize(users.johnDoe.id)
    await fetchGqlApi(`mutation DELETE_ACTIVITY_CATEGORY {
      deleteActivityCategory(id: ${activityCategories.reading.id}) {
        ${QueryFields.activityCategory}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      activityCategory(id: ${activityCategories.reading.id}) {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Not found." })
  })
})
