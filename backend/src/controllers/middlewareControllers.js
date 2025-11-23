import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Support both `Authorization: Bearer <token>` and legacy `token: Bearer <token>` header
    const header = req.headers.authorization || req.headers.token;
    if (!header) return res.status(401).json({ message: "Unauthorized" });
    const parts = header.split(" ");
    const accessToken = parts.length === 2 ? parts[1] : parts[0];
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY_SECRET,
      (err, payload) => {
        if (err) return res.status(403).json({ message: "Token is not valid" });
        // Normalize user payload
        req.user = { id: payload.id || payload._id, role: payload.role };
        next();
      }
    );
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.role === "Admin" || req.user.id === req.params.id) {
        next();
      } else {
        res.status(403).json({ message: "You are not allowed to do that" });
      }
    });
  } catch (error) {}
};
