import { useState, useEffect, useMemo, FC, FormEvent } from 'react';
import moment from 'moment';

import { WorkedHoursInput, WorkedHoursChangeHandler } from '../../components/WorkedHoursInput';

import { getWorkingDaysFromSelectedDay } from '../../shared/utils';
import type { WorkingDay } from '../../shared/utils';
import { useLogWorkingHours } from '../../hooks/useLogWorkingHours';

enum FormStatuses {
  saving,
  saved,
  changed,
  unchanged
}

const LogWorkedHoursForm: FC = () => {
  const [selectedDate, setSelectedDate] = useState<WorkingDay>(moment());
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
  const [values, setValues] = useState<{[key: string]: number}>({});
  const [formStatus, setFormStatus] = useState<FormStatuses>(FormStatuses.unchanged);

  const { getLoggedHours, submit } = useLogWorkingHours();

  const handleSelectDate: WorkedHoursChangeHandler = (e) => {
    e.preventDefault();
    const date = moment(e.target.value);
    setSelectedDate(date);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (values.length === 0) return;

    setFormStatus(FormStatuses.saving);
    await submit(values);
    setFormStatus(FormStatuses.saved);
  }

  const set = (name: string): WorkedHoursChangeHandler => (e) => {
    setValues((prevValues) => ({ ...prevValues, [name]: parseInt(e.target.value, 10) }));
    setFormStatus(FormStatuses.changed);
  }

  useEffect(() => {
    if (selectedDate) {
      // Setting the working days to the selected date
      const workingDaysOfTheSelectedDate = getWorkingDaysFromSelectedDay(selectedDate);
      setWorkingDays(workingDaysOfTheSelectedDate);
      setFormStatus(FormStatuses.unchanged);


      // Getting the logged hours from the server
      getLoggedHours(workingDaysOfTheSelectedDate).then((loggedHours) => {
        const mappedLoggedHours = {};
        loggedHours.forEach((value, index) => {
          if (!value || typeof value !== 'number') return;
          const keyName = workingDaysOfTheSelectedDate[index].toISOString();
          mappedLoggedHours[keyName] = parseInt(value, 10);
        });

        setValues(mappedLoggedHours);
      });
    }
  }, [getLoggedHours, selectedDate]);

  const formButtonText = useMemo(() => {
    switch (formStatus) {
      case FormStatuses.saving:
        return 'Saving...';
        break;
      case FormStatuses.saved:
        return 'Saved ✅';
        break;
      default:
        return 'Save';
        break;
    }
  }, [formStatus]);

  return (
    <main className='flex flex-col'>
      <div className='mx-auto my-4'>
        <h2 className='text-lg'>Please enter the hours you worked below</h2>
        <section className='mx-auto my-4'>
          <label htmlFor='selectedWorkWeek'>Select a date:
            <input
              type='date'
              name='selectedWorkWeek'
              value={selectedDate.format('yyyy-MM-DD')}
              onChange={handleSelectDate}
              className='max-w-xs rounded-lg border-2 border-gray-300 p-2 w-full'
            />
          </label>
        </section>
      </div>

      {workingDays.length 
        ? (
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <div className='flex mx-auto w-full justify-center flex-col md:flex-row'>
              {
                workingDays.map((day) => {
                  const isoDay = day.toISOString();
                  return (
                    <WorkedHoursInput key={isoDay} date={day} value={values[isoDay]} onChange={set(isoDay)} />
                  )
                })
              }
            </div>

            <button
              type='submit'
              className='mx-auto my-6 bg-green-300 hover:bg-green-400 px-4 py-2 rounded-lg transition-all w-full md:w-32 disabled:opacity-70 disabled:hover:bg-green-300 disabled:cursor-not-allowed'
              disabled={formStatus !== FormStatuses.changed}
            >
              {
                formButtonText
              }
            </button>
          </form>
        )
        : null
      }
    </main>
  )
}

export default LogWorkedHoursForm;