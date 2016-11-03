'use strict';

var CronJob = require('./index').CronJob,
  should = require('chai').should();
/* globals
  describe: false,
  it: false
  */
void(should);
describe('graceful-cron', function() {
  it('shutdown', function (done) {
    var job = new CronJob('* * * * * *', function (done) {
      console.log('job started');
      setTimeout(function () {
        console.log('job finished');
        done();
      }, 5000);
    });
    job.start();
    this.timeout(10000);
    setTimeout(function () {
      console.log('shutting down');
      job.shutdown(function () {
        console.log('shutted down');
        done();
      });
    }, 3000);
  });
});
