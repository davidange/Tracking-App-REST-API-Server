const expect = require("chai").expect;

it("should sum 2  numbers correctly", () => {
	const num1 = 1;
    const num2 = 2;
    expect(num1+num2).to.be.equal(3);
});

it('should not be 6',()=>{
    const num1 = 1;
    const num2 = 2;
    expect(num1+num2).to.not.be.equal(6);
})
