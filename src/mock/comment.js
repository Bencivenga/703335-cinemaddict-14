import {NAMES, COMMENTS, EMOJIS} from '../data';
import {getRandomInteger, getRandomArrayElement, getUniqId, getRandomDate} from '../utils/common';

const COMMENTS_COUNT = getRandomInteger(5, 10);

const generateComment = (id) => {
  return {
    id: `comment${id}`,
    author: `${getRandomArrayElement(NAMES)}`,
    comment: `${getRandomArrayElement(COMMENTS)}`,
    date: getRandomDate(new Date(2021, 1, 31), new Date(2021, 8, 10)),
    emoji: `${getRandomArrayElement(EMOJIS)}`,
  };
};

export const generateCommentsList = () => {
  return new Array(COMMENTS_COUNT).fill().map(() => generateComment(getUniqId()));
};
