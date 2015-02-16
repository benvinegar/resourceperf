"use strict";

module.exports = function(sequelize, DataTypes) {
  var Snippet = sequelize.define("Snippet", {
    title: DataTypes.STRING,
    code: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => Snippet.belongsTo(models.TestCase)
    }
  });

  return Snippet;
};