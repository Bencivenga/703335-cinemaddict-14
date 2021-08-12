import {createElement} from '../utils/common';
import {getProfileRating} from '../utils/profile-rating';

const createHeaderProfileTemplate = (films) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${getProfileRating(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class HeaderProfile {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._films);
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
