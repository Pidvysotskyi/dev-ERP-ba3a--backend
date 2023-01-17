const { User } = require("../models");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  try {
    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, SECRET_KEY);

    const [[user], _] = await User.getById(id);

    console.log(user);

    if (!user || !user.TOKEN) {
      throw new Unauthorized("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.mesage === "Invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
