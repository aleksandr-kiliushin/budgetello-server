import { CreateActivityRecordDto } from "#models/activity-records/dto/create-activity-record.dto"

import { IActivityRecord } from "#interfaces/activities"

import { activityCategories } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { ITestUser, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Activity record creating", () => {
  it("a newly created record is presented in all records list", async () => {
    await authorize(users.johnDoe)
    const createRecordPayload: CreateActivityRecordDto = {
      booleanValue: null,
      categoryId: activityCategories.reading.id,
      comment: "read about backend",
      date: "2022-08-10",
      quantitativeValue: 4.5,
    }
    await fetchApi("/api/activities/records", { body: JSON.stringify(createRecordPayload), method: "POST" })
    const getAllCategoriesResponse = await fetchApi("/api/activities/records/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IActivityRecord>({
      booleanValue: null,
      category: activityCategories.reading,
      comment: "read about backend",
      date: "2022-08-10",
      id: 8,
      quantitativeValue: 4.5,
    })
  })

  test.each<{
    authorizedUserUsername: ITestUser
    payload: Record<string, unknown>
    responseBody: Record<string, unknown>
    status: number
  }>([
    {
      authorizedUserUsername: users.johnDoe,
      payload: {},
      responseBody: {
        fields: {
          categoryId: "Required.",
          date: "Required.",
          comment: "Required.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe,
      payload: {
        booleanValue: null,
        categoryId: activityCategories.reading.id,
        comment: "read about backend",
        date: "2022/08/10",
        quantitativeValue: 4.5,
      },
      responseBody: { fields: { date: "Should have format YYYY-MM-DD." } },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe,
      payload: {
        booleanValue: true,
        categoryId: activityCategories.reading.id,
        comment: "read about backend",
        date: "2022-08-10",
        quantitativeValue: null,
      },
      responseBody: {
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.jessicaStark,
      payload: {
        booleanValue: null,
        categoryId: activityCategories.noSweets.id,
        comment: "Yes, I did it today!",
        date: "2022-08-10",
        quantitativeValue: 1,
      },
      responseBody: {
        fields: {
          categoryId: "Yes-no option should be filled for «Yes / no» activity.",
          booleanValue: "Yes-no option should be filled for «Yes / no» activity.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe,
      payload: {
        booleanValue: null,
        categoryId: activityCategories.reading.id,
        comment: "read about backend",
        date: "2022-08-10",
        quantitativeValue: 4.5,
      },
      responseBody: {
        booleanValue: null,
        category: activityCategories.reading,
        comment: "read about backend",
        date: "2022-08-10",
        id: 8,
        quantitativeValue: 4.5,
      },
      status: 201,
    },
  ])("Budget record creating case #%#", async ({ authorizedUserUsername, payload, responseBody, status }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi("/api/activities/records", { body: JSON.stringify(payload), method: "POST" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })
})
