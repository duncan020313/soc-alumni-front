import React, { useState, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

const Wrapper = () => {
  const [validated, setValidated] = useState(true)
  const [studentId, setStudentId] = useState('20200445')

  const Edit = React.lazy(() => import('./edit'))
  const Form = React.lazy(() => import('./form'))
  const validateHandler = () => {
    setValidated(true)
  }
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route
            path="/edit"
            element={
              <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
                <Edit handler={validateHandler} idHandler={setStudentId} />
              </div>
            }
          />
          <Route
            path="/form"
            element={
              <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
                <Form isValidated={validated} studentId={studentId} />
              </div>
            }
          />
          <Route path="/" element={<Navigate to="/req/edit" />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default Wrapper
