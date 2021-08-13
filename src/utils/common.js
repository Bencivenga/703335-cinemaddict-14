import dayjs from 'dayjs';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const getUniqueValues = (array) => {
  return [...new Set(array)];
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => {
  const randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const getRandomArraySize = (min, max, array) => {
  const randomArray = new Array(getRandomInteger(min, max)).fill().map(() => getRandomArrayElement(array));
  return getUniqueValues(randomArray);
};

export const getRandomFloat = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const num = lower + Math.random() * (upper - lower);

  return +num.toFixed(1);
};

export const getTruncatedText = (text) => {
  return text.length > 140 ? `${text.substring(0, 139)}...` : text;
};

export const getRandomDate = (start, end, format = 'YYYY/MM/DD HH:mm') => {
  const newDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return dayjs(newDate).format(format);
};

export const getHumanizedDuration = (minsTotal) => {
  const hours = Math.floor(minsTotal / 60);
  const mins = minsTotal % 60;
  const hoursOutput = hours ? hours + 'h ' : '';

  return hoursOutput + mins + 'm';
};

export const formatDateToYearOnly = (date) => {
  return dayjs(date).format('YYYY');
};

export const getUniqId = function () {
  return `-${Math.random().toString(36).substr(2, 9)}`;
};

export const capitalizeFirstChar = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
