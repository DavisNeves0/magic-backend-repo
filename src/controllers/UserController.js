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
}

export default new UserController();
