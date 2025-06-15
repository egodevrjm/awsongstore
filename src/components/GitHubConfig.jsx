import React, { useState, useEffect } from 'react'
import { Settings, Eye, EyeOff, Github, CheckCircle, AlertCircle } from 'lucide-react'

const GitHubConfig = ({ onConfigChange, initialConfig = {} }) => {
  const [config, setConfig] = useState({
    token: '',
    owner: '',
    repo: '',
    branch: 'main',
    ...initialConfig
  })
  const [showToken, setShowToken] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('github-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading GitHub config:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Save config to localStorage
    if (config.token || config.owner || config.repo) {
      localStorage.setItem('github-config', JSON.stringify(config))
    }
    
    // Validate config
    const valid = config.token && config.owner && config.repo
    setIsValid(valid)
    
    if (onConfigChange) {
      onConfigChange(valid ? config : null)
    }
  }, [config, onConfigChange])

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const testConnection = async () => {
    if (!isValid) return

    setTesting(true)
    try {
      const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (response.ok) {
        alert('✅ GitHub connection successful!')
      } else {
        const error = await response.json()
        alert(`❌ GitHub connection failed: ${error.message}`)
      }
    } catch (error) {
      alert(`❌ GitHub connection failed: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Github className="w-6 h-6 text-gray-400" />
        <h3 className="text-lg font-semibold">GitHub Configuration</h3>
        {isValid && <CheckCircle className="w-5 h-5 text-green-500" />}
        {!isValid && config.token && <AlertCircle className="w-5 h-5 text-yellow-500" />}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Personal Access Token
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={config.token}
              onChange={(e) => handleInputChange('token', e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Create a token at{' '}
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub Settings
            </a>
            {' '}with 'repo\' permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Repository Owner
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={config.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              placeholder="username or organization"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Repository Name
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={config.repo}
              onChange={(e) => handleInputChange('repo', e.target.value)}
              placeholder="repository-name"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Branch</label>
          <input
            type="text"
            value={config.branch}
            onChange={(e) => handleInputChange('branch', e.target.value)}
            placeholder="main"
            className="w-full"
          />
        </div>

        {isValid && (
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={testConnection}
              disabled={testing}
              className="btn btn-secondary"
            >
              {testing ? (
                <div className="spinner" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        )}
      </div>

      {!isValid && (
        <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-400 mb-1">Setup Required</h4>
              <p className="text-sm text-yellow-200">
                Configure your GitHub repository details to enable image uploads. 
                Images will be stored in your repository under the <code>images/songs/</code> directory.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GitHubConfig