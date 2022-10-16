import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Responds with a board found by provided ID", () => {
  test.each<{
    authorizedUserId: ITestUserId
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUserId: users.johnDoe.id,
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
    //   authorizedUserId: users.johnDoe,
    //   query: "/api/boards/666666",
    //   responseBody: {},
    // },
  ])("$query", async ({ authorizedUserId, query, responseBody }) => {
    await authorize(authorizedUserId)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Boards search", () => {
  test.each<{
    authorizedUserId: ITestUserId
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.johnDoe.id,
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
      authorizedUserId: users.jessicaStark.id,
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
      authorizedUserId: users.jessicaStark.id,
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
      authorizedUserId: users.jessicaStark.id,
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
  ])("boards search for: $query", async ({ authorizedUserId, query, responseBody }) => {
    await authorize(authorizedUserId)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
