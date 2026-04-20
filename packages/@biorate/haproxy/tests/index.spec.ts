import { expect } from 'vitest';
import { root } from './__mocks__';

describe('@payment/haproxy', function () {
  beforeAll(async () => await root.$run());

  it('verify', async () => {
    expect(await root.connector.get().verify()).to.be.a('boolean');
  });

  it('running', async () => {
    expect(await root.connector.get().running()).to.be.a('boolean');
  });

  it('reload', async () => {
    expect(await root.connector.get().reload()).to.be.a('boolean');
  });

  it('stop', async () => {
    await root.connector.get().stop();
  });
});
