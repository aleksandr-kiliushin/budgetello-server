import { activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("get activity category measurement types", () => {
  it("responds with all types list", async () => {
    const response = await fetchGqlApi(`{
      activityCategoryMeasurementTypes {
        id,
        name
      }
    }`)
    expect(response).toEqual({
      data: {
        activityCategoryMeasurementTypes: [
          activityCategoryMeasurementTypes.quantitative,
          activityCategoryMeasurementTypes.boolean,
        ],
      },
    })
  })

  it("responds with a category type for a given id", async () => {
    const response = await fetchGqlApi(`{
      activityCategoryMeasurementType(id: ${activityCategoryMeasurementTypes.boolean.id}) {
        id,
        name
      }
    }`)
    expect(response).toEqual({
      data: {
        activityCategoryMeasurementType: activityCategoryMeasurementTypes.boolean,
      },
    })
  })
})
