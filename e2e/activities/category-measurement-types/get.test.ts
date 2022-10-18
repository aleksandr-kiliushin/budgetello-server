import { activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("get activity category measurement types", () => {
  it("responds with all types list", async () => {
    const response = await fetchGqlApi(`{
      activityCategoryMeasurementTypes {
        ${pickFields.activityCategoryMeasurementType}
      }
    }`)
    expect(response.data).toEqual({
      activityCategoryMeasurementTypes: [
        activityCategoryMeasurementTypes.quantitative,
        activityCategoryMeasurementTypes.boolean,
      ],
    })
  })

  it("responds with a category type for a given id", async () => {
    const response = await fetchGqlApi(`{
      activityCategoryMeasurementType(id: ${activityCategoryMeasurementTypes.boolean.id}) {
        ${pickFields.activityCategoryMeasurementType}
      }
    }`)
    expect(response.data).toEqual({ activityCategoryMeasurementType: activityCategoryMeasurementTypes.boolean })
  })
})
