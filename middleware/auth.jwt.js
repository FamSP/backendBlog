const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ message: "No Token Provide!" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Unautherized!" });
    }
    req.username = decoded.username;
    req.authorId = decoded.id;
    next();
  });
};

const authjwt = { verifyToken };
export default authjwt;
