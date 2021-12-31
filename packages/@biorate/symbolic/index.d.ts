declare module '@biorate/symbolic' {
  type Proxify = (namespace: string) => Proxify & { [key: string]: symbol };
  export function create(label: string): { [key: string]: symbol };
  export const Global: Proxify;
}
