import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

describe("Find a board", () => {
  test.each<{
    queryNameAndArgs: string
    foundBoard: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `board(id: ${boards.cleverBudgetiers.id})`,
      foundBoard: boards.cleverBudgetiers,
      responseError: undefined,
    },
    {
      queryNameAndArgs: `board(id: 666666)`,
      foundBoard: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundBoard, responseError }) => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.board}
      }
    }`)
    expect(responseBody.data?.board).toEqual(foundBoard)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search boards", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndArgs: string
    foundBoards: unknown[]
  }>([
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards(ids: [${boards.cleverBudgetiers.id}, ${boards.beautifulSportsmen.id}])`,
      foundBoards: [boards.cleverBudgetiers, boards.beautifulSportsmen],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards(ids: [666666])`,
      foundBoards: [],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards`,
      foundBoards: [boards.cleverBudgetiers, boards.megaEconomists, boards.beautifulSportsmen, boards.productivePeople],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards(subjectsIds: [${boardSubjects.budget.id}])`,
      foundBoards: [boards.cleverBudgetiers, boards.megaEconomists],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards(name: "me")`,
      foundBoards: [boards.megaEconomists, boards.beautifulSportsmen],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards(name: "me", subjectsIds: [${boardSubjects.budget.id}])`,
      foundBoards: [boards.megaEconomists],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `boards(iAmMemberOf: true)`,
      foundBoards: [boards.cleverBudgetiers, boards.productivePeople],
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndArgs: `boards(iAmAdminOf: false)`,
      foundBoards: [boards.cleverBudgetiers, boards.productivePeople],
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndArgs: `boards(iAmMemberOf: false, iAmAdminOf: true)`,
      foundBoards: [],
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndArgs: `boards(subjectsIds: [${boardSubjects.activities.id}], iAmMemberOf: true, iAmAdminOf:false)`,
      foundBoards: [boards.productivePeople],
    },
  ])("$queryNameAndArgs", async ({ authorizedUserId, queryNameAndArgs, foundBoards }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.board}
      }
    }`)
    expect(responseBody.data.boards).toEqual(foundBoards)
  })
})
