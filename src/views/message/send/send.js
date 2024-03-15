// src/components/EmailSender.js
import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel as CLabel,
  CButton,
} from '@coreui/react'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EmailSender = () => {
  const [departments, setDepartments] = useState([])
  const [degrees, setDegrees] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState([])
  const [selectedDegree, setSelectedDegree] = useState([])
  const [alumniCount, setAlumniCount] = useState(0)

  const [emailModal, setEmailModal] = useState(false)
  const [emailTitle, setEmailTitle] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [password, setPassword] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('email') // Default to email

  useEffect(() => {
    fetchDepartments()
    fetchDegrees()
  }, [])

  useEffect(() => {
    const fetchAlumniCount = async () => {
      try {
        if (selectedMethod === 'email') {
          const response = await axios.get('/api/alumni/email', {
            params: {
              department: selectedDepartment,
              degree: selectedDegree,
            },
          })
          setAlumniCount(response.data.number)
        } else {
          const response = await axios.get('/api/alumni/text', {
            params: {
              department: selectedDepartment,
              degree: selectedDegree,
            },
          })
          setAlumniCount(response.data.number)
        }
      } catch (error) {
        console.error('Error fetching alumni count:', error)
      }
    }
    fetchAlumniCount()
  }, [selectedDepartment, selectedDegree, selectedMethod])

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department')
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchDegrees = async () => {
    try {
      const response = await axios.get('/api/degree')
      setDegrees(response.data)
    } catch (error) {
      console.error('Error fetching degrees:', error)
    }
  }

  const handleSendMessage = () => {
    if (selectedMethod === 'email') {
      handleSendEmail()
    } else {
      handleSendText()
    }
  }

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(Array.from(event.target.selectedOptions, (option) => option.value))
  }

  const handleDegreeChange = (event) => {
    setSelectedDegree(Array.from(event.target.selectedOptions, (option) => option.value))
  }

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value)
  }

  const handleSendEmail = async () => {
    try {
      await axios.post('/api/message/email', {
        title: emailTitle,
        content: emailContent,
        department: selectedDepartment,
        degree: selectedDegree,
      })
      toast.success('Message sent successfully')
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setEmailModal(false)
    }
  }

  const handleSendText = async () => {
    try {
      await axios.post('/api/message/text', {
        title: emailTitle,
        content: emailContent,
        department: selectedDepartment,
        degree: selectedDegree,
      })
      toast.success('Message sent successfully')
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setEmailModal(false)
    }
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>문자/메일 발송</h5>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CLabel>Department:</CLabel>
                <select
                  className="form-select"
                  multiple
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <CLabel>Degree:</CLabel>
                <select
                  className="form-select"
                  multiple
                  onChange={handleDegreeChange}
                  value={selectedDegree}
                >
                  {degrees.map((degree) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <CLabel>Send Method:</CLabel>
                <select
                  className="form-select"
                  onChange={handleMethodChange}
                  value={selectedMethod}
                >
                  <option value="email">Email</option>
                  <option value="text">Text Message</option>
                </select>
              </div>
              <CButton
                color="primary"
                disabled={!selectedDepartment || !selectedDegree}
                onClick={() => setEmailModal(true)}
              >
                Send Message
              </CButton>
              <p className="mt-2">Number of recipients: {alumniCount}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Email Modal */}
      {/* Email Modal */}
      <Modal show={emailModal} onHide={() => setEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMethod} Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <CLabel>Title:</CLabel>
            <Form.Control
              type="text"
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
            />
          </div>
          <ReactQuill
            theme="snow"
            value={emailContent}
            onChange={(value) => setEmailContent(value)}
          />
          <div className="mt-3">
            <CLabel>Password:</CLabel>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
          <Button variant="secondary" onClick={() => setEmailModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </CContainer>
  )
}

export default EmailSender
