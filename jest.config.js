module.exports = {
  setupFiles: ["./src/functions/__mocks__/customFunctions.js"],
  coveragePathIgnorePatterns: ["lib"],
  coverageThreshold: {
    global: {
      branches: 91,
      functions: 91,
      lines: 91,
      statements: 91
    }
  }
};
