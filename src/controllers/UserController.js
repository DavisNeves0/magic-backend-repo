import User from "../models/User.js";

class UserController {
  async create(req, res) {
    const { name, email } = req.body;

    try {
      if (!name || !email) {
        throw new Error("Erro ao criar usuario, nome e email são obrigatórios");
      }
      res
        .status(201)
        .json({ message: "Usuario criado com sucesso", user: { name, email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async get(req, res) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno" });
    }
  }
}

export default new UserController();
