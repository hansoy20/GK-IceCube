const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { signToken } = require("../utils/jwt");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().optional(),
});

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}



const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: toPublicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user: toPublicUser(user) });
});

module.exports = { login, me };
