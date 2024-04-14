// check username, password in post(login) request
// if exist create new JWT
// send back to front-end

// setup authenication so only the request with JWT can access the dashboard
const jwt = require("jsonwebtoken");

const BadRequestError = require("../errors");

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // 3 ways to do authentication:
  // check mongo for username password
  // using a package called joi
  // check in the controller directly (this is just for learning purpose here lol)

  if (!username || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const id = new Date().getDate(); // Since this example has no connection to a db we will use as dummy id
  // try to keep the payload small, better experience for the user.
  /// just for demo, in production use long, complex and unguessable string value!!!
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  }); // never send password here to sign lol
  // res.send("Fake login/Register/Sign up");
  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  console.log(req.user);
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });

  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   throw new CustomAPIError("No token", 401); // Normally the text would be invalid credentials.
  // }
  // const token = authHeader.split(" ")[1];
  // console.log(token);
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const luckyNumber = Math.floor(Math.random() * 100);
  //   res.status(200).json({
  //     msg: `Hello, ${decoded.username}`,
  //     secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  //   });
  // } catch (error) {
  //   throw new CustomAPIError("Not authorized to access this route", 401);
  // }
};

module.exports = {
  login,
  dashboard,
};
