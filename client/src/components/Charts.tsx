import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  stats: {
    total: number;
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
  candidates: any[];
}

const Charts: React.FC<ChartsProps> = ({ stats, candidates }) => {
  // Gráfico de Pizza - Status dos Candidatos
  const statusPieData = {
    labels: ['Pendentes', 'Em Análise', 'Aprovados', 'Rejeitados'],
    datasets: [
      {
        data: [stats.pending, stats.reviewing, stats.approved, stats.rejected],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // Âmbar
          'rgba(59, 130, 246, 0.8)',  // Azul
          'rgba(16, 185, 129, 0.8)',  // Esmeralda
          'rgba(239, 68, 68, 0.8)',   // Vermelho
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de Barras - Status dos Candidatos
  const statusBarData = {
    labels: ['Pendentes', 'Em Análise', 'Aprovados', 'Rejeitados'],
    datasets: [
      {
        label: 'Quantidade de Candidatos',
        data: [stats.pending, stats.reviewing, stats.approved, stats.rejected],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // Âmbar
          'rgba(59, 130, 246, 0.8)',  // Azul
          'rgba(16, 185, 129, 0.8)',  // Esmeralda
          'rgba(239, 68, 68, 0.8)',   // Vermelho
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Gráfico de Linhas - Candidatos por Posição
  const positionData = candidates.reduce((acc: any, candidate) => {
    const position = candidate.position || 'Não especificada';
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});

  const positionLineData = {
    labels: Object.keys(positionData).slice(0, 6), // Limitar a 6 posições
    datasets: [
      {
        label: 'Candidatos por Posição',
        data: Object.values(positionData).slice(0, 6),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Pizza - Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
        <div className="h-64">
          <Pie data={statusPieData} options={pieOptions} />
        </div>
      </div>

      {/* Gráfico de Barras - Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidatos por Status</h3>
        <div className="h-64">
          <Bar data={statusBarData} options={barOptions} />
        </div>
      </div>

      {/* Gráfico de Linhas - Posições */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidatos por Posição</h3>
        <div className="h-64">
          <Line data={positionLineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
