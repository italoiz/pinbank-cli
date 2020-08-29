const axios = require("axios")
const qs = require('querystring');
const get = require('lodash.get');
const chalk = require('chalk');

module.exports = async ({ url, username, password }) => {
  try {
    const res = await axios.post(url.concat('/token'), qs.stringify({
      grant_type: 'password',
      username,
      password,
    }));

    return {
      accessToken: get(res, 'data.access_token', null),
      expiresIn: get(res, 'data.expires_in', null)
    }
  } catch (err) {
    const message = get(err, 'response.data.error_description', err.message);
    console.log(chalk.red.bold(message));
    return {};
  }
}
