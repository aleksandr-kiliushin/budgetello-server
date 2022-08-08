import { IFinanceRecord } from "../../../src/interfaces/finance"
import { logIn } from "../../helpers/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Get finance record by ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IFinanceRecord }
    | { url: string; responseStatus: 404; responseData: { message: string } }
  >([
    {
      url: "http://localhost:3080/api/finances/records/1",
      responseStatus: 200,
      responseData: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
    },
    {
      url: "http://localhost:3080/api/finances/records/666",
      responseStatus: 404,
      responseData: { message: "Record with ID '666' not found." },
    },
  ])("find record for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetch(url, { headers: { Authorization: authToken } })
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Finance records search", () => {
  test.each<{ url: string; searchResult: IFinanceRecord[] }>([
    {
      url: "http://localhost:3080/api/finances/records/search",
      searchResult: [
        {
          amount: 230,
          category: { id: 4, name: "gifts", type: { id: 2, name: "income" } },
          date: "2022-08-03",
          id: 6,
          isTrashed: false,
        },
        {
          amount: 10,
          category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
          date: "2022-08-02",
          id: 5,
          isTrashed: false,
        },
        {
          amount: 30,
          category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
          date: "2022-08-02",
          id: 4,
          isTrashed: false,
        },
        {
          amount: 25,
          category: { id: 2, name: "education", type: { id: 1, name: "expense" } },
          date: "2022-08-01",
          id: 3,
          isTrashed: false,
        },
        {
          amount: 400,
          category: { id: 2, name: "education", type: { id: 1, name: "expense" } },
          date: "2022-08-01",
          id: 2,
          isTrashed: true,
        },
        {
          amount: 100,
          category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
          date: "2022-08-01",
          id: 1,
          isTrashed: true,
        },
      ],
    },
    {
      url: "http://localhost:3080/api/finances/records/search?orderingByDate=ASC&orderingById=ASC&isTrashed=false&skip=1&take=2",
      searchResult: [
        {
          amount: 30,
          category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
          date: "2022-08-02",
          id: 4,
          isTrashed: false,
        },
        {
          amount: 10,
          category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
          date: "2022-08-02",
          id: 5,
          isTrashed: false,
        },
      ],
    },
  ])("user search for: $url", async ({ url, searchResult }) => {
    const response = await fetch(url, { headers: { Authorization: authToken } })
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

// describe("", () => {
//   test.each<{ url: string; searchResult: IFinanceRecord[] }>([
//     {
//       url: "http://localhost:3080/api/finances/records/search",
//       searchResult: [
//         {
//           amount: 100,
//           category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
//           date: "2022-08-01",
//           id: 1,
//           isTrashed: true,
//         },
//         {
//           amount: 400,
//           category: { id: 2, name: "education", type: { id: 1, name: "expense" } },
//           date: "2022-08-01",
//           id: 2,
//           isTrashed: true,
//         },
//         {
//           amount: 25,
//           category: { id: 2, name: "education", type: { id: 1, name: "expense" } },
//           date: "2022-08-01",
//           id: 3,
//           isTrashed: false,
//         },
//         {
//           amount: 30,
//           category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
//           date: "2022-08-02",
//           id: 4,
//           isTrashed: false,
//         },
//         {
//           amount: 10,
//           category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
//           date: "2022-08-02",
//           id: 5,
//           isTrashed: false,
//         },
//         {
//           amount: 230,
//           category: { id: 4, name: "gifts", type: { id: 2, name: "income" } },
//           date: "2022-08-03",
//           id: 6,
//           isTrashed: false,
//         },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/finances/records/search?orderingByDate=DESC&orderingById=DESC&isTrashed=false&skip=1&take=2",
//       searchResult: [
//         {
//           amount: 10,
//           category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
//           date: "2022-08-02",
//           id: 5,
//           isTrashed: false,
//         },
//         {
//           amount: 30,
//           category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
//           date: "2022-08-02",
//           id: 4,
//           isTrashed: false,
//         },
//       ],
//     },
//   ])("user search for: $url", async ({ url, searchResult }) => {
//     const response = await fetch(url, { headers: { Authorization: authToken } })
//     expect(response.status).toEqual(200)
//     expect(await response.json()).toEqual(searchResult)
//   })
// })

// search({
//   orderingByDate,
//   orderingById,
//   skip = 0,
//   take,
//   ...where
// }: GetFinanceRecordsDto): Promise<FinanceRecordEntity[]> {
//   return this.financeRecordRepository.find({
//     order: {
//       ...(orderingByDate === undefined ? {} : { date: orderingByDate }),
//       ...(orderingById === undefined ? {} : { id: orderingById }),
//     },
//     relations: ["category", "category.type"],
//     skip,
//     ...(take ? { take } : {}),
//     where,
//   })
// }
