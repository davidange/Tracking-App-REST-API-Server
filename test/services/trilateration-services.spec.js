const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const weigthedMultilateration = require("../../services/trilateration-services");

describe("Services: Weighted multilateration", () => {
	describe("weightedMultilateration(...)", () => {
		const listMeasuerements = [
			{ radius: 5, x: 0, y: 0, z: 0 },
			{ radius: 3, x: 6, y: 0, z: 0 },
			{ radius: 7, x: 7, y: 5, z: 0 },
			{ radius: 10, x: 5, y: 5, z: 0 },
		];
		it("should obtain the value of the Location", () => {
			expect(
				weigthedMultilateration.weightedMultilateration(listMeasuerements)
			).to.be.number();
		});
	});
});
