const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors");

const authenicationMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided"); // Normally the text would be invalid credentials.
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    req.user = { id, username };
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
  next();
};

module.exports = {
  authenicationMiddleware,
};
