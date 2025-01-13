import React, { useState } from 'react';
import { Github, Code, Shield, Package, Activity, GitBranch, GitCommit, GitPullRequest } from 'lucide-react';

const RepoPreview = () => {
  // State management remains the same
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);

  // All helper functions remain the same (parseRepoUrl, analyzeCodeQuality, analyzeDependencies, etc.)
  // ... [Previous helper functions remain unchanged]

  const analyzeRepository = async (url) => {
    const { owner, repo } = parseRepoUrl(url);
    
    // All API calls and analysis logic remain the same
    // ... [Previous analysis logic remains unchanged]
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
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
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
              <div className="space-y-6">
                {/* Basic Repository Info */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      <h2 className="text-xl font-bold text-gray-900">Repository Analysis</h2>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                        <p className="mt-1 text-sm text-gray-900">{previewData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Project Type</h4>
                        <p className="mt-1 text-sm text-gray-900">{previewData.type}</p>
                      </div>
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

                {/* Enhanced Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Code Quality Section */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <h3 className="text-lg font-semibold text-gray-900">Code Quality</h3>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Test Coverage</span>
                          <span className="font-medium">{previewData.metrics.codeQuality.testCoverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Code Smells</span>
                          <span className="font-medium">{previewData.metrics.codeQuality.codeSmells}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Technical Debt</span>
                          <span className="font-medium">{previewData.metrics.codeQuality.technicalDebt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duplications</span>
                          <span className="font-medium">{previewData.metrics.codeQuality.duplications}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dependencies Section */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <h3 className="text-lg font-semibold text-gray-900">Dependencies</h3>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total</span>
                          <span className="font-medium">{previewData.metrics.dependencies.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Outdated</span>
                          <span className="font-medium text-yellow-600">
                            {previewData.metrics.dependencies.outdated}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vulnerable</span>
                          <span className="font-medium text-red-600">
                            {previewData.metrics.dependencies.vulnerable}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Section */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commits</span>
                          <span className="font-medium">{previewData.metrics.activity.commits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pull Requests</span>
                          <span className="font-medium">{previewData.metrics.activity.pullRequests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contributors</span>
                          <span className="font-medium">{previewData.metrics.activity.contributors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Update</span>
                          <span className="font-medium">{previewData.metrics.activity.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {previewData.metrics.dependencies.vulnerable > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-6">
                    <p className="text-sm text-red-700">
                      Found {previewData.metrics.dependencies.vulnerable} vulnerable dependencies that need attention.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepoPreview;
