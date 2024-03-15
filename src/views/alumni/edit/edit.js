// src/components/AlumniEdit.js
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
} from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'

const AlumniEdit = () => {
  const [alumniId, setAlumniId] = useState('')
  const [alumniInfo, setAlumniInfo] = useState({})
  const [countries, setCountries] = useState([])
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [birthday, setBirthday] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const { id } = useParams()

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    // 사용자가 URL에서 직접 ID를 입력할 경우 대비
    if (id) {
      setAlumniId(id)
      fetchAlumniInfo(id)
    }
  }, [id])

  const fetchAlumniInfo = async (alumniId) => {
    try {
      const response = await axios.get(`/api/alumni/${alumniId}`, {
        headers: {
          'Cache-Control': 'no-store',
          Pragma: 'no-store',
          Expires: '0',
        },
      })
      setAlumniInfo(response.data)
      setName(response.data.korean_name)
      setEnglishName(response.data.english_name)
      setCountryCode(response.data.country_code)
      const bd = response.data.birthday.split('T')[0]
      setBirthday(bd)
      setPhoneNumber(response.data.phone_number)
      setEmail(response.data.email)
    } catch (error) {
      toast.error('Invalid student ID')
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/country')
      setCountries(response.data)
    } catch (error) {
      console.error('Error fetching countries')
    }
  }

  const handleSave = async () => {
    if (!alumniId) {
      toast.error('Please enter Valid Alumni ID')
      return
    }
    try {
      const response = await axios.post(`/api/alumni/${alumniId}`, {
        korean_name: name,
        english_name: englishName,
        country_code: countryCode,
        birthday: new Date(birthday),
        phone_number: phoneNumber,
        email,
      })
      console.log('Alumni info updated successfully:', response.data)

      toast.success('Alumni info updated successfully')
      handleClose()
    } catch (error) {
      console.error('Error updating alumni info:', error)
      toast.error('Failed to update alumni info')
    }
  }

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleSearch = () => {
    if (!alumniId) {
      toast.error('Please enter Alumni ID')
      return
    }
    fetchAlumniInfo(alumniId)
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Edit Alumni Information</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CLabel>student ID:</CLabel>
                  <CInput
                    type="text"
                    value={alumniId}
                    onChange={(e) => setAlumniId(e.target.value)}
                  />
                </div>
                <CButton className="mb-3" color="primary" onClick={handleSearch}>
                  Search
                </CButton>
                {alumniInfo && (
                  <div>
                    <div className="mb-3">
                      <CLabel>Name:</CLabel>
                      <CInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <CLabel>English Name:</CLabel>
                      <CInput
                        type="text"
                        value={englishName}
                        onChange={(e) => setEnglishName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <CLabel>Country Code:</CLabel>
                      <select
                        className="form-control"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.korean_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <CLabel>Birthday:</CLabel>
                      <CInput
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <CLabel>Phone Number:</CLabel>
                      <CInput
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <CLabel>Email:</CLabel>
                      <CInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <CButton color="primary" onClick={handleShow}>
                      Save Changes
                    </CButton>
                  </div>
                )}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
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

export default AlumniEdit
