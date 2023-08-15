const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlatesController{
    async create(request, response) {
        const { name, price, description, category, ingredients } = request.body;
        const  user_id  = request.user.id;

        const [user] = await knex("users").where({id: user_id});

        if(!user) {
            throw new AppError("Usuário inexistente.");
        }

        if(user.admin !== 1 ){
            throw new AppError("Usuário não é administrador e não pode criar pratos.");
        }

        const [dishId] = await knex("dish").insert({
            name,
            price,
            description,
            category,
            user_id
        });

        const ingredientsInsert = ingredients.map(ingredient => {
           return {
            title: ingredient,
            dish_id: dishId,
            user_id
           }
        });

        await knex("tags").insert(ingredientsInsert);
        response.json(dishId);
    }

    async update(request, response) {
        const { name, price, description, tags, category } = request.body;
        
        const { id } = request.params;
        const user_id = request.user.id;
        
        const [user] = await knex("users").where({id: user_id});

        if(!user) {
            throw new AppError("Usuário inexistente.");
        }

        if(user.admin !== 1 ){
            throw new AppError("Usuário não é administrador e não pode editar pratos.");
        }

        const [dish] = await knex("dish").where({id});

        dish.name = name ??dish.name;
        dish.price = price ?? dish.price;
        dish.description = description ?? dish.description;
        dish.category = category ?? dish.category;

        await knex("dish").where({id}).update({
            name: dish.name,
            price: dish.price,
            description: dish.description,
            category: dish.category,
            updated_at: knex.fn.now()
        });
        
        if(!tags){
            return
        } 

        await knex("tags").where({ dish_id: dish.id }).delete();

        const tagsInsert = tags.map(tag => {
            return {
             title: tag,
             dish_id: id,
             user_id
            }
         });
         await knex("tags").insert(tagsInsert);
         response.json({dish, tagsInsert})
    }

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.user.id;

        const [user] = await knex("users").where({ id: user_id });
        
        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        if(!user.admin) {
            throw new AppError("Usuário não tem poderes de admin.");
        }

        await knex("dish").where({ id }).delete();
        response.json("Deletado com sucesso!");
    }

    async index(request, response) {
        const { search } = request.query;
        const user_id = request.user.id;

        const user = await knex("users").where({id: user_id});

        if(!user) {
            throw new AppError("Usuário não encontrado, favor efetuar o login.")
        }

        let dish;

        if(search) {
            const filterIngredients = search.split(' ').map(ingredient => ingredient.trim());

            dish = await knex("dish")
            .select([
                "dish.id",
                "dish.name",
                "dish.price",
                "dish.description",
            ])
            .whereIn("dish.id", function() {
                this.select('tags.dish_id')
                    .from('tags')
                    .whereIn(knex.raw("LOWER(title)"), filterIngredients.map(ingredient => ingredient.toLowerCase()));
            })
            .orWhereLike("dish.name", `%${search}%`);

        } else {  
            dish  = await knex("dish")
        .whereLike("name", `%${search}%`);

        if(!dish) {
            throw new AppError("Prato inexistente.");
            }
        }
        
        return response.json(dish);
    }

    async show(request, response) {
        const {id} = request.params;
    
        const [dish] = await knex("dish").where({ id });
        const tags = await knex("tags").where({dish_id: id});

        return response.json({dish, tags})        
    }
}

module.exports = PlatesController;