import User from "../models/User.js";

class UserController {
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
