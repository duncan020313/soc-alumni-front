import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel as CLabel,
  CFormInput as CInput,
  CButton,
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const VerificationPage = ({ handler, idHandler }) => {
  const [selectedMethod, setSelectedMethod] = useState('email')
  const [contactInfo, setContactInfo] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [studentId, setStudentId] = useState('')
  const [timer, setTimer] = useState(180)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isVerificationSuccessful, setIsVerificationSuccessful] = useState(false)
  const history = useNavigate()

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)

      return () => clearInterval(interval)
    } else if (timer === 0) {
      setIsTimerRunning(false)
      setErrorMessage('Verification code has expired. Please request a new one.')
    }
  }, [timer, isTimerRunning])

  const handleRequestVerificationCode = async () => {
    try {
      await axios.post('/api/request/verify-gen', {
        contact: contactInfo,
        studentId,
        method: selectedMethod,
      })

      setTimer(180)
      setIsTimerRunning(true)
      setErrorMessage('')
      setIsVerificationSuccessful(false)
    } catch (error) {
      if (error?.response?.status === 404) {
        setErrorMessage('Matched student was not find. Please try again.')
      } else {
        setErrorMessage('Failed to request verification code. Please try again.')
      }
    }
  }

  const handleVerifyCode = async () => {
    try {
      await axios.post('/api/request/verify-check', {
        contact: contactInfo,
        method: selectedMethod,
        studentId,
        code: verificationCode,
      })

      setIsVerificationSuccessful(true)
      setErrorMessage('')
      // Redirect to the page for directly updating alumni information
      // Add your navigation logic here
      handler()
      idHandler(studentId)
      history('/req/form')
    } catch (error) {
      console.error('Error verifying code:', error)
      setErrorMessage('Verification code is incorrect. Please try again.')
    }
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="6">
          <CCard>
            <CCardHeader>
              <h5>Verification Page</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CLabel>Select Verification Method:</CLabel>
                  <select
                    className="form-control"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
                <div className="mb-3">
                  <CLabel>Enter {selectedMethod === 'email' ? 'Email' : 'Phone Number'}:</CLabel>
                  <CInput
                    type={selectedMethod === 'email' ? 'email' : 'tel'}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CLabel>Student Id:</CLabel>
                  <CInput
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    maxLength={8}
                  />
                </div>
                <div className="mb-3">
                  <CLabel>Enter Verification Code:</CLabel>
                  <CInput
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <div className="mb-3">
                  <CButton
                    color="primary"
                    onClick={handleRequestVerificationCode}
                    disabled={isTimerRunning}
                  >
                    Request Verification Code
                  </CButton>
                </div>
                {isVerificationSuccessful && (
                  <CAlert color="success" className="mt-3">
                    Verification successful! Redirecting...
                  </CAlert>
                )}
                {errorMessage && (
                  <CAlert color="danger" className="mt-3">
                    {errorMessage}
                  </CAlert>
                )}
                <CButton
                  color="primary"
                  className="mt-3"
                  onClick={handleVerifyCode}
                  disabled={!verificationCode || verificationCode.length !== 6}
                >
                  Verify Code
                </CButton>
                {isTimerRunning && (
                  <p className="mt-2">
                    Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}
                    {timer % 60} seconds
                  </p>
                )}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

VerificationPage.propTypes = {
  handler: PropTypes.func.isRequired,
  idHandler: PropTypes.func.isRequired,
}

export default VerificationPage
