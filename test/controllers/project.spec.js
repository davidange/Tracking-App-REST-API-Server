// const sinon = require("sinon");
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// const expect = chai.expect;

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const bcrypt = require("bcryptjs");
// dotenv.config();

// const Project = require("../../models/project");
// const projectController = require("../../controllers/project");

// describe("Project ", () => {
// 	before(async function () {
// 		await mongoose.connect(
// 			process.env.DB_TESTING,
// 			{ useUnifiedTopology: true, useNewUrlParser: true },
// 			() => console.log("connected to DB!")
// 		);

// 		// //create new User
// 		// const password = "testPassword";
// 		// //Hash passwords
// 		// const salt = await bcrypt.genSalt(10);
// 		// const hashPassword = await bcrypt.hash(password, salt);

// 		// const user = new User({
// 		// 	email: "test@test.com",
// 		// 	name: "testingName",
// 		// 	password: hashPassword,
// 		// 	_id: "5f1aaba0b8ee114a141cd0db",
// 		// });

// 		// await user.save();
// 	});

// 	describe("Project - getProjects", () => {
//         const res = {
// 			statusCode: 500,
// 			headers: {},
// 			header: function (a, b) {
// 				this.headers[a] = b;
// 				return this;
// 			},
// 			status: function (number) {
// 				this.statusCode = number;
// 				return this;
// 			},
// 			send: (message) => {
// 				return message;
// 			},
// 			message: "",
//         };
        
//         it('should ')

//     }

// 	after(async function () {
// 		await Project.deleteMany({});
// 		return await mongoose.disconnect();
// 	});
// });
