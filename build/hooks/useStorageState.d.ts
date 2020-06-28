export declare const useBaseStorageState: <T>(storage: Storage, storageKey: string, defaultValue: T, live?: boolean) => any[];
export declare const useStorageState: <T>(storageKey: string, defaultValue: T) => any[];
export declare const useLiveStorageState: <T>(storageKey: string, defaultValue: T) => any[];
export declare const useSessionState: <T>(storageKey: string, defaultValue: T) => any[];
export declare const useLiveSessionState: <T>(storageKey: string, defaultValue: T) => any[];
export declare function handleStorageEvent<T>(storageKey: string, setState: (newState: T) => void): (evt: StorageEvent) => void;
