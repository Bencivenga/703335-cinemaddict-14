import FilmsSectionView from '../view/films-section';
import FilmsContainerView from '../view/films-container';
import SortView from '../view/sort';
import NoFilmView from '../view/no-film';
import TopRatedFilmsView from '../view/top-rated';
import MostCommentedFilmsView from '../view/most-commented';
import FilmPresenter from './film';
import ShowMoreButtonView from '../view/show-more-button';
import {render, remove} from '../utils/render';
import {sortFilmsByComments, sortFilmsByRating} from '../utils/film';
import {updateItem} from '../utils/common';

const FILM_CARDS_COUNT_PER_STEP = 5;
const EXTRA_FILM_CARDS_COUNT = 2;

export default class filmsBoard {
  constructor(bodyContainer, mainContainer) {
    this._mainContainer = mainContainer;
    this._bodyContainer = bodyContainer;

    this._filmsSectionComponet = new FilmsSectionView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmsContainerElement = this._filmsContainerComponent.getElement().querySelector('.films-list__container');
    this._sortComponent = new SortView();
    this._noFilmComponent = new NoFilmView();
    this._topRatedFilmsComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    this._filmPresenter = {};

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleFilmPopupMode = this._handleFilmPopupMode.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._topRatedFilms = sortFilmsByRating(this._films);
    this._mostCommentedFilms = sortFilmsByComments(this._films);
    this._commments = comments.slice();
    this._renderFilmsBoard();
  }

  _handleFilmPopupMode() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    console.log(this._films.find((prevFilm) => prevFilm.id === updatedFilm.id));
    this._films = updateItem(this._films, updatedFilm);
    console.log(updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm, this._comments);
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent);
  }

  _renderFilm(container, film) {
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
    render(this._filmsSectionComponet , this._topRatedFilmsComponent);
    const topRatedFilmsListContainerElement = this._topRatedFilmsComponent.getElement().querySelector('.films-list--extra .films-list__container');

    this._renderFilms(0, EXTRA_FILM_CARDS_COUNT, topRatedFilmsListContainerElement, this._topRatedFilms);
    console.log(this._mostCommentedFilms);
  }

  _renderMostCommentedFilms() {
    render(this._filmsSectionComponet, this._mostCommentedFilmsComponent);
    const mostCommentedFilmsListContainerElement = this._mostCommentedFilmsComponent.getElement().querySelector('.films-list--extra:last-of-type .films-list__container');
    console.log(this._mostCommentedFilms);

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

    console.log(this._filmPresenter);
    // this._renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
    remove(this._topRatedFilmsComponent);
    remove(this._mostCommentedFilmsComponent);
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;
    console.log(this._topRatedFilms);
    console.log(this._mostCommentedFilms);
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
