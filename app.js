const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

//routes Middlewares
app.use("/api/user/", authRouter);

//start application
app.listen(port, () => {
	console.log("Server Up and running");
});
