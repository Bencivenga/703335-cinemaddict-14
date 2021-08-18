import FilmCardView from '../view/film-card';
import FilmCardPopupView from '../view/film-card-popup';
import {render, remove} from '../utils/render';

export default class Film {
  constructor(filmsListContainer, bodyContainer) {
    this._filmsListContainer = filmsListContainer;
    this._bodyContainer = bodyContainer;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
    this._onSpareSpaceClickHandler = this._onSpareSpaceClickHandler.bind(this);
    this._onFilmPopupCloseHandler = this._onFilmPopupCloseHandler.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._commments = comments;
    this._filmComponent = new FilmCardView(film);
    this._filmComponent.setFilmCardClickHandler(this._handleFilmCardClick);

    render(this._filmsListContainer, this._filmComponent);
  }

  _renderFilmPopup(film, comments) {
    this._filmPopupComponent = new FilmCardPopupView(film, comments);

    this._filmPopupComponent.setPopupCloseButtonClickHandler(this._onFilmPopupCloseHandler);

    render(this._bodyContainer, this._filmPopupComponent);
    document.addEventListener('keydown', this._onEscKeyDownHandler);

    if (document.querySelector('.film-details')) {
      document.addEventListener('click', this._onSpareSpaceClickHandler);
    }
  }

  _handleFilmCardClick() {
    const popupElement = document.querySelector('.film-details');

    if (!popupElement) {
      this._bodyContainer.classList.add('hide-overflow');
      this._renderFilmPopup(this._film, this._commments);
    }
  }

  _onFilmPopupCloseHandler() {
    this._bodyContainer.classList.remove('hide-overflow');
    remove(this._filmPopupComponent);
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
    document.removeEventListener('click', this._onSpareSpaceClickHandler);
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._onFilmPopupCloseHandler();
    }
  }

  _onSpareSpaceClickHandler(evt) {
    const {target} = evt;
    const popupTarget = target.closest('.film-details');
    const cardTarget = target.closest('.film-card');

    if (!popupTarget && !cardTarget) {
      this._onFilmPopupCloseHandler();
    }
  }
}
