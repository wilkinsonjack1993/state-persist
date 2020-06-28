import { useState, useEffect } from 'react';

var useBaseStorageState = function (storage, storageKey, defaultValue, live) {
    if (live === void 0) { live = false; }
    // Get value from storage, if not use default value
    var _a = useState(function () {
        var storageValue = storage.getItem(storageKey);
        return storageValue ? JSON.parse(storageValue) : defaultValue;
    }), state = _a[0], setState = _a[1];
    useLiveStorageListners(live, handleStorageEvent(storageKey, setState), storageKey);
    // On change set storage.
    useEffect(function () {
        storage.setItem(storageKey, JSON.stringify(state));
    }, [storageKey, state]);
    var clear = function () {
        storage.removeItem(storageKey);
    };
    var setStateExternal = setStateBuilder(state, setState, live, storageKey);
    return [state, setStateExternal, clear];
};
var useStorageState = function (storageKey, defaultValue) {
    return useBaseStorageState(localStorage, storageKey, defaultValue, false);
};
var useLiveStorageState = function (storageKey, defaultValue) {
    return useBaseStorageState(localStorage, storageKey, defaultValue, true);
};
var useSessionState = function (storageKey, defaultValue) {
    return useBaseStorageState(sessionStorage, storageKey, defaultValue, false);
};
var useLiveSessionState = function (storageKey, defaultValue) {
    return useBaseStorageState(sessionStorage, storageKey, defaultValue, true);
};
function setStateBuilder(state, setState, live, storageKey) {
    return function (newState) {
        var oldValue = JSON.stringify(state);
        setState(newState);
        if (live) {
            var event_1 = new StorageEvent("state-persist-" + storageKey, {
                key: storageKey,
                oldValue: oldValue,
                newValue: JSON.stringify(newState)
            });
            window.dispatchEvent(event_1);
        }
    };
}
function useLiveStorageListners(live, handleStorageEvent, storageKey) {
    useEffect(function () {
        if (live) {
            window.addEventListener('storage', handleStorageEvent);
            window.addEventListener("state-persist-" + storageKey, handleStorageEvent);
            return function () {
                window.removeEventListener('storage', handleStorageEvent);
                window.removeEventListener("state-persist-" + storageKey, handleStorageEvent);
            };
        }
        else {
            window.removeEventListener('storage', handleStorageEvent);
        }
        return;
    }, [live, storageKey]);
}
function handleStorageEvent(storageKey, setState) {
    return function (evt) {
        if (evt.key === storageKey && evt.newValue !== evt.oldValue) {
            setState(evt.newValue ? JSON.parse(evt.newValue) : evt.newValue);
        }
    };
}

export { handleStorageEvent, useBaseStorageState, useLiveSessionState, useLiveStorageState, useSessionState, useStorageState };
//# sourceMappingURL=index.es.js.map
