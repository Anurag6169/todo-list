const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.body.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.send({"error":"unauthorised"});
      } else {
        // console.log(decodedToken);
        res.user = decodedToken;
        next();
      }
    });
  } else {
    res.send({"error":"unauthorised"});
  }
};

module.exports = { requireAuth }; 