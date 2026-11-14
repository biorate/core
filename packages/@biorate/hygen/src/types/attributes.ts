/**
 * @description The rendered frontmatter attributes of a template action. Most
 * keys are user-defined and unconstrained (anything written in the frontmatter
 * block is preserved); the well-known keys below are documented so templates and
 * operations can rely on their semantics. Global attributes are declared on the
 * template frontmatter and drive a single action; glob attributes declare a
 * batch action that expands into one action per matched file.
 */
export interface ActionAttributes {
  /** @description Write target path, relative to `cwd` (overwrite is the default). */
  to?: string;
  /** @description Opt-in mirroring: derive the target from the template file path. */
  mirror?: boolean;
  /** @description A shell command to run instead of writing a file. */
  sh?: string;
  /** @description Glob pattern, relative to the template's own directory. Declaring
   *  it turns the template into a batch action: each matched file is rendered (in
   *  both its destination path and its content) and written to `to`/`destination`. */
  glob?: string;
  /** @description Path prefix stripped from each matched file's relative path when
   *  computing its destination (for glob batch actions). */
  base?: string;
  /** @description Extension suffixes removed from each matched file's file name when
   *  computing its destination (for glob batch actions). One or more suffix strings,
   *  e.g. `.t`, `.ejs.t`. */
  stripExtensions?: string | string[];
  /** @description Alias for `to`, the destination directory for glob batch actions
   *  (treated as a folder joined with each matched file's rendered relative path). */
  destination?: string;
  /** @description When the destination file already exists, skip the action instead of
   *  overwriting (or prompting to overwrite). */
  skipIfExists?: boolean;
  /** @description Template-rendered conditional skip. The rendered value is
   *  coerced: an empty string or a `false` spelling (case-insensitive, trimmed)
   *  runs the action; a `true` spelling skips it without a reason; any other
   *  non-empty string skips it and is reported as the skip reason. */
  skip?: unknown;
  /** @description Remaining attributes are user-defined and unconstrained by shape. */
  [key: string]: unknown;
}

/**
 * @description A single template action after frontmatter and body have been
 * rendered by EJS. This is the unit that operations (`add`, `inject`, `shell`,
 * …) consume and turn into concrete filesystem/shell effects. */
export interface RenderedAction {
  /** @description Absolute path of the source template file (when written from disk). */
  file?: string;
  /** @description Rendered frontmatter attributes; user-defined and unconstrained by shape. */
  attributes: ActionAttributes;
  /** @description Rendered template body (the file content / operation payload). */
  body: string;
  /** @description Set when the `skip:` attribute rendered truthy: `true` skips
   *  without a reason, while a non-`true` string is the skip reason reported in
   *  the run log. When present, no operation executes for this action. */
  skip?: true | string;
}
