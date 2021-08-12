import {createCommentTemplate} from '../utils/comment';
import {createEmojisList} from '../utils/emoji';
import {createElement} from '../utils/common';
import { getUniqueValues } from '../utils/common';

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
      'Robert De Niro',
      'Jack Nicholson',
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
  const watchListClassName = isInWatchList ? 'film-card__controls-item--active' : '';
  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';
  const filmComments = comments ? commentItems.filter((comment) => comments.has(comment.id)) : null;
  console.log(filmComments);
  const uniqueComments = filmComments.filter((item, index, arr) =>
    index === arr.findIndex((i) => i.comment === item.comment)
  );

  console.log(uniqueComments);

//   const res = things.thing = things.thing.filter((thing, index, self) =>
//   index === self.findIndex((t) => (
//     t.place === thing.place && t.name === thing.name
//   ))
// );

  const commentsCount = comments ? uniqueComments.length : 0;
  const commentsTemplate = createCommentTemplate(uniqueComments);
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
              <td class="film-details__term">Genres</td>
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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList ? watchListClassName : ''}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? watchedClassName : ''}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? favoriteClassName : ''}>
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

export default class FilmCardPopup {
  constructor(film, comments) {
    this._element = null;
    this._film = film;
    this._commments = comments;
  }

  getTemplate() {
    return createFilmCardPopupTemplate(this._film, this._commments);
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
