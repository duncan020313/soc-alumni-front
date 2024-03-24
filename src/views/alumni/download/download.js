// src/components/AlumniDownload.js
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
  CButton,
} from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { translateColumnEngToKor } from 'src/utils'

const AlumniDownload = () => {
  const [departments, setDepartments] = useState([])
  const [degrees, setDegrees] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [selectedDegrees, setSelectedDegrees] = useState([])
  const [loading, setLoading] = useState(false)

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

  const downloadAlumniData = async () => {
    setLoading(true)

    try {
      const response = await axios.get('/api/alumni/', {
        responseType: 'json',
        params: {
          department: selectedDepartments,
          degree: selectedDegrees,
        },
      })

      const fileName = `alumni_data_${new Date().toISOString()}.xlsx`

      const workbook = XLSX.utils.book_new()
      const data = response.data
        .map((alumni) => {
          alumni['birthday'] = alumni['birthday'].split('T')[0]
          return alumni.degree.map((d) => {
            const copiedAlumni = { ...alumni }
            delete copiedAlumni.preserve
            copiedAlumni.degree = d.name
            copiedAlumni['department'] = d.department.name
            copiedAlumni['professor'] = d.professor.name
            const translatedAlumni = translateColumnEngToKor(copiedAlumni)
            return translatedAlumni
          })
        })
        .flat()
      const sheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet 1')

      XLSX.writeFile(workbook, fileName)
      toast.success('Alumni data downloaded successfully')
    } catch (error) {
      console.error('Error downloading alumni data:', error)
      toast.error('Failed to download alumni data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
    fetchDegrees()
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Download Alumni Data</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CLabel>Departments:</CLabel>
                  <select
                    className="form-control"
                    multiple
                    value={selectedDepartments}
                    onChange={(e) =>
                      setSelectedDepartments(
                        Array.from(e.target.selectedOptions, (option) => option.value),
                      )
                    }
                  >
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <CLabel>Degrees:</CLabel>
                  <select
                    className="form-control"
                    multiple
                    value={selectedDegrees}
                    onChange={(e) =>
                      setSelectedDegrees(
                        Array.from(e.target.selectedOptions, (option) => option.value),
                      )
                    }
                  >
                    {degrees.map((degree) => (
                      <option key={degree.id} value={degree.id}>
                        {degree.name}
                      </option>
                    ))}
                  </select>
                </div>
                <CButton color="primary" disabled={loading} onClick={downloadAlumniData}>
                  {loading ? 'Downloading...' : 'Download Alumni Data'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
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

export default AlumniDownload
