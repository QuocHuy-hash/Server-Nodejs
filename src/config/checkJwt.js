const jwt = require('jsonwebtoken');
const constant = require("../config/constant");
require('dotenv').config();

// exports.checkJwt = (req, res, next) => {
//   //Get the jwt token from the head
//   let token = req.headers["authorization"];
//   if (typeof token == 'undefined') {
//     res.status(401).send();
//     return;
//   }

//   token = token.substring(7);
//   let jwtPayload;

//   //Try to validate the token and get data
//   try {
//     jwtPayload = jwt.verify(token, constant.jwtSecret);
//     res.locals.jwtPayload = jwtPayload;
//   } catch (error) {
//     //If token is not valid, respond with 401 (unauthorized)
//     console.log("ERROR - function checkJwt", error, token);
//     res.status(401).send();
//     return;
//   }

//   //The token is valid for 1 hour
//   //We want to send a new token on every request
//   const { userId, username } = jwtPayload;
//   const newToken = jwt.sign({ userId, username }, constant.jwtSecret, {
//     expiresIn: constant.jwtSecretExp
//   });
//   res.setHeader("token", newToken);

//   //Call the next middleware or controller
//   next();
// };


exports.getCurrentLogin = (req) => {
  let jwtdata;
  try {
    const KEY_TOKEN = process.env.KEY_TOKEN;
    console.log("KEY_TOKEN " , KEY_TOKEN);
    let token = req.cookies.access_token;
    console.log("token1111", token);

    if (!token) {
      console.log("Token is missing");
      return null;
    }
    const tokenWithoutBearer = token.substring(7);
    jwtdata = jwt.verify(tokenWithoutBearer, constant.jwtSecret);
  } catch (error) {
    console.log("ERROR - function getCurrentLogin", error);

    return null;
  }
  const { userId, username } = jwtdata;
  console.log(" curent userId", userId);

  return { "userId": userId, "username": username };
}