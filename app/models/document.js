"use strict";

export default function(sequelize, DataTypes) {
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