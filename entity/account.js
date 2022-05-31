<<<<<<< HEAD
var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "account",
  columns: {
    name: {
      primary: true,
      type: "varchar",
    },
    password: {
      type: "varchar"
    }
  }
=======
var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "account",
  columns: {
    name: {
      primary: true,
      type: "varchar",
    },
    password: {
      type: "varchar"
    }
  }
>>>>>>> 807acb856e1fed5776fece5f1c2c6e82f8b2a3d3
});