This is an Blogging API that provides the basic tools for a Bloging platform to manage, create and interact with users, and blogs in an efficient manner.
Authentication: This API uses JWT authentication, and some of its endpoint requires a valid JWT to be supplied in the request header.
Authorization: Some Endpoints are only accessible to authencticated users. so make sure to include your tokens in the header section of your request.

**Register EndPoint ( /POST/auth/signup )**
    This endpoint registers a user and stores the user details in the users collection in the database, this endpoint accepts first_name, last_name, email and password fields 
    in the request body and stores this details in the database. alongside it creates an empty blog array column for the user.

**Login EndPoint ( /POST/auth/signin )**
  This endpoint logins a user. after a user has been successfully validated it logs in the user and returns a access_token in the response.
  it accepts the user email and password in the request body.
  
**Creat Blog EndPoint ( /POST/blog )**
    This endpoint creates a blog for a logged in user and stores in the the blogs array of that user. it accepts title, description, tag and body in the body of the request
    it creates a read_count, and reading_time column automatically and assigns it a value of '0' initially.A default state column is also created and assigned 'draft'.
    Also the creatorId is stored in the creator column. only authorized users can access this endpont. Be sure to include the valid token that was sent to you in your authrization
    headers in other to be successfully authorized.

**Creat Blog EndPoint ( /POST/blog )**
  
