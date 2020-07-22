import Express from "express";
const app = Express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");


const port = process.env.PORT || 3000;

//import Routes
import authRouter from "./routes/auth";


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
app.use(Express.json());

//routes Middlewares
app.use("/api/user/", authRouter);




//start application
app.listen(port, () => {
	console.log("Server Up and running");
});
