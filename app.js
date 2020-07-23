const express = require("express");
const app = express();

//mongoose (MongoDB)
const mongoose = require("mongoose");
//local variables(to not share passwords)
const dotenv = require("dotenv");

//port for the Server
const port = process.env.PORT || 3000;

//import Routes
const authRouter = require("./routes/auth");

//load Environment Constants saved in .env
dotenv.config();

//connect to DB
mongoose.connect(
	process.env.DB_CONNECT,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log("connected to DB!")
);

//Middlewares
//to parse incoming requests
app.use(express.json());

//Documentation middleware
app.use("/api-docs", express.static("./docs"));

//routes Middlewares
app.use("/api/user/", authRouter);

//start application
app.listen(port, () => {
	console.log("Server Up and running");
});
