import importedPath from 'path';
import type { ResolverIO } from './types';

// inline fp methods due to perf
const uniq = (arr: string[]) => arr.filter((elem, pos, a) => a.indexOf(elem) === pos);
/**
 * @description Computes the directories from the filesystem root down to `folder`
 * and reverses them so the nearest directory is walked first.
 * @param params - The folder to walk and the path module to use.
 * @returns The reversed, ordered list of directories.
 * */
const reversePathsToWalk = ({
  folder,
  path,
}: {
  folder: string;
  path: typeof importedPath;
}) => {
  const resolved = path.resolve(folder);
  const parts = resolved.split(path.sep);
  const results = parts.map((_, idx, arr) => arr.slice(0, idx + 1).join(path.sep));
  results[0] = results[0] || '/';
  return results.reverse();
};

/**
 * @description Builds the single config-file candidate paths to walk when looking
 * for a config file from a folder up to the filesystem root (nearest first).
 * @param file - The config file name to append to each walked directory.
 * @param folder - The starting folder.
 * @param path - Path module (injected for testability).
 * @returns The ordered, de-duplicated list of candidate paths.
 * */
const configLookup = (
  file: string,
  folder: string,
  path: typeof importedPath = importedPath,
) => uniq(reversePathsToWalk({ folder, path }).map((p) => path.join(p, file)));

/**
 * @description Resolves the nearest project config relative to a directory by
 * walking the tree up, using the supplied `ResolverIO` for existence/loading.
 * Each walked directory is checked for the candidate config-file names in
 * priority order: the nearest directory wins, and within a directory the first
 * existing candidate (by array order) is used. `load` is called once for the
 * winning file; if no candidate exists anywhere, `none` is returned.
 * */
class ConfigResolver {
  /** @description Config file names searched for, in priority order, in each directory. */
  configFiles: string[];

  /** @description I/O primitives used to test existence and load the config. */
  io: ResolverIO;

  /** @description Create a resolver for the given config file names and I/O. */
  constructor(configFiles: string[], io: ResolverIO) {
    this.configFiles = configFiles;
    this.io = io;
  }

  /**
   * @description Resolve the nearest config starting from `from`, loading the first
   * existing candidate (nearest directory first, then priority order) or falling
   * back to `none`.
   * @param from - The starting directory.
   * @returns The loaded config object.
   * */
  async resolve(from: string) {
    const { exists, load, none } = this.io;
    for (const dir of reversePathsToWalk({ folder: from, path: importedPath })) {
      for (const file of this.configFiles) {
        const candidate = importedPath.join(dir, file);
        if (await exists(candidate)) {
          return load(candidate);
        }
      }
    }
    return none(from);
  }
}

export { configLookup, ConfigResolver, reversePathsToWalk };
