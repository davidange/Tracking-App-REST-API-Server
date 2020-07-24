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
describe("User ", () => {
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

	describe("User - Login", () => {
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
				send: sinon.spy()
			};


			await userController.loginUser(req, res, () => {});
			
			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.have.property('message');
			expect(res.send.firstCall.args[0]).to.have.property('expires_in');
			expect(res.send.firstCall.args[0]).to.have.property('token');
			expect(res.statusCode).to.equal(200);
		});
	});

	describe("User - Register", () => {
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
			message: "",
		};

		it("Should create a new User", async () => {
			const req = {
				body: {
					name: "newUser",
					email: "newUser1@test.com",
					password: "password1",
				},
			};
			await userController.registerUser(req, res, () => {});
			expect(res).has.property("statusCode").that.is.equal(201);
		});

		it("Should fail if user already registered", async () => {
			const req = {
				body: {
					email: "test@test.com",
					name: "testingName",
					password: "testPassword",
				},
			};
			await expect(userController.registerUser(req, res, () => {}))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(400);
		});
	});

	after(async function () {
		await User.deleteMany({});
		return await mongoose.disconnect();
	});
});
