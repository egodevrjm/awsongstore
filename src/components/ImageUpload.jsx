import React, { useState } from 'react'
import { Upload, X, ExternalLink, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useGitHubUpload } from '../hooks/useGitHubUpload'

const ImageUpload = ({ 
  songId, 
  images = [], 
  onImagesChange, 
  githubConfig,
  maxImages = 10 
}) => {
  const { uploadImage, deleteImage, uploading, uploadProgress } = useGitHubUpload()
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = async (files) => {
    if (!githubConfig) {
      alert('Please configure GitHub settings first')
      return
    }

    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files')
      return
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    // Upload files one by one
    for (const file of imageFiles) {
      try {
        const imageData = await uploadImage(file, songId, githubConfig)
        onImagesChange([...images, imageData])
      } catch (error) {
        console.error('Upload failed:', error)
        alert(`Failed to upload ${file.name}: ${error.message}`)
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleRemoveImage = async (imageData) => {
    if (!githubConfig) {
      // For local images, just remove from state
      onImagesChange(images.filter(img => img.id !== imageData.id))
      return
    }

    try {
      if (imageData.sha) {
        // Delete from GitHub if it was uploaded there
        await deleteImage(imageData, githubConfig)
      }
      
      // Remove from local state
      onImagesChange(images.filter(img => img.id !== imageData.id))
    } catch (error) {
      console.error('Failed to delete image:', error)
      alert(`Failed to delete image: ${error.message}`)
    }
  }

  const getProgressInfo = (imageId) => {
    return uploadProgress[imageId]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragOver
            ? 'border-red-400 bg-red-400/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${!githubConfig ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (githubConfig) {
            document.getElementById('image-upload-input').click()
          }
        }}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload Images</h3>
        <p className="text-gray-400 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-sm text-gray-500">
          Supports: JPG, PNG, GIF, WebP (Max {maxImages} images)
        </p>
        
        {!githubConfig && (
          <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-200">
                Configure GitHub settings to upload images
              </span>
            </div>
          </div>
        )}
      </div>

      <input
        id="image-upload-input"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={!githubConfig}
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Upload Progress</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {fileId.split('_').slice(1).join('_')}
                </span>
                <div className="flex items-center gap-2">
                  {progress.status === 'complete' && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  {progress.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {['converting', 'uploading'].includes(progress.status) && (
                    <Loader className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  <span className="text-xs text-gray-400">
                    {progress.progress}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === 'error'
                      ? 'bg-red-500'
                      : progress.status === 'complete'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              
              {progress.error && (
                <p className="text-xs text-red-400 mt-1">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h4 className="font-medium mb-4">
            Uploaded Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => {
              const progress = getProgressInfo(image.id)
              
              return (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {progress && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <Loader className="w-6 h-6 text-white animate-spin mx-auto mb-2" />
                          <p className="text-xs text-white">{progress.progress}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Image Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.githubUrl && (
                      <a
                        href={image.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/70 text-white p-1.5 rounded-lg hover:bg-black/90 transition-colors"
                        title="View on GitHub"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    
                    <button
                      onClick={() => handleRemoveImage(image)}
                      className="bg-red-600/70 text-white p-1.5 rounded-lg hover:bg-red-600/90 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Image Info */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 truncate" title={image.name}>
                      {image.name}
                    </p>
                    {image.size && (
                      <p className="text-xs text-gray-500">
                        {(image.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Usage Info */}
      {githubConfig && (
        <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg p-3">
          <p className="mb-1">
            <strong>Repository:</strong> {githubConfig.owner}/{githubConfig.repo}
          </p>
          <p>
            <strong>Storage Path:</strong> images/songs/{songId}/
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageUpload