const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const Project = require("../../models/project");
const Model= require('../../models/model/model')
const projectServices = require("../../services/project-services");
const bimPlusToken = require("../../util/BimPlus/getBimPlusToken");

describe("Services: Project Services", () => {
	let token;

	//create User for Testing and get Token from Bimplus
	before(async function () {
		await mongoose.connect(
			process.env.DB_TESTING,
			{ useUnifiedTopology: true, useNewUrlParser: true },
			() => console.log("")
		);
		token = await bimPlusToken.requestAutenticationToken(
			process.env.BIMPLUS_USER,
			process.env.BIMPLUS_PASSWORD,
			process.env.BIMPLUS_APPLICATION_ID
		);
		//clean Project Document Collections
		await Project.deleteMany({});
	});

	describe("Update(...)", () => {
		let totalNumOfProjects = 0;
		it("should add lists of Projects in database", function (done) {
			this.timeout(15000); //raise Timeout limit to 15000ms

			projectServices
				.update(token.access_token)
				.then(() => done())
				.then(() => {
					Project.estimatedDocumentCount().then((numberOfProjects) => {
						//only Validates that there is a document in Project Document Collection
						//the Schema structure is not validated
						totalNumOfProjects = numberOfProjects;
						expect(numberOfProjects).to.be.greaterThan(0);
					});
				});
		});

		it("should not add any more Projects if the Update(..) function is called", function (done) {
			this.timeout(15000);
			projectServices
				.update(token.access_token)
				.then(() => done())
				.then(() => {
					Project.estimatedDocumentCount().then((numberOfProjects) => {
						expect(numberOfProjects).to.be.equal(totalNumOfProjects);
					});
				});
		});
	});

	describe("getAll()", () => {
		before(async function () {
			await Project.deleteMany({});
		});
		it("should throw an error if there are no Projects", async () => {
			await expect(projectServices.getAll())
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});

		it("should succesfully return an array with a list of projects Project", async () => {
			const project = new Project({
				slug: "slug",
				name: "projectName",
				_id: "123456",
			});
			await project.save();
			const listOfProjects = await projectServices.getAll();
			expect(listOfProjects).to.be.array();
			expect(listOfProjects[0]).to.have.property("slug", "slug");
			expect(listOfProjects[0]).to.have.property("_id", "123456");
		});
	});


	describe("get(...)", () => {
		before(async function () {
			await Project.deleteMany({});
		});
		it("should throw an error if Project does not exist", async () => {
			await expect(projectServices.get('123456'))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});

		it("should succesfully return the info of the Project if it exist", async () => {
			const project = new Project({
				slug: "slug",
				name: "projectName",
				_id: "123456",
			});
			await project.save();
			const projectSearched = await projectServices.get('123456');
			expect(projectSearched).to.have.property("slug", "slug");
			expect(projectSearched).to.have.property("_id", "123456");
		});
	});


	describe('getModels(...)',()=>{
		before(async function () {
			await Project.deleteMany({});

			const project = new Project({
				slug: "slug",
				name: "projectName",
				_id: "123456",
				models:new Model({_id:'000001',name:"modelName",id_topology:'top001'})
			});
			await project.save();
		});
		it('should return the models inside the Project',async ()=>{
			const models=await projectServices.getModels('123456');
			expect(models).to.be.array()
			expect(models[0]).to.have.property('_id','000001')

		})
		it('should throw if id given is not of a valid Project',async()=>{
			await expect(projectServices.getModels('111111'))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		
		})
	})




	//clean Database
	after(async function () {
		await Project.deleteMany({});
		return await mongoose.disconnect();
	});
});
