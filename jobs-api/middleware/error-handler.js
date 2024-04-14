const CustomAPIError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.messsage || "Something went wrong, try again later",
  };
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  /** Mongoose Errors
   *    Validation Errors
   *    Duplicate email
   *    Cast Errors
   */
  if (err.name === "ValidationError") {
    console.log(Object.values(err.errors)); // since you might be confused
    customError.msg = Object.values(err.errors)
      .map((item) => item.messsage)
      .join(", ");
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate vale entered for ${Object.keys(
      err.KeyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  //   return res
  //     .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //     .json({ msg: err.message });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
