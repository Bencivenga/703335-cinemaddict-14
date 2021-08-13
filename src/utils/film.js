export const checkGenresLength = (genres) => {
  return genres.length > 1 ? 'Genres' : 'Genre';
};

export const sortFilmsByRating = (films) => {
  return films.slice().sort((a, b) => a.audienceScore > b.audienceScore ? -1 : 1);
};

export const sortFilmsByComments = (films) => {
  return films.slice().sort((a, b) => a.comments.size > b.comments.size ? -1 : 1);
};
