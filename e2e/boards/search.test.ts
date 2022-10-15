import { boardSubjects, boards } from "#e2e/constants/boards"
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
    //   authorizedUserUsername: users.johnDoe.username,
    //   query: "/api/boards/666666",
    //   responseBody: {},
    // },
  ])("$query", async ({ authorizedUserUsername, query, responseBody }) => {
    await authorize(authorizedUserUsername)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Boards search", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.johnDoe.username,
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
      authorizedUserUsername: users.jessicaStark.username,
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
      authorizedUserUsername: users.jessicaStark.username,
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
      authorizedUserUsername: users.jessicaStark.username,
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
  ])("boards search for: $query", async ({ authorizedUserUsername, query, responseBody }) => {
    await authorize(authorizedUserUsername)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
