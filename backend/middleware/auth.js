const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log(req.headers);

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Token নেই বা অবৈধ" });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token মেয়াদ শেষ বা ভুল" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "শুধু Admin দেখতে পারবেন" });
  next();
};
