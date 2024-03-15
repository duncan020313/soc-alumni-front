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
  CInputGroup,
  CFormCheck as CInputGroupCheckbox,
} from '@coreui/react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

const EditProfilePage = ({ isValidated, studentId }) => {
  const [name, setName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [country, setCountry] = useState('')
  const [birthday, setBirthday] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [countryList, setCountryList] = useState([])

  useEffect(() => {
    // Fetch country list
    fetchCountryList()
  }, [])

  const fetchCountryList = async () => {
    try {
      const response = await axios.get('/api/country') // Replace with your API endpoint
      setCountryList(response.data)
    } catch (error) {
      console.error('Error fetching country list:', error)
    }
  }

  const handleSubmit = async () => {
    // Assuming you have an API endpoint for updating user profile data
    if (!name || !englishName || !country || !birthday || !phoneNumber || !email || !agree) {
      alert('Please fill out all the fields')
      return
    }
    try {
      const response = await axios.post('/api/request/', {
        student_id: studentId,
        korean_name: name,
        english_name: englishName,
        country_code: country,
        birthday,
        phone_number: phoneNumber,
        email,
        agree,
      })
      console.log('Profile update successful:', response.data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (!isValidated) {
    return <Navigate to="/req/edit" replace />
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader>
              <h5>Edit Profile</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CLabel>Name</CLabel>
                  <CInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <CLabel>English Name</CLabel>
                  <CInput
                    type="text"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CLabel>Country</CLabel>
                  <select
                    className="form-control"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select Country</option>
                    {countryList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.korean_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <CLabel>Birthday</CLabel>
                  <CInput
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CLabel>Phone Number</CLabel>
                  <CInput
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CLabel>Email</CLabel>
                  <CInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <CInputGroup>
                    <CInputGroupCheckbox
                      id="agreeCheckbox"
                      checked={agree}
                      onChange={() => setAgree(!agree)}
                    />
                    <CLabel variant="checkbox" htmlFor="agreeCheckbox">
                      I agree to the terms and conditions
                    </CLabel>
                  </CInputGroup>
                </div>
                <CButton color="primary" onClick={handleSubmit}>
                  Save Changes
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

EditProfilePage.propTypes = {
  isValidated: PropTypes.bool.isRequired,
  studentId: PropTypes.string.isRequired,
}

export default EditProfilePage
