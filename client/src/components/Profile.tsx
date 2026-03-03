import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { authAPI } from '../services/api.ts';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at || new Date().toISOString()
      });
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email é obrigatório');
      return;
    }

    try {
      const response = await authAPI.updateProfile(formData.name, formData.email);
      const updatedUser = {
        ...user!,
        name: response.user.name,
        email: response.user.email
      };
      
      updateUser(updatedUser);
      setProfile(prev => prev ? { ...prev, ...updatedUser } : null);
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar perfil');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword) {
      toast.error('Senha atual é obrigatória');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      await authAPI.updatePassword(formData.currentPassword, formData.newPassword);
      
      toast.success('Senha atualizada com sucesso!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar senha');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'recruiter': return 'Recrutador';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'recruiter': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Perfil não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{profile.name}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                    {getRoleText(profile.role)}
                  </span>
                  <p className="text-gray-600 mt-4 text-center">{profile.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Membro desde {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Information */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome</p>
                      <p className="text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Função</p>
                      <p className="text-gray-900">{getRoleText(profile.role)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Alterar Senha</h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      minLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      minLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Atualizar Senha
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
