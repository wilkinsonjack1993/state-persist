# state-persist

Lightweight react hooks library providing and abstraction for persisting state in either Local or Session storage.

- Typescript Support
- Automatic persistance of state to either local or session storage
- Option to have live updating of state across browser windows using storage event listener

## Installation

With npm:

`npm install state-persist`

or with yarn:

`yarn add state-persist`

## Live Mode

When not in Live mode, the state is only initially fetched from localStorage/sessionStorage on instantiation. The hook will continue to update the value in localStorage when setState is called, but if another source changes the value in localStorage,the hook will not update.

However, in Live Mode, when the value is updated in storage, all instances of the hooks that have the same storageKey, will update if the value in their state is different. This works between different browser windows.

## Usage

### Using LocalStorage:

```jsx
import { useStorageState } from 'state-persist';

const [state, setState, clear] = useStorageState('storageKey', 'Default value');
```

If you want the live updating version, where if you update a localStorage key using setState, all hook instances with the same storageKey will automatically update across all broswer windows:

```jsx
import { useLiveStorageState } from 'state-persist';

const [state, setState, clear] = useLiveStorageState(
  'storageKey',
  'Default value'
);
```

### Using SessionStorage:

```jsx
import { useSessionState } from 'state-persist';

const [state, setState, clear] = useSessionState('storageKey', 'Default value');
```

If you want the live updating version, where if you update a localStorage key using setState, all hook instances with the same storageKey will automatically update across all broswer windows:

```jsx
import { useLiveSessionState } from 'state-persist';

const [state, setState, clear] = useLiveSessionState(
  'storageKey',
  'Default value'
);
```

## API

```jsx
const [state, setState, clear] = useStorageState(storageKey, defaultValue);

const [state, setState, clear] = useLiveStorageState(storageKey, defaultValue);

const [state, setState, clear] = useSessionState(storageKey, defaultValue);

const [state, setState, clear] = useLiveSessionState(storageKey, defaultValue);
```

### Input Types

- storageKey: string - The key that will be used for either local or session

- defaultValue: any - Optional - The default value if no value is present in local/session storage. Can be any value that can be stringified.
