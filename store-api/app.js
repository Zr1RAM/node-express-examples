require("dotenv").config();
require("express-async-errors");
const express = require("express");
const errorHandlerMiddleware = require("./middleware/error-handler");
const app = express();
const connectDB = require("./db/connectDB");
const productsRouter = require("./routes/products");
const notFoundMiddleware = require("./middleware/not-found");
//const errorMiddleware = require("./middleware/error-handler");

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>');
});

app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening at port ${PORT}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
