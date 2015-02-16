"use strict";

module.exports = function(sequelize, DataTypes) {
  var TestCase = sequelize.define("TestCase", {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => TestCase.hasMany(models.Snippet)
    }
  });

  return TestCase;
};