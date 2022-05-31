<<<<<<< HEAD
var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "expense_income_record",
  columns: {
    id: {
      primary: true,
      type: "integer",
    },
    account: {
      type: "varchar"
    },
    item:{
      type:"varchar"
    },
    price: {
      type: "varchar"
    },
    date: {
      type: "varchar"
    },
    state: {
      type: "varchar"
    },
  }
=======
var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "expense_income_record",
  columns: {
    id: {
      primary: true,
      type: "integer",
    },
    account: {
      type: "varchar"
    },
    item:{
      type:"varchar"
    },
    price: {
      type: "varchar"
    },
    date: {
      type: "varchar"
    },
    state: {
      type: "varchar"
    },
  }
>>>>>>> 807acb856e1fed5776fece5f1c2c6e82f8b2a3d3
});