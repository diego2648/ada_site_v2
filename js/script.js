const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
window.addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('hidden'),450));
$('#year').textContent=new Date().getFullYear();
const header=$('.header');window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});
const toggle=$('.menu-toggle'),menu=$('.menu');toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});$$('.menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));

const slides=$$('.slide'),dotsWrap=$('.slider-dots');let current=0,timer;
slides.forEach((_,i)=>{const b=document.createElement('button');b.className='slider-dot'+(i===0?' active':'');b.setAttribute('aria-label',`Ir a diapositiva ${i+1}`);b.addEventListener('click',()=>{show(i);restart()});dotsWrap.appendChild(b)});const dots=$$('.slider-dot');
function show(i){slides[current].classList.remove('active');dots[current].classList.remove('active');current=(i+slides.length)%slides.length;slides[current].classList.add('active');dots[current].classList.add('active')}
function restart(){clearInterval(timer);timer=setInterval(()=>show(current+1),6500)}$('.next').addEventListener('click',()=>{show(current+1);restart()});$('.prev').addEventListener('click',()=>{show(current-1);restart()});restart();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.14});$$('.reveal,.reveal-left,.reveal-right').forEach(el=>observer.observe(el));

const coarse=matchMedia('(pointer:coarse)').matches; if(!coarse){
  $$('[data-tilt]').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-4px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
  const glow=$('#mouseGlow');window.addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity='1'},{passive:true});
  $$('.magnetic').forEach(el=>el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`}));$$('.magnetic').forEach(el=>el.addEventListener('mouseleave',()=>el.style.transform=''));
}
$$('.btn').forEach(btn=>btn.addEventListener('click',e=>{const r=btn.getBoundingClientRect(),s=Math.max(r.width,r.height),span=document.createElement('span');span.className='ripple';span.style.width=span.style.height=s+'px';span.style.left=e.clientX-r.left-s/2+'px';span.style.top=e.clientY-r.top-s/2+'px';btn.appendChild(span);setTimeout(()=>span.remove(),650)}));

const projectData={
 interiores:{category:'Interiores',title:'Centros decorativos y plafones',description:'Galería de trabajos de tablaroca, iluminación indirecta y elementos decorativos.',images:['img/hero-tv.png','img/plafon-rojo.png','img/muro-naranja.png','img/closet.png','img/sala-limpia.png']},
 cocinas:{category:'Remodelación',title:'Cocinas, barras y detalles',description:'Transformaciones de interiores con madera, iluminación, barras y acabados limpios.',images:['img/hero-cocina.png','img/cocina-tv.png','img/sala-limpia.png','img/sala-proceso.png']},
 epoxicos:{category:'Epóxico',title:'Pisos de alto desempeño',description:'Aplicaciones con acabado brillante, uniforme y resistente para distintos espacios.',images:['img/epoxico.png']},
 exteriores:{category:'Exteriores',title:'Fachadas y pintura',description:'Trabajos de pintura, recubrimiento y acabado exterior.',images:['img/fachada.png','img/hero-casa.png']}
};
const modal=$('#projectModal'),mainImg=$('#modalMainImage'),thumbs=$('#modalThumbs');let gallery=[],galleryIndex=0,lastFocus=null;
function renderGallery(){mainImg.src=gallery[galleryIndex];mainImg.alt=$('#modalTitle').textContent;$('#modalCounter').textContent=`${galleryIndex+1} / ${gallery.length}`;$$('.modal-thumb',thumbs).forEach((b,i)=>b.classList.toggle('active',i===galleryIndex))}
function openProject(key,trigger){const d=projectData[key];if(!d)return;lastFocus=trigger;gallery=d.images;galleryIndex=0;$('#modalCategory').textContent=d.category;$('#modalTitle').textContent=d.title;$('#modalDescription').textContent=d.description;thumbs.innerHTML='';gallery.forEach((src,i)=>{const b=document.createElement('button');b.className='modal-thumb';b.innerHTML=`<img src="${src}" alt="Miniatura ${i+1}">`;b.addEventListener('click',()=>{galleryIndex=i;renderGallery()});thumbs.appendChild(b)});renderGallery();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('.modal-close').focus()}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');lastFocus?.focus()}
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project,b)));$$('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));$('.modal-close').addEventListener('click',closeModal);$('.modal-prev').addEventListener('click',()=>{galleryIndex=(galleryIndex-1+gallery.length)%gallery.length;renderGallery()});$('.modal-next').addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%gallery.length;renderGallery()});document.addEventListener('keydown',e=>{if(!modal.classList.contains('open'))return;if(e.key==='Escape')closeModal();if(e.key==='ArrowRight')$('.modal-next').click();if(e.key==='ArrowLeft')$('.modal-prev').click()});

let touchStartX=0;$('.modal-viewer').addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].clientX,{passive:true});$('.modal-viewer').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>50)(dx<0?$('.modal-next'):$('.modal-prev')).click()},{passive:true});

$('#quoteForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),phone='527121875766',text=`Hola, soy ${f.get('nombre')}. Mi teléfono es ${f.get('telefono')}. Me interesa: ${f.get('servicio')}. Detalles: ${f.get('mensaje')}`;window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank','noopener')});
$('#tiktokProfile').addEventListener('click',e=>{if(e.currentTarget.getAttribute('href')==='#'){e.preventDefault();window.open(
  "https://www.tiktok.com/@a.c.d_arthurs","_blank"); }});
