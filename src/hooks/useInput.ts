import React, { useCallback, useState } from 'react';

const useInput = <T>(value: T): [T, (e: any) => void, React.Dispatch<React.SetStateAction<T>>] => {
  const [data, setData] = useState(value);
  const callback = useCallback(
    (e: any) => {
      setData(e.target.value);
    },
    [data],
  );

  return [data, callback, setData];
};

export default useInput;
