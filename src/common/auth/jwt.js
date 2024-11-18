const jwt = require("jsonwebtoken");
const configs = require("../../../configs");
const createError = require("http-errors");

const { JWT_TOKEN_TYPES } = require("../../../helpers/constants");

exports.signToken = (user, type) => {
  return new Promise((resolve, reject) => {
    let secret;

    if (type === JWT_TOKEN_TYPES.ACCESS_TOKEN) {
      secret = configs.jwt.accessToken.secret;
    } else {
      secret = configs.jwt.refreshToken.secret;
    }

    const expiry =
      type === JWT_TOKEN_TYPES.ACCESS_TOKEN
        ? configs.jwt.accessToken.ttl
        : configs.jwt.refreshToken.ttl;

    const options = {
      expiresIn: expiry,
      issuer: configs.jwt.issuer,
      audience: user.id.toString(),
    };

    const payload = type === JWT_TOKEN_TYPES.ACCESS_TOKEN ? user : {}; // because in case of refresh token payload doesnot have any body

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        // log exception here
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

exports.verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");

  const token = bearerToken[1];

  jwt.verify(token, configs.jwt.accessToken.secret, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.user = payload;
    next();
  });
};

exports.verifyRefreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    jwt.verify(
      refreshToken,
      configs.jwt.refreshToken.secret,
      (err, payload) => {
        if (err) {
          return next(createError.Unauthorized());
        }

        const userId = payload.aud; //get the user ID | aud hold the userID

        req.user = { userId };
        next();
      }
    );
  } catch (ex) {
    next(ex);
  }
};
