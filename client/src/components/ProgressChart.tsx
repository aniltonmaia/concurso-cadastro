import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  stats: {
    total: number;
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
}

const ProgressChart: React.FC<ProgressChartProps> = ({ stats }) => {
  // Calcular taxas de conversão
  const conversionRate = stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : '0';
  const rejectionRate = stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : '0';
  const processingRate = stats.total > 0 ? (((stats.reviewing + stats.approved + stats.rejected) / stats.total) * 100).toFixed(1) : '0';

  const progressData = {
    labels: ['Taxa de Aprovação', 'Taxa de Rejeição', 'Taxa de Processamento'],
    datasets: [
      {
        label: 'Percentual (%)',
        data: [parseFloat(conversionRate), parseFloat(rejectionRate), parseFloat(processingRate)],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Esmeralda para aprovação
          'rgba(239, 68, 68, 0.8)',   // Vermelho para rejeição
          'rgba(59, 130, 246, 0.8)',  // Azul para processamento
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Desempenho</h3>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{conversionRate}%</div>
          <div className="text-sm text-gray-600">Taxa de Aprovação</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{rejectionRate}%</div>
          <div className="text-sm text-gray-600">Taxa de Rejeição</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{processingRate}%</div>
          <div className="text-sm text-gray-600">Taxa de Processamento</div>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="h-48">
        <Bar data={progressData} options={options} />
      </div>

      {/* Indicadores Adicionais */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Candidatos em Análise</span>
            <span className="text-lg font-semibold text-blue-600">{stats.reviewing}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.reviewing / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Candidatos Pendentes</span>
            <span className="text-lg font-semibold text-amber-600">{stats.pending}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-amber-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
