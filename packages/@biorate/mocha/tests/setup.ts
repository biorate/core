import { use } from 'chai';
import { assignPmsUrl, assignTmsUrl, decorate, allure, MochaAllure } from '../src';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

use(jestSnapshotPlugin());

before(async function () {
  this.timeout(3000);
  decorate<MochaAllure>(allure);
  assignTmsUrl(<string>process.env.TMS_URL);
  assignPmsUrl(<string>process.env.PMS_URL);
});

after(async function () {});
