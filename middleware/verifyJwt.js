const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {

  const authHeader = req.headers.authorization || req.headers. Authorization;

  if(!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send('No token in the header. UnAuthorized');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRETKEY,
    (err, decodedUserInfo) => {
      if(err) {
        return res.status(403).send('Forbidden');
      }

      req.user = decodedUserInfo.userInfo.username;
      req.roles = decodedUserInfo.userInfo.roles;
      next();
    }
    )
};

module.exports = verifyJwt;