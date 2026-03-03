import React from 'react';

interface DataTableProps {
  candidates: any[];
}

const DataTable: React.FC<DataTableProps> = ({ candidates }) => {
  // Agrupar candidatos por posição
  const positionData = candidates.reduce((acc: any, candidate) => {
    const position = candidate.position || 'Não especificada';
    if (!acc[position]) {
      acc[position] = {
        total: 0,
        pending: 0,
        reviewing: 0,
        approved: 0,
        rejected: 0,
      };
    }
    acc[position].total++;
    acc[position][candidate.status]++;
    return acc;
  }, {});

  // Ordenar posições por total de candidatos
  const sortedPositions = Object.entries(positionData)
    .sort(([,a]: any, [,b]: any) => b.total - a.total)
    .slice(0, 5); // Top 5 posições

  // Calcular dados de tempo (simulado)
  const recentActivity = candidates
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tabela de Posições */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Posições</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Posição</th>
                <th className="text-center py-2 text-sm font-medium text-gray-600">Total</th>
                <th className="text-center py-2 text-sm font-medium text-gray-600">Aprov.</th>
                <th className="text-center py-2 text-sm font-medium text-gray-600">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {sortedPositions.map(([position, data]: any, index: number) => {
                const approvalRate = data.total > 0 ? ((data.approved / data.total) * 100).toFixed(0) : '0';
                return (
                  <tr key={position} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{position}</span>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className="text-sm font-semibold text-gray-900">{data.total}</span>
                    </td>
                    <td className="text-center py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {data.approved}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">{approvalRate}%</span>
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${approvalRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela de Atividade Recente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {recentActivity.map((candidate, index) => {
            const statusColors = {
              pending: 'bg-amber-100 text-amber-800',
              reviewing: 'bg-blue-100 text-blue-800',
              approved: 'bg-emerald-100 text-emerald-800',
              rejected: 'bg-red-100 text-red-800',
            };

            const statusTexts = {
              pending: 'Pendente',
              reviewing: 'Em Análise',
              approved: 'Aprovado',
              rejected: 'Rejeitado',
            };

            return (
              <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {candidate.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-xs text-gray-500">{candidate.position}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status as keyof typeof statusColors]}`}>
                    {statusTexts[candidate.status as keyof typeof statusTexts]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(candidate.created_at || Date.now()).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
