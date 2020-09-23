const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require("sinon");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Project = require("../../models/project");
const beaconsInfoServices = require("../../services/beacons-info-services");
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
		//add Dummy Project
		const project = new Project({
			_id: "123456",
			slug: "slug",
			name: "projectName",
			models: [{ _id: "000001", name: "modelName", id_topology: "top001" }],
			__v: 0,
			beacons_model: {
				beacons: [
					{
						is_active: true,
						_id: "000000001",
						uid_beacon: "12345678",
						name: "beacon1",
						location: { x: 0, y: 1, z: 2 },
					},
					{
						is_active: false,
						_id: "000000002",
						name: "beacon2",
						location: { x: 0, y: 1, z: 2 },
					},
					{
						is_active: false,
						_id: "000000003",
						name: "beacon3",
						location: { x: 0, y: 1, z: 2 },
					},
				],
				_id: "000001",
			},
		});
		await project.save();

		const project2 = new Project({
			_id: "123457",
			slug: "slug",
			name: "projectName",
			models: [{ _id: "000001", name: "modelName", id_topology: "top001" }],
			__v: 0,
		});
		await project2.save();

		const project3 = new Project({
			_id: "123458",
			slug: "slug",
			name: "projectName",
			models: [{ _id: "000001", name: "modelName", id_topology: "top001" }],
			__v: 0,
			beacons_model: {
				beacons: [],
				_id: "000001",
			},
		});
		await project3.save();
	});
	describe("getBeacons(...)", () => {
		it("should throw if the project id is the wrong one ", async () => {
			await expect(beaconsInfoServices.getBeacons("111111"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});
		it("should return list of beacons if the project id is the correct one ", async () => {
			const beacons = await beaconsInfoServices.getBeacons("123456");
			expect(beacons).to.be.array();
			expect(beacons[0]).to.have.property("_id", "000000001");
		});
		it("should throw if the project does not contain a beacons_model", async () => {
			await expect(beaconsInfoServices.getBeacons("123457"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(500);
		});
		it("should throw if the project does not contain any beacons in the beacon model", async () => {
			await expect(beaconsInfoServices.getBeacons("123458"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(500);
		});
	});

	describe("getActiveBeacons(...)", () => {
		it("should return only the activeBeacons", async () => {
			const activeBeacons = await beaconsInfoServices.getActiveBeacons(
				"123456"
            );
            expect(activeBeacons).to.be.array();
            expect(activeBeacons).to.be.length(1)
		});
    });
    
    describe("getBeacon(...)", () => {
		it("should throw if the project id is the wrong one ", async () => {
			await expect(beaconsInfoServices.getBeacon("111111","000000001"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});
		it("should throw if the beacon_id is not in beacons_model", async () => {
			await expect(beaconsInfoServices.getBeacon("123456","000000008"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
        });
        it("should return the Beacon info",async()=>{
            const beacon=await beaconsInfoServices.getBeacon("123456","000000001");
            expect(beacon).to.have.property("name","beacon1")
        })
		
    });
    
    describe('setBeaconUID(...)',()=>{
        it("should throw if the project id is the wrong one ", async () => {
			await expect(beaconsInfoServices.setBeaconUID("111111","000000001","1234564"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});
		it("should throw if the beacon_id is not in beacons_model", async () => {
			await expect(beaconsInfoServices.setBeaconUID("123456","000000008","1234564"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
        });

        it("should throw if another beacon has the desired Beacon UID", async () => {
			await expect(beaconsInfoServices.setBeaconUID("123456","000000002","12345678"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(403);
        });
        it("should return the beacon info if the update was successful",async ()=>{
            const beacon=await beaconsInfoServices.setBeaconUID("123456","000000001","UIDBEACON");
            expect(beacon).to.have.property("name","beacon1")
            expect(beacon).to.have.property("is_active",true)
        })
    })

    describe('deleteBeaconUID(...)',()=>{
        it("should throw if the project id is the wrong one ", async () => {
			await expect(beaconsInfoServices.deleteBeaconUID("111111","000000001"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
		});
		it("should throw if the beacon_id is not in beacons_model", async () => {
			await expect(beaconsInfoServices.deleteBeaconUID("123456","000000008"))
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(404);
        });

        it("should return the beacon info updated if the deletion of the UID was successful",async ()=>{
            const beacon=await beaconsInfoServices.deleteBeaconUID("123456","000000001");
            expect(beacon).to.have.property("name","beacon1")
            expect(beacon).to.have.property("is_active",false)
        })
    })

	after(async () => {
		await Project.deleteMany({});
		return await mongoose.disconnect();
	});
});
