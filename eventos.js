'use strict';

const formatData = {
  'Buffet Completo': { image: 'casamento-buffet.jpg', alt: 'Buffet completo do Chef Vini em um casamento' },
  'Finger Food': { image: 'finger-food.jpg', alt: 'Mini porções de Finger Food preparadas pelo Chef Vini' },
  'Grazing Food': { image: 'grazing-food.jpg', alt: 'Mesa de frios e antepastos do Chef Vini' },
};

const photographs = [
  { category: 'Casamentos', image: 'casamento-mesa.jpg', caption: 'Uma mesa para celebrar' },
  { category: 'Casamentos', image: 'casamento-buffet.jpg', caption: 'Buffet para o grande dia' },
  { category: 'Casamentos', image: 'casamento-celebracao.jpg', caption: 'Gastronomia em uma celebração' },
  { category: 'Casamentos', image: 'casamento-detalhes.jpg', caption: 'O cuidado no serviço' },
  { category: 'Finger Food', image: 'finger-food.jpg', caption: 'Mini porções, grandes encontros' },
  { category: 'Finger Food', image: 'empratado.jpg', caption: 'Apresentação em cada preparo' },
  { category: 'Finger Food', image: 'grazing-food.jpg', caption: 'Uma mesa para compartilhar' },
  { category: 'Corporativos', image: 'corporativo-mesa.jpg', caption: 'Uma pausa para receber bem' },
  { category: 'Corporativos', image: 'coffee-break.jpg', caption: 'Detalhes do coffee break' },
  { category: 'Corporativos', image: 'corporativo-finger.jpg', caption: 'Sabores para o encontro' },
  { category: 'Outras experiências', image: 'paella.jpg', caption: 'Paella' },
  { category: 'Outras experiências', image: 'feijoada.jpg', caption: 'Feijoada' },
  { category: 'Outras experiências', image: 'celebracoes.jpg', caption: 'Celebrações à mesa' },
  { category: 'Outras experiências', image: 'empratado.jpg', caption: 'Menus empratados' },
];

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#menu-mobile');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.hidden = !open;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});

document.querySelectorAll('[data-format]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.format;
    const data = formatData[name];
    const image = document.querySelector('#format-image');
    document.querySelectorAll('[data-format]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    image.src = 'eventos/' + data.image;
    image.alt = data.alt;
    document.querySelector('#format-caption').textContent = name + ' · Chef Vini Eventos';
    document.querySelector('#chosen-format').dataset.service = name;
  });
});

const occasion = document.querySelector('#occasion');
const service = document.querySelector('#service');
document.querySelectorAll('[data-event], [data-service]').forEach(link => {
  link.addEventListener('click', () => {
    if (link.dataset.event) occasion.value = link.dataset.event;
    if (link.dataset.service) service.value = link.dataset.service;
  });
});

const gallery = document.querySelector('#gallery-grid');
let activeCategory = 'Casamentos';
let selectedPhoto = 0;
let filteredPhotos = [];
let focusBeforePhoto;
const photoDialog = document.querySelector('#photo-dialog');

function renderGallery(category) {
  activeCategory = category;
  filteredPhotos = photographs.filter(photo => photo.category === category);
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === activeCategory;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  gallery.replaceChildren();
  filteredPhotos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Ampliar foto: ' + photo.caption);
    const image = document.createElement('img');
    image.src = 'eventos/' + photo.image;
    image.alt = photo.caption + ' · Chef Vini Eventos';
    image.loading = 'lazy';
    const caption = document.createElement('span');
    caption.textContent = photo.caption;
    const arrow = document.createElement('b');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    caption.append(arrow);
    button.append(image, caption);
    button.addEventListener('click', () => {
      focusBeforePhoto = button;
      selectedPhoto = index;
      showPhoto();
      photoDialog.showModal();
      document.body.classList.add('photo-open');
    });
    gallery.append(button);
  });
}
function showPhoto() {
  const photo = filteredPhotos[selectedPhoto];
  const image = document.querySelector('#dialog-image');
  image.src = 'eventos/' + photo.image;
  image.alt = photo.caption + ' · Chef Vini Eventos';
  document.querySelector('#dialog-caption').textContent = photo.caption + ' · ' + (selectedPhoto + 1) + ' de ' + filteredPhotos.length;
}
function changePhoto(direction) {
  selectedPhoto = (selectedPhoto + direction + filteredPhotos.length) % filteredPhotos.length;
  showPhoto();
}
document.querySelector('.dialog-close').addEventListener('click', () => photoDialog.close());
document.querySelector('.dialog-previous').addEventListener('click', () => changePhoto(-1));
document.querySelector('.dialog-next').addEventListener('click', () => changePhoto(1));
photoDialog.addEventListener('close', () => {
  document.body.classList.remove('photo-open');
  focusBeforePhoto?.focus({ preventScroll: true });
});
photoDialog.addEventListener('click', event => {
  if (event.target === photoDialog) photoDialog.close();
});
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    changePhoto(event.key === 'ArrowRight' ? 1 : -1);
  }
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => renderGallery(button.dataset.filter));
});
document.querySelectorAll('[data-gallery-filter]').forEach(link => {
  link.addEventListener('click', () => renderGallery(link.dataset.galleryFilter));
});
renderGallery(activeCategory);

const form = document.querySelector('#event-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const lines = [
    'Olá, Chef Vini! Gostaria de conversar sobre o meu evento.',
    '',
    'Ocasião: ' + data.get('occasion'),
    'Formato: ' + data.get('service'),
  ];
  if (data.get('date')) {
    const [year, month, day] = data.get('date').split('-');
    lines.push('Data prevista: ' + day + '/' + month + '/' + year);
  }
  if (data.get('guests')) lines.push('Convidados: ' + data.get('guests'));
  if (data.get('city').trim()) lines.push('Cidade: ' + data.get('city').trim());
  if (data.get('message').trim()) lines.push('', data.get('message').trim());
  lines.push('', 'Podemos conversar sobre o menu e a disponibilidade?');
  window.open('https://wa.me/5547999121977?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
});
const contactSection = document.querySelector('#orcamento');
const floatingContact = document.querySelector('.floating-contact');
const observer = new IntersectionObserver(entries => {
  floatingContact.classList.toggle('in-contact', entries[0].isIntersecting);
}, { threshold: 0.05 });
observer.observe(contactSection);
document.querySelector('#year').textContent = new Date().getFullYear();


// Entrada da marca: filme único, seguido por uma cortina que sobe.
(()=>{
 const intro=document.querySelector('#brand-intro'),film=document.querySelector('#intro-film'),shell=document.querySelector('#site-shell'),skip=document.querySelector('#skip-intro');
 if(!intro)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let finished=false,watchdog;
 shell.inert=true;
 const finish=()=>{if(finished)return;finished=true;clearTimeout(watchdog);film.pause();intro.classList.add('is-leaving');document.body.classList.remove('intro-pending');shell.inert=false;const hadFocus=intro.contains(document.activeElement);setTimeout(()=>{intro.remove();if(hadFocus)document.querySelector('.brand').focus({preventScroll:true});},reduced.matches?0:1300);};
 skip.addEventListener('click',finish);intro.addEventListener('keydown',e=>{if(e.key==='Escape')finish();if(e.key==='Tab'){e.preventDefault();skip.focus();}});film.addEventListener('ended',finish);film.addEventListener('error',finish);
 film.addEventListener('timeupdate',()=>{if(film.duration)intro.querySelector('.intro-progress span').style.transform='scaleX('+film.currentTime/film.duration+')';});
 watchdog=setTimeout(finish,12000);
 if(reduced.matches)finish();else{film.muted=true;film.play().catch(()=>finish());}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
 if(!reduced.matches)document.querySelectorAll('main>.section,main>.corporate-section,main>.care-section').forEach(section=>{section.classList.add('reveal-section');observer.observe(section);});
})();

// Interações editoriais e progresso da navegação.
(()=>{
 const meter=document.createElement('div');meter.className='scroll-meter';meter.setAttribute('aria-hidden','true');document.body.append(meter);
 let ticking=false;const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>{ticking=false;document.body.classList.toggle("hero-active",document.querySelector(".hero").getBoundingClientRect().bottom>80);const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--page-progress',max>0?scrollY/max:0);const image=document.querySelector('.hero-background');if(image&&!motion.matches&&scrollY<innerHeight)image.style.transform='translateY('+Math.min(scrollY*.12,75)+'px) scale(1.04)';};
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});update();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});
 if(!motion.matches)document.querySelectorAll('.corporate,.gallery-section,.care-grid article,.experience-heading').forEach(el=>{el.classList.add('reveal-section');observer.observe(el);});
})();
