import { expect } from 'chai';
import { User, Event } from './__mocks__';

describe('@biorate/auto-object', function () {
  it('AutoObject', () => {
    const data = {
      id: 1,
      firstName: 'Vasya',
      lastName: 'Pupkin',
      address: {
        city: 'Moscow',
        street: 'Gogol str.',
        postal: 123321,
        apartment: 74,
        geo: [12321, 32123],
      },
    };
    const user = new User(data);
    expect(user).toMatchSnapshot();
    expect(user.address.inline).toMatchSnapshot();
  });

  it('AutoObject.extends', () => {
    const data = {
      name: 'user',
      payload: {
        id: 1,
        firstName: 'Vasya',
        lastName: 'Pupkin',
        address: {
          city: 'Moscow',
          street: 'Gogol str.',
          postal: 123321,
          apartment: 74,
          geo: [12321, 32123],
        },
      },
    };
    const event = new Event(data);
    expect(event).toMatchSnapshot();
  });
});
