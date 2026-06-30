export function initPart3() {
  const p3Month = document.getElementById('p3-month');
  const p3Clock = document.getElementById('p3-clock');
  const p3ProgressBar = document.getElementById('p3-progress-bar');
  
  const p3GrossRev = document.getElementById('p3-gross-rev');
  const p3ValC = document.getElementById('p3-val-c');
  const p3ValV = document.getElementById('p3-val-v');
  const p3ValM = document.getElementById('p3-val-m');
  const p3CvWarning = document.getElementById('p3-cv-warning');
  const p3ValPerClick = document.getElementById('p3-val-per-click');
  const p3ValMissingUpgrade = document.getElementById('p3-val-missing-upgrade');
  
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
  const modalBtnContinue = document.getElementById('p3-modal-btn-continue');
  const modalControlsPos = document.getElementById('p3-modal-controls-positive');
  const modalControlsNeg = document.getElementById('p3-modal-controls-negative');
  
  const setupScreen = document.getElementById('p3-setup-screen');
  const setupV = document.getElementById('p3-setup-v');
  const setupC = document.getElementById('p3-setup-c');
  const setupInvest = document.getElementById('p3-setup-invest');
  const setupTime = document.getElementById('p3-setup-time');
  const setupSet = document.getElementById('p3-setup-set');
  const btnStartGame = document.getElementById('p3-btn-start-game');
  
  const cartLuxuryText = document.getElementById('p3-cart-luxury-text');
  const cartLuxurySlider = document.getElementById('p3-cart-luxury-slider');
  
  const cartSetsCost = document.getElementById('p3-cart-sets-cost');
  const cartSetPrice = document.getElementById('p3-cart-set-price');
  const cartBtnSetMinus = document.getElementById('p3-cart-btn-set-minus');
  const cartSetsCount = document.getElementById('p3-cart-sets-count');
  const cartBtnSetPlus = document.getElementById('p3-cart-btn-set-plus');
  
  const cartInvestCost = document.getElementById('p3-cart-invest-cost');
  const cartInvestPrice = document.getElementById('p3-cart-invest-price');
  const cartBtnInvestToggle = document.getElementById('p3-cart-btn-invest-toggle');
  
  const cartTotalCost = document.getElementById('p3-cart-total-cost');
  const cartWarning = document.getElementById('p3-cart-warning');
  const modalBtnConfirm = document.getElementById('p3-modal-btn-confirm');
  

  
  const winModal = document.getElementById('p3-win-modal');
  const btnWinReturn = document.getElementById('p3-btn-win-return');
  
  let month = 1;
  let timeLeft = 30;
  let timerInterval = null;
  
  let level = 1;
  let flexScore = 0;
  
  let numMachines = 1;
  let numBaristas = 1;
  
  let cCostPerMachine = 10;
  let vCostPerBarista = 15;
  let baseInvestCost = 100;
  let monthDuration = 30;
  let baseSetCost = 50;
  
  let baseWPerClick = 1;
  
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
    // Không set currentM = 0 nếu âm nữa để người chơi thấy rõ lỗ
    
    p3ValC.innerText = `${currentC} Tr` + (isFreeLabor ? " (0Đ Khấu hao!)" : "");
    p3ValV.innerText = `${currentV} Tr`;
    p3ValM.innerText = `${currentM} Tr`;
    
    // Chỉ số phụ
    let efficiency = Math.min(1, numMachines / numBaristas);
    let revAdded = Math.round(baseWPerClick * numBaristas * efficiency);
    p3ValPerClick.innerText = `${revAdded} Tr`;
    
    let investCost = level * baseInvestCost;
    let missing = investCost - currentM;
    
    if (level > 5) {
      p3ValMissingUpgrade.innerText = `Đã max cấp!`;
      p3ValMissingUpgrade.classList.remove('text-purple-400');
      p3ValMissingUpgrade.classList.add('text-emerald-400');
    } else if (missing <= 0) {
      p3ValMissingUpgrade.innerText = `Đã Đủ Điều Kiện!`;
      p3ValMissingUpgrade.classList.remove('text-purple-400');
      p3ValMissingUpgrade.classList.add('text-emerald-400');
    } else {
      p3ValMissingUpgrade.innerText = `${missing} Tr`;
      p3ValMissingUpgrade.classList.remove('text-emerald-400');
      p3ValMissingUpgrade.classList.add('text-purple-400');
    }
  }
  
  function updateLevelUI() {
    let lData = LEVEL_DATA[level] || LEVEL_DATA[5];
    p3CafeImg.innerText = lData.icon;
    p3LevelName.innerText = lData.name;
    
    let investCost = level * baseInvestCost;
    btnInvest.innerHTML = `<span>🚀 Nâng cấp Cửa Hàng (-${investCost} Tr)</span>`;
    btnInvest.nextElementSibling.innerText = `Cần ${investCost} Tr tiền Lãi (m) để nâng cấp.`;
  }
  
  function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  function startMonth() {
    timeLeft = monthDuration;
    // grossRev không bị reset về 0, để lại làm vốn tích lũy cho tháng sau
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
      p3ProgressBar.style.width = `${(timeLeft / monthDuration) * 100}%`;
      
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
    
    // Gán lại vốn tích lũy (W mới sẽ là m của tháng cũ)
    grossRev = finalM;
    
    // Show Modal
    modalW.innerText = `${finalM + finalC + finalV} Tr`;
    modalC.innerText = `-${finalC} Tr`;
    modalV.innerText = `-${finalV} Tr`;
    modalM.innerText = `${finalM} Tr`;
    
    endMonthModal.classList.remove('hidden');
    endMonthModal.classList.add('flex');
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }, 50);
    
    let investCost = level * baseInvestCost;
    
    if (finalM < 0) {
       modalControlsPos.classList.add('hidden');
       modalControlsPos.classList.remove('flex');
       modalControlsNeg.classList.remove('hidden');
       modalControlsNeg.classList.add('flex');
     } else {
       modalControlsNeg.classList.add('hidden');
       modalControlsNeg.classList.remove('flex');
       modalControlsPos.classList.remove('hidden');
       modalControlsPos.classList.add('flex');
       
       cartSetPrice.innerText = baseSetCost;
       cartInvestPrice.innerText = investCost;
       
       let luxAmount = 0;
       let setsAmount = 0;
       let isInvestSelected = false;
       
       const updateTotal = () => {
         let total = luxAmount + (setsAmount * baseSetCost) + (isInvestSelected ? investCost : 0);
         cartLuxuryText.innerText = `${luxAmount} Tr`;
         cartSetsCost.innerText = `${setsAmount * baseSetCost} Tr`;
         cartInvestCost.innerText = `${isInvestSelected ? investCost : 0} Tr`;
         cartTotalCost.innerText = `${total} Tr`;
         
         if (total > finalM) {
           cartWarning.classList.remove('hidden');
           modalBtnConfirm.disabled = true;
         } else {
           cartWarning.classList.add('hidden');
           modalBtnConfirm.disabled = false;
         }
       };
       
       cartLuxurySlider.max = finalM;
       cartLuxurySlider.value = 0;
       cartLuxurySlider.oninput = (e) => {
         luxAmount = parseInt(e.target.value);
         updateTotal();
       };
       
       cartSetsCount.innerText = "0";
       cartBtnSetMinus.onclick = () => {
         if (setsAmount > 0) setsAmount--;
         cartSetsCount.innerText = setsAmount;
         updateTotal();
       };
       cartBtnSetPlus.onclick = () => {
         setsAmount++;
         cartSetsCount.innerText = setsAmount;
         updateTotal();
       };
       
       isInvestSelected = false;
       cartBtnInvestToggle.classList.remove('bg-amber-600', 'text-white', 'border-transparent');
       cartBtnInvestToggle.classList.add('bg-slate-700', 'text-slate-300', 'border-slate-600');
       cartBtnInvestToggle.innerText = "CHỌN";
       
       cartBtnInvestToggle.onclick = () => {
         isInvestSelected = !isInvestSelected;
         if (isInvestSelected) {
           cartBtnInvestToggle.classList.remove('bg-slate-700', 'text-slate-300', 'border-slate-600');
           cartBtnInvestToggle.classList.add('bg-amber-600', 'text-white', 'border-transparent');
           cartBtnInvestToggle.innerText = "ĐÃ CHỌN";
         } else {
           cartBtnInvestToggle.classList.remove('bg-amber-600', 'text-white', 'border-transparent');
           cartBtnInvestToggle.classList.add('bg-slate-700', 'text-slate-300', 'border-slate-600');
           cartBtnInvestToggle.innerText = "CHỌN";
         }
         updateTotal();
       };
       
       modalBtnConfirm.onclick = () => handleConfirm(luxAmount, setsAmount, isInvestSelected, investCost);
       updateTotal();
    }
  }
  
  modalBtnContinue.onclick = () => {
    month++;
    startMonth();
  };
  
  function handleConfirm(luxAmount, setsAmount, isInvestSelected, costInvest) {
    flexScore += luxAmount;
    flexScoreEl.innerText = flexScore;
    
    numMachines += setsAmount;
    numBaristas += setsAmount;
    
    grossRev -= luxAmount;
    grossRev -= (setsAmount * baseSetCost);
    
    baseWPerClick += setsAmount;
    
    if (isInvestSelected) {
      level++;
      if (level > 5) {
        endMonthModal.classList.add('hidden');
        endMonthModal.classList.remove('flex');
        winModal.classList.remove('hidden');
        winModal.classList.add('flex');
        return;
      }
      
      numMachines += level; 
      numBaristas += level;
      machineLifeMonths = 0; 
      baseWPerClick += 1; 
      
      grossRev -= costInvest;
    }
    
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
  btnStartGame.addEventListener('click', () => {
    vCostPerBarista = parseInt(setupV.value) || 15;
    cCostPerMachine = parseInt(setupC.value) || 10;
    baseInvestCost = parseInt(setupInvest.value) || 100;
    monthDuration = parseInt(setupTime.value) || 30;
    baseSetCost = parseInt(setupSet.value) || 50;
    
    setupScreen.classList.add('hidden');
    
    // Reset state
    month = 1;
    level = 1;
    flexScore = 0;
    numMachines = 1;
    numBaristas = 1;
    baseWPerClick = 1;
    grossRev = 0;
    machineLifeMonths = 0;
    flexScoreEl.innerText = 0;
    
    startMonth();
  });
  
  btnWinReturn.addEventListener('click', () => {
    window.location.reload();
  });
}
