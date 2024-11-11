require('dotenv').config();
module.exports = {
    database: {
      uri: process.env.DATABASE_URI,
    },

    jwt: {
      accessToken: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        ttl: "1m",
      },
      refreshToken: {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        ttl: "7 days",
        remeberMeTTL: "30 days",
        redisTTL: 7 * 86400, // 7 days
        redisRemeberMeTTL: 30 * 86400, //days
      },
      issuer: "greenpad.com",
    },
   
  };
  