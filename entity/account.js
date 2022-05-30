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
});