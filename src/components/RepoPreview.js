import React, { useState } from 'react';
import { Github, Code } from 'lucide-react';

const RepoPreview = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);

  const analyzeRepository = async (url) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const urlSegments = url.split('/');
    const repoName = urlSegments[urlSegments.length - 1];

    // Determine repository type based on URL patterns
    let type = 'unknown';
    if (url.includes('react') || url.includes('vue') || url.includes('angular')) {
      type = 'web-application';
    } else if (url.includes('android') || url.includes('ios')) {
      type = 'mobile-application';
    } else if (url.includes('desktop')) {
      type = 'desktop-application';
    }

    return {
      name: repoName,
      type: type,
      status: 'ready',
      language: url.includes('typescript') ? 'TypeScript' : 
                url.includes('python') ? 'Python' : 'JavaScript'
    };
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
      setError('Failed to analyze repository');
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
                      <h4 className="text-sm font-medium text-gray-500">Language</h4>
                      <p className="mt-1 text-sm text-gray-900">{previewData.language}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p className="mt-1 text-sm text-gray-900">{previewData.status}</p>
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
