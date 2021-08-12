import {createElement} from '../utils/common';

const createFooterStatsTemplate = (footerStats) => {
  return `<p>${footerStats} movies inside</p>`;
};

export default class FooterStats {
  constructor(stats) {
    this._element = null;
    this._stats = stats;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._stats);
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
