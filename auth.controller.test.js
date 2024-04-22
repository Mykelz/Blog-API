import User from "./models/user";
import { registerUser, loginUser } from "./controllers/user";
import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');
require('dotenv').config();


const mockReq = ()=>{
    return {
        body: {
            first_name: "testname",
            last_name: "testname",
            email: "test@mail.com",
            password: "password"
        }
    }
}

const mockRes = ()=>{
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    }
}

const next = jest.fn();

const mockUser = {
    first_name: "testname",
    last_name: "testname",
    email: "test@mail.com",
    password: "hashedpswd"
}

afterEach(()=>{
    jest.restoreAllMocks()
})

describe("Register User", ()=>{
    it('should register a user', async()=>{
        jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedpswd', 12);
        jest.spyOn(User, 'create').mockResolvedValueOnce(mockUser);


        const mockRequest = mockReq();
        const mockResponse = mockRes();

        await registerUser(mockRequest, mockResponse, next);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@mail.com'});
        expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
        expect(User.create).toHaveBeenCalledWith({
            first_name: "testname",
            last_name: "testname",
            email: "test@mail.com",
            password: "hashedpswd"
        });
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);    
    })
   
})

describe("Login a user", ()=>{
    it('should login a user', async()=>{
        jest.spyOn(User, 'findOne').mockResolvedValueOnce({
            _id: "12345",
            first_name: "testname",
            last_name: "testname",
            email: "test@mail.com",
            password: "hashedpswd"
        });
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(1);
        jest.spyOn(jwt, 'sign').mockResolvedValueOnce('atestjwttoken');

        const mockReqst = ()=>{
            return {
                body: {
                    email: "test@mail.com",
                    password: "password"
                }
            }
        }

        const mockRequest = mockReqst();
        const mockResponse = mockRes();

        await loginUser(mockRequest, mockResponse, next);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@mail.com'});
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpswd');
        expect(jwt.sign).toHaveBeenCalledWith(
                { email:'test@mail.com', userId: '12345'},
                process.env.JWT_SECRET,
                { expiresIn: '1hr'}
            );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);    

    })
})

