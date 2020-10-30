const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const assertArrays = require("chai-arrays");
chai.use(assertArrays);

const bimPlusServices = require("../../services/bim-plus-services");
const bimPlusToken = require("../../util/BimPlus/getBimPlusToken");
describe("Services: Bim-Plus-Services", () => {
	let token;
	const slug = "bimplus-demo";
	const projectId = "d88d837c-389d-457a-ba9e-a2976ddc2733";
	const modelTopologyId = "260626a0-1d60-47e7-bd01-be367ea6bbc8";
	before(async () => {
		token = await bimPlusToken.requestAutenticationToken(
			process.env.BIMPLUS_USER,
			process.env.BIMPLUS_PASSWORD,
			process.env.BIMPLUS_APPLICATION_ID
		);
	});

	describe("getTeams(...)", () => {
		it("should return list of the teams available in BimPlus Account", async () => {
			const teams = await bimPlusServices.getTeams(token.access_token);
			expect(teams).to.be.array();
			expect(teams[0]).to.have.property("slug");
			expect(teams[0]).to.have.property("name");
			expect(teams[0]).to.have.property("_id");
		});
	});

	describe("getProjects(...)", () => {
		it("should return list of the Projects available in BimPlus Account", async () => {
			const projects = await bimPlusServices.getProjects(token.access_token, slug);
			expect(projects).to.be.array();
			expect(projects[0]).to.have.property("slug");
			expect(projects[0]).to.have.property("name");
			expect(projects[0]).to.have.property("_id");
			expect(projects[0]).to.have.property("team_id");
		});
	});

	describe("getModels(...)", () => {
		it("should return list of models for selected Project", async () => {
			const models = await bimPlusServices.getModels(token.access_token, slug, projectId);
			expect(models).to.be.array();
			expect(models[0]).to.have.property("name");
			expect(models[0]).to.have.property("description");
			expect(models[0]).to.have.property("_id");
			expect(models[0]).to.have.property("id_topology");
		});
	});

	describe("getObjectTree(...)", () => {
		it("should return the Object Tree for selected Model", async () => {
			const objectTree = await bimPlusServices.getObjectTree(token.access_token, slug, modelTopologyId);

			expect(objectTree).to.have.property("children");
			expect(objectTree).to.have.property("name");
			expect(objectTree).to.have.property("type");
		});
	});

	describe("getObjectTreeWithPropertyList(...)", () => {
		it("should return the Object tree with Property List for selected Model", function (done) {
			this.timeout(15000); //raise Timeout limit to 15000ms
			bimPlusServices.getObjectTreeWithPropertyList(token.access_token, slug, modelTopologyId).then((objectTree) => {
				expect(objectTree).to.have.property("elementsCount");
				expect(objectTree).to.have.property("viewbox");
				expect(objectTree).to.have.property("objects");
				done();
			});
		});
	});
});
