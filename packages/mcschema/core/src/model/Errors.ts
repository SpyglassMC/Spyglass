import { Path } from "./Path";

export type PathError = {
  path: Path,
  error: string,
  params?: any[]
}

/**
 * Collects errors from data paths
 */
export class Errors implements Iterable<PathError> {
  private errors: PathError[] = []

  add(path: Path, error: string, ...params: any): false {
    this.errors.push({ path, error, params })
    return false
  }

  get(path: Path, exact = false): PathError[] {
    return exact ? this.errors.filter(e => e.path.equals(path))
      : this.errors.filter(e => e.path.startsWith(path))
  }

  getAll() :PathError[] {
    return this.errors
  }

  clear() {
    this.errors = []
  }

  count() {
    return this.errors.length
  }

  *[Symbol.iterator]() {
    for (const e of this.errors) {
      yield e
    }
  }
}
