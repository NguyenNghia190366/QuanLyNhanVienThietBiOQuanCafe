import Chart from 'chart.js/auto';

let chartInstance = null;
let ctx = null;

export function initChart(companies) {
  ctx = document.getElementById('accumulationChart');
  if (!ctx || !companies) return;
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  let datasets = companies.map(c => ({
    label: c.name,
    data: [c.capital],
    borderColor: c.color,
    backgroundColor: c.color + '20',
    borderWidth: 3,
    tension: 0.4,
    fill: true
  }));
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0],
      datasets: datasets
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

export function updateChart(month, valuesArray) {
  if(!chartInstance) return;
  
  chartInstance.data.labels.push(month);
  for(let i = 0; i < valuesArray.length; i++) {
    if(chartInstance.data.datasets[i]) {
      chartInstance.data.datasets[i].data.push(valuesArray[i]);
    }
  }
  chartInstance.update();
}
