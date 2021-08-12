const filmsToFilterMap = {
  watchlist: (films) => films.filter((film) => film.isInWatchList).length,
  history: (films) => films.filter((film) => film.isWatched).length,
  favorites: (films) => films.filter((film) => film.isFavorite).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, filmsCount]) => {
    return {
      name: filterName,
      count: filmsCount(films),
    };
  });
};
