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
import {RenderPosition, render, remove} from './utils/render';
import {sortFilmsByComments, sortFilmsByRating} from './utils/film';

const FILM_CARDS_COUNT_PER_STEP = 5;
const FILM_CARDS_COUNT = 22;
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

render(siteHeaderElement, new HeaderProfileView(films));
render(siteMainElement, new SiteMenuView(filters), RenderPosition.AFTERBEGIN);

const renderFilm = (filmsListElement, film) => {
  const filmCard = new FilmCardView(film);

  const onFilmCardItemsClick = () => {
    if (!document.querySelector('.film-details')) {
      siteBodyElement.classList.add('hide-overflow');
      const filmPopup = new FilmCardPopupView(film, comments);

      const filmPopupCloseHandler = () => {
        siteBodyElement.classList.remove('hide-overflow');
        remove(filmPopup);
        document.removeEventListener('keydown', onEscKeyDown);
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

      siteBodyElement.appendChild(filmPopup.getElement());
      document.addEventListener('keydown', onEscKeyDown);
    }
  };

  filmCard.setFilmCardClickHandler(() => {
    onFilmCardItemsClick();
  });

  render(filmsListElement, filmCard);
};

if (films.length === 0) {
  render(siteMainElement, new NoFilmView());
} else {
  render(siteMainElement, new SortView());
  const filmsSectionComponent = new FilmsSectionView();
  render(siteMainElement, filmsSectionComponent);
  render(filmsSectionComponent, new FilmsContainerView());
  const filmsListElement = filmsSectionComponent.getElement().querySelector('.films-list');
  const filmsContainerElement = filmsSectionComponent.getElement().querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILM_CARDS_COUNT_PER_STEP); i++) {
    renderFilm(filmsContainerElement, films[i]);
  }

  if (films.length > FILM_CARDS_COUNT_PER_STEP) {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmsListElement, showMoreButtonComponent);

    const showMoreFilms = () => {
      films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsContainerElement, film));

      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;

      if (renderedFilmCardsCount >= films.length) {
        remove(showMoreButtonComponent);
      }
    };

    showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      showMoreFilms();
    });
  }

  render(filmsSectionComponent, new TopRatedFilmsView());

  const topRatedFilmsListContainerElement = filmsSectionComponent.getElement().querySelector('.films-list--extra .films-list__container');
  const filmsTopRated = sortFilmsByRating(films);

  for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
    renderFilm(topRatedFilmsListContainerElement, filmsTopRated[i]);
  }

  render(filmsSectionComponent, new MostCommentedFilmsView());

  const mostCommentedFilmsListContainerElement = filmsSectionComponent.getElement().querySelector('.films-list--extra:last-of-type .films-list__container');
  const filmsMostCommented = sortFilmsByComments(films.slice().filter((film) => film.comments));

  for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
    renderFilm(mostCommentedFilmsListContainerElement, filmsMostCommented[i]);
  }
}

const footerStatsContainerElement = siteFooterElement.querySelector('.footer__statistics');

render(footerStatsContainerElement, new FooterStatsView(footerStats));
