"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DataPerson extends Model {
    static associate(models) {
      // define association here
      DataPerson.belongsTo(models.User);
    }
  }
  DataPerson.init(
    {
      fullName: DataTypes.STRING,
      aboutMe: DataTypes.TEXT,
      sayName: DataTypes.STRING,
      birthDate: DataTypes.STRING,
      gender: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      domisili: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DataPerson",
    }
  );
  DataPerson.beforeCreate("register", (dataPerson) => {
    dataPerson.fullName = dataPerson.aboutMe = dataPerson.sayName = dataPerson.birthDate = dataPerson.gender = dataPerson.phoneNumber = dataPerson.domisili = "-";
  });
  return DataPerson;
};
