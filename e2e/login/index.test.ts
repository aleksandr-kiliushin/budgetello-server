describe("Login", () => {
  it("responds that user is not found", async () => {
    const response = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({ username: "nonexistent-username", password: "some-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(response.status).toEqual(404)
    expect(await response.json()).toEqual({})
  })

  it("responds 'unauthorized' if the user is found but password is invalid", async () => {
    const response = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({ username: "john-doe", password: "invalid-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(response.status).toEqual(401)
    expect(await response.json()).toEqual({ message: "Invalid password." })
  })

  it("returns an auth token if cretendials are valid", async () => {
    const response = await fetch("http://localhost:3080/api/login", {
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
