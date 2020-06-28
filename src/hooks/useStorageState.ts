import { useState, useEffect } from 'react';

export const useBaseStorageState = <T>(
  storage: Storage,
  storageKey: string,
  defaultValue: T,
  live = false
) => {
  // Get value from storage, if not use default value
  const [state, setState] = useState(() => {
    const storageValue = storage.getItem(storageKey);
    return storageValue ? JSON.parse(storageValue) : defaultValue;
  });

  useLiveStorageListners(
    live,
    handleStorageEvent(storageKey, setState),
    storageKey
  );

  // On change set storage.
  useEffect(() => {
    storage.setItem(storageKey, JSON.stringify(state));
  }, [storageKey, state]);

  const clear = () => {
    storage.removeItem(storageKey);
  };

  const setStateExternal = setStateBuilder(state, setState, live, storageKey);

  return [state, setStateExternal, clear];
};

export const useStorageState = <T>(storageKey: string, defaultValue: T) =>
  useBaseStorageState(localStorage, storageKey, defaultValue, false);

export const useLiveStorageState = <T>(storageKey: string, defaultValue: T) =>
  useBaseStorageState(localStorage, storageKey, defaultValue, true);

export const useSessionState = <T>(storageKey: string, defaultValue: T) =>
  useBaseStorageState(sessionStorage, storageKey, defaultValue, false);

export const useLiveSessionState = <T>(storageKey: string, defaultValue: T) =>
  useBaseStorageState(sessionStorage, storageKey, defaultValue, true);

function setStateBuilder<T>(
  state: T,
  setState: (newState: T) => void,
  live: boolean,
  storageKey: string
) {
  return (newState: T) => {
    const oldValue = JSON.stringify(state);
    setState(newState);
    if (live) {
      const event = new StorageEvent(`state-persist-${storageKey}`, {
        key: storageKey,
        oldValue,
        newValue: JSON.stringify(newState)
      });
      window.dispatchEvent(event);
    }
  };
}

function useLiveStorageListners(
  live: boolean,
  handleStorageEvent: (evt: StorageEvent) => void,
  storageKey: string
) {
  useEffect(() => {
    if (live) {
      window.addEventListener('storage', handleStorageEvent);
      window.addEventListener(
        `state-persist-${storageKey}`,
        handleStorageEvent
      );
      return () => {
        window.removeEventListener('storage', handleStorageEvent);
        window.removeEventListener(
          `state-persist-${storageKey}`,
          handleStorageEvent
        );
      };
    } else {
      window.removeEventListener('storage', handleStorageEvent);
    }
    return;
  }, [live, storageKey]);
}

export function handleStorageEvent<T>(
  storageKey: string,
  setState: (newState: T) => void
) {
  return (evt: StorageEvent) => {
    if (evt.key === storageKey && evt.newValue !== evt.oldValue) {
      setState(evt.newValue ? JSON.parse(evt.newValue) : evt.newValue);
    }
  };
}
