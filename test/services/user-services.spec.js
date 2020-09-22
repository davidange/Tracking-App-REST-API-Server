const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const User = require("../../models/user");
const userServices = require("../../services/user-services");

describe("Services: User-Services", () => {
	const emailUser = "test@test.com";
	const nameUser = "testingName";
	const passwordUser = "123fdaR";
	before(async function () {
		await mongoose.connect(
			process.env.DB_TESTING,
			{ useUnifiedTopology: true, useNewUrlParser: true },
			() => console.log("")
		);

		//create new User
		const password = passwordUser;
		//Hash passwords
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = new User({
			email: emailUser,
			name: nameUser,
			password: hashPassword,
			_id: "5f1aaba0b8ee114a141cd0db",
		});

		await user.save();
	});

	describe("user-services - Login", () => {
		it("should throw an error of 400 if Credenttials are Wrong", async () => {
			const email = "email@test.com";
			const password = "WrongTestPassword";

			await expect(userServices.login(email, password))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(400);
		});

		it("should get an JSON Object with the necesary Token information if Succesfully logged in", async () => {
			const token = await userServices.login(emailUser, passwordUser);
			expect(token).to.have.property("expires_in");
			expect(token).to.have.property("token");
		});
	});

	describe("user-services - register", () => {
		it("Should create a new User and save it in Database", async () => {
			await expect(
				userServices.register("Johny F", "test2@email.com", "12344$!F")
			).to.not.be.rejectedWith(Error);
			await expect(User.findOne({ email: "test2@email.com" })).to.not.be.null;
		});

		it("Should throw if user already registered", async () => {
			await expect(userServices.register(nameUser, emailUser, passwordUser))
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
