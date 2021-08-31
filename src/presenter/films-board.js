import FilmsSectionView from '../view/films-section';
import FilmsContainerView from '../view/films-container';
import SortView from '../view/sort';
import NoFilmView from '../view/no-film';
import FilmsExtraView from '../view/films-extra';
import FilmPresenter from './film';
import ShowMoreButtonView from '../view/show-more-button';
import {
  render,
  remove
} from '../utils/render';
import {
  sortFilmsByComments,
  sortFilmsByRating,
  sortFilmsByDate
} from '../utils/film';
import {
  updateItem
} from '../utils/common';
import {
  SortType,
  ExtraFilmsTitles
} from '../data';

const FILM_CARDS_COUNT_PER_STEP = 5;
const EXTRA_FILM_CARDS_COUNT = 2;

export default class filmsBoard {
  constructor(bodyContainer, mainContainer) {
    this._bodyContainer = bodyContainer;
    this._mainContainer = mainContainer;

    this._filmsSectionComponet = new FilmsSectionView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmsContainerElement = this._filmsContainerComponent.getElement().querySelector('.films-list__container');
    this._noFilmComponent = new NoFilmView();
    this._topRatedFilmsComponent = new FilmsExtraView(ExtraFilmsTitles.TOP_RATED);
    this._mostCommentedFilmsComponent = new FilmsExtraView(ExtraFilmsTitles.MOST_COMMENTED);
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleFilmPopupMode = this._handleFilmPopupMode.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._topRatedFilms = films.slice().sort(sortFilmsByRating);
    this._mostCommentedFilms = sortFilmsByComments(films.slice());
    this._commments = comments.slice();
    this._sourcedComments = comments.slice();
    this._renderFilmsBoard();
  }

  _handleFilmPopupMode() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    // console.log(this._films.find((prevFilm) => prevFilm.id === updatedFilm.id));
    this._films = updateItem(this._films, updatedFilm);

    this._filmPresenter[updatedFilm.id].init(updatedFilm, this._sourcedComments.slice());
    console.log(this._filmPresenter[updatedFilm.id]);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmsByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsBoard();
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    render(this._mainContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(container,  film) {
    const filmPresenter = new FilmPresenter(container, this._bodyContainer, this._handleFilmChange, this._handleFilmPopupMode);
    filmPresenter.init(film, this._commments);
    // filmPresenter.init(film, this._commments);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(from, to, container, films) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderTopRatedFilms() {
    render(this._filmsSectionComponet, this._topRatedFilmsComponent);
    const topRatedFilmsListContainerElement = this._topRatedFilmsComponent.getElement().querySelector('.films-list--extra .films-list__container');

    this._renderFilms(0, EXTRA_FILM_CARDS_COUNT, topRatedFilmsListContainerElement, this._topRatedFilms);

  }

  _renderMostCommentedFilms() {
    render(this._filmsSectionComponet, this._mostCommentedFilmsComponent);
    const mostCommentedFilmsListContainerElement = this._mostCommentedFilmsComponent.getElement().querySelector('.films-list--extra .films-list__container');

    this._renderFilms(0, EXTRA_FILM_CARDS_COUNT, mostCommentedFilmsListContainerElement, this._mostCommentedFilms);
  }

  _renderNoFilm() {
    render(this._mainContainer, this._noFilmComponent);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCardsCount, this._renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP, this._filmsContainerElement, this._films);

    this._renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;

    if (this._renderedFilmCardsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsContainerComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      this._handleShowMoreButtonClick();
    });
  }

  _clearFilmsList() {
    Object.values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    this._filmPresenter = {};
    this._renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
    remove(this._sortComponent);
    remove(this._topRatedFilmsComponent);
    remove(this._mostCommentedFilmsComponent);

    this._filmsContainerElement.innerHTML = null;
  }

  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._films.length, FILM_CARDS_COUNT_PER_STEP), this._filmsContainerElement, this._films);

    if (this._films.length > FILM_CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsBoard() {
    if (this._films.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderSort();
    render(this._mainContainer, this._filmsSectionComponet);
    render(this._filmsSectionComponet, this._filmsContainerComponent);
    this._renderFilmsList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }
}
