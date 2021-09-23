import { Core, init, log } from '../../';

log.info = null;

export function simple(done) {
  class One extends Core() {
    @init() initialize() {
      done();
    }
  }
  return new One();
}

export const override = {
  child(done) {
    class One extends Core() {
      @init() initialize() {
        done(new Error('[initialize] called twice'));
      }
    }
    class Two extends One {
      @init() initialize() {
        done();
      }
    }
    return new Two();
  },

  parent(done) {
    class One extends Core() {
      @init() initialize() {
        done();
      }
    }
    class Two extends One {
      @init() initialize() {
        done(new Error('[initialize] called twice'));
      }
    }
    return new One();
  },
};
