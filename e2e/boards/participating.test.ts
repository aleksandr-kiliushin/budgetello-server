import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Boards participating", () => {
  describe("Add user", () => {
    test.each<{
      authorizedUserId: ITestUserId
      queryNameAndInput: string
      updatedBoard: unknown
      responseError: unknown
    }>([
      {
        authorizedUserId: users.johnDoe.id,
        queryNameAndInput: `addMemberToBoard (input: { boardId: ${boards.beautifulSportsmen.id}, userId: ${users.johnDoe.id} })`,
        updatedBoard: undefined,
        responseError: { message: "Access denied." },
      },
      {
        authorizedUserId: users.johnDoe.id,
        queryNameAndInput: `addMemberToBoard (input: { boardId: ${boards.cleverBudgetiers.id}, userId: ${users.jessicaStark.id} })`,
        updatedBoard: undefined,
        responseError: { message: "The user is already a member of the board." },
      },
      {
        authorizedUserId: users.jessicaStark.id,
        queryNameAndInput: `addMemberToBoard (input: { boardId: ${boards.beautifulSportsmen.id}, userId: ${users.johnDoe.id} })`,
        updatedBoard: {
          admins: [users.jessicaStark],
          id: boards.beautifulSportsmen.id,
          members: [users.johnDoe, users.jessicaStark],
          name: boards.beautifulSportsmen.name,
          subject: boardSubjects.activities,
        },
        responseError: undefined,
      },
    ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedBoard, responseError }) => {
      await authorize(authorizedUserId)
      const responseBody = await fetchGqlApi(`mutation ADD_MEMBER_TO_BOARD {
        ${queryNameAndInput} {
          ${QueryFields.board}
        }
      }`)
      expect(responseBody.data?.addMemberToBoard).toEqual(updatedBoard)
      expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
    })
  })

  // describe("Remove user", () => {
  //   test.each<{
  //     authorizedUserId: ITestUserId
  //     responseBody: Record<string, unknown>
  //     status: number
  //     url: string
  //   }>([
  //     {
  //       authorizedUserId: users.johnDoe.id,
  //       responseBody: { message: "The user can't be removed from this board because they are the only admin." },
  //       status: 403,
  //       url: `/api/boards/${boards.productivePeople.id}/remove-member/${users.johnDoe.id}`,
  //     },
  //     {
  //       authorizedUserId: users.johnDoe.id,
  //       responseBody: { message: "Access denied." },
  //       status: 403,
  //       url: `/api/boards/${boards.beautifulSportsmen.id}/remove-member/${users.jessicaStark.id}`,
  //     },
  //     {
  //       authorizedUserId: users.jessicaStark.id,
  //       responseBody: { message: "Access denied." },
  //       status: 403,
  //       url: `/api/boards/${boards.productivePeople.id}/remove-member/${users.johnDoe.id}`,
  //     },
  //     {
  //       authorizedUserId: users.johnDoe.id,
  //       responseBody: {
  //         admins: [users.johnDoe],
  //         id: boards.productivePeople.id,
  //         members: [users.johnDoe],
  //         name: boards.productivePeople.name,
  //         subject: boardSubjects.activities,
  //       },
  //       status: 201,
  //       url: `/api/boards/${boards.productivePeople.id}/remove-member/${users.jessicaStark.id}`,
  //     },
  //   ])("case #%#", async ({ authorizedUserId, responseBody, status, url }) => {
  //     await authorize(authorizedUserId)
  //     const response = await fetchApi(url, { method: "POST" })
  //     expect(response.status).toEqual(status)
  //     expect(await response.json()).toEqual(responseBody)
  //   })
  // })
})
