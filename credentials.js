const chalk = require("chalk");
const env = require('env-var');

module.exports = () => {
  try {
    return {
      keyValue: env.get('KEY_VALUE').required().asString(),
      userName: env.get('USER_NAME').required().asString(),
      requestOrigin: env.get('REQUEST_ORIGIN').required().asInt(),
      clientCode: env.get('CLIENT_CODE').required().asInt(),
      channelCode: env.get('CHANNEL_CODE').required().asInt(),
    }
  } catch (err) {
    console.log(chalk.red.bold(err.message));
    process.exit(0);
  }
}