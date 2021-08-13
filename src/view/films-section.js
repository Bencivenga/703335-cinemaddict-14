import AbstractView from './abstract';

const createNoFilmTemplate = () => {
  return `<section class="films">
          </section>`;
};

export default class FilmsSection extends AbstractView {
  getTemplate() {
    return createNoFilmTemplate();
  }
}
