import { use } from 'chai';
import {
  assignPmsUrl,
  assignTmsUrl,
  decorate,
  allure,
  // MochaAllure,
} from '../src';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

use(jestSnapshotPlugin());

before(async function () {
  this.timeout(3000);
  decorate<any>(allure);
  assignTmsUrl(process.env.TMS_URL ?? '');
  assignPmsUrl(process.env.PMS_URL ?? '');
});

after(async function () {});
