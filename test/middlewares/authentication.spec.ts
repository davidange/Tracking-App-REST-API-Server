import {expect} from 'chai'
import {} from  'mocha'
import {auth} from  '../../src/middlewares/authentication/verifyToken'
import Express from 'express'
describe('Authentication Middleware Tests',()=>{
    it('should thow error if authentication header is missing',()=>{
        const res:Express.Response=Express.response;
        const req:Express.Request=Express.request;
        
        auth(req,res,()=>{});
        expect(res.statusCode).to.equal(400);
        

    })
})