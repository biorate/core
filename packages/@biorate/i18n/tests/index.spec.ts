import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root } from './__mocks__';
import { t } from '../src';

describe('@biorate/i18n', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  it('ru', () => expect(t`Привет мир`).toMatchSnapshot());

  it('en', () => expect(t(`Привет мир`, { lng: 'en' })).toMatchSnapshot());
});
