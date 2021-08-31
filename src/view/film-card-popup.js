import AbstractView from './abstract';
import {createCommentTemplate} from '../utils/comment';
import {createEmojisList} from '../utils/emoji';
import {checkGenresLength} from '../utils/film';

const createFilmCardPopupTemplate = (film = {}, commentItems) => {
  const {
    title = 'Made For Each Other',
    originalTitle = 'Made For Each Other',
    poster = 'made-for-each-other.png',
    description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    director = 'Alfred Hitchcock',
    screenWriters = [
      'Anne Wigton',
      'Heinz Herald',
      'Richard Weil',
    ],
    actors = [
      'Jack Nicholson',
      'Robert De Niro',
      'Marlon Brando',
    ],
    rating = 'NC-17',
    audienceScore = 8.9,
    releaseDate = '01 April 1995',
    duration = '1h 50m',
    country = 'USA',
    genres = [
      'Drama',
      'Film-Noir',
      'Horror',
    ],
    comments = [],
    isInWatchList = false,
    isWatched = false,
    isFavorite = false,
  } = film;

  console.log(comments);
  console.log(commentItems);
  const watchListStatus = isInWatchList ? 'checked' : '';
  const watchedStatus = isWatched ? 'checked' : '';
  const favoriteStatus = isFavorite ? 'checked' : '';
  const filmComments = comments ? commentItems.filter((comment) => comments.has(comment.id)) : null;
  console.log(filmComments);

  const commentsCount = comments ? filmComments.length : 0;
  const commentsTemplate = createCommentTemplate(filmComments);
  const emojisElement = createEmojisList();

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${rating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${audienceScore}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenWriters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${checkGenresLength(genres)}</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genres.join('</span><span class="film-details__genre">')}</span>
            </tr>
          </table>

          <p class="film-details__film-description">
           ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchListStatus}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedStatus}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteStatus}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojisElement}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmCardPopup extends AbstractView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._commments = comments;
    this._popupCloseButtonClickHandler = this._popupCloseButtonClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardPopupTemplate(this._film, this._commments);
  }

  _popupCloseButtonClickHandler() {
    this._callback.popupCloseButtonClick(this._film, this._commments);
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick(this._film, this._commments);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick(this._film, this._commments);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(this._film, this._commments);
  }

  setPopupCloseButtonClickHandler(callback) {
    this._callback.popupCloseButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._popupCloseButtonClickHandler);
  }

  setPopupWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('input[name="watchlist"]').addEventListener('change', this._watchListClickHandler);
  }

  setPopupWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('input[name="watched"]').addEventListener('change', this._watchedClickHandler);
  }

  setPopupFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('input[name="favorite"]').addEventListener('change', this._favoriteClickHandler);
  }
}
