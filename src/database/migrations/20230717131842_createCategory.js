exports.up = knex => knex.schema.createTable("category", table =>{
    table.increments("id").primary();

    table.string("title").notNullable();

    table.text("description");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("category");