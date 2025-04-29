import { expect } from 'chai';
import { User } from './__mocks__';

describe('@biorate/auto-object', function () {
  it('AutoObject', () => {
    const data = {
      id: 1,
      firstName: 'Vasya',
      lastName: 'Pupkin',
      address: {
        city: 'Moscow',
        street: 'Gogolya',
        index: 123321,
        flat: 74,
        geo: [12321, 32123],
      },
    };
    const user = new User(data);
    expect(user).toMatchSnapshot();
    expect(user.address.inline).toMatchSnapshot();
  });
});
