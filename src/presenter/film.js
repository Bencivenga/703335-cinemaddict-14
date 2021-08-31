import FilmCardView from '../view/film-card';
import FilmCardPopupView from '../view/film-card-popup';
import {render, remove, replace} from '../utils/render';

const PopupMode = {
  ClOSED: 'ClOSED',
  OPENED: 'OPENED',
};

export default class Film {
  constructor(filmsListContainer, bodyContainer, changeData, changePopupMode) {
    this._filmsListContainer = filmsListContainer;
    this._bodyContainer = bodyContainer;
    this._changeData = changeData;
    this._changePopupMode = changePopupMode;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = PopupMode.ClOSED;

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
    this._onSpareSpaceClickHandler = this._onSpareSpaceClickHandler.bind(this);
    this._removeFilmPopup = this._removeFilmPopup.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._commments = comments;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this._filmsListContainer, this._filmComponent);
      return;
    }

    console.log('after return');

    if (this._bodyContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  resetView() {
    if (this._mode !== PopupMode.ClOSED) {
      this._removeFilmPopup();
    }
  }

  _renderFilmPopup(film, comments) {
    this._filmPopupComponent = new FilmCardPopupView(film, comments);
    this._filmPopupComponent.setPopupCloseButtonClickHandler(this._removeFilmPopup);
    this._filmPopupComponent.setPopupWatchListClickHandler(this._handleWatchListClick);
    this._filmPopupComponent.setPopupWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setPopupFavoriteClickHandler(this._handleFavoriteClick);
    this._changePopupMode();
    this._mode = PopupMode.OPENED;

    render(this._bodyContainer, this._filmPopupComponent);
    document.addEventListener('keydown', this._onEscKeyDownHandler);

    if (document.querySelector('.film-details')) {
      document.addEventListener('click', this._onSpareSpaceClickHandler);
    }
  }

  _handleFilmCardClick() {
    this._bodyContainer.classList.add('hide-overflow');
    this._renderFilmPopup(this._film, this._commments);
  }

  _handleWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isInWatchList: !this._film.isInWatchList,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _removeFilmPopup() {
    this._bodyContainer.classList.remove('hide-overflow');
    remove(this._filmPopupComponent);
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
    document.removeEventListener('click', this._onSpareSpaceClickHandler);
    this._mode = PopupMode.ClOSED;
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmPopup();
      this._mode = PopupMode.ClOSED;
    }
  }

  _onSpareSpaceClickHandler(evt) {
    const {target} = evt;
    const popupTarget = target.closest('.film-details');
    const cardTarget = target.closest('.film-card');

    if (!popupTarget && !cardTarget) {
      this._removeFilmPopup();
      this._mode = PopupMode.ClOSED;
    }
  }
}
