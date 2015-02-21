"use strict";

module.exports = function(sequelize, DataTypes) {
  var Snippet = sequelize.define("Snippet", {
    title: DataTypes.STRING,
    head: DataTypes.STRING,
    body: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => Snippet.belongsTo(models.TestCase)
    }
  });

  return Snippet;
};