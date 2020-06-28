import { renderHook, act } from '@testing-library/react-hooks';
import {
  useStorageState,
  useLiveStorageState,
  useSessionState,
  useLiveSessionState,
  handleStorageEvent
} from '../useStorageState';

describe.each([
  [useStorageState, useLiveStorageState, localStorage],
  [useSessionState, useLiveSessionState, sessionStorage]
])('useStorageStorage tests', (stateHook, liveStateHook, storage) => {
  beforeEach(() => {
    // Clear stateHookstorage after each run
    storage.clear();
    jest.resetAllMocks();
  });

  test.each([[undefined], [null], ['String'], [34], [{ obj: { x: 'yz' } }]])(
    'Initial value calls stateHookstorage then sets stateHookstorage.',
    (defaultValue: any) => {
      const TEST_KEY = 'testKey';

      const { result } = renderHook(() => stateHook(TEST_KEY, defaultValue));

      const [state] = result.current;
      expect(state).toEqual(defaultValue);

      expect(storage.getItem).toHaveBeenCalledWith(TEST_KEY);
      expect(storage.setItem).toHaveBeenCalledWith(
        TEST_KEY,
        JSON.stringify(defaultValue)
      );
    }
  );

  test('Calling set state updates stateHookstorage.', () => {
    const TEST_KEY = 'testKey';
    const START_VALUE = 'start';
    const UPDATED_VALUE = 'updated';

    const { result } = renderHook(() => stateHook(TEST_KEY, START_VALUE));

    act(() => {
      const [, setState] = result.current;
      storage.clear();
      setState(UPDATED_VALUE);
    });

    const [state] = result.current;
    expect(state).toEqual(UPDATED_VALUE);
    expect(storage.setItem).toHaveBeenCalledWith(
      TEST_KEY,
      JSON.stringify(UPDATED_VALUE)
    );
  });

  test('Calling clear on removes from stateHookstorage', () => {
    const TEST_KEY = 'testKey';
    const START_VALUE = 'start';

    const { result } = renderHook(() => stateHook(TEST_KEY, START_VALUE));

    act(() => {
      const [, , clear] = result.current;
      clear();
    });

    expect(storage.removeItem).toHaveBeenCalledWith(TEST_KEY);
  });

  test.each([[null], ['String'], [34]])(
    'Gets state from storage on instantiation.',
    (initialValue: any) => {
      const TEST_KEY = 'testKey';

      (storage.getItem as any).mockImplementation(() =>
        JSON.stringify(initialValue)
      );

      // Second render should get storage of first render
      const { result } = renderHook(() => stateHook(TEST_KEY, 'New value'));

      const [state] = result.current;

      expect(state).toEqual(initialValue);
    }
  );

  test.each([[undefined]])(
    'Setting storage as undefined returns default value.',
    (initialValue: any) => {
      const TEST_KEY = 'testKey';
      const NEW_VALUE = 'New value';

      (storage.getItem as any).mockImplementation(() =>
        JSON.stringify(initialValue)
      );

      // Second render should get storage of first render
      const { result } = renderHook(() => stateHook(TEST_KEY, NEW_VALUE));

      const [state] = result.current;

      expect(state).toEqual(NEW_VALUE);
    }
  );

  test('Object retrieved from storage', () => {
    const TEST_KEY = 'testKey';
    const obj = { x: 2, y: 'abc' };

    (storage.getItem as any).mockImplementation(() => JSON.stringify(obj));

    // Second render should get storage of first render
    const { result } = renderHook(() => stateHook(TEST_KEY, 'New value'));

    const [state] = result.current;

    expect(state.x).toEqual(obj.x);
    expect(state.y).toEqual(obj.y);
  });

  test('Live updating', () => {
    const TEST_KEY = 'testKey';
    const INITIAL_VALUE = 'Initial value';
    const NEXT_VALUE = 'Next value';

    const eventDispatcher = jest.fn();
    (global as any).dispatchEvent = eventDispatcher;

    // Hook we will use set state on
    const { result: result1 } = renderHook(() =>
      liveStateHook(TEST_KEY, INITIAL_VALUE)
    );

    const [, setState] = result1.current;
    act(() => {
      // Update Hook 1
      setState(NEXT_VALUE);
    });

    expect(eventDispatcher).toHaveBeenCalled();
    console.log(eventDispatcher.mock.calls[0][0]);
    expect(eventDispatcher.mock.calls[0][0].key).toEqual(TEST_KEY);
    expect(eventDispatcher.mock.calls[0][0].oldValue).toEqual(
      JSON.stringify(INITIAL_VALUE)
    );
    expect(eventDispatcher.mock.calls[0][0].newValue).toEqual(
      JSON.stringify(NEXT_VALUE)
    );

    const [newState1] = result1.current;
    expect(newState1).toEqual(NEXT_VALUE);
  });

  test.each([['new'], [null]])(
    'handleStorageEvent new value',
    (newValue: string | null) => {
      const KEY = 'ANY';
      const setState = jest.fn();
      const oldValue = 'old';

      const event = new StorageEvent(`state-persist-${KEY}`, {
        key: KEY,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(newValue)
      });

      const eventHandler = handleStorageEvent(KEY, setState);

      eventHandler(event);

      expect(setState).toHaveBeenCalled();
      expect(setState.mock.calls[0][0]).toEqual(newValue);
    }
  );

  test('handleStorageEvent existing value', () => {
    const KEY = 'ANY';
    const setState = jest.fn();
    const oldValue = 'old';

    const event = new StorageEvent(`state-persist-${KEY}`, {
      key: KEY,
      oldValue: JSON.stringify(oldValue),
      newValue: JSON.stringify(oldValue)
    });

    const eventHandler = handleStorageEvent(KEY, setState);

    eventHandler(event);
    expect(setState).toHaveBeenCalledTimes(0);
  });
});
