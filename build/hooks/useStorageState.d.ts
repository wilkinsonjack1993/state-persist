export declare const useBaseStorageState: (storage: Storage, storageKey: string, defaultValue: any, live?: boolean) => any[];
export declare const useStorageState: (storageKey: string, defaultValue: any, live?: boolean | undefined) => any[];
export declare const useLiveStorageState: (storageKey: string, defaultValue: any) => any[];
export declare const useSessionState: (storageKey: string, defaultValue: any, live?: boolean | undefined) => any[];
export declare const useLiveSessionState: (storageKey: string, defaultValue: any) => any[];
export declare function handleStorageEvent(storageKey: string, setState: (newState: any) => void): (evt: StorageEvent) => void;
