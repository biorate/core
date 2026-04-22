import { expect } from 'vitest';
import {
  User,
  Event,
  Pet,
  PetArray,
  UserPets,
  UserPetsComplex,
  PetWithToysArray,
  PetWithToys,
  ToyArray,
  Toy,
} from './__mocks__';

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

  it('AutoArray::array args', () => {
    const result = new PetArray([{ type: 'cat' }, { type: 'dog' }, { type: 'fox' }]);
    expect(result).toMatchSnapshot();
    expect(result.test()).toMatchSnapshot();
  });

  it('AutoObject:AutoArray', () => {
    const data = {
      firstName: 'Vasya',
      pets: [{ type: 'cat' }, { type: 'dog' }, { type: 'fox' }],
    };
    const userPets = new UserPets(data);
    expect(userPets.pets instanceof PetArray).toBe(true);
    expect(userPets.pets.test()).toBe('Hello world!');
    expect(userPets).toMatchSnapshot();
  });

  it('AutoObject:AutoArray (already AutoArray instance)', () => {
    const data = {
      firstName: 'Vasya',
      pets: [{ type: 'cat' }, { type: 'dog' }],
    };
    const userPets = new UserPets(data);
    expect(userPets.pets instanceof PetArray).toBe(true);
    expect(userPets.pets.test()).toBe('Hello world!');
    expect(userPets.pets.length).toBe(2);
  });

  it('AutoArray supports passing array as args', () => {
    const pets = new PetArray({ type: 'cat' });
    pets.push([{ type: 'dog' }, { type: 'fox' }]);
    expect(pets.length).toBe(3);
    expect(pets.test()).toBe('Hello world!');
  });

  it('Complex nested structure (AutoObject/AutoArray recursion)', () => {
    const data = {
      firstName: 'Vasya',
      pets: [
        {
          type: 'cat',
          toys: [{ name: 'ball' }, { name: 'mouse' }],
        },
        new PetWithToys({
          type: 'dog',
          toys: new ToyArray({ name: 'stick' }, { name: 'bone' }),
        }),
      ],
    };
    const user = new UserPetsComplex(data);
    expect(user.pets instanceof PetWithToysArray).toBe(true);
    expect(user.pets[0] instanceof PetWithToys).toBe(true);
    expect(user.pets[0].toys instanceof ToyArray).toBe(true);
    expect(user.pets[0].toys.names()).toBe('ball,mouse');
    expect(user.pets[1].toys.names()).toBe('stick,bone');
    // also check AutoArray mutations keep shape
    user.pets[1].toys.push({ name: 'rope' });
    expect(user.pets[1].toys.names()).toBe('stick,bone,rope');

    expect(user).toMatchSnapshot();
  });
});
