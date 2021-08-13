import AbstractView from './abstract';
import {capitalizeFirstChar} from '../utils/common';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item">${capitalizeFirstChar(name)} <span class="main-navigation__item-count">${count}</span></a>`
};

const createSiteMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter)).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filterItems) {
    super();
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filterItems);
  }
}
