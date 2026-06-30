import './style.css';
import { initPart1 } from './js/part1.js';
import { initPart2 } from './js/part2.js';
import { initPart3 } from './js/part3.js';

document.addEventListener('DOMContentLoaded', () => {
  const menuScreen = document.getElementById('menu-screen');
  const gameContainer = document.getElementById('game-container');
  const btnPart1 = document.getElementById('btn-part1');
  const btnPart2 = document.getElementById('btn-part2');
  const btnPart3 = document.getElementById('btn-part3');
  const btnBack = document.getElementById('btn-back');
  const btnBackPart3 = document.getElementById('btn-back-part3');
  const gameContainerPart3 = document.getElementById('game-container-part3');

  const controlsPart1 = document.getElementById('controls-part1');
  const controlsPart2 = document.getElementById('controls-part2');
  const vizPart1 = document.getElementById('viz-part1');
  const vizPart2 = document.getElementById('viz-part2');
  const vizTitle = document.getElementById('viz-title');

  btnPart1.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainerPart3.classList.add('hidden');
    controlsPart1.classList.remove('hidden');
    controlsPart1.classList.add('flex');
    vizPart1.classList.remove('hidden');
    vizPart1.classList.add('flex');
    
    controlsPart2.classList.add('hidden');
    controlsPart2.classList.remove('flex');
    vizPart2.classList.add('hidden');
    vizPart2.classList.remove('flex');
    vizTitle.innerText = "Phần 1: Bóc Lột & Năng Suất";
    
    initPart1();
  });

  btnPart2.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainerPart3.classList.add('hidden');
    controlsPart2.classList.remove('hidden');
    controlsPart2.classList.add('flex');
    vizPart2.classList.remove('hidden');
    vizPart2.classList.add('flex');
    
    controlsPart1.classList.add('hidden');
    controlsPart1.classList.remove('flex');
    vizPart1.classList.add('hidden');
    vizPart1.classList.remove('flex');
    vizTitle.innerText = "Phần 2: Khấu Hao & Quy Mô Vốn";
    
    initPart2();
  });

  btnPart3.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    gameContainerPart3.classList.remove('hidden');
    
    initPart3();
  });

  btnBack.addEventListener('click', () => {
    window.location.reload(); // Simple way to reset state when going back
  });

  btnBackPart3.addEventListener('click', () => {
    window.location.reload(); 
  });
});
