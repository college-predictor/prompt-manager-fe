"use client";
import React, { useState, useEffect } from 'react';
import { useModels } from '@/hooks/useModels';
import { useProjects } from '@/hooks/useProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedModels: [] as number[],
    apiKeys: {} as { [providerId: string]: string },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { models, fetchModels, loading: modelsLoading } = useModels();
  const { createProject } = useProjects();

  useEffect(() => {
    if (isOpen && models.length === 0) {
      fetchModels();
    }
  }, [isOpen, models.length, fetchModels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.selectedModels.length === 0) return;

    setIsSubmitting(true);
    try {
      const success = await createProject({
        name: formData.name,
        description: formData.description,
        llm_models: formData.selectedModels,
        api_keys: Object.keys(formData.apiKeys).length > 0 ? formData.apiKeys : undefined,
      });

      if (success) {
        setFormData({
          name: '',
          description: '',
          selectedModels: [],
          apiKeys: {},
        });
        onClose();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModelToggle = (modelId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedModels: prev.selectedModels.includes(modelId)
        ? prev.selectedModels.filter(id => id !== modelId)
        : [...prev.selectedModels, modelId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Models *
              </label>
              {modelsLoading ? (
                <div className="text-center py-4">Loading models...</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {models.map((model) => (
                    <label key={model.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.selectedModels.includes(model.id)}
                        onChange={() => handleModelToggle(model.id)}
                        className="mr-3 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{model.model_name}</div>
                        <div className="text-sm text-gray-500">{model.provider_name}</div>
                        <div className="text-xs text-gray-400">{model.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || formData.selectedModels.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
