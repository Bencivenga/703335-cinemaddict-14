import HeaderProfileView from './view/header-profile';
import SiteMenuView from './view/site-menu';
import SortView from './view/sort';
import FilmsSectionView from './view/films-section';
import FilmsContainerView from './view/films-container';
import FilmCardView from './view/film-card';
import ShowMoreButtonView from './view/show-more-button';
import TopRatedFilmsView from './view/top-rated';
import MostCommentedFilmsView from './view/most-commented';
import FooterStatsView from './view/footer-stats';
import FilmCardPopupView from './view/film-card-popup';
import NoFilmView from './view/no-film';
import {generateFilms} from './mock/film-card';
import {generateFilter} from './mock/filter';
import {generateCommentsList} from './mock/comment';
import {generateFooterStats} from './mock/footer-stats';
import {RenderPosition, render, sortFilmsByComments, sortFilmsByRating, getUniqueValues} from './utils/common';

const FILM_CARDS_COUNT_PER_STEP = 5;
const FILM_CARDS_COUNT = 20;
const EXTRA_FILM_CARDS_COUNT = 2;

const comments = generateCommentsList();
console.log(comments);
const films = generateFilms(FILM_CARDS_COUNT, comments);
console.log(films);
const filters = generateFilter(films);
const footerStats = generateFooterStats(films);

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteFooterElement = siteBodyElement.querySelector('.footer');

render(siteHeaderElement, new HeaderProfileView(films).getElement());
render(siteMainElement, new SiteMenuView(filters).getElement(), RenderPosition.AFTERBEGIN);

const renderFilm = (filmsListElement, film) => {
  const filmCard = new FilmCardView(film);

  const onFilmCardItemsClick = () => {
    siteBodyElement.classList.add('hide-overflow');

    const filmPopup = new FilmCardPopupView(film, comments);

    const filmPopupCloseHandler = () => {
      siteBodyElement.classList.remove('hide-overflow');
      siteBodyElement.removeChild(filmPopup.getElement());
      filmPopup.removeElement();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        filmPopupCloseHandler();
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    const filmPopupCloseButton = filmPopup.getElement().querySelector('.film-details__close-btn');
    filmPopupCloseButton.addEventListener('click', filmPopupCloseHandler);

    siteBodyElement.appendChild(filmPopup.getElement());
  };

  filmCard.getElement().querySelector('.film-card__poster').addEventListener('click', onFilmCardItemsClick);
  filmCard.getElement().querySelector('.film-card__title').addEventListener('click', onFilmCardItemsClick);
  filmCard.getElement().querySelector('.film-card__comments').addEventListener('click', onFilmCardItemsClick);

  render(filmsListElement, filmCard.getElement());
};

if (films.length === 0) {
  render(siteMainElement, new NoFilmView().getElement());
} else {
  render(siteMainElement, new SortView().getElement());
  const filmsSectionComponent = new FilmsSectionView().getElement();
  render(siteMainElement, filmsSectionComponent);
  render(filmsSectionComponent, new FilmsContainerView().getElement());
  const filmsListElement = filmsSectionComponent.querySelector('.films-list');
  const filmsContainerElement = filmsSectionComponent.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILM_CARDS_COUNT_PER_STEP); i++) {
    renderFilm(filmsContainerElement, films[i]);
  }

  if (films.length > FILM_CARDS_COUNT_PER_STEP) {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmsListElement, showMoreButtonComponent.getElement());

    showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsContainerElement, film));

      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;

      if (renderedFilmCardsCount >= films.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  render(filmsSectionComponent, new TopRatedFilmsView().getElement());

  const topRatedFilmsListContainerElement = filmsSectionComponent.querySelector('.films-list--extra .films-list__container');
  const filmsTopRated = sortFilmsByRating(films);

  for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
    renderFilm(topRatedFilmsListContainerElement, filmsTopRated[i]);
  }

  render(filmsSectionComponent, new MostCommentedFilmsView().getElement());

  const mostCommentedFilmsListContainerElement = filmsSectionComponent.querySelector('.films-list--extra:last-of-type .films-list__container');
  const filmsMostCommented = sortFilmsByComments(films.slice().filter((film) => film.comments));

  for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
    renderFilm(mostCommentedFilmsListContainerElement, filmsMostCommented[i]);
  }
}

const footerStatsContainerElement = siteFooterElement.querySelector('.footer__statistics');

render(footerStatsContainerElement, new FooterStatsView(footerStats).getElement());
