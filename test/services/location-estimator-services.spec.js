const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const chaiArrays = require("chai-arrays");
chai.use(chaiArrays);

const sinon = require("sinon");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Project = require("../../models/project");
const locationEstimatorServices = require("../../services/location-estimator-services");
const trilaterationServices = require("../../services/trilateration-services");
const bimPlusToken = require("../../util/BimPlus/getBimPlusToken");

describe("Services: Location Estimator Services", () => {
	let token;

	const projectId = "000001";
	const beaconsUid = ["000000001", "000000002", "000000003"];

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
			_id: projectId,
			slug: "slug",
			name: "projectName",
			models: [{ _id: "000001", name: "modelName", id_topology: "top001" }],
			__v: 0,
			beacons_model: {
				beacons: [
					{
						is_active: true,
						_id: "000000001",
						uid_beacon: beaconsUid[0],
						name: "beacon1",
						location: { x: 0, y: 1, z: 1 },
					},
					{
						is_active: true,
						_id: "000000002",
						uid_beacon: beaconsUid[1],
						name: "beacon2",
						location: { x: 0, y: 0, z: 2 },
					},
					{
						is_active: true,
						_id: "000000003",
						uid_beacon: beaconsUid[2],
						name: "beacon3",
						location: { x: 1, y: 1, z: 3 },
					},
				],
				_id: "111111111",
			},
		});
		await project.save();
	});
	describe("estimateLocation(...)", () => {
		const beaconTrackingData = [
			{ distance: 2, beacon_uid: beaconsUid[0] },
			{ distance: 2, beacon_uid: beaconsUid[1] },
			{ distance: 2, beacon_uid: beaconsUid[2] },
		];

		it("should thow if an invalid method for estimating location is selected", async () => {
			await expect(
				locationEstimatorServices.estimateLocation(
					projectId,
					beaconTrackingData,
					"NotAMethodImplemented"
				)
			)
				.to.be.rejectedWith(Error)
				.and.eventually.have.property("statusCode")
				.that.equals(400);
		});

		it("should return a Location for the beacon-trilateration method", async () => {
			const mock = sinon.mock(trilaterationServices);
			mock
				.expects("weightedTrilateration")
				.once()
				.withArgs([
					{ radius: 2, x: 0, y: 1 },
					{ radius: 2, x: 0, y: 2 },
					{ radius: 2, x: 1, y: 3 },
				])
				.returns({ x: 0, y: 0});

			const estimatedLocation = await locationEstimatorServices.estimateLocation(
				projectId,
				beaconTrackingData,
				"beacon-trilateration"
			);
			expect(estimatedLocation).to.have.property("x", 0);
			expect(estimatedLocation).to.have.property("y", 1);
			expect(estimatedLocation).to.have.property("z", 0);
			mock.restore();
			mock.verify();
		});
	});

	after(async () => {
		await Project.deleteMany({});
		return await mongoose.disconnect();
	});
});
