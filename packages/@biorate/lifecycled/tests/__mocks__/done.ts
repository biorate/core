export function p(fn: (...args: any[]) => void) {
  return () =>
    new Promise((resolve, reject) => {
      fn((e?: any) => {
        if (e) return void reject(e);
        resolve(void 0);
      });
    });
}

export type Done = (err?: any) => void;
