import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUser, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Responds with a board found by provided ID", () => {
  test.each<{
    authorizedUser: ITestUser
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUser: users.johnDoe,
      query: `{
        board(id: ${boards.cleverBudgetiers.id}) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { board: boards.cleverBudgetiers } },
    },
    // {
    //   authorizedUser: users.johnDoe,
    //   query: "/api/boards/666666",
    //   responseBody: {},
    // },
  ])("$query", async ({ authorizedUser, query, responseBody }) => {
    await authorize(authorizedUser)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Boards search", () => {
  test.each<{
    authorizedUser: ITestUser
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards(ids: [${boards.cleverBudgetiers.id}, ${boards.beautifulSportsmen.id}]) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.cleverBudgetiers, boards.beautifulSportsmen] } },
    },
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards(ids: [666666]) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [] } },
    },
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: {
        data: {
          boards: [boards.cleverBudgetiers, boards.megaEconomists, boards.beautifulSportsmen, boards.productivePeople],
        },
      },
    },
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards(subjectsIds: [${boardSubjects.budget.id}]) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.cleverBudgetiers, boards.megaEconomists] } },
    },
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards(name: "me") {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.megaEconomists, boards.beautifulSportsmen] } },
    },
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards(name: "me", subjectsIds: [${boardSubjects.budget.id}]) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.megaEconomists] } },
    },
    {
      authorizedUser: users.johnDoe,
      query: `{
        boards(iAmMemberOf: true) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.cleverBudgetiers, boards.productivePeople] } },
    },
    {
      authorizedUser: users.jessicaStark,
      query: `{
        boards(iAmAdminOf: false) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.cleverBudgetiers, boards.productivePeople] } },
    },
    {
      authorizedUser: users.jessicaStark,
      query: `{
        boards(iAmMemberOf: false, iAmAdminOf: true) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [] } },
    },
    {
      authorizedUser: users.jessicaStark,
      query: `{
        boards(subjectsIds: [${boardSubjects.activities.id}], iAmMemberOf: true, iAmAdminOf:false) {
          admins { id, password, username },
          id,
          members { id, password, username },
          name,
          subject { id, name }
        }
      }`,
      responseBody: { data: { boards: [boards.productivePeople] } },
    },
  ])("boards search for: $query", async ({ authorizedUser, query, responseBody }) => {
    await authorize(authorizedUser)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
