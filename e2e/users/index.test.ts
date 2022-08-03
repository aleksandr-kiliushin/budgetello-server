let authToken = ""
beforeEach(async () => {
  const loginResponse = await fetch("http://localhost:3080/api/login", {
    body: JSON.stringify({
      username: "john-doe",
      password: "john-doe-password",
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  const loginResponseData = await loginResponse.json()
  authToken = loginResponseData.authToken
})

describe("Users", () => {
  it("responds with the users list", async () => {
    const response = await fetch("http://localhost:3080/api/user", {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual([
      {
        id: 1,
        username: "john-doe",
        password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
      },
      {
        id: 2,
        username: "jessica-stark",
        password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC",
      },
    ])
  })
})
