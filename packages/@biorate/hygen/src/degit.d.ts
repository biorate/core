// degit ships no type declarations; declare the minimal surface we consume.
declare module 'degit' {
  export interface DegitOptions {
    mode?: string;
    force?: boolean;
    verbose?: boolean;
    cache?: boolean;
    [key: string]: unknown;
  }
  export interface Degit {
    clone: (dest: string) => Promise<void>;
    on: (event: string, fn: () => void) => void;
  }
  const degit: (src: string, opts?: DegitOptions) => Degit;
  export default degit;
}
