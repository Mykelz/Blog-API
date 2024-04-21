import { registerUser } from './controllers/user.js';
import bcrypt from "bcrypt";

const mockRequest= ()=>  {
    return {
        body: {
            firs_tname: "testname",
            last_name: "testname",
            email: "testEmail", 
        }
    }   
}

const mockResponse = ()=>  {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }   
}

const mockUser = {
        firstname: "testname",
        lastname: "testname",
        email: "testEmail",
        password: "hashedpaswd",
    }

describe('registers a user', ()=>{
    it('should register a user', async()=>{
        jest.spyOn(User, 'findOne').mockResolvedValueOnce('user details')
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedpaswd');

    })
})