import { IFinanceRecord } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Get finance record by ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IFinanceRecord }
    | { url: string; responseStatus: 403; responseData: { message: string } }
    | { url: string; responseStatus: 404; responseData: { message: string } }
  >([
    {
      url: "/api/finances/records/1",
      responseStatus: 200,
      responseData: {
        amount: 100,
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 1,
          name: "clothes",
          type: { id: 1, name: "expense" },
        },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
    },
    {
      url: "/api/finances/records/4",
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/finances/records/666",
      responseStatus: 404,
      responseData: { message: "Record with ID '666' not found." },
    },
  ])("find record for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Finance records search", () => {
  test.each<{ url: string; searchResult: IFinanceRecord[] }>([
    {
      url: "/api/finances/records/search",
      searchResult: [
        {
          amount: 25,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 2,
            name: "education",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 3,
          isTrashed: false,
        },
        {
          amount: 400,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 2,
            name: "education",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 2,
          isTrashed: true,
        },
        {
          amount: 100,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 1,
            name: "clothes",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 1,
          isTrashed: true,
        },
      ],
    },
    {
      url: "/api/finances/records/search?boardId=1,666666",
      searchResult: [
        {
          amount: 25,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 2,
            name: "education",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 3,
          isTrashed: false,
        },
        {
          amount: 400,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 2,
            name: "education",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 2,
          isTrashed: true,
        },
        {
          amount: 100,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 1,
            name: "clothes",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 1,
          isTrashed: true,
        },
      ],
    },
    {
      url: "/api/finances/records/search?boardId=666666",
      searchResult: [],
    },
    {
      url: "/api/finances/records/search?boardId=2",
      searchResult: [],
    },
    {
      url: "/api/finances/records/search?orderingByDate=ASC&orderingById=ASC&isTrashed=true&skip=1&take=1",
      searchResult: [
        {
          amount: 400,
          category: {
            board: { id: 1, name: "clever-financiers" },
            id: 2,
            name: "education",
            type: { id: 1, name: "expense" },
          },
          date: "2022-08-01",
          id: 2,
          isTrashed: true,
        },
      ],
    },
  ])("find records for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})
