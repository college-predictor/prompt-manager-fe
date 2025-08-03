"use client";

import React from "react";
import Image from "next/image";
import { Model } from "@/lib/api";

interface ProjectCardProps {
  title: string;
  description: string;
  promptCount?: number;
  models?: Model[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const getProviderIcon = (providerName: string) => {
  switch (providerName.toLowerCase()) {
    case "openai":
      return "/openai-icon.svg";
    case "anthropic":
      return "/anthropic-icon.svg";
    case "google ai":
    case "google":
      return "/gemini-icon.svg";
    default:
      return "/openai-icon.svg"; // fallback
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  promptCount = 0,
  models = [],
  onEdit = () => {},
  onDelete = () => {},
}) => {
  // Get unique providers from models
  const uniqueProviders = models.reduce((acc, model) => {
    if (!acc.find(p => p.name === model.provider_name)) {
      acc.push({
        name: model.provider_name,
        icon: getProviderIcon(model.provider_name)
      });
    }
    return acc;
  }, [] as { name: string; icon: string }[]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {promptCount} prompts
          </span>
        </div>
      </div>

      {/* Models Info */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">
          {models.length} model{models.length !== 1 ? 's' : ''} configured
        </div>
        {uniqueProviders.length > 0 && (
          <div className="flex justify-start items-center space-x-3">
            {uniqueProviders.map((provider) => (
              <div key={provider.name} className="flex items-center space-x-1">
                <Image
                  src={provider.icon}
                  alt={provider.name}
                  width={16}
                  height={16}
                />
                <span className="text-xs text-gray-600">{provider.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-4" />

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-700 rounded-md hover:text-red-900 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
