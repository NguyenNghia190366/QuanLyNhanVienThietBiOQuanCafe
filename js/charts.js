import Chart from 'chart.js/auto';

let chartInstance = null;
let ctx = null;

export function initChart() {
  ctx = document.getElementById('accumulationChart');
  if (!ctx) return;
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0],
      datasets: [
        {
          label: 'Quán Nhỏ (20Tr)',
          data: [20],
          borderColor: '#f43f5e',
          backgroundColor: '#f43f5e20',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Chuỗi Lớn (2 Tỷ)',
          data: [2000],
          borderColor: '#10b981',
          backgroundColor: '#10b98120',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + Number(context.parsed.y).toLocaleString() + ' Tr';
            }
          }
        }
      },
      scales: {
        x: { 
          title: { display: true, text: 'Tháng', color: '#94a3b8' },
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8' }
        },
        y: { 
          title: { display: true, text: 'Tích Lũy (Triệu VNĐ)', color: '#94a3b8' },
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8' },
          type: 'logarithmic'
        }
      },
      animation: {
        duration: 400
      }
    }
  });
}

export function updateChart(month, smallCapVal, bigCapVal) {
  if(!chartInstance) return;
  
  chartInstance.data.labels.push(month);
  chartInstance.data.datasets[0].data.push(smallCapVal);
  chartInstance.data.datasets[1].data.push(bigCapVal);
  chartInstance.update();
}
