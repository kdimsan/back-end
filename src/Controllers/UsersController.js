const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;
        
        if(!name) {
            throw new AppError("Nome é obrigatório.");
        }
        
        const [existingUser] = await knex("users").where({email}).limit(1);

        if(existingUser){
            throw new AppError("Este email já está em uso.");
        }

        if(!password) {
            throw new AppError("Senha é obrigatória.");
        }

        const hashedPassword = await hash(password, 6);

        await knex("users").insert({
            name, 
            email,
            password: hashedPassword
        });
        return response.status(201).json("Cadastro realizado com sucesso");
    }

    async update(request, response) {
        const { name, email, password, old_password, isAdmin } = request.body;
        const id = request.user.id;

        const [user] = await knex("users").where({ id });

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        const [checkEmailExisting] = await knex("users").where({email});

        if(checkEmailExisting && checkEmailExisting.id != user.id) {
            throw new AppError("Email já está em uso.");
        }

        if((user.name != name || user.email != email) && !old_password) {
            throw new AppError("Necessária senha para alteração de dados.");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) {
            throw new AppError("Necessária senha antiga para alteração de senha.");
        }

        if(old_password && password) {
            const checkPassword = await compare(old_password, user.password);
            if(!checkPassword) {
                throw new AppError("Senha antiga não confere.")
            }
            user.password = await hash(password, 6);
        }

        if(isAdmin) {
            user.isAdmin = true;
        }
        
        await knex("users").where({ id: user.id }).update({
            name: user.name, 
            email: user.email, 
            password: user.password, 
            isAdmin: user.isAdmin,
            updated_at: knex.fn.now()
        });
        return response.json(user);
    }
}

module.exports = UsersController;