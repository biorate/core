import { setTimeout } from 'timers/promises';
import { container } from '@biorate/inversion';
import { root } from './__mocks__';

describe('@biorate/migrations', function () {
  it('run', async () => new Promise((done) => root.on('end', () => done(void 0))));
});
