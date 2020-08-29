#!/usr/bin/env node
const program = require('commander');
const dotenv = require('dotenv');
const path = require('path');
const authenticate = require('./authenticate');
const { existsSync } = require('fs');
const chalk = require('chalk');
const credentials = require('./credentials');
const { parseRoute, parseParams } = require('./helpers');
const axios = require('axios');
const get = require('lodash.get');
const Crypto = require('./crypto');

const homedir = require('os').homedir();
const configFile = path.resolve(homedir, '.pinbank');

program
  .version('0.1.0')
  .option('-e, --env <env>', 'The environment file to get credentials.')
  .option('-d, --dev', 'Use the Pinbank dev environment.')
  .option('-r, --route <route>', 'Specified the route to execute.')
  .option('-p, --params <params...>', 'The params to pass to request.')
  .parse(process.argv);

if (!program.env || !existsSync(program.env)) {
  console.log(chalk.red.bold('Environment file was not found.'));
  process.exit(1);
}

/* load specified environment file */
dotenv.config({ path: program.env });

/* credentials */
const CREDENTIALS = credentials();

/* url */
const pinbankurl = program.dev === true
  ? 'https://dev.pinbank.com.br/services/api'
  : 'https://pinbank.com.br/services/api';

(async () => {
  const { accessToken } = await authenticate({ 
    url: pinbankurl,
    username: CREDENTIALS.userName,
    password: CREDENTIALS.keyValue
  });

  if (!accessToken)
    return;

  const crypto = new Crypto({ credentials: CREDENTIALS });
  const apiRoute = pinbankurl.concat('/', parseRoute(program.route), 'Encrypted');
  const params = parseParams(program.params);
  const defaultParams = { CodigoCliente: CREDENTIALS.clientCode, CodigoCanal: CREDENTIALS.channelCode };

  try {
    console.log(chalk.green.bold(`Sending request to ${apiRoute}\n`));

    const body = { ...defaultParams, ...params };
    console.log(chalk.grey(JSON.stringify(body, null, 2)));
    console.log(chalk.grey('-'.repeat(50)));

    const encryptedBody = { Data: { Json: crypto.encrypt({ Data: body }) } };
    
    const res = await axios.post(apiRoute, encryptedBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        RequestOrigin: CREDENTIALS.requestOrigin,
        UserName: CREDENTIALS.userName,
      }
    });

    const encryptedResponse = get(res, 'data.Data.Json', null);
    const Data = !!encryptedResponse 
      ? get(crypto.decrypt(encryptedResponse), 'Data', {})
      : null;

    const response = { ...get(res, 'data', {}), Data };
    console.log(chalk.grey(JSON.stringify(response, null, 2)));
  } catch (err) {
    const message = get(err, 'response.data.Message', err.message);
    console.log(chalk.red.bold(message));
    process.exit(0);
  }
})();