import { updateChart, initChart } from './charts.js';
import * as animePkg from 'animejs';
const anime = animePkg.default || animePkg;

const COLORS = ['#f43f5e', '#10b981', '#3b82f6', '#eab308', '#a855f7'];
const COMPANY_NAMES = ['Công ty Đỏ', 'Công ty Xanh lá', 'Công ty Xanh dương', 'Công ty Vàng', 'Công ty Tím'];

let companies = [
  { id: 1, name: "Quán Nhỏ", capital: 20, color: COLORS[0], initialCapital: 20 },
  { id: 2, name: "Chuỗi Lớn", capital: 2000, color: COLORS[1], initialCapital: 2000 }
];

const PART2_MACHINES = {
  1: { name: "Phin Cafe Thường", price: 0, depMonths: 0, depPerMonth: 0 },
  2: { name: "Máy Espresso Cơ bản", price: 50, depMonths: 5, depPerMonth: 10 },
  3: { name: "Máy Espresso Cao cấp", price: 150, depMonths: 10, depPerMonth: 15 },
  4: { name: "Robot Pha Chế", price: 300, depMonths: 12, depPerMonth: 25 },
  5: { name: "Dây chuyền Công nghiệp", price: 1000, depMonths: 20, depPerMonth: 50 }
};

export function initPart2() {
  const monthVal = document.getElementById('month-val');
  const btnStartMonth = document.getElementById('btn-start-month');
  const btnFastForward = document.getElementById('btn-fast-forward');
  const depreciationBars = document.getElementById('depreciation-bars');
  const machineSelection = document.getElementById('machine-selection');
  const companiesContainer = document.getElementById('companies-container');
  const btnAddCompany = document.getElementById('btn-add-company');
  const chartLegend = document.getElementById('chart-legend');
  
  const tableHeaderRow = document.getElementById('table-header-row');
  const accumulationTbody = document.getElementById('accumulation-tbody');
  const accumulationTableContainer = document.getElementById('accumulation-table-container');
  
  let currentMonth = 0;
  let selectedMachineId = 2; // Default to Espresso 2
  
  function resetSimulation() {
    currentMonth = 0;
    monthVal.innerText = `Tháng 0`;
    // reset current capital to initial
    companies.forEach(c => c.capital = c.initialCapital);
    initChart(companies);
    renderDepreciation(0);
    renderLegend();
    renderTableHeaders();
  }

  function renderTableHeaders() {
    let html = `<th class="p-2 font-bold text-center border-r border-slate-700/50 w-16">Tháng</th>`;
    companies.forEach(c => {
      html += `<th class="p-2 font-bold" style="color: ${c.color}">${c.name}</th>`;
    });
    tableHeaderRow.innerHTML = html;
    accumulationTbody.innerHTML = '';
  }

  function renderLegend() {
    chartLegend.innerHTML = '';
    companies.forEach(c => {
      chartLegend.innerHTML += `<div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full block" style="background-color: ${c.color}"></span><span class="text-xs text-slate-300">${c.name} (${c.initialCapital}Tr)</span></div>`;
    });
  }

  function renderCompanies() {
    companiesContainer.innerHTML = '';
    companies.forEach((c, index) => {
      const div = document.createElement('div');
      div.className = `p-3 bg-slate-800 rounded-lg border-2`;
      div.style.borderColor = c.color;
      div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-sm" style="color: ${c.color}">${c.name}</div>
          <div class="text-xs text-slate-300 font-mono">${c.initialCapital} Triệu VNĐ</div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500">10Tr</span>
          <input type="range" min="1" max="1000" value="${Math.pow(c.initialCapital/10, 1/3)*100}" class="w-full cursor-pointer h-1 rounded-lg appearance-none" style="background: ${c.color}50; accent-color: ${c.color};" data-index="${index}">
          <span class="text-[10px] text-slate-500">10Tỷ</span>
        </div>
      `;
      companiesContainer.appendChild(div);
      
      const slider = div.querySelector('input');
      slider.addEventListener('input', (e) => {
        let val = e.target.value;
        // Non-linear mapping from 1 to 1000 -> 10 to 10000
        let mapped = 10 * Math.pow(val / 100, 3);
        if (mapped < 10) mapped = 10;
        if (mapped > 10000) mapped = 10000;
        
        c.initialCapital = Math.round(mapped);
        resetSimulation();
        renderCompanies(); // Update text
      });
    });
    
    if (companies.length >= 5) {
      btnAddCompany.classList.add('hidden');
    } else {
      btnAddCompany.classList.remove('hidden');
    }
  }

  btnAddCompany.addEventListener('click', () => {
    if (companies.length < 5) {
      const newIndex = companies.length;
      companies.push({
        id: newIndex + 1,
        name: COMPANY_NAMES[newIndex],
        capital: 100,
        initialCapital: 100,
        color: COLORS[newIndex]
      });
      renderCompanies();
      resetSimulation();
    }
  });

  function renderMachines() {
    machineSelection.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const m = PART2_MACHINES[i];
      const isSelected = i === selectedMachineId;
      const borderClass = isSelected ? 'border-amber-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50 hover:border-amber-500/50';
      
      const div = document.createElement('div');
      div.className = `flex items-center p-2 rounded-lg border-2 cursor-pointer transition-colors ${borderClass}`;
      div.innerHTML = `
        <img src="/assets/machine${i > 3 ? 3 : i}.png" class="w-10 h-10 mr-3 bg-slate-700 rounded-md p-1" style="filter: hue-rotate(${i*40}deg)">
        <div class="flex-1">
          <div class="font-bold text-sm ${isSelected ? 'text-amber-400' : 'text-slate-300'}">${m.name}</div>
          <div class="text-[10px] text-slate-400">Giá: ${m.price}Tr | Khấu hao: ${m.depMonths > 0 ? m.depMonths + ' tháng' : 'Không'}</div>
        </div>
      `;
      
      div.addEventListener('click', () => {
        selectedMachineId = i;
        renderMachines();
        resetSimulation();
      });
      
      machineSelection.appendChild(div);
    }
  }

  function renderDepreciation(month) {
    const m = PART2_MACHINES[selectedMachineId];
    
    if (m.depMonths === 0) {
      depreciationBars.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center text-slate-500 italic bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-700">Máy móc loại này không tính khấu hao.</div></div>`;
      return;
    }

    if (month === 0) {
      depreciationBars.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center text-slate-500 italic bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-700">Bấm PLAY để bắt đầu chạy thời gian.</div></div>`;
      return;
    }
    
    let progress = Math.min(100, (month / m.depMonths) * 100);
    let isFullyDepreciated = month >= m.depMonths;
    
    let barColor = isFullyDepreciated ? "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" : "bg-amber-600";
    let textState = isFullyDepreciated ? "LỰC LƯỢNG PHỤC VỤ KHÔNG CÔNG" : `Đang khấu hao (Tháng ${Math.min(m.depMonths, month)}/${m.depMonths})`;
    let textColor = isFullyDepreciated ? "text-amber-900 font-black" : "text-white";
    
    depreciationBars.innerHTML = `
      <div class="mb-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
        <div class="flex justify-between text-sm mb-2">
          <span class="font-bold text-slate-300 text-lg">${m.name}</span>
          <span class="text-amber-400 font-bold text-lg">${isFullyDepreciated ? 'Hoàn vốn 100%' : `${progress.toFixed(0)}%`}</span>
        </div>
        <div class="relative w-full h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
          <div class="h-full ${barColor} transition-all duration-1000 ease-out flex items-center justify-center text-xs ${textColor}" style="width: ${progress}%">
            ${textState}
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-400 text-center">
          ${isFullyDepreciated ? 'Máy móc tiếp tục sinh lời mà không tốn chi phí hao mòn!' : `Đã chuyển ${month * m.depPerMonth} Tr vào chi phí.`}
        </div>
      </div>
    `;
  }

  function advanceMonth() {
    currentMonth++;
    monthVal.innerText = `Tháng ${currentMonth}`;
    
    const m = PART2_MACHINES[selectedMachineId];
    let isFullyDepreciated = currentMonth >= m.depMonths;
    
    let valuesArray = [];
    
    companies.forEach(c => {
      // Base surplus calculation: 5% of capital naturally? Or fixed base surplus.
      // We scale base surplus based on capital size to represent scale.
      let baseSurplus = c.capital * 0.05; 
      
      // Bonus from free machinery
      if (isFullyDepreciated && m.depMonths > 0) {
        // Larger capital has more machines
        let machineCount = Math.max(1, Math.floor(c.capital / m.price));
        baseSurplus += (m.depPerMonth * machineCount * 0.5); // Bonus profit
      }
      
      c.capital += baseSurplus;
      valuesArray.push(c.capital.toFixed(0));
    });
    
    updateChart(currentMonth, valuesArray);
    renderDepreciation(currentMonth);
    
    // Thêm record vào bảng
    let rowHtml = `<td class="p-2 border-r border-slate-700/50 text-center font-bold text-slate-400">${currentMonth}</td>`;
    valuesArray.forEach((val, i) => {
      rowHtml += `<td class="p-2 font-mono" style="color: ${companies[i].color}">${Number(val).toLocaleString()}</td>`;
    });
    
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800/50 transition-colors';
    tr.innerHTML = rowHtml;
    accumulationTbody.appendChild(tr);
    
    accumulationTableContainer.scrollTop = accumulationTableContainer.scrollHeight;
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
    }, 150);
  });
  
  renderCompanies();
  renderMachines();
  resetSimulation();
}
