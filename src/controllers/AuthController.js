import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto, { randomInt } from "crypto";
import VerificationCodes from "../models/VerificationCodes.js";
import EmailSender from "../service/emailSender.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

const GenerateTwoAuthCode = async (userId) => {
  const code = randomInt(10000, 100000);
  const encryptedCode = crypto
    .createHash("sha256")
    .update(code.toString())
    .digest("hex");

  await VerificationCodes.deleteMany({ userId, type: "email_verification" });

  await VerificationCodes.create({
    userId,
    codeHash: encryptedCode,
    type: "email_verification",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  return code;
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

      const code = await GenerateTwoAuthCode(user._id);

      await EmailSender.sendMail({
        to: email,
        subject: "Codigo de acesso ✔",
        text: `Seu codigo de verificação: ${code}`,
        html: `<p>Seu codigo de verificação:<b>${code}</b></p>`
      });

      return res.status(201).json({
        message:
          "Usuário criado com sucesso, o codigo de acesso foi enviado para o email cadastrado",
        userId: user._id
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao criar usuário", error: error.message });
    }
  }

  async verifyCode(req, res) {
    try {
      const { code, userId } = req.body;

      const codeHash = crypto.createHash("sha256").update(code).digest("hex");

      const record = await VerificationCodes.findOne({
        userId,
        codeHash,
        type: "email_verification"
      });

      if (!record) {
        throw new Error("Código invalido ou expirado");
      }

      await VerificationCodes.deleteOne({ _id: record._id });

      res.status(200).json({
        message: "Codigo validado com sucesso",
        token: generateToken(userId)
      });
    } catch (error) {
      console.error("error", error.message);
      res
        .status(500)
        .json({ message: "Erro ao enviar o código de verificação" });
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
