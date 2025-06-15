import { useState } from 'react'
import { GitHubAPI } from '../utils/githubApi'

export const useGitHubUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  const uploadImage = async (file, songId, githubConfig) => {
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      throw new Error('GitHub configuration is incomplete')
    }

    setUploading(true)
    const fileId = `${Date.now()}_${file.name}`
    
    try {
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { status: 'converting', progress: 25 }
      }))

      // Convert file to base64
      const base64Content = await GitHubAPI.fileToBase64(file)
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { status: 'uploading', progress: 50 }
      }))

      // Generate safe filename
      const filename = GitHubAPI.generateSafeFilename(file.name, songId)
      
      // Create GitHub API instance
      const github = new GitHubAPI(
        githubConfig.token,
        githubConfig.owner,
        githubConfig.repo
      )

      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { status: 'uploading', progress: 75 }
      }))

      // Upload to GitHub
      const result = await github.uploadFile(
        filename,
        base64Content,
        `Add image for song: ${songId}`,
        githubConfig.branch || 'main'
      )

      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { status: 'complete', progress: 100 }
      }))

      // Return the image data with GitHub URL
      const imageData = {
        id: fileId,
        name: file.name,
        filename,
        url: result.content.download_url,
        githubUrl: result.content.html_url,
        sha: result.content.sha,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }

      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
      }, 3000)

      return imageData
    } catch (error) {
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { status: 'error', progress: 0, error: error.message }
      }))
      throw error
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (imageData, githubConfig) => {
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      throw new Error('GitHub configuration is incomplete')
    }

    try {
      const github = new GitHubAPI(
        githubConfig.token,
        githubConfig.owner,
        githubConfig.repo
      )

      await github.deleteFile(
        imageData.filename,
        `Remove image: ${imageData.name}`,
        imageData.sha,
        githubConfig.branch || 'main'
      )

      return true
    } catch (error) {
      console.error('Error deleting image from GitHub:', error)
      throw error
    }
  }

  return {
    uploadImage,
    deleteImage,
    uploading,
    uploadProgress
  }
}