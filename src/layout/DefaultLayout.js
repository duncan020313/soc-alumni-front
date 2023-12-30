import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import axios from 'axios'

const DefaultLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [getInfo, setGetInfo] = useState(false)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // /api/auth/info로 GET 요청하여 로그인 상태 확인
        const response = await axios.get('/api/auth/info', { withCredentials: true })
        setGetInfo(true)
        if (response.status !== 200) {
          throw new Error('로그인 실패')
        }
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }

    checkLoginStatus()
  }, [])
  if (getInfo && !isLoggedIn) {
    return <Navigate to="/login" />
  } else if (getInfo) {
    return (
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    )
  } else {
    return <div />
  }
}

export default DefaultLayout
