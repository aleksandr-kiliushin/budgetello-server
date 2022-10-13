describe("Authorization", () => {
  it("validates fields", async () => {
    const response = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ password: "" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      fields: {
        username: "Required.",
        password: "Required.",
      },
    })
  })

  it("responds that the user not found", async () => {
    const response = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ username: "nonexistent-username", password: "some-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({ fields: { username: "User not found." } })
  })

  it("responds that the password is invalid if the user is found but password is invalid", async () => {
    const response = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ username: "john-doe", password: "invalid-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({ fields: { password: "Invalid password." } })
  })

  it("returns an auth token if cretendials are valid", async () => {
    const response = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ username: "john-doe", password: "john-doe-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(response.status).toEqual(201)
    expect(await response.json()).toEqual({
      authToken: expect.stringMatching(".+"),
    })
  })
})
