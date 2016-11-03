'use strict';

var BaseCronJob = require('cron').CronJob,
  when = require('when'),
  util = require('util');

function CronJob(cronTime, onTick) {
  var self = this;
  self.pendingJobs = self.pendingJobs || [];

  arguments[1] = function () {
    var pendingJob = when.defer();
    self.pendingJobs.push(pendingJob.promise);

    onTick(function () {
      pendingJob.resolve();
      var index = self.pendingJobs.indexOf(pendingJob);
      if(index >= 0) {
        self.pendingJobs.splice(index, 1);
      }
    });
  };
  console.log(arguments);
  BaseCronJob.apply(this, Array.prototype.slice.call(arguments, 0));
}

util.inherits(CronJob, BaseCronJob);


CronJob.prototype.shutdown = function (done) {
  if(this.shuttingDown) {
    return done(new Error('Shutdown is already in process'));
  }
  this.shuttingDown = true;
  this.stop();
  if(this.pendingJobs && this.pendingJobs.length) {
    return when.all(this.pendingJobs)
      .then(function () {
        done();
      })
      .catch(done);
  }
  done();
};

module.exports.CronJob = CronJob;