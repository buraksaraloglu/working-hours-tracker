import { ChangeEvent, FC } from 'react';
import type { Moment } from 'moment';

export type WorkedHoursChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;

export const WorkedHoursInput: FC<{
  date: Moment,
  value: number,
  onChange: WorkedHoursChangeHandler
}> = ({ date, value, onChange }) => {
  const name = date.toISOString();

  return (
    <div className='flex flex-col my-1 md:mx-2'>
      <label htmlFor={name}>
        {date.format('ddd - MM.DD.')}
      </label>
      <div className='flex items-center'>
        <input
          name={name}
          type='number'
          min={0}
          max={24}
          value={value}
          onChange={onChange}
          placeholder='Hours'
          className='max-w-xs w-full md:w-24 rounded-lg border-2 border-gray-300 px-2 py-1'
        />
        <p className='ml-2'>hours</p>
      </div>
    </div>
  );
}