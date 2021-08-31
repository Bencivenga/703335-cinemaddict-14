import dayjs from 'dayjs';

export const checkGenresLength = (genres) => {
  return genres.length > 1 ? 'Genres' : 'Genre';
};

export const sortFilmsByRating = (filmA, filmB) => {
  return filmA.audienceScore > filmB.audienceScore ? -1 : 1;
};

export const sortFilmsByDate = (filmA, filmB) => {
  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};

export const sortFilmsByComments = (films) => {
  return films.filter((film) => film.comments).sort((a, b) => a.comments.size > b.comments.size ? -1 : 1);
};
