const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const dotenv = require("dotenv");
dotenv.config();
const getBimPlusToken = require("../../../util/BimPlus/getBimPlusToken");

describe("Bimplus Token Getter", () => {
	it("should return a token if correct data was given", async () => {
        const tokenData= await getBimPlusToken.requestAutenticationToken(
            process.env.BIMPLUS_USER,
            process.env.BIMPLUS_PASSWORD,
            process.env.BIMPLUS_APPLICATION_ID
        )
		expect(tokenData).to.not.be.null;
    });
});
