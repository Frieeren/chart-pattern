import { useState } from 'react';

type ReturnTypeToggle = [boolean, () => void];

export function useToggle(initialValue = false): ReturnTypeToggle {
  const [value, setValue] = useState(initialValue);

  const handleToggle = () => {
    setValue(!value);
  };

  return [value, handleToggle];
}
