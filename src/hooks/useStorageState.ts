import { useState, useEffect } from 'react';

export const useBaseStorageState = (
  storage: Storage,
  storageKey: string,
  defaultValue: any,
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

export const useStorageState = (
  storageKey: string,
  defaultValue: any,
  live?: boolean
) => useBaseStorageState(localStorage, storageKey, defaultValue, live);

export const useLiveStorageState = (storageKey: string, defaultValue: any) =>
  useStorageState(storageKey, defaultValue, true);

export const useSessionState = (
  storageKey: string,
  defaultValue: any,
  live?: boolean
) => useBaseStorageState(sessionStorage, storageKey, defaultValue, live);

export const useLiveSessionState = (storageKey: string, defaultValue: any) =>
  useStorageState(storageKey, defaultValue, true);

function setStateBuilder(
  state: any,
  setState: (newState: any) => void,
  live: boolean,
  storageKey: string
) {
  return (newState: any) => {
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

export function handleStorageEvent(
  storageKey: string,
  setState: (newState: any) => void
) {
  return (evt: StorageEvent) => {
    if (evt.key === storageKey && evt.newValue !== evt.oldValue) {
      setState(evt.newValue ? JSON.parse(evt.newValue) : evt.newValue);
    }
  };
}
