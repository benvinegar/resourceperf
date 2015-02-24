"use strict";

module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define("Document", {
    title: DataTypes.STRING,
    head: DataTypes.STRING,
    body: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => Document.belongsTo(models.TestCase)
    }
  });

  return Document;
};