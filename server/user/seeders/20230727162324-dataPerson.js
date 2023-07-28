"use strict";
const fs = require("fs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync("./data/data-person.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();

      return el;
    });
    await queryInterface.bulkInsert("DataPeople", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("DataPeople", null, {});
  },
};
