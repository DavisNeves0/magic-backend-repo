import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../service/emailSender.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword
      });

      await user.save();

      await EmailSender.sendMail({
        to: email,
        subject: "Codigo de acesso ✔",
        text: "Seu codigo de verificação: 123456",
        html: "<p>Seu codigo de verificação:<b>123456</b></p>"
      });

      console.log("Message sent:", info.messageId);

      return res.status(201).json({
        message:
          "Usuário criado com sucesso, o codigo de acesso foi enviado para o email cadastrado",
        token: generateToken(user)
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao criar usuário", error: error });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({ message: "Email ou senha inválidos" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: "Email ou senha inválidos" });
      }

      return res.json({
        message: "Login bem-sucedido",
        token: generateToken(user)
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao realizar login" });
    }
  }
}

export default new AuthController();
