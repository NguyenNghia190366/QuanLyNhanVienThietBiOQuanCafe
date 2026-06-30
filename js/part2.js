import { updateChart, initChart } from './charts.js';
import { globalTechLevel } from './part1.js';
import * as animePkg from 'animejs';
const anime = animePkg.default || animePkg;

export function initPart2() {
  initChart();
  
  const monthVal = document.getElementById('month-val');
  const btnStartMonth = document.getElementById('btn-start-month');
  const btnFastForward = document.getElementById('btn-fast-forward');
  const depreciationBars = document.getElementById('depreciation-bars');
  const assetList = document.getElementById('asset-list');
  const freeLaborAnim = document.getElementById('free-labor-anim');
  
  let currentMonth = 0;
  let smallCapital = 20; // 20m
  let bigCapital = 2000; // 2b
  
  const baseSurplusSmall = 5;
  const baseSurplusBig = 500;
  
  let machineName = "Phin Cafe";
  let machineCost = 0;
  let machineDepreciation = 0;
  
  let techToUse = globalTechLevel === 1 ? 2 : globalTechLevel; 
  
  if (techToUse === 2) {
    machineName = "Máy Espresso Cấp 2";
    machineCost = 50;
  } else if (techToUse === 3) {
    machineName = "Robot Pha Chế Cấp 3";
    machineCost = 200;
  }
  
  machineDepreciation = machineCost / 5;
  
  assetList.innerHTML = `
    <div class="flex items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
      <img src="/assets/machine${techToUse}.png" class="w-12 h-12 mr-3 bg-slate-700 rounded-md p-1">
      <div class="flex-1">
        <div class="font-bold text-amber-400">${machineName}</div>
        <div class="text-xs text-slate-300">Nguyên giá: ${machineCost} Triệu</div>
        <div class="text-xs text-slate-500">Khấu hao: 5 Tháng (${machineDepreciation} Tr/tháng)</div>
      </div>
    </div>
  `;
  
  function renderDepreciation(month) {
    if (month === 0) {
      depreciationBars.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center text-slate-500 italic bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-700">Bấm PLAY để bắt đầu chạy thời gian.</div></div>`;
      return;
    }
    
    let progress = Math.min(100, (month / 5) * 100);
    let isFullyDepreciated = month >= 5;
    
    let barColor = isFullyDepreciated ? "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" : "bg-amber-600";
    let textState = isFullyDepreciated ? "LỰC LƯỢNG PHỤC VỤ KHÔNG CÔNG" : `Đang khấu hao (Tháng ${Math.min(5, month)}/5)`;
    let textColor = isFullyDepreciated ? "text-amber-900 font-black" : "text-white";
    
    depreciationBars.innerHTML = `
      <div class="mb-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
        <div class="flex justify-between text-sm mb-2">
          <span class="font-bold text-slate-300 text-lg">${machineName}</span>
          <span class="text-amber-400 font-bold text-lg">${isFullyDepreciated ? 'Hoàn vốn 100%' : `${progress}%`}</span>
        </div>
        <div class="relative w-full h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
          <div class="h-full ${barColor} transition-all duration-1000 ease-out flex items-center justify-center text-xs ${textColor}" style="width: ${progress}%">
            ${textState}
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-400 text-center">
          ${isFullyDepreciated ? 'Máy móc tiếp tục sinh lời mà không tốn chi phí hao mòn!' : `Đã chuyển ${month * machineDepreciation} Tr vào chi phí.`}
        </div>
      </div>
    `;
    
    if (isFullyDepreciated && month === 5) {
      freeLaborAnim.classList.remove('hidden', 'opacity-0');
      freeLaborAnim.classList.add('opacity-100');
      
      for(let i=0; i<40; i++) {
        const coin = document.createElement('img');
        coin.src = '/assets/coin.png';
        coin.className = 'absolute w-12 h-12 z-50';
        coin.style.left = '50%';
        coin.style.top = '50%';
        freeLaborAnim.appendChild(coin);
        
        anime({
          targets: coin,
          translateX: () => anime.random(-300, 300),
          translateY: () => anime.random(-300, 300),
          scale: [0, 1.5, 1],
          rotate: '3turn',
          opacity: [1, 0],
          duration: anime.random(2000, 4000),
          easing: 'easeOutExpo',
          complete: () => coin.remove()
        });
      }
    }
  }

  function advanceMonth() {
    currentMonth++;
    monthVal.innerText = `Tháng ${currentMonth}`;
    
    let smallAdded = baseSurplusSmall;
    let bigAdded = baseSurplusBig;
    
    // Once fully depreciated (month 5+), machinery becomes unpaid serving force
    if (currentMonth >= 5) {
      smallAdded += machineDepreciation;
      bigAdded += (machineDepreciation * 50); // Big chain has 50x machines
    }
    
    smallCapital += smallAdded + (smallCapital * 0.01);
    bigCapital += bigAdded + (bigCapital * 0.08); // Compound interest effect
    
    updateChart(currentMonth, smallCapital.toFixed(0), bigCapital.toFixed(0));
    renderDepreciation(currentMonth);
  }

  btnStartMonth.addEventListener('click', () => {
    advanceMonth();
  });
  
  btnFastForward.addEventListener('click', () => {
    btnFastForward.disabled = true;
    btnFastForward.classList.add('opacity-50');
    let count = 0;
    let interval = setInterval(() => {
      advanceMonth();
      count++;
      if(count >= 12) {
        clearInterval(interval);
        btnFastForward.disabled = false;
        btnFastForward.classList.remove('opacity-50');
      }
    }, 250);
  });
  
  renderDepreciation(0);
}
