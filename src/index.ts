import storageUtils from 'storage-utilities'

const emit = (target: Storage, detail: Record<string, unknown>, options: Options) => {
  return new Promise<void>((resolve) => {
    let attempts = 0

    const interval = setInterval(() => {
      if (attempts++ >= options.timeout) {
        clearInterval(interval)
        resolve()
        return
      }

      const event = new CustomEvent(options.eventName, { detail })

      if (target[detail.key as string] === detail.value) {
        window.dispatchEvent(event)
        clearInterval(interval)
        resolve()
      }
    }, 10)
  })
}

const getEventName = (options: Partial<Options> & { targetName: string }) => {
  return options.eventName || options.targetName + 'StorageChanged'
}

const getTimeout = (options: Partial<Options>) => {
  return options.timeout ? options.timeout / 10 : 15
}

const getTarget = (storage: string | Storage): Storage => {
  if (typeof storage === 'string') {
    return (window as unknown as Record<string, Storage>)[`${storage}Storage`]
  }

  return storage
}

const getTargetName = (storage: string | Storage): string => {
  return typeof storage === 'string'
    ? storage === 'session'
      ? 'session'
      : `local`
    : storage === window.sessionStorage
      ? 'session'
      : 'local'
}

interface Options {
  targetName: string
  eventName: string
  timeout: number
}

export default (storage: string | Storage, options?: Partial<Options>) => {
  const opts = options || {}

  // Set up missing options.
  const targetName = getTargetName(storage)
  const eventName = getEventName({ ...opts, targetName })
  const timeout = getTimeout(opts)

  const resolvedOpts: Options = { targetName, eventName, timeout }

  // Get correct storage target and ref setItem.
  const target = getTarget(storage)
  const setItem = target.setItem.bind(target)
  const removeItem = target.removeItem.bind(target)

  target.setItem = (key: string, value: string) => {
    const _value = storageUtils.stringify(value)

    emit(target, { key, value: _value, _target: resolvedOpts.targetName }, resolvedOpts)
    setItem(key, _value)
  }

  target.removeItem = (key: string) => {
    emit(target, { key, _target: resolvedOpts.targetName }, resolvedOpts)
    removeItem(key)
  }
}
