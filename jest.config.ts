import type { Config } from "@jest/types"

const testConfig: Config.InitialOptions = {
  preset: "ts-jest",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.jest.json",
    },
  },
  watchman: true,
  verbose: true,
}

export default testConfig;
