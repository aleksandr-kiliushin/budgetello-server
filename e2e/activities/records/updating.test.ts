import { UpdateActivityRecordDto } from "#models/activity-records/dto/update-activity-record.dto"

import { IActivityRecord } from "#interfaces/activities"

import { activityCategories, activityRecords } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Activity record updating", () => {
  it("updated record can be found by ID", async () => {
    await authorize(users.johnDoe.username)
    const updateRecordPayload: UpdateActivityRecordDto = {
      comment: "read about CI",
      date: "2022-08-11",
      quantitativeValue: 6,
    }
    await fetchApi(`/api/activities/records/${activityRecords["5th"].id}`, {
      body: JSON.stringify(updateRecordPayload),
      method: "PATCH",
    })
    const getCategoryResponse = await fetchApi(`/api/activities/records/${activityRecords["5th"].id}`)
    expect(await getCategoryResponse.json()).toEqual<IActivityRecord>({
      booleanValue: null,
      category: activityCategories.reading,
      comment: "read about CI",
      date: "2022-08-11",
      id: 5,
      quantitativeValue: 6,
    })
  })

  test.each<{
    authorizedUserUsername: ITestUserUsername
    url: string
    payload: Record<string, unknown>
    responseBody: Record<string, unknown>
    status: number
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["5th"].id}`,
      payload: { categoryId: 666666 },
      responseBody: { fields: { categoryId: "Invalid value." } },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["5th"].id}`,
      payload: { date: "20_08_10qwer" },
      responseBody: { fields: { date: "Should have format YYYY-MM-DD." } },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["5th"].id}`,
      payload: { quantitativeValue: null },
      responseBody: {
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      },
      status: 400,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["5th"].id}`,
      payload: {},
      responseBody: activityRecords["5th"],
      status: 200,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["1st"].id}`,
      payload: {},
      responseBody: { message: "Access denied." },
      status: 403,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["5th"].id}`,
      payload: {
        comment: "read about CI",
        date: "2022-08-11",
        quantitativeValue: 6,
      },
      responseBody: {
        booleanValue: null,
        category: activityCategories.reading,
        comment: "read about CI",
        date: "2022-08-11",
        id: 5,
        quantitativeValue: 6,
      },
      status: 200,
    },
  ])("case #%#", async ({ authorizedUserUsername, url, payload, responseBody, status }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })
})
