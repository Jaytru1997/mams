const cron = require("node-cron");
const {asyncWrapper} = require('../utilities/async');

exports.scheduler = asyncWrapper((schedule, job) => {
  if (cron.validate(schedule)) {
    cron.schedule(schedule, job);
  } else {
    console.log(`Scheduler invalid`);
  }
});
