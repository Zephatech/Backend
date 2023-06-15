/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("price").notNullable();
    table.integer("rating").notNullable();
    table.specificType("images", "json[]").notNullable();
    table.specificType("colors", "json[]").notNullable();
    table.string("description").notNullable();
    table.specificType("details", "json[]").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
