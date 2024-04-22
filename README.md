This is an Blogging API that provides the basic tools for a Bloging platform to manage, create and interact with users, and blogs in an efficient manner.
Authentication: This API uses JWT authentication, and some of its endpoint requires a valid JWT to be supplied in the request header.
Authorization: Some Endpoints are only accessible to authencticated users. so make sure to include your tokens in the header section of your request.

**Register EndPoint ( /POST/auth/signup )**
    This endpoint registers a user and stores the user details in the users collection in the database, this endpoint accepts first_name, last_name, email and password fields 
    in the request body and stores this details in the database. alongside it creates an empty blog array column for the user.

**Login EndPoint ( /POST/auth/signin )**
  This endpoint logins a user. after a user has been successfully validated it logs in the user and returns a access_token in the response.
  it accepts the user email and password in the request body.
  
**Create Blog EndPoint ( /POST/blog )**
    This endpoint creates a blog for a logged in user and stores in the the blogs array of that user. it accepts title, description, tag and body in the body of the request
    it creates a read_count, and reading_time column automatically and assigns it a value of '0' initially.A default state column is also created and assigned 'draft'.
    Also the creatorId is stored in the creator column. only authorized users can access this endpont. Be sure to include the valid token that was sent to you in your authrization
    headers in other to be successfully authorized.

**Get all Blogs EndPoint ( /GET/blog )**
    This endpoint gets all publisehd blog in the database- both logged in and non logged in users can access this endpoint.

**Get a single Blog EndPoint ( /GET/blog/:blogId )**
    This enpoint gets a single blog by its Id- both logged in and non logged in users can access this endpoint. it accepts a blogId as a parameter

**Update a Blog state EndPoint ( /PUT/blog/:blogId/state )**
    This endpoint updates a blog state it can only be accessed by logged in users. and only a creator of a blog can update it state. it accepts a blogId as a parameter
    and state='published' as a query.

**Update a Blog  ( /Patch/blog/:blogId' )**
    It updates a blog.it takes a blogId as parameter. only users who created a blog can edit it.
    
**Delete a Blog  ( /delete/blog/:blogId' )**
    It deletes a blog.it takes a blogId as parameter. only users who created a blog can delete it.

**Get all Blogs belonging to an author ( /GET/blog/author/blogs' )**
    This endpoint gets all blogs beloging to a logged in author.

    

