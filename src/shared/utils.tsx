import type { Moment } from 'moment';

// Maybe we can group types if they become too big
export type WorkingDay = Moment;

const getStartDateOfAWeekByDay = (day: WorkingDay): WorkingDay => {
  const startOfISOWeek = day.clone().startOf('isoWeek'); // ISO week and working days starts on Monday

  return startOfISOWeek;
};

const getEndDateOfAIsoWeekByDay = (day: WorkingDay): WorkingDay => {
  const endOfISOWeek = day.clone().endOf('isoWeek'); // ISO week ends on Sunday
  const endOfWorkingDays = endOfISOWeek.clone().subtract(2, 'days'); // Work days ends on Friday

  return endOfWorkingDays;
};


export const getWorkingDaysFromSelectedDay = (day: WorkingDay): WorkingDay[] => {
  const startOfWeek = getStartDateOfAWeekByDay(day);
  const endOfWeek = getEndDateOfAIsoWeekByDay(day);

  const dates: WorkingDay[] = [];

  const currentDate = startOfWeek.clone();

  while (currentDate <= endOfWeek) {
    dates.push(currentDate.clone());
    currentDate.add(1, 'days');
  }

  return dates;
};
