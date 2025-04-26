
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import GroupDetailPage from '../components/GroupDetailsPage'
import LoginPage from '../components/LoginPage'
import RegisterPage from '../components/RegisterPage'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={ <HomePage/> } />
            <Route path='/groups/:groupId' element={ <GroupDetailPage/> } />
            <Route path="/login" element={<LoginPage />} />  
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes