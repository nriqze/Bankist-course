'use strict';

/////////////////////// Elements ///////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenAccount = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnsSections = document.querySelector('.nav__links');
const btnRightSlider = document.querySelector('.slider__btn--right');
const btnLeftSlider = document.querySelector('.slider__btn--left');
const btnCookie = document.querySelector('.cookie-button');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabc = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const imgs = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

///////////////////////// Functions /////////////////////////
// Nav links opacity ----------
const hoverOpacity = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(sib => {
      if(sib !== link) {
        sib.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  };
};

// Sticky nav ----------
const navHeight = nav.getBoundingClientRect().height;

const navSticky = function (entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerOptions = {
  root: null, // intersection with viewport
  threshold: 0, // none of the header element is visible
  rootMargin: `-${navHeight}px`, // like css margin
};

const headerObs = new IntersectionObserver(navSticky, headerOptions);
headerObs.observe(header);

// Revealing sections ----------
const sectionsScroll = function (entries, observer) {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);
  })
};

const sectionOptions = {
  root: null,
  threshold: 0.25,
};

const sectionsObs = new IntersectionObserver(sectionsScroll, sectionOptions);
sections.forEach(section => {
  sectionsObs.observe(section);
  section.classList.add('section--hidden');
});

// Image load ----------
const loadImg = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img')
  });

  observer.unobserve(entry.target);
};

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imageObs = new IntersectionObserver(loadImg, imgOptions);
imgs.forEach(img => imageObs.observe(img));

// Slider arrows ----------
let curSlide = 0;
const maxSlide = slides.length;

const moveToSlide = function(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100*(i - slide)}%)`
  });
};

const nextSlide = function() {
  if(curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  };
  
  moveToSlide(curSlide);
  activeDot(curSlide);
};

const prevSlide = function() {
  if(curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  };
  
  moveToSlide(curSlide);
  activeDot(curSlide);
};

// Slider dots ----------
const createDots = function() {
  slides.forEach((_, i) => 
    dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
  );
};

const activeDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => 
      dot.classList.remove('dots__dot--active')
    );
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

const init = function() {
  moveToSlide(0);
  createDots();
  activeDot(0);
};
init();

// Toggle modal  ----------
const toggleModal = function() {
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

///////////////////////// Handlers /////////////////////////
// Learn more btn ----------
btnScrollTo.addEventListener('click', function() {
  // Scroll to section1
  section1.scrollIntoView({behavior: 'smooth'});
});

// Nav btns scroll ----------
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();

  if(e.target.classList.contains('nav__link-fot')) {
    const att = e.target.getAttribute('href');
    document.querySelector(att).scrollIntoView({behavior: 'smooth'});
  };
});

// Tab component ----------
tabsContainer.addEventListener('click', function(e) {
  const tabB = e.target.closest('.operations__tab');
  const tabC = document.querySelector(`.operations__content--${tabB.dataset.tab}`);
  
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabc.forEach(c => c.classList.remove('operations__content--active'));
  
  tabB.classList.add('operations__tab--active');
  if(!tabB) return;
  
  tabC.classList.add('operations__content--active');
});

// Nav buttons fade out ----------
nav.addEventListener('mouseover', hoverOpacity.bind(0.5));
nav.addEventListener('mouseout', hoverOpacity.bind(1));

// Key press slider ----------
document.addEventListener('keydown', function(e) {
  if(e.key === 'ArrowRight') nextSlide();
  if(e.key === 'ArrowLeft') prevSlide();
});

// Arrows slider ----------
btnRightSlider.addEventListener('click', nextSlide);
btnLeftSlider.addEventListener('click', prevSlide);

// Dots slider ----------
dotsContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activeDot(slide);
  };
});

// Log in btn ----------
document.querySelector('.nav__link--btnLogin').addEventListener('click', function(e) {
  e.preventDefault();
  window.location = './app/indexApp.html'
});

// Create account btn ----------
btnOpenAccount.forEach(btn => 
  btn.addEventListener('click', toggleModal)
);

// Close modal ----------
btnCloseModal.addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);
document.addEventListener('keydown', function(e) {
  if(e.key === 'Escape') toggleModal();
});

// Cookie message ----------
btnCookie.addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.cookie').classList.add('hidden');
})