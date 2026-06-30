export function initPart3() {
  const p3Month = document.getElementById('p3-month');
  const p3Clock = document.getElementById('p3-clock');
  const p3ProgressBar = document.getElementById('p3-progress-bar');
  
  const p3GrossRev = document.getElementById('p3-gross-rev');
  const p3ValC = document.getElementById('p3-val-c');
  const p3ValV = document.getElementById('p3-val-v');
  const p3ValM = document.getElementById('p3-val-m');
  const p3CvWarning = document.getElementById('p3-cv-warning');
  
  const p3CafeImg = document.getElementById('p3-cafe-img');
  const p3LevelName = document.getElementById('p3-level-name');
  
  const btnWork = document.getElementById('p3-btn-work');
  
  const shopOverlay = document.getElementById('p3-shop-overlay');
  const btnLuxury = document.getElementById('p3-btn-luxury');
  const btnInvest = document.getElementById('p3-btn-invest');
  const flexScoreEl = document.getElementById('p3-flex-score');
  
  const endMonthModal = document.getElementById('p3-end-month-modal');
  const modalContent = document.getElementById('p3-modal-content');
  const modalW = document.getElementById('p3-modal-w');
  const modalC = document.getElementById('p3-modal-c');
  const modalV = document.getElementById('p3-modal-v');
  const modalM = document.getElementById('p3-modal-m');
  const modalBtnLuxury = document.getElementById('p3-modal-btn-luxury');
  const modalBtnInvest = document.getElementById('p3-modal-btn-invest');
  
  let month = 1;
  let timeLeft = 30;
  let timerInterval = null;
  
  let level = 1;
  let flexScore = 0;
  
  let numMachines = 1;
  let numBaristas = 1;
  
  const cCostPerMachine = 10; // 10 Tr per machine depreciation
  const vCostPerBarista = 15; // 15 Tr per barista
  let baseWPerClick = 1; // Start small so they have to click a lot
  
  let grossRev = 0;
  let machineLifeMonths = 0; // if >= 5, depreciation is 0
  
  const LEVEL_DATA = {
    1: { name: "Xe Đẩy Vỉa Hè", icon: "🛒" },
    2: { name: "Quán Cafe Nhỏ", icon: "🏪" },
    3: { name: "Chuỗi Cửa Hàng", icon: "🏢" },
    4: { name: "Đế Chế Cafe", icon: "🏙️" },
    5: { name: "Siêu Tập Đoàn", icon: "🌐" }
  };
  
  function updateHUD() {
    p3GrossRev.innerText = `${grossRev} Tr`;
    
    let isFreeLabor = machineLifeMonths >= 5;
    let currentC = isFreeLabor ? 0 : (cCostPerMachine * numMachines);
    let currentV = vCostPerBarista * numBaristas;
    let currentM = grossRev - currentC - currentV;
    if (currentM < 0) currentM = 0; // Display 0 if negative for simplicity in HUD
    
    p3ValC.innerText = `${currentC} Tr` + (isFreeLabor ? " (0Đ Khấu hao!)" : "");
    p3ValV.innerText = `${currentV} Tr`;
    p3ValM.innerText = `${currentM} Tr`;
  }
  
  function updateLevelUI() {
    let lData = LEVEL_DATA[level] || LEVEL_DATA[5];
    p3CafeImg.innerText = lData.icon;
    p3LevelName.innerText = lData.name;
    
    let investCost = level * 100;
    btnInvest.innerHTML = `<span>🚀 Nâng cấp Cửa Hàng (-${investCost} Tr)</span>`;
    btnInvest.nextElementSibling.innerText = `Cần ${investCost} Tr tiền Lãi (m) để nâng cấp.`;
  }
  
  function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  function startMonth() {
    timeLeft = 30;
    grossRev = 0;
    p3Month.innerText = month;
    p3Clock.innerText = formatTime(timeLeft);
    p3ProgressBar.style.width = '100%';
    
    endMonthModal.classList.add('hidden');
    endMonthModal.classList.remove('flex');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    shopOverlay.classList.remove('hidden');
    shopOverlay.classList.add('flex');
    
    updateHUD();
    updateLevelUI();
    
    btnWork.disabled = false;
    btnWork.classList.remove('opacity-50', 'pointer-events-none');
    
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      p3Clock.innerText = formatTime(timeLeft);
      p3ProgressBar.style.width = `${(timeLeft / 30) * 100}%`;
      
      if (timeLeft <= 0) {
        endOfMonth();
      }
    }, 1000);
  }
  
  function endOfMonth() {
    clearInterval(timerInterval);
    btnWork.disabled = true;
    btnWork.classList.add('opacity-50', 'pointer-events-none');
    
    shopOverlay.classList.remove('flex');
    shopOverlay.classList.add('hidden');
    
    machineLifeMonths++;
    
    let isFreeLabor = machineLifeMonths >= 5;
    let finalC = isFreeLabor ? 0 : (cCostPerMachine * numMachines);
    let finalV = vCostPerBarista * numBaristas;
    let finalM = grossRev - finalC - finalV;
    if (finalM < 0) finalM = 0; // Prevent negative surplus for simplicity
    
    // Show Modal
    modalW.innerText = `${grossRev} Tr`;
    modalC.innerText = `-${finalC} Tr`;
    modalV.innerText = `-${finalV} Tr`;
    modalM.innerText = `${finalM} Tr`;
    
    endMonthModal.classList.remove('hidden');
    endMonthModal.classList.add('flex');
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }, 50);
    
    let investCost = level * 100;
    
    // In Modal
    if (finalM < investCost) {
      modalBtnInvest.classList.add('opacity-50', 'grayscale', 'cursor-not-allowed');
      modalBtnInvest.disabled = true;
    } else {
      modalBtnInvest.classList.remove('opacity-50', 'grayscale', 'cursor-not-allowed');
      modalBtnInvest.disabled = false;
    }
    
    // Setup modal button events
    modalBtnLuxury.onclick = () => handleLuxury(finalM);
    modalBtnInvest.onclick = () => handleInvest(investCost, finalM);
  }
  
  function handleLuxury(mVal) {
    flexScore += mVal;
    flexScoreEl.innerText = flexScore;
    month++;
    startMonth();
  }
  
  function handleInvest(cost, mVal) {
    level++;
    numMachines += level; // scale up machines
    numBaristas += level;
    machineLifeMonths = 0; // bought new machines
    baseWPerClick += 1; // increase base power
    
    // Optional: any remaining mVal adds to flexScore? 
    // Or just simple reproduction of remaining
    let remaining = mVal - cost;
    if(remaining > 0) flexScore += remaining;
    flexScoreEl.innerText = flexScore;
    
    month++;
    startMonth();
  }
  
  // Also hook up shop buttons in right panel (if clicked while paused? No, the modal forces decision)
  // The right panel is just decorative / info while running, and locked. We could allow clicking them when paused, 
  // but the modal handles it. We can just bind them to the same logic if needed, but modal is better.
  
  // Clicker Action
  btnWork.addEventListener('click', () => {
    if (timeLeft <= 0) return;
    
    let efficiency = Math.min(1, numMachines / numBaristas);
    let revAdded = Math.round(baseWPerClick * numBaristas * efficiency);
    
    // Sometimes critical hit (x2) just for fun?
    if (Math.random() < 0.1) revAdded *= 2;
    
    grossRev += revAdded;
    
    if (efficiency < 1) {
      p3CvWarning.classList.remove('hidden');
    } else {
      p3CvWarning.classList.add('hidden');
    }
    
    // Create floating text +W
    createFloatingText(btnWork, `+${revAdded}`);
    
    updateHUD();
  });
  
  function createFloatingText(parent, text) {
    const el = document.createElement('div');
    el.className = 'absolute text-emerald-300 font-black text-2xl pointer-events-none drop-shadow-md z-50';
    el.innerText = text;
    
    const rect = parent.getBoundingClientRect();
    const x = Math.random() * 100 + 40; 
    const y = Math.random() * 50 + 20;
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    parent.appendChild(el);
    
    let opacity = 1;
    let top = y;
    
    const anim = setInterval(() => {
      opacity -= 0.05;
      top -= 2;
      el.style.opacity = opacity;
      el.style.top = `${top}px`;
      
      if (opacity <= 0) {
        clearInterval(anim);
        el.remove();
      }
    }, 50);
  }
  
  // Init
  startMonth();
}
