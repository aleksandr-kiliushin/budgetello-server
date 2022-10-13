import { IActivityCategory } from "#interfaces/activities"

import { activityCategories, activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Activity category updating", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    payload: Record<string, unknown>
    responseBody: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: { unit: "" },
      responseBody: {
        fields: {
          measurementTypeId: "«Quantitative» activity must be measured in units.",
          unit: "Required for «Quantitative» activities.",
        },
      },
      status: 400,
      url: `/api/activities/categories/${activityCategories.reading.id}`,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: { unit: null },
      responseBody: {
        fields: {
          measurementTypeId: "«Quantitative» activity must be measured in units.",
          unit: "Required for «Quantitative» activities.",
        },
      },
      status: 400,
      url: `/api/activities/categories/${activityCategories.reading.id}`,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: { measurementTypeId: activityCategoryMeasurementTypes.boolean.id },
      responseBody: {
        fields: {
          measurementTypeId: "«Yes / no» activity cannot be measured with any unit.",
          unit: "«Yes / no» activity cannot be measured with any unit.",
        },
      },
      status: 400,
      url: `/api/activities/categories/${activityCategories.reading.id}`,
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      payload: {
        name: activityCategories.pushups.name,
        unit: activityCategories.pushups.unit,
      },
      responseBody: {
        fields: {
          boardId: "Similar «pushups» category already exists in this board.",
          measurementType: "Similar «pushups» category already exists in this board.",
          name: "Similar «pushups» category already exists in this board.",
          unit: "Similar «pushups» category already exists in this board.",
        },
      },
      status: 400,
      url: `/api/activities/categories/${activityCategories.running.id}`,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: { name: "write conspects" },
      responseBody: { message: "Access denied." },
      status: 403,
      url: `/api/activities/categories/${activityCategories.running.id}`,
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      payload: {},
      responseBody: { message: "Access denied." },
      status: 403,
      url: `/api/activities/categories/${activityCategories.reading.id}`,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: {},
      responseBody: activityCategories.reading,
      status: 200,
      url: `/api/activities/categories/${activityCategories.reading.id}`,
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      payload: {
        boardId: boards.productivePeople.id,
        measurementTypeId: activityCategoryMeasurementTypes.boolean.id,
        name: "meditate",
        unit: null,
      },
      responseBody: {
        board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
        id: 4,
        measurementType: activityCategoryMeasurementTypes.boolean,
        name: "meditate",
        owner: users.jessicaStark,
        unit: null,
      },
      status: 200,
      url: `/api/activities/categories/${activityCategories.sleep.id}`,
    },
  ])("case #%#", async ({ authorizedUserUsername, payload, responseBody, status, url }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })

  it("updated category category can be found by ID", async () => {
    await authorize(users.johnDoe.username)
    await fetchApi(`/api/activities/categories/${activityCategories.reading.id}`, {
      body: JSON.stringify({ unit: "hour" }),
      method: "PATCH",
    })
    const getUpdatedCategoryResponse = await fetchApi(`/api/activities/categories/${activityCategories.reading.id}`)
    expect(await getUpdatedCategoryResponse.json()).toEqual<IActivityCategory>({
      board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
      id: 5,
      measurementType: activityCategoryMeasurementTypes.quantitative,
      name: "reading",
      owner: users.johnDoe,
      unit: "hour",
    })
  })
})
