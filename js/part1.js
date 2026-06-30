import { dropSweat } from './animations.js';

export let globalTechLevel = 1;

const MACHINES = {
  1: {
    name: "Phin Cafe (Cấp 1)",
    price: 0,
    depreciationTime: 0,
    depreciationPerHour: 0,
    multiplier: 1,
    wageDrop: 0
  },
  2: {
    name: "Máy Espresso (Cấp 2)",
    price: 2000000, 
    depreciationTime: 100, 
    depreciationPerHour: 20000,
    multiplier: 2,
    wageDrop: 2 
  },
  3: {
    name: "Robot Pha Chế (Cấp 3)",
    price: 10000000,
    depreciationTime: 200,
    depreciationPerHour: 50000,
    multiplier: 5,
    wageDrop: 5
  }
};

export function initPart1() {
  const clockText = document.getElementById('clock-text');
  
  const sliderWage = document.getElementById('slider-wage');
  const sliderOt = document.getElementById('slider-ot');
  const sliderKpi = document.getElementById('slider-kpi');
  
  const wageVal = document.getElementById('wage-val');
  const otVal = document.getElementById('ot-val');
  const kpiVal = document.getElementById('kpi-val');
  
  const btnOtToggle = document.getElementById('btn-ot-toggle');
  const otStatus = document.getElementById('ot-status');
  
  const barV = document.getElementById('bar-v');
  const barM = document.getElementById('bar-m');
  const mPrimeVal = document.getElementById('m-prime-val');
  const vHoursDesc = document.getElementById('v-hours-desc');
  const mHoursDesc = document.getElementById('m-hours-desc');
  
  const burnoutNeedle = document.getElementById('burnout-needle');
  const burnoutVal = document.getElementById('burnout-val');
  
  const techContainer = document.getElementById('tech-container');
  const animMachine = document.getElementById('anim-machine');
  const machineLabel = document.getElementById('machine-label');
  const animWorker = document.getElementById('anim-worker');
  
  const alertMsg = document.getElementById('alert-msg');
  
  const scoreWage = document.getElementById('score-wage');
  const scoreProfit = document.getElementById('score-profit');
  
  let day = 1;
  let hour = 9;
  
  let plannedOtHours = 0; 
  let currentShiftOt = 0; 
  let isOtChot = false; 
  
  let gameInterval = null;
  let techLevel = 1;
  let isGameOver = false;
  
  let totalWages = 0;
  let totalProfit = 0;
  
  let hData = { wage: 0, dep: 0, profit: 0, rev: 0 };
  let dData = { wage: 0, dep: 0, profit: 0, rev: 0 };
  let wData = { wage: 0, dep: 0, profit: 0, rev: 0 };
  let mData = { wage: 0, dep: 0, profit: 0, rev: 0 };
  
  let machineState = {
    1: { status: 'using', hoursUsed: 0 },
    2: { status: 'not_bought', hoursUsed: 0 },
    3: { status: 'not_bought', hoursUsed: 0 }
  };

  function formatMoney(amount) {
    return amount.toLocaleString('vi-VN') + " VNĐ";
  }

  const financialLog = document.getElementById('financial-log');
  let logCount = 0;

  function addFinancialLog(type, data, timeLabel) {
    if(!financialLog) return;
    let borderColor = '';
    let typeName = '';
    
    if(type === 'hour') { borderColor = 'border-emerald-500'; typeName = '1 Giờ'; }
    else if(type === 'day') { borderColor = 'border-amber-400'; typeName = '1 Ngày'; }
    else if(type === 'week') { borderColor = 'border-blue-500'; typeName = '1 Tuần'; }
    else if(type === 'month') { borderColor = 'border-rose-500'; typeName = '1 Tháng'; }

    const formula = `Doanh thu = Lương(v) + Khấu hao(c) + Thặng dư(m)`;
    const numbers = `${formatMoney(data.rev)} = ${formatMoney(data.wage)} + ${formatMoney(data.dep)} + ${formatMoney(data.profit)}`;

    const logEl = document.createElement('div');
    logEl.className = `border-l-4 ${borderColor} bg-slate-900 p-2 rounded flex flex-col gap-1 text-[11px] mb-1 shrink-0`;
    logEl.innerHTML = `
      <div class="flex justify-between items-center text-slate-300 font-bold">
        <span>[${timeLabel}] Tổng kết ${typeName}</span>
      </div>
      <div class="text-slate-500">${formula}</div>
      <div class="text-emerald-400 font-semibold">${numbers}</div>
    `;
    
    financialLog.prepend(logEl);
    logCount++;
    if(logCount > 50) {
      financialLog.lastElementChild.remove();
      logCount--;
    }
  }

  function renderTechButtons() {
    techContainer.innerHTML = '';
    for(let i=1; i<=3; i++) {
      const m = MACHINES[i];
      const state = machineState[i].status;
      
      let borderClass = state === 'using' ? 'border-cyan-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50';
      
      let actionHtml = '';
      if(state === 'not_bought') {
        let canBuy = totalProfit >= m.price;
        actionHtml = `<button class="px-3 py-1 bg-amber-600 ${canBuy ? 'hover:bg-amber-500 cursor-pointer' : 'opacity-50 cursor-not-allowed'} rounded text-xs font-bold text-white transition-colors" onclick="buyMachine(${i})" ${!canBuy ? 'disabled' : ''}>Mua: ${formatMoney(m.price)}</button>`;
      } else if (state === 'bought') {
        actionHtml = `<button class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 cursor-pointer rounded text-xs font-bold text-white transition-colors" onclick="useMachine(${i})">Sử dụng</button>`;
      } else {
        actionHtml = `<div class="px-3 py-1 border border-cyan-500 text-cyan-400 rounded text-xs font-bold inline-block bg-cyan-900/30">Đang sử dụng</div>`;
      }
      
      let infoHtml = '';
      if (m.price > 0) {
        let hoursLeft = Math.max(0, m.depreciationTime - machineState[i].hoursUsed);
        infoHtml = `
          <div class="text-[10px] text-slate-400 leading-tight mt-1 mb-2">
            <div>Giá mua: <span class="text-slate-300 font-semibold">${formatMoney(m.price)}</span></div>
            <div>Khấu hao: <span class="text-slate-300 font-semibold">${m.depreciationTime} giờ</span> (còn ${hoursLeft} giờ)</div>
            <div>Trừ khấu hao: <span class="text-rose-400 font-semibold">-${formatMoney(m.depreciationPerHour)}/giờ</span></div>
          </div>
        `;
      } else {
         infoHtml = `<div class="text-[10px] text-slate-400 leading-tight mt-1 mb-2">Sản phẩm có sẵn, không tính khấu hao.</div>`;
      }

      techContainer.innerHTML += `
        <div class="flex items-center p-3 rounded-lg border-2 ${borderClass} transition-colors">
          <img src="/assets/machine${i}.png" class="w-12 h-12 mr-3 object-contain bg-slate-700 rounded-md p-1">
          <div class="flex-1 flex flex-col justify-center">
            <div class="font-bold text-sm text-slate-200">${m.name}</div>
            ${infoHtml}
            <div>${actionHtml}</div>
          </div>
        </div>
      `;
    }
  }
  
  window.buyMachine = function(level) {
    if(totalProfit >= MACHINES[level].price && machineState[level].status === 'not_bought') {
      totalProfit -= MACHINES[level].price;
      machineState[level].status = 'bought';
      scoreProfit.innerText = formatMoney(totalProfit);
      renderTechButtons();
    }
  };
  
  window.useMachine = function(level) {
    for(let i=1; i<=3; i++) {
      if(machineState[i].status === 'using') {
        machineState[i].status = 'bought';
      }
    }
    machineState[level].status = 'using';
    techLevel = level;
    globalTechLevel = level;
    
    animMachine.src = `/assets/machine${level}.png`;
    machineLabel.innerText = MACHINES[level].name;
    
    sliderWage.value = Math.max(15, parseInt(sliderWage.value) - MACHINES[level].wageDrop);
    wageVal.innerText = `${sliderWage.value}k/h`;
    
    animMachine.classList.add('scale-125');
    setTimeout(() => animMachine.classList.remove('scale-125'), 300);
    
    calculateMPrime();
    renderTechButtons();
  };

  function getHourlyData() {
    let baseWage = parseInt(sliderWage.value) * 1000;
    let kpi = parseInt(sliderKpi.value); 
    let m = MACHINES[techLevel];
    let valueGenerated = kpi * m.multiplier * 5000;
    
    let depreciation = 0;
    if (machineState[techLevel].hoursUsed < m.depreciationTime) {
      depreciation = m.depreciationPerHour;
    }
    
    let surplus = valueGenerated - baseWage - depreciation;
    return { baseWage, surplus, valueGenerated, depreciation };
  }
  
  function calculateMPrime() {
    let { baseWage, surplus, valueGenerated, depreciation } = getHourlyData();
    let displayOt = isOtChot ? parseFloat(sliderOt.value) : 0;
    let totalHours = 8 + displayOt;
    
    // cost to cover = wage + depreciation
    let cost = baseWage + depreciation;
    let necessaryHours = (cost * totalHours) / valueGenerated;
    if (necessaryHours > totalHours) necessaryHours = totalHours;
    
    let surplusHours = totalHours - necessaryHours;
    let mPrime = surplusHours > 0 ? (surplusHours / necessaryHours) * 100 : 0;
    
    let vPercent = (necessaryHours / totalHours) * 100;
    let mPercent = 100 - vPercent;
    
    barV.style.width = `${vPercent}%`;
    barM.style.width = `${mPercent}%`;
    
    mPrimeVal.innerText = `${mPrime.toFixed(0)}%`;
    vHoursDesc.innerText = `Làm ${necessaryHours.toFixed(1)}h bù chi phí`;
    mHoursDesc.innerText = `Làm ${surplusHours.toFixed(1)}h sinh lời`;
  }

  let burnoutScore = 0;
  function updateBurnout(isWorking) {
    if (!isWorking) {
      burnoutScore -= 2; 
    } else {
      let wageK = parseInt(sliderWage.value);
      let kpi = parseInt(sliderKpi.value);
      
      let increase = 0;
      if (wageK < 20) increase += (20 - wageK) * 0.5;
      if (kpi > 15) increase += (kpi - 15) * 0.5;
      if (hour >= 17) increase += 4; 
      
      burnoutScore += increase;
    }
    
    burnoutScore = Math.min(100, Math.max(0, burnoutScore));
    let rotation = -90 + (burnoutScore * 1.8);
    burnoutNeedle.style.transform = `rotate(${rotation}deg)`;
    
    if (burnoutScore < 30) {
      burnoutVal.innerText = `${burnoutScore.toFixed(0)}% (Khỏe mạnh)`;
      burnoutVal.className = "text-xl font-bold mt-6 text-emerald-400 bg-slate-900 px-4 py-1 rounded-lg border border-slate-700";
      alertMsg.classList.remove('opacity-100');
    } else if (burnoutScore < 75) {
      burnoutVal.innerText = `${burnoutScore.toFixed(0)}% (Mệt mỏi)`;
      burnoutVal.className = "text-xl font-bold mt-6 text-amber-400 bg-slate-900 px-4 py-1 rounded-lg border border-slate-700";
      if (isWorking) dropSweat();
      alertMsg.classList.remove('opacity-100');
    } else {
      burnoutVal.innerText = `${burnoutScore.toFixed(0)}% (KIỆT SỨC!)`;
      burnoutVal.className = "text-xl font-bold mt-6 text-rose-500 bg-slate-900 px-4 py-1 rounded-lg border border-slate-700 animate-pulse";
      if (isWorking) dropSweat();
      if(burnoutScore >= 98) {
         isGameOver = true;
         alertMsg.innerText = "Nhân viên đã kiệt sức và nghỉ việc! Quán phá sản.";
         alertMsg.classList.add('opacity-100');
         alertMsg.classList.remove('opacity-0', '-translate-y-4');
         animWorker.classList.add('opacity-0'); 
      }
    }
  }

  sliderWage.addEventListener('input', (e) => {
    wageVal.innerText = `${e.target.value}k/h`;
    calculateMPrime();
  });
  
  sliderOt.addEventListener('input', (e) => {
    otVal.innerText = `+${e.target.value}h`;
    if(isOtChot) {
       plannedOtHours = parseFloat(e.target.value);
    }
    calculateMPrime();
  });
  
  sliderKpi.addEventListener('input', (e) => {
    kpiVal.innerText = `${e.target.value} cốc/h`;
    calculateMPrime();
  });

  btnOtToggle.addEventListener('click', () => {
    isOtChot = !isOtChot;
    if(isOtChot) {
      btnOtToggle.innerText = "Hủy OT";
      btnOtToggle.classList.remove('bg-slate-600');
      btnOtToggle.classList.add('bg-rose-600');
      plannedOtHours = parseFloat(sliderOt.value);
    } else {
      btnOtToggle.innerText = "Chốt OT";
      btnOtToggle.classList.add('bg-slate-600');
      btnOtToggle.classList.remove('bg-rose-600');
      plannedOtHours = 0;
    }
    calculateMPrime();
  });

  function tick() {
    if(isGameOver) return;
    
    hour++;
    if (hour >= 24) {
      hour = 0;
      day++;
    }
    
    clockText.innerText = `Ngày ${day} - ${hour.toString().padStart(2, '0')}:00`;
    
    let isWorking = false;
    
    if (hour === 17) {
      currentShiftOt = plannedOtHours; 
      isOtChot = false;
      plannedOtHours = 0;
      btnOtToggle.innerText = "Chốt OT";
      btnOtToggle.classList.add('bg-slate-600');
      btnOtToggle.classList.remove('bg-rose-600');
      calculateMPrime();
    }
    
    if (hour > 9 && hour <= 17) {
      isWorking = true;
    } else if (hour > 17 && hour <= 17 + currentShiftOt) {
      isWorking = true;
    }

    if (isWorking) {
      animWorker.classList.remove('opacity-0');
      
      let { baseWage, surplus, valueGenerated, depreciation } = getHourlyData();
      totalWages += baseWage;
      totalProfit += surplus;
      
      // Update machine usage hours
      machineState[techLevel].hoursUsed += 1;
      
      scoreWage.innerText = formatMoney(totalWages);
      scoreProfit.innerText = formatMoney(totalProfit);
      
      // Accumulate Financial Data
      let rev = baseWage + depreciation + surplus;
      hData = { wage: baseWage, dep: depreciation, profit: surplus, rev: rev };
      
      dData.wage += baseWage; dData.dep += depreciation; dData.profit += surplus; dData.rev += rev;
      wData.wage += baseWage; wData.dep += depreciation; wData.profit += surplus; wData.rev += rev;
      mData.wage += baseWage; mData.dep += depreciation; mData.profit += surplus; mData.rev += rev;

      addFinancialLog('hour', hData, `Ngày ${day} - ${hour.toString().padStart(2, '0')}:00`);
      
      renderTechButtons(); // Re-render to update the buttons state (canBuy check) and hours left
    } else {
      animWorker.classList.add('opacity-0');
      // Re-render to update canBuy if they somehow crossed threshold
      renderTechButtons();
    }
    
    updateBurnout(isWorking);
    
    let windowOpen = (hour >= 17 || hour < 12);
    if(windowOpen) {
       btnOtToggle.disabled = false;
       btnOtToggle.classList.remove('opacity-50', 'cursor-not-allowed');
       otStatus.innerText = "CEO có thể chốt OT ngày tới";
       sliderOt.parentElement.classList.remove('opacity-50');
       sliderOt.disabled = false;
    } else {
       btnOtToggle.disabled = true;
       btnOtToggle.classList.add('opacity-50', 'cursor-not-allowed');
       otStatus.innerText = "Đã khóa chốt OT";
       sliderOt.parentElement.classList.add('opacity-50');
       sliderOt.disabled = true;
    }

    if (hour === 23) {
      if (dData.rev > 0) {
        addFinancialLog('day', dData, `Ngày ${day} (Cả ngày)`);
      }
      dData = { wage: 0, dep: 0, profit: 0, rev: 0 };
      
      if (day % 7 === 0) {
        addFinancialLog('week', wData, `Tuần ${day/7} (7 Ngày)`);
        wData = { wage: 0, dep: 0, profit: 0, rev: 0 };
      }
      if (day % 30 === 0) {
        addFinancialLog('month', mData, `Tháng ${day/30} (30 Ngày)`);
        mData = { wage: 0, dep: 0, profit: 0, rev: 0 };
      }
    }
  }

  const gameSpeedSelect = document.getElementById('game-speed');
  let tickDuration = parseInt(gameSpeedSelect.value) || 1000;
  
  gameSpeedSelect.addEventListener('change', (e) => {
    tickDuration = parseInt(e.target.value);
    if(gameInterval) {
      clearInterval(gameInterval);
      gameInterval = setInterval(tick, tickDuration);
    }
  });

  sliderOt.parentElement.classList.add('opacity-50');
  sliderOt.disabled = true;
  calculateMPrime();
  renderTechButtons();
  
  if(gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(tick, tickDuration); 
}
