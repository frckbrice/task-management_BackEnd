const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {

  const authHeader = req.headers.authorization || req.headers. Authorization;

  if(!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send('UnAuthorized. need to login first');
  }

  const token = authHeader.split(' ')[1];
// console.log('token', token)
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRETKEY,
    (err, decodedUserInfo) => {
      if(err) {
        return res.status(403).json({message:'Forbidden'});
      }

      req.user = decodedUserInfo.userInfo.username;
      req.roles = decodedUserInfo.userInfo.roles;
      next();
    }
    )
};

module.exports = verifyJwt;