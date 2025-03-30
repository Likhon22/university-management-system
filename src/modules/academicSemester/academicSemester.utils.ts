import { TMonths } from './academicSemester.interface';

const monthNames: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const validateMonthRange = (startMonth: TMonths, endMonth: TMonths) => {
  const startMonthIndex = monthNames.indexOf(startMonth);
  const endMonthIndex = monthNames.indexOf(endMonth);

  if (startMonthIndex > endMonthIndex) {
    return true;
  }

  return false;
};
