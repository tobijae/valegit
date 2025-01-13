import React, { useState } from 'react';
const RepoPreview = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const handlePreview = async () => {
    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPreviewData({
        type: 'web-app',
        name: repoUrl.split('/').pop(),
        status: 'ready'
      });
    } catch (err) {
      setError('Failed to load repository preview');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">ValeGit Preview</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
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
              {loading ? 'Loading...' : 'Preview Repository'}
            </button>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            {previewData && (
              <div className="mt-4 rounded-md bg-gray-50 p-4">
                <h3 className="text-lg font-medium text-gray-900">Preview Results</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Repository Type: {previewData.type}</p>
                  <p>Name: {previewData.name}</p>
                  <p>Status: {previewData.status}</p>
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
