import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Responds with a board found by provided ID", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      query: `{
        board(id: ${boards.cleverBudgetiers.id}) {
          id,
          name,
          subject {
            id,
            name
          }
        }
      }`,
      responseBody: {
        data: {
          board: {
            id: boards.cleverBudgetiers.id,
            name: boards.cleverBudgetiers.name,
            subject: boards.cleverBudgetiers.subject,
          },
        },
      },
    },
    // {
    //   authorizedUserUsername: users.johnDoe.username,
    //   query: "/api/boards/666666",
    //   responseBody: {},
    // },
  ])("$query", async ({ authorizedUserUsername, query, responseBody }) => {
    await authorize(authorizedUserUsername)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

// describe("Boards search", () => {
//   test.each<{
//     authorizedUserUsername: ITestUserUsername
//     url: string
//     searchResult: unknown[]
//   }>([
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: `/api/boards/search?ids=${boards.cleverBudgetiers.id}`,
//       searchResult: [boards.cleverBudgetiers],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: `/api/boards/search?ids=${boards.cleverBudgetiers.id},${boards.beautifulSportsmen.id}`,
//       searchResult: [boards.cleverBudgetiers, boards.beautifulSportsmen],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: "/api/boards/search?ids=666666",
//       searchResult: [],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: "/api/boards/search",
//       searchResult: [
//         boards.cleverBudgetiers,
//         boards.megaEconomists,
//         boards.beautifulSportsmen,
//         boards.productivePeople,
//       ],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: `/api/boards/search?subjectsIds=${boardSubjects.budget.id}`,
//       searchResult: [boards.cleverBudgetiers, boards.megaEconomists],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: "/api/boards/search?name=me",
//       searchResult: [boards.megaEconomists, boards.beautifulSportsmen],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: `/api/boards/search?name=me&subjectsIds=${boardSubjects.budget.id}&id=${boards.megaEconomists.id}`,
//       searchResult: [boards.megaEconomists],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: "/api/boards/search?iAmMemberOf=true",
//       searchResult: [boards.cleverBudgetiers, boards.productivePeople],
//     },
//     {
//       authorizedUserUsername: users.jessicaStark.username,
//       url: "/api/boards/search?iAmAdminOf=false",
//       searchResult: [boards.cleverBudgetiers, boards.productivePeople],
//     },
//     {
//       authorizedUserUsername: users.johnDoe.username,
//       url: "/api/boards/search?iAmMemberOf=false&iAmAdminOf=true",
//       searchResult: [],
//     },
//     {
//       authorizedUserUsername: users.jessicaStark.username,
//       url: `/api/boards/search?subjectsIds=${boardSubjects.activities.id}&iAmMemberOf=true&iAmAdminOf=false`,
//       searchResult: [boards.productivePeople],
//     },
//   ])("boards search for: $url", async ({ authorizedUserUsername, url, searchResult }) => {
//     await authorize(authorizedUserUsername)
//     const response = await fetchApi(url)
//     expect(await response.json()).toEqual(searchResult)
//     expect(response.status).toEqual(200)
//   })
// })
