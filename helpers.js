module.exports.parseRoute = (route) => route.split('.').join('/');

module.exports.parseParams = (params) => params.reduce((acc, item) => {
  const [key, value] = item.split('=').map(str => str.trim());
  acc[key] = value;
  return acc;
}, {});