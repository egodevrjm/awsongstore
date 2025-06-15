// GitHub API utilities for file operations
const GITHUB_API_BASE = 'https://api.github.com'

export class GitHubAPI {
  constructor(token, owner, repo) {
    this.token = token
    this.owner = owner
    this.repo = repo
    this.headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  }

  async uploadFile(path, content, message, branch = 'main') {
    try {
      // First, try to get the existing file to get its SHA (for updates)
      let sha = null
      try {
        const existingFile = await this.getFile(path, branch)
        sha = existingFile.sha
      } catch (error) {
        // File doesn't exist, which is fine for new uploads
      }

      const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`
      
      const body = {
        message,
        content,
        branch
      }

      if (sha) {
        body.sha = sha
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`GitHub API error: ${error.message}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading file to GitHub:', error)
      throw error
    }
  }

  async getFile(path, branch = 'main') {
    try {
      const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}?ref=${branch}`
      
      const response = await fetch(url, {
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`File not found: ${path}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting file from GitHub:', error)
      throw error
    }
  }

  async deleteFile(path, message, sha, branch = 'main') {
    try {
      const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
        body: JSON.stringify({
          message,
          sha,
          branch
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`GitHub API error: ${error.message}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting file from GitHub:', error)
      throw error
    }
  }

  // Helper method to convert file to base64
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Remove the data URL prefix to get just the base64 content
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  // Helper method to generate a safe filename
  static generateSafeFilename(originalName, songId) {
    const timestamp = Date.now()
    const extension = originalName.split('.').pop()
    const safeName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
    
    return `images/songs/${songId}/${timestamp}_${safeName}`
  }
}