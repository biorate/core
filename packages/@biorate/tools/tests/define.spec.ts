import { assert } from 'chai';
import { IDefine } from '../interfaces';
// import { define } from '../src';
import { prop, conditions } from './__mocks__/define';

describe('define', () => {
  for (const [descriptor, properties] of conditions)
    it(`define prop [${descriptor}]`, () => {
      for (const property of properties) assert(prop(descriptor)[property]);
    });
});
