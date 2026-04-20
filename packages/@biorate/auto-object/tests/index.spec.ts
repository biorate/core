import { expect } from 'vitest';
import { User, Event, Pet, PetArray } from './__mocks__';

describe('@biorate/auto-object', function () {
  it('AutoObject', () => {
    const data = {
      id: 1,
      firstName: 'Vasya',
      address: {
        city: 'Moscow',
        street: 'Gogol str.',
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

  it('AutoArray::create', () => {
    const pets = new PetArray({ type: 'cat' });
    pets.push({ type: 'dog' });
    pets.push(new Pet({ type: 'fox' }));
    expect(pets).toMatchSnapshot();
  });

  it('AutoArray::slice', () => {
    const pets = new PetArray({ type: 'cat' }, { type: 'dog' }, { type: 'fox' });
    const part = pets.slice(0, 2);
    expect(part).toMatchSnapshot();
    expect(part.test()).toMatchSnapshot();
  });

  it('AutoArray::splice', () => {
    const pets = new PetArray({ type: 'cat' }, { type: 'dog' }, { type: 'fox' });
    const part = pets.splice(1, 2, { type: 'bird' });
    expect(part).toMatchSnapshot();
    expect(part.test()).toMatchSnapshot();
  });

  it('AutoArray::concat', () => {
    const pets = new PetArray({ type: 'cat' }, { type: 'dog' }, { type: 'fox' });
    const result = pets.concat({ type: 'bird' }, { type: 'iguana' });
    expect(result).toMatchSnapshot();
    expect(result.test()).toMatchSnapshot();
  });
});
