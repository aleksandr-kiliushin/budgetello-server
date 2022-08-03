const { execSync } = require("child_process")

beforeEach(async () => {
  execSync('echo "bash /var/app/fill-db-in-with-testing-data.sh" | docker exec -i personal-app-database bash;')
})

afterAll(() => {
  execSync('echo "bash /var/app/fill-db-in-with-dev-data.sh" | docker exec -i personal-app-database bash;')
})
