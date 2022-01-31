declare module '@biorate/lifecycled' {
  export function lifecycled(
    root: {},
    onInit?: (object: {}) => {},
    onKill?: (object: {}) => {},
  );
  export function init();
  export function kill();
  export function on(event: string);
}
