import Express from "express";
const app = Express();
import mongoose = require("mongoose");
import dotenv = require("dotenv");

//load Environment Constants saved in .env
dotenv.config();

//connect to DB
mongoose.connect(
	process.env.DB_CONNECT!,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log("connected to DB!")
);

//import Routes
import authRouter from "./routes/auth";

//routes Middlewares
app.use("/api/user/", authRouter);

//start application
app.listen(3000, () => {
	console.log("Server Up and running");
});
