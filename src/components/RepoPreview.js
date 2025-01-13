import React, { useState } from 'react';
import { Github, Code } from 'lucide-react';

const RepoPreview = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);

  const parseRepoUrl = (url) => {
    try {
      const [, , , owner, repo] = url.split('/');
      return { owner, repo };
    } catch {
      throw new Error('Invalid repository URL');
    }
  };

  const analyzeRepository = async (url) => {
    const { owner, repo } = parseRepoUrl(url);
    
    // Fetch repository details
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) throw new Error('Repository not found');
    const repoData = await repoResponse.json();

    // Fetch repository contents
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
    if (!contentsResponse.ok) throw new Error('Cannot access repository contents');
    const contents = await contentsResponse.json();

    // Analyze project type based on files
    const files = contents.map(file => file.name.toLowerCase());
    const projectType = determineProjectType(files);
    const techStack = analyzeTechStack(files);

    return {
      name: repoData.name,
      type: projectType,
      language: repoData.language,
      techStack,
      status: 'ready'
    };
  };

  const determineProjectType = (files) => {
    if (files.includes('package.json')) {
      if (files.includes('react')) return 'React Application';
      if (files.some(f => f.includes('vue'))) return 'Vue Application';
      if (files.includes('angular.json')) return 'Angular Application';
      return 'Node.js Project';
    }
    if (files.includes('requirements.txt') || files.includes('setup.py')) return 'Python Project';
    if (files.includes('gemfile')) return 'Ruby Project';
    if (files.includes('dockerfile')) return 'Docker Project';
    if (files.includes('index.html')) return 'Static Website';
    return 'Unknown Project Type';
  };

  const analyzeTechStack = (files) => {
    const stack = new Set();
    
    if (files.includes('package.json')) stack.add('Node.js');
    if (files.includes('requirements.txt')) stack.add('Python');
    if (files.includes('docker-compose.yml')) stack.add('Docker');
    if (files.includes('kubernetes')) stack.add('Kubernetes');
    if (files.includes('tailwind.config.js')) stack.add('Tailwind CSS');
    if (files.some(f => f.includes('.sql'))) stack.add('SQL');

    return Array.from(stack);
  };

  const handlePreview = async () => {
    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeRepository(repoUrl);
      setPreviewData(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Github className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">ValeGit Preview</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="max-w-3xl">
              <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
                GitHub Repository URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="repoUrl"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://github.com/username/repository"
                />
              </div>
            </div>

            <button
              onClick={handlePreview}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing Repository...
                </div>
              ) : (
                'Preview Repository'
              )}
            </button>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {previewData && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Code className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900">Repository Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                      <p className="mt-1 text-sm text-gray-900">{previewData.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Project Type</h4>
                      <p className="mt-1 text-sm text-gray-900">{previewData.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Primary Language</h4>
                      <p className="mt-1 text-sm text-gray-900">{previewData.language}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Tech Stack</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {previewData.techStack.join(', ') || 'Not detected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepoPreview;
