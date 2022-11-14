import './css/styles.css';
import axios, { Axios } from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";


const KEY = "31275684-a0e2946a16e4e349973d98af2";
const BASE_URL = "https://pixabay.com/api/";


const formRef = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");

let page = 1;
let value = "";
let lightbox = new SimpleLightbox(".gallery a")

formRef.addEventListener("submit", onSubmitForm);
window.addEventListener("scroll", onLoadMore);


function onSubmitForm(evt) {
    evt.preventDefault();
    gallery.innerHTML = "";
    value = evt.currentTarget.elements.searchQuery.value;
    updateImg(value, page).then(articles => {
        if (articles.data.totalHits === 0) {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
            return;
        }
        Notiflix.Notify.success(`Hooray! We found ${articles.data.totalHits} images.`);
        renderingsImg(articles)
    })
    
}

async function updateImg(data, page) { 

    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    return response;

};

function onLoadMore() {
    
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement
     if (scrollTop === scrollHeight - clientHeight) {
        page ++;
         updateImg(value, page).then(renderingsImg);
    }
   
};

function renderingsImg(articles) {
    if (articles.data.totalHits < page * 40) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        return;
    }
    const img = articles.data.hits.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads }) => ` 
        <div class="photo-card">
  <a href = ${largeImageURL}>
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  
</div>`)
        .join("");
    gallery.insertAdjacentHTML('beforeend', img);
    lightbox.refresh();
};