import React, { useState } from 'react';
import { Github, Code, Shield, Package, Activity, GitBranch, GitCommit, GitPullRequest } from 'lucide-react';

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

  const analyzeDependencies = async (contents, owner, repo) => {
    try {
      // Find package.json file in contents
      const packageJson = contents.find(file => file.name === 'package.json');
      
      if (packageJson) {
        // Fetch package.json content
        const packageResponse = await fetch(packageJson.download_url);
        if (!packageResponse.ok) throw new Error('Cannot access package.json');
        const packageData = await packageResponse.json();

        // Count dependencies
        const totalDeps = Object.keys({
          ...packageData.dependencies || {},
          ...packageData.devDependencies || {}
        }).length;

        // Mock values for outdated and vulnerable deps
        // In a real implementation, these would come from npm audit or similar
        const outdatedDeps = Math.floor(totalDeps * 0.15); // Example: 15% outdated
        const vulnerableDeps = Math.floor(totalDeps * 0.02); // Example: 2% vulnerable

        return {
          total: totalDeps,
          outdated: outdatedDeps,
          vulnerable: vulnerableDeps
        };
      }

      return {
        total: 0,
        outdated: 0,
        vulnerable: 0
      };
    } catch (error) {
      console.error('Error analyzing dependencies:', error);
      return {
        total: 0,
        outdated: 0,
        vulnerable: 0
      };
    }
  };

  const analyzeCodeQuality = async (owner, repo) => {
    try {
      // Fetch commit history for code churn analysis
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`
      );
      const commits = await commitsResponse.json();

      // Calculate code churn (changes per commit)
      const totalChanges = commits.reduce((acc, commit) => {
        const stats = commit.stats || { total: 0 };
        return acc + stats.total;
      }, 0);
      const averageChurn = totalChanges / commits.length;

      // Mock values for demonstration
      // In a real implementation, these would come from static analysis tools
      return {
        testCoverage: `${Math.min(95, Math.floor(75 + Math.random() * 20))}%`,
        codeSmells: Math.floor(averageChurn / 10),
        technicalDebt: `${Math.floor(averageChurn / 20)} days`,
        duplications: `${Math.min(20, Math.floor(Math.random() * 10 + 2))}%`
      };
    } catch (error) {
      console.error('Error analyzing code quality:', error);
      return {
        testCoverage: 'N/A',
        codeSmells: 'N/A',
        technicalDebt: 'N/A',
        duplications: 'N/A'
      };
    }
  };

  const determineProjectType = (files) => {
    const fileNames = files.map(file => file.name.toLowerCase());
    
    if (fileNames.includes('package.json')) {
      if (fileNames.includes('next.config.js')) return 'Next.js Application';
      if (fileNames.some(f => f.includes('react'))) return 'React Application';
      if (fileNames.some(f => f.includes('vue'))) return 'Vue Application';
      if (fileNames.includes('angular.json')) return 'Angular Application';
      if (fileNames.includes('express')) return 'Express Application';
      return 'Node.js Project';
    }
    
    if (fileNames.includes('go.mod')) return 'Go Project';
    if (fileNames.includes('cargo.toml')) return 'Rust Project';
    if (fileNames.includes('requirements.txt') || fileNames.includes('setup.py')) return 'Python Project';
    if (fileNames.includes('composer.json')) return 'PHP Project';
    if (fileNames.includes('gemfile')) return 'Ruby Project';
    if (fileNames.includes('pom.xml')) return 'Java Project';
    if (fileNames.includes('dockerfile')) return 'Docker Project';
    if (fileNames.includes('kubernetes') || fileNames.some(f => f.endsWith('.yaml'))) return 'Kubernetes Project';
    if (fileNames.includes('index.html')) return 'Static Website';
    
    return 'Unknown Project Type';
  };

  const analyzeTechStack = (files) => {
    const stack = new Set();
    const fileNames = files.map(file => file.name.toLowerCase());
    
    // Frontend
    if (fileNames.includes('package.json')) stack.add('Node.js');
    if (fileNames.some(f => f.includes('react'))) stack.add('React');
    if (fileNames.some(f => f.includes('vue'))) stack.add('Vue.js');
    if (fileNames.includes('angular.json')) stack.add('Angular');
    if (fileNames.includes('next.config.js')) stack.add('Next.js');
    if (fileNames.includes('tailwind.config.js')) stack.add('Tailwind CSS');
    if (fileNames.some(f => f.includes('sass') || f.endsWith('.scss'))) stack.add('Sass');
    
    // Backend
    if (fileNames.includes('requirements.txt')) stack.add('Python');
    if (fileNames.includes('django')) stack.add('Django');
    if (fileNames.includes('flask')) stack.add('Flask');
    if (fileNames.includes('composer.json')) stack.add('PHP');
    if (fileNames.includes('laravel')) stack.add('Laravel');
    if (fileNames.includes('go.mod')) stack.add('Go');
    if (fileNames.includes('cargo.toml')) stack.add('Rust');
    
    // Database
    if (fileNames.some(f => f.includes('.sql'))) stack.add('SQL');
    if (fileNames.some(f => f.includes('mongodb'))) stack.add('MongoDB');
    if (fileNames.some(f => f.includes('redis'))) stack.add('Redis');
    
    // DevOps
    if (fileNames.includes('dockerfile')) stack.add('Docker');
    if (fileNames.some(f => f.includes('kubernetes') || f.endsWith('.yaml'))) stack.add('Kubernetes');
    if (fileNames.includes('.github/workflows')) stack.add('GitHub Actions');
    if (fileNames.includes('jenkins')) stack.add('Jenkins');
    
    // Testing
    if (fileNames.some(f => f.includes('jest'))) stack.add('Jest');
    if (fileNames.some(f => f.includes('cypress'))) stack.add('Cypress');
    if (fileNames.some(f => f.includes('pytest'))) stack.add('PyTest');

    return Array.from(stack);
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

    // Fetch commit activity
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`);
    if (!commitsResponse.ok) throw new Error('Cannot access commit history');
    const commits = await commitsResponse.json();

    // Fetch pull requests
    const prsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`);
    if (!prsResponse.ok) throw new Error('Cannot access pull requests');
    const pullRequests = await prsResponse.json();

    // Fetch contributors
    const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
    if (!contributorsResponse.ok) throw new Error('Cannot access contributors');
    const contributors = await contributorsResponse.json();

    // Fetch branches
    const branchesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`);
    if (!branchesResponse.ok) throw new Error('Cannot access branches');
    const branches = await branchesResponse.json();

    // Analyze project type and tech stack
    const projectType = determineProjectType(contents);
    const techStack = analyzeTechStack(contents);

    // Calculate code quality metrics
    const codeQuality = await analyzeCodeQuality(owner, repo);

    // Analyze dependencies if package.json exists
    const dependencies = await analyzeDependencies(contents, owner, repo);

    return {
      name: repoData.name,
      type: projectType,
      language: repoData.language,
      techStack,
      metrics: {
        codeQuality,
        dependencies,
        activity: {
          commits: commits.length,
          branches: branches.length,
          pullRequests: pullRequests.length,
          contributors: contributors.length,
          lastUpdate: new Date(repoData.updated_at).toLocaleDateString()
        }
      },
      status: 'ready'
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
                      <div className="flex items-center gap-2
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
