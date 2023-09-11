import axios from 'axios';
import { url, defaultSearchParams } from './cfg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');
let q = '';
let page = 0;

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '39349329-da0d96b7ff19f00149bd6d266',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

let lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export async function searchPhotos(e) {
  e.preventDefault();

  gallery.innerHTML = '';

  e.target.page.value = '1';
  q = e.target.q.value;

  await loadPhotos({ q, page: '1' });
  Notiflix.Notify.success(`Hooray! We found 500 images.`);
}

async function loadPhotos({ q, page }) {
  const photos = await fetchPhotos({ q, page });
  if (photos.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreButton.classList.add('hidden');
    return;
  }
  drawPhotos(photos.hits);
  lightBox.refresh();
}

async function fetchPhotos({ q = '', page = '1' }) {
  const searchParams = new URLSearchParams({
    q,
    page,
  });
  try {
    const response = await axios.get(`?${searchParams}`);
    const data = await response.data;

    return data;
  } catch (e) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreButton.classList.add('hidden');
    return;
  }
}

function drawPhotos(array) {
  // let photosArray = [];

  let photos = array.map(photo => {
    const imgBox = document.createElement('a');
    imgBox.classList.add('gallery__item');
    imgBox.setAttribute('href', photo.largeImageURL);

    imgBox.innerHTML = `
      <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" class="gallery__photo"/>
      <div class="info">
      <p class="info-item">
      <b>Likes</b>
      ${photo.likes}
      </p>
      <p class="info-item">
      <b>Views</b>
      ${photo.views}
      </p>
      <p class="info-item">
      <b>Comments</b>
      ${photo.comments}
      </p>
      <p class="info-item">
      <b>Downloads</b>
      ${photo.downloads}
      </p>
      </div>
      `;
    // photosArray.push(imgBox);
    return imgBox;
  });

  gallery.append(...photos);
  loadMoreButton.classList.remove('hidden');
}

export async function loadMorePhotos() {
  page = parseInt(searchForm.page.value);
  page += 1;
  searchForm.page.value = page;
  loadPhotos({ q, page });
  console.log(searchForm.page.value);
}
