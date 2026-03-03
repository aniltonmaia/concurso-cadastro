import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { candidatesAPI } from '../services/api.ts';

interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
}

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CandidateFormData>();

  useEffect(() => {
    if (isEditing) {
      loadCandidate();
    }
  }, [id]);

  const loadCandidate = async () => {
    try {
      const response = await candidatesAPI.getById(Number(id));
      const candidate = response;
      setValue('name', candidate.name);
      setValue('email', candidate.email);
      setValue('phone', candidate.phone);
      setValue('position', candidate.position);
      setValue('experience', candidate.experience);
      setValue('education', candidate.education);
    } catch (error) {
      console.error('Error loading candidate:', error);
      toast.error('Erro ao carregar candidato');
    }
  };

  const onSubmit = async (data: CandidateFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await candidatesAPI.update(Number(id), data);
        toast.success('Candidato atualizado com sucesso!');
      } else {
        await candidatesAPI.create(data);
        toast.success('Candidato criado com sucesso!');
      }
      navigate('/candidates');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar candidato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/candidates')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    ← Voltar
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Editar Candidato' : 'Novo Candidato'}
                  </h1>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    {...register('name', { required: 'Nome é obrigatório' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email inválido'
                      }
                    })}
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <input
                    {...register('phone', { required: 'Telefone é obrigatório' })}
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Posição Desejada *
                  </label>
                  <input
                    {...register('position', { required: 'Posição é obrigatória' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experiência Profissional *
                  </label>
                  <textarea
                    {...register('experience', { required: 'Experiência é obrigatória' })}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                    Formação Acadêmica *
                  </label>
                  <input
                    {...register('education', { required: 'Formação é obrigatória' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.education && (
                    <p className="mt-1 text-sm text-red-600">{errors.education.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/candidates')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
