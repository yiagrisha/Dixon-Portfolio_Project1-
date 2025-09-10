const scrollContainer = document.querySelector('#warmth .scroll-row');
const leftBtn = document.querySelector('#warmth .scroll-left');
const rightBtn = document.querySelector('#warmth .scroll-right');

function updateScrollButtons() {
   if (!scrollContainer || !leftBtn || !rightBtn) return;
   leftBtn.disabled = scrollContainer.scrollLeft <= 0;
   rightBtn.disabled = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;
}

if (scrollContainer && leftBtn && rightBtn) {
   leftBtn.onclick = () => {
      scrollContainer.scrollBy({left: -300, behavior: 'smooth'});
   };
   rightBtn.onclick = () => {
      scrollContainer.scrollBy({left: 300, behavior: 'smooth'});
   };
   scrollContainer.addEventListener('scroll', updateScrollButtons);
   window.addEventListener('resize', updateScrollButtons);
   updateScrollButtons();
}

const scrollPoints = document.querySelectorAll('#scroll-points li');
function updateActiveScrollPoint() {
const n = scrollPoints.length
let activeIdx = -1

scrollPoints.forEach((li, idx) => {
   const triggerY = window.innerHeight - (window.innerHeight * (idx + 1) / (n + 1))
   const rect = li.getBoundingClientRect()
   if (rect.top <= triggerY && rect.bottom > triggerY) {
      activeIdx = idx
   }
})

scrollPoints.forEach((li, idx) => {
   li.classList.toggle('active', idx === activeIdx)
})
}

window.addEventListener('scroll', updateActiveScrollPoint)
window.addEventListener('resize', updateActiveScrollPoint)
updateActiveScrollPoint()

const stillDivs = document.querySelectorAll('#still div');
const stillParagraphs = document.querySelectorAll('#still div p')

stillParagraphs.forEach((p, idx) => {
  p.style.textAlign = 'left'
  p.style.marginLeft = idx % 2 === 0 ? '0' : 'auto'
  p.style.marginRight = idx % 2 === 0 ? 'auto' : '0'
})

function updateActiveStillP() {
  const triggerY = window.innerHeight * (2 / 3)
  stillParagraphs.forEach(p => {
    const rect = p.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom < window.innerHeight) {
      p.classList.add('activeP')
    } else {
      p.classList.remove('activeP')
    }
  })
}

window.addEventListener('scroll', updateActiveStillP)
window.addEventListener('resize', updateActiveStillP)
updateActiveStillP()



const button = document.querySelector("#finalle-button")
const transit = document.querySelector("#transit")

button.addEventListener("click", () => {
   transit.classList.toggle("open")
})