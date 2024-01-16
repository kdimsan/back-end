const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlatesImageController {
  async update(request, response) {
    const { dish_id } = request.query;
    const user_id = request.user.id;
    const dish_filename = request.file.filename;

    const diskStorage = new DiskStorage();

    const [user] = await knex("users").where({ id: user_id });
    const [dish] = await knex("dish").where({ id: dish_id });

    if (!user) {
      throw new AppError("Usuário não pode atualizar imagens.");
    }
    if (!dish) {
      throw new AppError("Prato inexistente.");
    }
    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(dish_filename);
    dish.image = filename;

    await knex("dish").update(dish).where({ id: dish_id });

    return response.json(dish);
  }
}

module.exports = PlatesImageController;
