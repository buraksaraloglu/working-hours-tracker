import { useCallback } from 'react';
import { getMany, setMany } from 'idb-keyval';


import { WorkingDay } from '../shared/utils';
import { useUserData } from './useUserData';

type SubmitProps = {
  [key: string]: number,
};

type LogWorkingHours = {
  getLoggedHours: (dates: WorkingDay[]) => Promise<string[]>,
  submit: (values: SubmitProps) => Promise<void>
}

export const useLogWorkingHours = (): LogWorkingHours => {
  const { data } = useUserData();
  const { username } = data;


  const getLoggedHours = useCallback(async (dates: WorkingDay[]): Promise<string[]> => {
    if (!username) return [];
    const hashedDates = dates.map((date) => `${username}_${date.toISOString()}`);
    const loggedHours = await getMany(hashedDates);

    return loggedHours;
  }, [username]);

  const submit = useCallback(async (values: SubmitProps): Promise<void> => {
    const hashedValues = {};
    
    Object.keys(values).forEach((key) => {
      if (!values[key]) return;

      const hashedKey = `${username}_${key}`;
      hashedValues[hashedKey] = values[key];
    });

    await setMany(Object.entries(hashedValues))

    console.log('---> Request body to send to the server:', { data: hashedValues });
  }, [username]);

  return {
    getLoggedHours,
    submit,
  }
}