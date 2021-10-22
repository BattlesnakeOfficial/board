import { useEffect, useState } from "react";

export function useLocalStorage(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const localValue = window.localStorage.getItem(key);

    return localValue !== null ? JSON.parse(localValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
