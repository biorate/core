export type IDescribe = (title: string, callback: () => void) => void;

export type ITest<T = () => unknown> = (title: string, callback: T) => void;

export type IBeforeAll = (callback: () => void) => void;

export type IAfterAll = (callback: () => void) => void;

export type IBeforeEach = (callback: () => void) => void;

export type IAfterEach = (callback: () => void) => void;
