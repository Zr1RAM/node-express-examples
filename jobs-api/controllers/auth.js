/**
 * Register User Steps:
 * Validate name, email password with mongoose
 * hash password with bcryptjs
 * Save user
 * Create token
 * Send response with token
 *
 * Login user steps:
 * Validate email, password in controller
 * If email or password is missing throw BadRequestError
 * find user
 * compare passwords
 * if no user or password does not natch , throw UnauthenticatedError
 * if correct, generate token
 * send response with token
 */

const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  // const { name, email, password } = req.body;

  // const salt = await bcrypt.genSalt(10); // Just means random byte. how many random bytes we will get, in this case 10
  // const hashedPassword = await bcrypt.hash(password, salt); // Uses the password and salt to create the hashed password to be safely store in our connectDB
  // const tempUser = {
  //   name,
  //   email,
  //   password: hashedPassword,
  // };

  // if (!name || !email || !password) {
  //   throw new BadRequestError("Please provide name, email and password");
  // }
  // const user = await User.create({ ...tempUser });
  const user = await User.create({ ...req.body });
  // const token = jwt.sign(
  //   { userId: user._id, name: user.name },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: "30d",
  //   }
  // );
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token }); // you can send back only the token since there are setups where the front end decodes the token
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
