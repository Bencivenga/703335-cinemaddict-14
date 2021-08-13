import AbstractView from './abstract';

const createFooterStatsTemplate = (footerStats) => {
  return `<p>${footerStats} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(stats) {
    super();
    this._stats = stats;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._stats);
  }
}
