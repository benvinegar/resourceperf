"use strict";

module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define("Document", {
    title: DataTypes.STRING,
    head: DataTypes.TEXT,
    body: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => Document.belongsTo(models.TestCase)
    }
  });

  return Document;
};