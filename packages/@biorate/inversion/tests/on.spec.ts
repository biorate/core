import { assert } from 'chai';
import { EventEmitter } from 'events';
import { Core, on, inject, injectable, container } from '../src';

describe('Core', () => {
  describe('on', () => {
    it('simple', (done) => {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      const obj = new One();
      obj.$run().then(() => obj.emit(event));
    });

    it('override (Child create)', (done) => {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done(new Error('[test] called twice'));
        }
      }
      class Two extends One {
        @on(event) test() {
          done();
        }
      }
      const obj = new Two();
      obj.$run().then(() => obj.emit(event));
    });

    it('override (Parent create)', (done) => {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      class Two extends One {
        @on(event) test() {
          done(new Error('[test] called twice'));
        }
      }
      const obj = new One();
      obj.$run().then(() => obj.emit(event));
    });

    it('in parent (Child create)', (done) => {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      class Two extends One {
        test() {
          done(new Error('[test] called twice'));
        }
      }
      const obj = new One();
      obj.$run().then(() => obj.emit(event));
    });

    it('in parent (Parent create)', (done) => {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      class Two extends One {
        test() {
          done(new Error('[test] called twice'));
        }
      }
      const obj = new Two();
      obj.$run().then(() => obj.emit(event));
    });
  });
});
