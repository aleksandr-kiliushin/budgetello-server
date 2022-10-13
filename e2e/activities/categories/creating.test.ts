import { activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Activity category creating", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: { name: "" },
      response: {
        fields: {
          boardId: "Required.",
          measurementTypeId: "Required.",
          name: "Required.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: {
        boardId: boards.productivePeople.id,
        measurementTypeId: activityCategoryMeasurementTypes.quantitative.id,
        name: "medidate",
        unit: null,
      },
      response: {
        fields: {
          unit: "Required for «Quantitative» activities.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      payload: {
        boardId: boards.productivePeople.id,
        measurementTypeId: activityCategoryMeasurementTypes.quantitative.id,
        name: "reading",
        unit: "page",
      },
      response: {
        fields: {
          boardId: "Similar «reading» category already exists in this board.",
          measurementType: "Similar «reading» category already exists in this board.",
          name: "Similar «reading» category already exists in this board.",
          unit: "Similar «reading» category already exists in this board.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      payload: {
        boardId: boards.productivePeople.id,
        measurementTypeId: activityCategoryMeasurementTypes.quantitative.id,
        name: "reading",
        unit: "page",
      },
      response: {
        board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
        id: 7,
        measurementType: activityCategoryMeasurementTypes.quantitative,
        name: "reading",
        owner: users.jessicaStark,
        unit: "page",
      },
      status: 201,
    },
  ])("Case #%#", async ({ authorizedUserUsername, payload, response, status }) => {
    await authorize(authorizedUserUsername)
    const categoryCreatingResponse = await fetchApi("/api/activities/categories", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(status)
    expect(await categoryCreatingResponse.json()).toEqual(response)
  })

  it("a newly created category can be found by ID", async () => {
    await authorize(users.jessicaStark.username)
    await fetchApi("/api/activities/categories", {
      body: JSON.stringify({
        boardId: boards.productivePeople.id,
        measurementTypeId: activityCategoryMeasurementTypes.quantitative.id,
        name: "reading",
        unit: "page",
      }),
      method: "POST",
    })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/activities/categories/7")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual({
      board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
      id: 7,
      measurementType: activityCategoryMeasurementTypes.quantitative,
      name: "reading",
      owner: users.jessicaStark,
      unit: "page",
    })
  })
})
