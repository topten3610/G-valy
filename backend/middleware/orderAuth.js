const jwt = require("jsonwebtoken");

async function orderAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
        next();
        return
    }

    jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY || "abcdefghjklmopqrstuvwxyz",
      function (err, decoded) {

        if (err) {
          console.log("error auth", err);
        }

        req.userId = decoded?._id;

        next();
      }
    );
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      data: [],
      error: true,
      success: false,
    });
  }
}

module.exports = orderAuth;
