import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, root } from './__mocks__';
import { t } from '../src';

describe('@biorate/i18n', () => {
  beforeAll(async () => await root.$run());

  it('ru', () => expect(t`Привет мир`).toMatchSnapshot());

  it('en', () => expect(t(`Привет мир`, { lng: 'en' })).toMatchSnapshot());
});
