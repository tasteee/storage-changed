# storage-changed

A lightweight utility that intercepts `localStorage` and `sessionStorage` mutations and dispatches `CustomEvent`s on the `window` object whenever items are set or removed.

## Installation

```bash
npm install storage-changed
```

## Usage

```ts
import storageChanged from 'storage-changed'

// Listen for changes to localStorage
storageChanged('local')

// Listen for changes to sessionStorage
storageChanged('session')

// Pass a storage object directly
storageChanged(window.localStorage)

// Listen for the dispatched events
window.addEventListener('localStorageChanged', (event) => {
  console.log('Storage changed:', event.detail)
})
```

### Options

| Option      | Type     | Default                          | Description                                      |
|-------------|----------|----------------------------------|--------------------------------------------------|
| `eventName` | `string` | `<target>StorageChanged`         | Name of the CustomEvent to dispatch.             |
| `timeout`   | `number` | `150` (ms)                       | Max time (in ms) to wait for the value to sync.  |

```ts
storageChanged('local', {
  eventName: 'myCustomEvent',
  timeout: 300,
})
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Type-check without emitting
npm run lint

# Watch mode
npm run dev
```

## License

MIT
