import { useState, ChangeEvent, FormEvent } from 'react';

export const useForm = <T extends Record<string, any>>(
  callback: () => void,
  initialState: T = {} as T
) => {
  const [values, setValues] = useState<T>(initialState);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values
  };
};
