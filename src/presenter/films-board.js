import FilmsSectionView from '../view/films-section';
import FilmsContainerView from '../view/films-container';
import SortView from '../view/sort';
import NoFilmView from '../view/no-film';
import FilmCardView from '../view/film-card';
import TopRatedFilmsView from '../view/top-rated';
import MostCommentedFilmsView from '../view/most-commented';
import FilmCardPopupView from '../view/film-card-popup';
import ShowMoreButtonView from '../view/show-more-button';
import {render, remove} from '../utils/render';
import {sortFilmsByComments, sortFilmsByRating} from '../utils/film';

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
    this._topRatedFilms = new TopRatedFilmsView();
    this._mostCommentedFilms = new MostCommentedFilmsView();
  }

  init(films, comments) {
    this._films = films.slice();
    this._commments = comments.slice();

    this._renderFilmsBoard();
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent);
  }

  _renderFilm(container, film) {
    const filmCard = new FilmCardView(film);

    const onFilmCardItemsClick = () => {

      const popupElement = document.querySelector('.film-details');

      if (!popupElement) {
        this._bodyContainer.classList.add('hide-overflow');
        this._renderFilmPopup(film, this._commments);
      }
    };

    filmCard.setFilmCardClickHandler(() => {
      onFilmCardItemsClick();
    });

    render(container, filmCard);
  }

  _renderFilmPopup(film, comments) {
    const filmPopup = new FilmCardPopupView(film, comments);

    const filmPopupCloseHandler = () => {
      this._bodyContainer.classList.remove('hide-overflow');
      remove(filmPopup);
      document.removeEventListener('keydown', onEscKeyDown);
      document.removeEventListener('click', onSpareSpaceClick);
    };

    filmPopup.setPopupCloseButtonClickHandler(() => {
      filmPopupCloseHandler();
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        filmPopupCloseHandler();
      }
    };

    const onSpareSpaceClick = (evt) => {
      const {target} = evt;
      const popupTarget = target.closest('.film-details');
      const cardTarget = target.closest('.film-card');

      if (!popupTarget && !cardTarget) {
        filmPopupCloseHandler();
      }
    };

    render(this._bodyContainer, filmPopup);
    document.addEventListener('keydown', onEscKeyDown);

    if (document.querySelector('.film-details')) {
      document.addEventListener('click', onSpareSpaceClick);
    }
  }

  _renderFilms(from, to, container, films) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderTopRatedFilms() {
    render(this._filmsSectionComponet , this._topRatedFilms);

    const topRatedFilmsListContainerElement = this._topRatedFilms.getElement().querySelector('.films-list--extra .films-list__container');
    const filmsTopRated = sortFilmsByRating(this._films);

    this._renderFilms(0, EXTRA_FILM_CARDS_COUNT, topRatedFilmsListContainerElement, filmsTopRated);
  }

  _renderMostCommentedFilms() {
    render(this._filmsSectionComponet, this._mostCommentedFilms);

    const mostCommentedFilmsListContainerElement = this._mostCommentedFilms.getElement().querySelector('.films-list--extra:last-of-type .films-list__container');
    const filmsMostCommented = sortFilmsByComments(this._films.slice().filter((film) => film.comments));

    this._renderFilms(0, EXTRA_FILM_CARDS_COUNT, mostCommentedFilmsListContainerElement, filmsMostCommented);
  }

  _renderNoFilm() {
    render(this._mainContainer, this._noFilmComponent);
  }

  _renderShowMoreButton() {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();

    render(this._filmsContainerComponent, showMoreButtonComponent);

    const showMoreFilms = () => {
      this._films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((film) => this._renderFilm(this._filmsContainerElement, film));

      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;

      if (renderedFilmCardsCount >= this._films.length) {
        remove(showMoreButtonComponent);
      }
    };

    showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      showMoreFilms();
    });
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
