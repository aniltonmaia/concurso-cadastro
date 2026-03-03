import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesAPI } from '../services/api.ts';
import toast from 'react-hot-toast';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  status: string;
  created_at: string;
}

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await candidatesAPI.getAll();
      setCandidates(response.candidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este candidato?')) {
      try {
        await candidatesAPI.delete(id);
        loadCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const updateCandidateStatus = async (id: number, status: string) => {
    try {
      await candidatesAPI.updateStatus(id, status);
      loadCandidates();
      
      const statusMessages: { [key: string]: string } = {
        'reviewing': 'Candidato em análise',
        'approved': 'Candidato aprovado com sucesso!',
        'rejected': 'Candidato rejeitado'
      };
      
      toast.success(statusMessages[status] || 'Status atualizado');
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'approved': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': 
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'reviewing': 
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      case 'approved': 
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected': 
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'reviewing': return 'Em Análise';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Candidatos</h1>
            </div>
            <button
              onClick={() => navigate('/candidates/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Candidato
            </button>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Filtrar por nome ou posição..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Candidato
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {candidates
                    .filter(candidate => 
                      candidate.name.toLowerCase().includes(filter.toLowerCase()) ||
                      candidate.position.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.email}</div>
                        <div className="text-sm text-gray-500">{candidate.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                          {getStatusIcon(candidate.status)}
                          {getStatusText(candidate.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Editar */}
                          <button
                            onClick={() => navigate(`/candidates/${candidate.id}/edit`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 group"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {/* Botões de status - apenas para pendentes e em análise */}
                          {candidate.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateCandidateStatus(candidate.id, 'reviewing')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                                title="Iniciar Análise"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => updateCandidateStatus(candidate.id, 'approved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
                                title="Aprovar Candidato"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                                title="Rejeitar Candidato"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            </>
                          )}

                          {candidate.status === 'reviewing' && (
                            <>
                              <button
                                onClick={() => updateCandidateStatus(candidate.id, 'approved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
                                title="Aprovar Candidato"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                                title="Rejeitar Candidato"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            </>
                          )}

                          {/* Excluir - sempre visível */}
                          <button
                            onClick={() => deleteCandidate(candidate.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                            title="Excluir Candidato"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
