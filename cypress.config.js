const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://restful-booker.herokuapp.com",
  },
});
