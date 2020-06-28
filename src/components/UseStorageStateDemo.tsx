import React, { useState, ChangeEvent } from 'react';
import { useStorageState } from '../hooks/useStorageState';

const KEY = 'demoKey';

export const UseStorageStateDemo = () => {
  const [live, setLive] = useState(false);

  const [state, setState, clear] = useStorageState(
    'demoKey',
    'Initial value',
    live
  );

  const [state2] = useStorageState(KEY, 'Other initial value', live);

  return (
    <>
      <>Current state is: {state}</>
      <br />
      <br />
      <input
        type="checkbox"
        id="live"
        name="live"
        onChange={() => setLive(!live)}
      />
      <label> Is live updating</label>
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
