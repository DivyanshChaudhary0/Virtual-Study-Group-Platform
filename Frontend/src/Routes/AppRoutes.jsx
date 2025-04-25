
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import GroupDetailPage from '../components/GroupDetailsPage'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={ <HomePage/> } />
            <Route path='/groups/:groupId' element={ <GroupDetailPage/> } />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes