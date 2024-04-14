const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    // alternatively some people use, we might see this or use this in the future.
    // const user = User.findById(payload.id).select('-password'); // finds the document instance (i think that is what it is called) and removes password
    // req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
