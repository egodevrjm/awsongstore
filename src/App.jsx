import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SongPage from './pages/SongPage'
import EditSongPage from './pages/EditSongPage'
import AddSongPage from './pages/AddSongPage'
import ThemePage from './pages/ThemePage'
import VenuePage from './pages/VenuePage'
import AlbumPage from './pages/AlbumPage'
import { SongProvider } from './context/SongContext'

function App() {
  return (
    <SongProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/song/new" element={<AddSongPage />} />
          <Route path="/song/:songId" element={<SongPage />} />
          <Route path="/song/:songId/edit" element={<EditSongPage />} />
          <Route path="/theme/:theme" element={<ThemePage />} />
          <Route path="/venue/:venue" element={<VenuePage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
        </Routes>
      </Layout>
    </SongProvider>
  )
}

export default App