const { forEach } = require('lodash');
const { Check } = require('../models/check');

const monitor = require('../services/uptime-monitor');
let ping;

module.exports = async () => {
  console.log('Monitoring....');
  const checks = await Check.find();

  if(checks.length === 0) {
    throw new Error('There is no checks to monitor..');
  }

  checks.forEach(async(check) => {
    ping = await monitor(check);
    ping.start();
  });
}