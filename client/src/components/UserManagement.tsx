import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { authAPI } from '../services/api.ts';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'recruiter'
  });

  const roles = [
    { value: 'admin', label: 'Administrador', description: 'Acesso total ao sistema', color: 'bg-purple-100 text-purple-800' },
    { value: 'manager', label: 'Gerente', description: 'Gerencia candidatos e relatórios', color: 'bg-blue-100 text-blue-800' },
    { value: 'recruiter', label: 'Recrutador', description: 'Visualiza e gerencia candidatos', color: 'bg-green-100 text-green-800' },
    { value: 'viewer', label: 'Visualizador', description: 'Apenas visualização de dados', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email é obrigatório');
      return;
    }

    if (!formData.password) {
      toast.error('Senha é obrigatória');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      const response = await authAPI.createUser(formData.name, formData.email, formData.password, formData.role);
      setUsers([...users, response.user]);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'recruiter'
      });
      setShowCreateForm(false);
      toast.success('Usuário criado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar usuário');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (userId === currentUser?.id) {
      toast.error('Você não pode excluir seu próprio usuário');
      return;
    }

    // Usar window.confirm explicitamente para evitar erro do ESLint
    const shouldDelete = window.confirm('Tem certeza que deseja excluir este usuário?');
    if (!shouldDelete) {
      return;
    }

    try {
      await authAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir usuário');
    }
  };

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[3];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Gestão de Usuários</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Usuário
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {roles.map((role, index) => {
              const count = users.filter(user => user.role === role.value).length;
              return (
                <div key={role.value} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{role.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${role.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabela de Usuários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Usuários Cadastrados</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Usuário</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Função</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Data de Criação</th>
                    <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    const isCurrentUser = user.id === currentUser?.id;
                    
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              {isCurrentUser && (
                                <div className="text-xs text-blue-600 font-medium">Você</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                              title="Editar usuário"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {!isCurrentUser && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                title="Excluir usuário"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Criação de Usuário */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Criar Novo Usuário</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do usuário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirme a senha"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
