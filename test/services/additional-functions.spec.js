const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const additionalFuncServices=require('../../services/additional-functions')

describe("Services: Additional-functions", () => {
	describe("flatten(...)", () => {
		const Tree = {
            color:'gold',
			child: [
				{
					color: "red",
					child: [
						{ color: "purple", child: [] },
						{ color: "black", child: [] },
						{ color: "white", child: [] },
					],
				},
				{
					color: "blue",
					child: [
						{ color: "red", child: [] },
						{ color: "blue", child: [] },
						{ color: "green", child: [] },
					],
				},
				{ color: "green", child: [] },
			],
		};
		it("should flatten a Tree to an Array", () => {
            expect(additionalFuncServices.flatten(Tree,'child')).to.be.array().and.to.have.lengthOf(10)
        });
	});
});
