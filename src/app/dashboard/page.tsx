"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = () => {
      // const authCookie = document.cookie
      //   .split('; ')
      //   .find(row => row.startsWith('session='));
      
      // if (!authCookie) {
      //   router.push('/login');
      //   return;
      // }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        title="Image Generator"
        description="Use DALL·E or Gemini to create beautiful AI illustrations."
        promptCount={14}
        onEdit={() => alert("Edit Project")}
        onDelete={() => alert("Delete Project")}
      />
    </div>
  );
}
