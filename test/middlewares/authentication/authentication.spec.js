const expect = require("chai").expect;
const jwt = require('jsonwebtoken');
const sinon=require('sinon');

const tokenAuthMiddleware = require("../../../middlewares/authentication/verifyToken");

describe("Token Authorization  middleware", () => {
	it("should throw an error if no authorization token in header is present", () => {
		const req = {
			get: function (headerName) {
				return null;
			},
		};
		expect(tokenAuthMiddleware.bind(this, req, {}, () => {})).to.throw(
			"Not Authenticated"
		);
	});

	it("should throw the error if authorization header is only one string", () => {
		const req = {
			get: function (headerName) {
				return "oneString";
			},
		};
		expect(tokenAuthMiddleware.bind(this, req, {}, () => {})).to.throw();
    });
    
    it('should throw an error if the token cannot be verified',()=>{
        const req = {
			get: function (headerName) {
				return "Token xxxxx";
			},
		};
		expect(tokenAuthMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should yield a userId after decoding Token',()=>{
        const req = {
			get: function (headerName) {
				return "Token validToken";
			},
        };
        
        sinon.stub(jwt,'verify');
        jwt.verify.returns({userId:'abc'});

        tokenAuthMiddleware( req, {}, () => {});
        expect(req).to.have.property('userId');
        
        jwt.verify.restore();
    })

    
});
