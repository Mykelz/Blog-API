import Blog from "./models/blog";
import User from "./models/user";
import { createBlog, getABlog } from "./controllers/blog";



const mockReq = ()=>{
    return {
        body: {
            title: "testtitle",
            description: "test description",
            tag: "test tag",
            body: "test body",
        },
        user: '12345',
        params: {
            blogId: "0000"
        }
    }
}




const mockRes = ()=>{
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    }
}

const mockUser = {
    _id: '12345',
    first_name: "testname",
    last_name: "testname",
    email: "test@mail.com",
    password: "hashedpswd",
    blogs: []
}


const mockBlog = {
            title: "testtitle",
            description: "test description",
            tag: "test tag",
            creator: mockUser._id,
            author: "testname",
            body: "test body",
            reading_time: "0.013333333333333334 min",
            
}



const next = jest.fn();

afterEach(()=>{
    jest.restoreAllMocks()
});


describe("Create Blog", ()=>{
    it('should create a Blog', async()=>{
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Blog, 'create').mockResolvedValueOnce(mockBlog);
        mockUser.save = jest.fn().mockResolvedValue(mockUser);
        

        const mockRequest = mockReq();
        const mockResponse = mockRes();

        await createBlog(mockRequest, mockResponse, next);

        expect(User.findById).toHaveBeenCalledWith(mockRequest.user);
        expect(Blog.create).toHaveBeenCalledWith(mockBlog)
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);    
        

    })
   
})

describe("should get a single blog", ()=>{
    it("should get a blog", async()=>{
        jest.spyOn(Blog, 'findById').mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockBlog),
          });
          
        Blog.findById.populate = jest.fn().mockResolvedValue(mockBlog.creator);
        mockBlog.save = jest.fn().mockResolvedValue(mockUser);
        
        const mockRequest = mockReq();
        const mockResponse = mockRes();
        const blogId = mockRequest.params.blogId;
        await getABlog(mockRequest, mockResponse, next);

        expect(Blog.findById).toHaveBeenCalledWith(blogId);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);    
    })
})