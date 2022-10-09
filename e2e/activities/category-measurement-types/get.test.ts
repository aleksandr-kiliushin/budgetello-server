import { IActivityCategoryMeasurementType } from "#interfaces/activities"

import { activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("get activity category measurement types", () => {
  it("responds with all types list", async () => {
    const fetchAll = await fetchApi("/api/activities/category-measurement-types")
    expect(await fetchAll.json()).toEqual<IActivityCategoryMeasurementType[]>([
      activityCategoryMeasurementTypes.quantitative,
      activityCategoryMeasurementTypes.boolean,
    ])
  })

  it("responds with a category type for a given id", async () => {
    const response = await fetchApi(
      `/api/activities/category-measurement-types/${activityCategoryMeasurementTypes.boolean.id}`
    )
    expect(await response.json()).toEqual<IActivityCategoryMeasurementType>(activityCategoryMeasurementTypes.boolean)
  })
})
