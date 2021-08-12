export const getProfileRating = (films) => {
  const filmsWatched = films.filter((film) => film.isWatched).length;

  if (filmsWatched === 0) {
    return '';
  } else if (filmsWatched >= 1 && filmsWatched <= 10) {
    return 'novice';
  } else if (filmsWatched >= 11 && filmsWatched <= 20) {
    return 'fan';
  } else {
    return 'movie buff';
  }
};
