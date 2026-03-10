declare module 'storage-utilities' {
  interface StorageUtils {
    stringify(value: unknown): string
    parse(value: string): unknown
  }

  const storageUtils: StorageUtils
  export default storageUtils
}
