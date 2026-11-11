export interface Logger {
  ok: (msg: string) => void;
  notice: (msg: string) => void;
  warn: (msg: string) => void;
  err: (msg: string) => void;
  log: (msg: string) => void;
  colorful: (msg: string) => void;
}
export interface Prompter<Q, T> {
  prompt: (arg0: Q) => Promise<T>;
}
export interface RenderedAction {
  file?: string;
  // frontmatter attributes are user-defined and unconstrained by shape
  attributes: Record<string, any>;
  body: string;
}
export interface RunnerConfig {
  exec: (sh: string, body: string) => void;
  templates?: string;
  templatesOverride?: string;
  cwd: string;
  logger: Logger;
  debug?: boolean;
  helpers?:
    | Record<string, any>
    | ((locals: any, config: RunnerContextConfig) => Record<string, any>);
  localsDefaults?: Record<string, any>;
  createPrompter: <Q, T>() => Prompter<Q, T>;
}

/**
 * @description A subset of `RunnerConfig` that user-supplied `helpers` may receive
 * when context is built without a fully resolved runner configuration. */
export type RunnerContextConfig = Partial<RunnerConfig>;

export interface ResolverIO {
  exists: (arg0: string) => Promise<boolean>;
  load: (arg0: string) => Promise<Record<string, any>>;
  none: (arg0: string) => Record<string, any>;
}

export type ActionResult = Record<string, any>;

export interface RunnerResult {
  success: boolean;
  time: number;
  actions: ActionResult[];
  failure?: {
    message: string;
    availableActions: string[];
  };
}

export type ParamsResult = {
  templates: string | undefined;
  generator: string | undefined;
  action: string | undefined;
  subaction?: string;
  actionfolder?: string;
  name?: string;
  dry?: boolean;
} & object;
