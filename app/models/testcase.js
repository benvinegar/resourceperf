"use strict";

export default function(sequelize, DataTypes) {
  var TestCase = sequelize.define("TestCase", {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {
    classMethods: {
      associate: models => TestCase.hasMany(models.Document)
    }
  });

  return TestCase;
};