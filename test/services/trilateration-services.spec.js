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
			const location = weigthedMultilateration.weightedTrilateration(listMeasuerements);

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
			const location = weigthedMultilateration.weightedTrilateration(listMeasuerements);

			expect(location).to.have.property("x").closeTo(4.215928, 0.00001);
			expect(location).to.have.property("y").closeTo(1.43250704, 0.00001);
		});

		it("should approximate the correct location when only 2 circles intersect and one not [Test 1]", () => {
			const listMeasuerements = [
				{ radius: 5, x: 0, y: 0 },
				{ radius: 3, x: 7, y: -6 },
				{ radius: 7, x: 7, y: 5 },
				{ radius: 10, x: 5, y: 5 },
			];
			const location = weigthedMultilateration.weightedTrilateration(listMeasuerements);
			expect(location).to.have.property("x").closeTo(4.729729729, 0.00001);
			expect(location).to.have.property("y").closeTo(-1.621621621, 0.00001);
		});

		it("should approximate the correct location when only 2 circles intersect and one not [Test 2]", () => {
			const listMeasuerements = [
				{ radius: 4, x: 0, y: 0 },
				{ radius: 7, x: 7, y: -10 },
				{ radius: 7, x: 7, y: 5 },
				{ radius: 10, x: 5, y: 5 },
			];
			const location = weigthedMultilateration.weightedTrilateration(listMeasuerements);
			console.log(location)
			expect(location).to.have.property("x").closeTo(3.8064883250588, 0.00001);
			expect(location).to.have.property("y").closeTo(-1.2290839655, 0.00001);
		});
	});
});
