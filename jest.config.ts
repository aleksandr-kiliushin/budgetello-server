const config = {
  moduleNameMapper: {
    "^#interfaces(.*)$": "<rootDir>/src/interfaces$1",
    "^#models(.*)$": "<rootDir>/src/models$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/node_modules"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "node",
}

export default config
