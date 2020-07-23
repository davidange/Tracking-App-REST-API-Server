const expect=require('chai').expect;



const tokenAuthMiddleware=require('../../../middlewares/authentication/verifyToken');


it('should throw an error if no authorization token in header is present',()=>{
    const req={
        get:function(){
            return null;
        }
    }
    expect(tokenAuthMiddleware.bind(this,req,{},()=>{})).to.throw('Not Authenticated');
})
