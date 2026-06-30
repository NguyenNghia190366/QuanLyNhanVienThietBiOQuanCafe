import * as animePkg from 'animejs';
const anime = animePkg.default || animePkg;

export function playCoinAnimation(container, count = 1) {
  for(let i=0; i<count; i++) {
    const coin = document.createElement('img');
    coin.src = '/assets/coin.png';
    coin.className = 'absolute w-8 h-8 z-20';
    
    const startX = 200 + Math.random() * 50;
    const startY = 150 + Math.random() * 20;
    
    coin.style.left = `${startX}px`;
    coin.style.top = `${startY}px`;
    
    container.appendChild(coin);
    
    anime({
      targets: coin,
      translateY: [0, -100 - Math.random() * 50, 200],
      translateX: [0, 50 + Math.random() * 100],
      rotate: '1turn',
      opacity: [1, 1, 0],
      duration: 1500,
      easing: 'easeOutCubic',
      complete: function() {
        coin.remove();
      }
    });
  }
}

export function dropSweat() {
  const sweat = document.getElementById('anim-sweat');
  if(!sweat) return;
  
  sweat.classList.remove('opacity-0');
  
  anime({
    targets: sweat,
    translateY: [0, 20],
    opacity: [1, 0],
    duration: 1000,
    easing: 'linear',
    complete: function() {
      anime.set(sweat, {translateY: 0});
    }
  });
}
