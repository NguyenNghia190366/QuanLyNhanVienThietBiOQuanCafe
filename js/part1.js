import { dropSweat } from './animations.js';

export let globalTechLevel = 1;

export function initPart1() {
  const clockText = document.getElementById('clock-text');
  
  // Sliders
  const sliderWage = document.getElementById('slider-wage');
  const sliderOt = document.getElementById('slider-ot');
  const sliderKpi = document.getElementById('slider-kpi');
  
  const wageVal = document.getElementById('wage-val');
  const otVal = document.getElementById('ot-val');
  const kpiVal = document.getElementById('kpi-val');
  
  const btnOtToggle = document.getElementById('btn-ot-toggle');
  const otStatus = document.getElementById('ot-status');
  
  // Progress bar m'
  const barV = document.getElementById('bar-v');
  const barM = document.getElementById('bar-m');
  const mPrimeVal = document.getElementById('m-prime-val');
  const vHoursDesc = document.getElementById('v-hours-desc');
  const mHoursDesc = document.getElementById('m-hours-desc');
  
  // Burnout Gauge
  const burnoutNeedle = document.getElementById('burnout-needle');
  const burnoutVal = document.getElementById('burnout-val');
  
  // Tech buttons
  const techBtns = document.querySelectorAll('.tech-btn');
  const animMachine = document.getElementById('anim-machine');
  const machineLabel = document.getElementById('machine-label');
  const animWorker = document.getElementById('anim-worker');
  
  const alertMsg = document.getElementById('alert-msg');
  
  // Scoreboard
  const scoreWage = document.getElementById('score-wage');
  const scoreProfit = document.getElementById('score-profit');
  
  // Game State
  let day = 1;
  let hour = 9;
  
  let plannedOtHours = 0; // OT planned for the upcoming 17:00 shift
  let currentShiftOt = 0; // OT currently being executed today
  let isOtChot = false; // Has the CEO clicked "Chốt OT" for the upcoming shift?
  
  let gameInterval = null;
  let techLevel = 1;
  let isGameOver = false;
  
  let totalWages = 0;
  let totalProfit = 0;
  
  function getHourlyData() {
    let baseWage = parseInt(sliderWage.value) * 1000; // e.g. 20k
    let kpi = parseInt(sliderKpi.value); 
    let techMultiplier = techLevel === 1 ? 1 : (techLevel === 2 ? 2 : 5);
    // Value generated per hour. E.g. KPI 10, tech 1 -> 10 * 1 * 5k = 50k
    let valueGenerated = kpi * techMultiplier * 5000;
    let surplus = valueGenerated - baseWage;
    return { baseWage, surplus, valueGenerated };
  }
  
  // Update UI logic for progress bar (estimation based on current settings)
  function calculateMPrime() {
    let { baseWage, surplus, valueGenerated } = getHourlyData();
    let displayOt = isOtChot ? parseFloat(sliderOt.value) : 0;
    let totalHours = 8 + displayOt;
    
    let necessaryHours = (baseWage * totalHours) / valueGenerated;
    if (necessaryHours > totalHours) necessaryHours = totalHours;
    
    let surplusHours = totalHours - necessaryHours;
    let mPrime = surplusHours > 0 ? (surplusHours / necessaryHours) * 100 : 0;
    
    let vPercent = (necessaryHours / totalHours) * 100;
    let mPercent = 100 - vPercent;
    
    barV.style.width = `${vPercent}%`;
    barM.style.width = `${mPercent}%`;
    
    mPrimeVal.innerText = `${mPrime.toFixed(0)}%`;
    vHoursDesc.innerText = `Làm ${necessaryHours.toFixed(1)}h bù lương`;
    mHoursDesc.innerText = `Làm ${surplusHours.toFixed(1)}h thặng dư`;
  }

  // Calculate Burnout dynamically
  let burnoutScore = 0;
  function updateBurnout(isWorking) {
    if (!isWorking) {
      burnoutScore -= 2; // Rest decay
    } else {
      let wageK = parseInt(sliderWage.value);
      let kpi = parseInt(sliderKpi.value);
      
      let increase = 0;
      if (wageK < 20) increase += (20 - wageK) * 0.5;
      if (kpi > 15) increase += (kpi - 15) * 0.5;
      if (hour >= 17) increase += 4; // High penalty for OT hours
      
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
         animWorker.classList.add('opacity-0'); // Disappear
      }
    }
  }

  // Event Listeners for Sliders
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
  
  // Tech upgrades
  techBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let level = parseInt(btn.dataset.level);
      techLevel = level;
      globalTechLevel = level; 
      
      techBtns.forEach(b => {
        b.classList.remove('border-cyan-500');
        b.classList.add('border-slate-600');
      });
      btn.classList.add('border-cyan-500');
      btn.classList.remove('border-slate-600');
      
      animMachine.src = `/assets/machine${level}.png`;
      if(level === 1) machineLabel.innerText = "Phin Cấp 1";
      if(level === 2) {
        machineLabel.innerText = "Espresso Cấp 2";
        sliderWage.value = Math.max(15, parseInt(sliderWage.value) - 2);
        wageVal.innerText = `${sliderWage.value}k/h`;
      }
      if(level === 3) {
        machineLabel.innerText = "Robot Cấp 3";
        sliderWage.value = Math.max(15, parseInt(sliderWage.value) - 5);
        wageVal.innerText = `${sliderWage.value}k/h`;
      }
      
      animMachine.classList.add('scale-125');
      setTimeout(() => animMachine.classList.remove('scale-125'), 300);
      calculateMPrime();
    });
  });

  function formatMoney(amount) {
    return amount.toLocaleString('vi-VN') + " VNĐ";
  }

  // Game Loop
  function tick() {
    if(isGameOver) return;
    
    hour++;
    if (hour >= 24) {
      hour = 0;
      day++;
    }
    
    clockText.innerText = `Ngày ${day} - ${hour.toString().padStart(2, '0')}:00`;
    
    // Evaluate if working
    let isWorking = false;
    
    // At 17:00, lock in the OT for today and reset planning for tomorrow
    if (hour === 17) {
      currentShiftOt = plannedOtHours; // The OT to actually perform today
      
      // Reset window for tomorrow
      isOtChot = false;
      plannedOtHours = 0;
      btnOtToggle.innerText = "Chốt OT";
      btnOtToggle.classList.add('bg-slate-600');
      btnOtToggle.classList.remove('bg-rose-600');
      calculateMPrime();
    }
    
    if (hour >= 9 && hour < 17) {
      isWorking = true;
    } else if (hour >= 17 && hour < 17 + currentShiftOt) {
      isWorking = true;
    }

    if (isWorking) {
      animWorker.classList.remove('opacity-0');
      
      // Accumulate money
      let { baseWage, surplus } = getHourlyData();
      totalWages += baseWage;
      totalProfit += surplus;
      
      scoreWage.innerText = formatMoney(totalWages);
      scoreProfit.innerText = formatMoney(totalProfit);
    } else {
      // Worker rests, disappears from screen
      animWorker.classList.add('opacity-0');
    }
    
    updateBurnout(isWorking);
    
    // OT decision window: 17:00 to 11:59 (so hour < 12)
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
  }

  // Initial setup
  sliderOt.parentElement.classList.add('opacity-50');
  sliderOt.disabled = true;
  calculateMPrime();
  scoreWage.innerText = "0 VNĐ";
  scoreProfit.innerText = "0 VNĐ";
  
  if(gameInterval) clearInterval(gameInterval);
  // Run slightly faster so the cycle is enjoyable (1000ms = 1 hour)
  gameInterval = setInterval(tick, 1000); 
}
