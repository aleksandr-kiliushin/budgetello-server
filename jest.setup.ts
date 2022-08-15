const { execSync } = require("child_process")

beforeEach(async () => {
  execSync('echo "bash /var/app/restore-db-from-testing-template.sh" | docker exec -i personal-app-database bash;')
})

afterEach(() => {
  // TODO: Do not use global object to store data. Instead, incapsulate data in a module.
  globalThis.authToken = ""
})

afterAll(() => {
  execSync('echo "bash /var/app/restore-db-from-dev-template.sh" | docker exec -i personal-app-database bash;')
})
