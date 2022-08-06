// { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
// { id: 2, name: "education", type: { id: 1, name: "expense" } },
// { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
// { id: 4, name: "gifts", type: { id: 2, name: "income" } },
// { id: 5, name: "salary", type: { id: 2, name: "income" } },
import { IFinanceCategory } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Responds with a finance category found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IFinanceCategory }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "http://localhost:3080/api/finances/categories/1",
      responseStatus: 200,
      responseData: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
    },
    {
      url: "http://localhost:3080/api/finances/categories/3",
      responseStatus: 200,
      responseData: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
    },
    {
      url: "http://localhost:3080/api/finances/categories/4",
      responseStatus: 200,
      responseData: { id: 4, name: "gifts", type: { id: 2, name: "income" } },
    },
    {
      url: "http://localhost:3080/api/finances/categories/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("user search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

// describe("Users search", () => {
//   test.each<{ url: string; searchResult: IUser[] }>([
//     {
//       url: "http://localhost:3080/api/users/search?id=1",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?username=john-doe",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?id=1&username=john-doe",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?username=john",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?username=doe",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?username=doe",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?username=j",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//         { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
//       ],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?username=nonexistent-username",
//       searchResult: [],
//     },
//     {
//       url: "http://localhost:3080/api/users/search?id=123456789",
//       searchResult: [],
//     },
//     {
//       url: "http://localhost:3080/api/users/search",
//       searchResult: [
//         { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
//         { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
//       ],
//     },
//   ])("user search for: $url", async ({ url, searchResult }) => {
//     const response = await fetch(url, {
//       headers: {
//         Authorization: "Bearer " + authToken,
//       },
//     })
//     expect(response.status).toEqual(200)
//     expect(await response.json()).toEqual(searchResult)
//   })
// })
