const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const weigthedMultilateration = require("../../services/trilateration-services");

describe("Services: Weighted Trilateration", () => {
	describe("weightedTrilateration(...)", () => {
		it("should obtain the value of the Location", () => {
			const listMeasuerements = [
				{ radius: 5, x: 0, y: 0 },
				{ radius: 3, x: 6, y: 0 },
				{ radius: 7, x: 7, y: 5 },
				{ radius: 10, x: 5, y: 5 },
			];
			const location = weigthedMultilateration.weightedTrilateration(
				listMeasuerements
			);

			expect(location).to.have.property("x");
			expect(location).to.have.property("y");
		});

		it("should approximate the correct location when the 3 smallest circles intersect ", () => {
			const listMeasuerements = [
				{ radius: 5, x: 0, y: 0 },
				{ radius: 3, x: 6, y: 0 },
				{ radius: 7, x: 7, y: 5 },
				{ radius: 10, x: 5, y: 5 },
			];
			const location = weigthedMultilateration.weightedTrilateration(
				listMeasuerements
			);

			expect(location).to.have.property("x").closeTo(4.215928, 0.00001);
			expect(location).to.have.property("y").closeTo(1.43250704, 0.00001);
		});
	});
});
