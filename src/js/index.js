import { searchPhotos, loadMorePhotos } from './img-api';

const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', searchPhotos);
loadMoreButton.addEventListener('click', loadMorePhotos);
