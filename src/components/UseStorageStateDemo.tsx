import React, { ChangeEvent } from 'react';
import { useLiveStorageState } from '../hooks/useStorageState';

const KEY = 'demoKey';

export const UseStorageStateDemo = () => {
  const [state, setState, clear] = useLiveStorageState(
    'demoKey',
    'Initial value'
  );

  const [state2] = useLiveStorageState(KEY, 'Other initial value');

  return (
    <>
      <>Current state is: {state}</>
      <br />
      <br />
      Type below to update state:
      <input
        value={state || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setState(event.target.value)
        }
      />
      <br />
      <br />
      <button
        onClick={() => {
          setState(null);
          clear();
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setState(null);
        }}
      >
        Set to Null
      </button>
      <br />
      <br />
      Second hook for same key value: {state2}
    </>
  );
};
