const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const User = require("../../models/user");
const userController = require("../../controllers/user");

describe("User - Login", () => {
	//connect to Database and create new User
	before(async function () {
		await mongoose.connect(
			process.env.DB_TESTING,
			{ useUnifiedTopology: true, useNewUrlParser: true },
			() => console.log("connected to DB!")
		);

		//create new User
		const password = "testPassword";
		//Hash passwords
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = new User({
			email: "test@test.com",
			name: "testingName",
			password: hashPassword,
			_id: "5f1aaba0b8ee114a141cd0db",
		});

		await user.save();
	});

	after(async function () {
		await User.deleteMany({});
		return await mongoose.disconnect();
	});
	
	it("should throw an error of 500 if accessing the database fails", async () => {
		sinon.stub(User, "findOne");
		User.findOne.rejects(new Error());

		const req = {
			body: {
				email: "email@test.com",
				password: "testPassword",
			},
		};
		await expect(userController.loginUser(req, {}, () => {}))
			.to.be.rejectedWith(Error)
			.and.eventually.have.property("statusCode")
			.that.equals(500);
		
		User.findOne.restore();
		
	});

	it("should send a response with a token for an existing user ", async () => {
		//create new User
		const password = "testPassword";
		//Hash passwords
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const req = {
			body: {
				email: "test@test.com",
				password: password,
			},
		};

		const res = {
			statusCode: 500,
			headers: {},
			header: function (a, b) {
				this.headers[a] = b;
				return this;
			},
			status: function (number) {
				this.statusCode = number;
				return this;
			},
			send: (message) => {
				return message;
			},
		};
		console.log('fdsafds')
		await userController.loginUser(req, res, () => {});
		expect(res.headers).has.property("auth-token").that.is.not.null;
		expect(res.statusCode).to.equal(200);
	});
});
