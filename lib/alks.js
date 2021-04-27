const ALKS = require('alks.js');
const utils = require('./utils');

exports.getAlks = async function getAlks({ baseUrl, token, userid, password }) {
  let params = {
    baseUrl,
    userAgent: utils.getUA(),
  };

  let alks;

  if (token) {
    alks = ALKS.create(params);
    const result = await alks.getAccessToken({
      refreshToken: auth.token,
    });
    alks = alks.create({
      accessToken: result.accessToken,
    });
  } else {
    params.userid = userid;
    params.password = password;
    alks = ALKS.create(params);
  }

  return alks;
};
