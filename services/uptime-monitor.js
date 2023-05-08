const axios = require('axios');

const ReportServices = require('../controllers/report/reportServices');

module.exports =  function createUptimeMonitor(check) {
  const { name, url, protocol, path = '/', port = '', timeout, interval, threshold, authentication, httpHeaders, assert, ignoreSSL = false } = check;
  
  const reportData = {
    status: 'unknown',
    availability: 0,
    outages: 0,
    downtime: 0,
    uptime: 0,
    aveResponseTime: 0,
    history: [],
    checkId: check._id
  }

  const reportServices = ReportServices(reportData);

  const pingUrl = async () => {
  const startTime = Date.now();

    try {
      const config = {
        method: 'get',
        url: `${protocol}://${url}:${port}${path}`,      
        timeout,
        headers: {},
        auth: authentication,
        //httpsAgent: new https.Agent({ rejectUnauthorized: !ignoreSSL })
      };

      if (httpHeaders) {
        httpHeaders.forEach(obj => {
          const values = Object.values(obj);
          config.headers[values[0]] = values[1];
        });
      }
    
      const response = await axios(config);
      const endTime = Date.now();
      const duration = endTime - startTime;
      reportData.aveResponseTime = (reportData.aveResponseTime + duration) / 2;
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
    if (reportData.status !== 'up') {
      reportData.uptime = reportData.uptime + (Date.now() - startTime);
      reportData.status = 'up';
      reportData.history.push({ timestamp: new Date().toISOString(), status: reportData.status });
    }
  };

  const handleFailure = (error, startTime) => {
    if (reportData.status !== 'down') {
      reportData.downtime = reportData.downtime + (Date.now() - startTime);
      reportData.status = 'down';
      reportData.outages++;
      reportData.history.push({ timestamp: new Date().toISOString(), status: reportData.status });
    }
    if (reportData.outages >= threshold) {
      // send email
      // send webhook notification
    }
  };

  const start = () => {
    setInterval(() => {
      pingUrl();
      reportData.availability = (((reportData.uptime / (reportData.uptime + reportData.downtime)) * 100).toFixed(2) || 0);
      const report = { status: reportData.status,  availability: reportData.availability, outages: reportData.outages, downtime: reportData.downtime, uptime: reportData.uptime, aveResponseTime: reportData.aveResponseTime, history: reportData.history };
      console.log(report);
    }, interval);

    // Update the report every minute and save it to the database every 5 minutes
    setInterval(() => {
      reportServices.updateReport()
    }, 60 * 1000);
    setInterval(() => {
      reportServices.saveReport()
    }, 10 * 60 * 1000);
  };

  return {
    start,
  };
}
