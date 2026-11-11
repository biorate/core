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
 * @description Builds the candidate config-file paths to walk when looking for a
 * `.hygen.js` from a folder up to the filesystem root.
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
 * @description Resolves the nearest `.hygen.js` config relative to a directory
 * by walking up the tree, using the supplied `ResolverIO` for existence/loading.
 * */
class ConfigResolver {
  /** @description Config file name searched for in each directory. */
  configFile: string;

  /** @description I/O primitives used to test existence and load the config. */
  io: ResolverIO;

  /** @description Create a resolver for the given config file name and I/O. */
  constructor(configFile: string, io: ResolverIO) {
    this.configFile = configFile;
    this.io = io;
  }

  /**
   * @description Resolve the nearest config starting from `from`, loading the first
   * existing candidate or falling back to `none`.
   * @param from - The starting directory.
   * @returns The loaded config object.
   * */
  async resolve(from: string) {
    const configCandidates = configLookup(this.configFile, from);
    const { exists, load, none } = this.io;
    for (const candidate of configCandidates) {
      if (await exists(candidate)) {
        return load(candidate);
      }
    }
    return none(from);
  }
}

export { configLookup, ConfigResolver, reversePathsToWalk };
