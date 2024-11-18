require('dotenv').config();
module.exports = {
    database: {
      uri: process.env.DATABASE_URI,
    },

    jwt: {
      accessToken: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        ttl: "5m",
      },
      refreshToken: {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        ttl: "7 days",
        remeberMeTTL: "30 days",
       
      },
      issuer: "greenpad.com",
    },
   
  };
  