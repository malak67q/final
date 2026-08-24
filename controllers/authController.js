// TODO: Handle login requests
import { login } from "../services/authService.js";

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await login(email, password);

    if (!result) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
