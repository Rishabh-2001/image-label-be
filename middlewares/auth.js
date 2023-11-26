const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    //   get the token from the authorization header
 
    const token = await request.headers.authorization.split(" ")[1];
  
    const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
    const user = await decodedToken;
    console.log("USER", user);

    // pass the user down to the endpoints here
    request.user = user;
console.log("ALLOwnig");
    // pass down functionality to the endpoint
    next();

    
  } catch (error) {
    return response.status(405).json({ error: "Invalid Request, Please Login Again" });
  }
};