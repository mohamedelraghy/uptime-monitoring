const axios = require('axios');

module.exports =  function createUptimeMonitor(check) {
  const { name, url, protocol = 'http', path = '/', port, timeout = 5000, interval = 600000, threshold = 1, authentication, httpHeaders, assert } = check;
  let uptime = 0;
  let downtime = 0;
  let outages = 0;
  let responseTime = 0;
  let status = 'unknown';
  let history = [];

  const pingUrl = async () => {
    const startTime = Date.now();
    try {
      const config = {
        url,
        method: 'get',
        timeout,
        headers: httpHeaders,
        auth: authentication,
      };
      const response = await axios(config);
      const endTime = Date.now();
      const duration = endTime - startTime;
      responseTime = (responseTime + duration) / 2;
      if (assert && assert.statusCode && response.status !== assert.statusCode) {
        handleFailure('status code does not match', startTime);
      } else {
        handleSuccess(startTime);
      }
    } catch (error) {
      handleFailure(error, startTime);
    }
  };

  const handleSuccess = (startTime) => {
    if (status !== 'up') {
      uptime = uptime + (Date.now() - startTime);
      status = 'up';
      outages++;
      history.push({ timestamp: new Date().toISOString(), status });
    }
  };

  const handleFailure = (error, startTime) => {
    if (status !== 'down') {
      downtime = downtime + (Date.now() - startTime);
      status = 'down';
      outages++;
      history.push({ timestamp: new Date().toISOString(), status });
    }
    if (outages >= threshold) {
      // send webhook notification
    }
  };

  const start = () => {
    setInterval(() => {
      pingUrl();
      const availability = ((uptime / (uptime + downtime)) * 100).toFixed(2);
      const report = { status, availability, outages, downtime, uptime, responseTime, history };
      console.log(report);
    }, interval);
  };

  return {
    start,
  };
}
