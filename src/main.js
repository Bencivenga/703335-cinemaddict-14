import HeaderProfileView from './view/header-profile';
import SiteMenuView from './view/site-menu';
import FooterStatsView from './view/footer-stats';
import FilmsBoardPresenter from './presenter/films-board';
import {generateFilms} from './mock/film-card';
import {generateFilter} from './mock/filter';
import {generateCommentsList} from './mock/comment';
import {generateFooterStats} from './mock/footer-stats';
import {RenderPosition, render} from './utils/render';

const FILM_CARDS_COUNT = 22;

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
const filmsBoardPresenter = new FilmsBoardPresenter(siteBodyElement, siteMainElement);

render(siteHeaderElement, new HeaderProfileView(films));
render(siteMainElement, new SiteMenuView(filters), RenderPosition.AFTERBEGIN);

filmsBoardPresenter.init(films, comments);

const footerStatsContainerElement = siteFooterElement.querySelector('.footer__statistics');

render(footerStatsContainerElement, new FooterStatsView(footerStats));
