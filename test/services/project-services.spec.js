const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require("sinon");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Project = require("../../models/project");
const Model = require("../../models/model/model");
const projectServices = require("../../services/project-services");
const bimPlusToken = require("../../util/BimPlus/getBimPlusToken");
const bimPlusServices = require("../../services/bim-plus-services");

describe("Services: Project Services", () => {
	let token;

	//Get Token from Bimplus
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
			await expect(projectServices.get("123456"))
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
			const projectSearched = await projectServices.get("123456");
			expect(projectSearched).to.have.property("slug", "slug");
			expect(projectSearched).to.have.property("_id", "123456");
		});
	});

	describe("getModels(...)", () => {
		before(async function () {
			await Project.deleteMany({});

			const project = new Project({
				slug: "slug",
				name: "projectName",
				_id: "123456",
				models: new Model({
					_id: "000001",
					name: "modelName",
					id_topology: "top001",
				}),
			});
			await project.save();
		});
		it("should return the models inside the Project", async () => {
			const models = await projectServices.getModels("123456");
			expect(models).to.be.array();
			expect(models[0]).to.have.property("_id", "000001");
		});
		it("should throw if id given is not of a valid Project", async () => {
			await expect(projectServices.getModels("111111"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});
		after(async () => {
			await Project.deleteMany({});
		});
	});

	describe("setBeaconsModel(...)", () => {
		before(async function () {
			const project = new Project({
				slug: "slug",
				name: "projectName",
				_id: "123456",
				models: new Model({
					_id: "000001",
					name: "modelName",
					id_topology: "top001",
				}),
			});
			await project.save();
		});

		it("should throw an error if the project ID is invalid", async () => {
			await expect(
				projectServices.setBeaconsModel("111111", "000001", token.access_token)
			)
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});

		it("should throw an error if the model ID is one of a model not inside the project", async () => {
			await expect(
				projectServices.setBeaconsModel("123456", "000004", token.access_token)
			)
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});

		it("should throw an error if the model does not contain any Beacons", async () => {
			//stub internal function call to bimplus Services
			const stub = sinon.stub(bimPlusServices, "getObjectTree");
			stub.returns({
				type: "GeometryObject",
				name: "x1",
				children: [
					{ type: "GeometryObject", name: "x2", children: [] },
					{ type: "GeometryObject", name: "x3", children: [] },
				],
			});

			await expect(
				projectServices.setBeaconsModel("123456", "000001", token.access_token)
			)
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(500);

			stub.restore();
		});

		it("should successfully extract the data of Beacons from the model and save it in the beacons_model property of the Project", async () => {
			//stub internal functions call to bimplus API
			const stub = sinon.stub(bimPlusServices, "getObjectTree");
			stub.returns({
				type: "GeometryObject",
				name: "beacon1",
				children: [
					{ type: "GeometryObject", name: "beacon2", children: [] },
					{ type: "GeometryObject", name: "beacon3", children: [] },
				],
			});

			const stub2 = sinon.stub(
				bimPlusServices,
				"getObjectTreeWithPropertyList"
			);
			stub2.returns({
				objects: [{ id: "000000001" }],
				viewbox: {
					x: 0,
					y: 1,
					z: 2,
				},
			});

			await projectServices.setBeaconsModel(
				"123456",
				"000001",
				token.access_token
			);

			//load Project
			const project = await projectServices.get("123456");
			expect(project).to.have.property("beacons_model");
			expect(project.beacons_model).to.have.property("_id", "000001");
			expect(project.beacons_model.beacons[0]).to.have.property(
				"is_active",
				false
			);

			stub.restore();
			stub2.restore();
		});

		it("should throw if project already has a default Beacons Model", async () => {
			await expect(
				projectServices.setBeaconsModel("123456", "000001", token.access_token)
			)
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(403);
		});
		after(async () => {
			await Project.deleteMany({});
		});
	});

	describe("getBeaconsModel(...)", () => {
		before(async () => {
			const project = new Project({
				_id: "123456",
				slug: "slug",
				name: "projectName",
				models: [{ _id: "000001", name: "modelName", id_topology: "top001" }],
				__v: 0,
				beacons_model: {
					beacons: [
						{
							is_active: false,
							_id: "000000001",
							name: "beacon1",
							location: { x: 0, y: 1, z: 2 },
						},
						{
							is_active: false,
							_id: "000000001",
							name: "beacon2",
							location: { x: 0, y: 1, z: 2 },
						},
						{
							is_active: false,
							_id: "000000001",
							name: "beacon3",
							location: { x: 0, y: 1, z: 2 },
						},
					],
					_id: "000001",
				},
			});
			await project.save()
		});
		it("should throw an error if the inputed Project is not found ",async ()=>{
			await expect(
				projectServices.getBeaconsModel("1111111")
			)
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});

		it("should successfully retrieve the Model that contains the beacon",async ()=>{
			const beaconsModel=await projectServices.getBeaconsModel("123456")
			expect(beaconsModel).to.have.property('_id','000001')
			
		});

		after(async () => {
			await Project.deleteMany({});
		});
	});

	describe("getBeaconsModel(...)", () => {
		before(async () => {
			const project = new Project({
				_id: "123456",
				slug: "slug",
				name: "projectName",
				models: [{ _id: "000001", name: "modelName", id_topology: "top001" }],
				__v: 0,
				beacons_model: {
					beacons: [
						{
							is_active: false,
							_id: "000000001",
							name: "beacon1",
							location: { x: 0, y: 1, z: 2 },
						},
						{
							is_active: false,
							_id: "000000001",
							name: "beacon2",
							location: { x: 0, y: 1, z: 2 },
						},
						{
							is_active: false,
							_id: "000000001",
							name: "beacon3",
							location: { x: 0, y: 1, z: 2 },
						},
					],
					_id: "000001",
				},
			});
			await project.save()
		});
		it('should throw if the projectId is not valid',async()=>{
			await expect(projectServices.deleteBeaconsModel('111111')).to.be.rejectedWith(Error)
			.and.eventually.have.property("statusCode")
			.that.equals(404);
		})

		it('should remove the beacons_model property',async()=>{
			await projectServices.deleteBeaconsModel('123456');
			const project= await projectServices.get('123456');
			expect(project).to.have.property('beacons_model',undefined)
		})


		after(async () => {
			await Project.deleteMany({});
		});
	});

	//clean Database
	after(async function () {
		await Project.deleteMany({});
		return await mongoose.disconnect();
	});
});
