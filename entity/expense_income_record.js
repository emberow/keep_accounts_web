
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
});