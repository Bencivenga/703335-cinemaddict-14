import {formatDateToYearOnly, getTruncatedText, createElement} from '../utils/common';
import {commentCountTemplate} from '../utils/comment';

const createFilmCardTemplate = (film) => {
  const {title, audienceScore, poster, releaseDate, duration, genres, description, comments, isInWatchList, isWatched, isFavorite} = film;
  const watchListClassName = isInWatchList ? 'film-card__controls-item--active' : '';
  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';
  const areComments = comments === null || comments.size === 0 ? '' : commentCountTemplate(comments);
  console.log(areComments);

  return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${audienceScore}</p>
          <p class="film-card__info">
            <span class="film-card__year">${formatDateToYearOnly(releaseDate)}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getTruncatedText(description)}</p>
          <a class="film-card__comments">${areComments}</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchListClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
