interface InternalPromise<P> {
  promise?: Promise<P>
  resolve?: (value?: P | PromiseLike<P> | undefined) => void
  reject?: (reason?: any) => void
}

export type FlattenedPromise<P> = {
  [K in keyof InternalPromise<P>]-?: InternalPromise<P>[K]
}

export default function getFlattenedPromise<P>(): FlattenedPromise<P> {
  const result: InternalPromise<P> = {}

  result.promise = new Promise<P>((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })

  return result as FlattenedPromise<P>
}
