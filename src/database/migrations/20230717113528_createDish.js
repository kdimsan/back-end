exports.up = knex => knex.schema.createTable("dish", table =>{
    table.increments("id").primary();

    table.string("name").notNullable();
    table.text("image");
  
    table.decimal("price");
    table.text("description");

    table.integer("category_id").references("id").inTable("category");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dish");