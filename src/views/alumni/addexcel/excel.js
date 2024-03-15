import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormLabel,
} from '@coreui/react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { translateColumnKorToEng } from '../../../utils'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ExcelUploader = () => {
  const [excelData, setExcelData] = useState(null)
  const [departments, setDepartments] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    setSelectedDepartments(departments[0]?.name)
  }, [departments])

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]

    // progree 초기화
    setProgress(0)

    // 엑셀 파일을 읽어서 JSON으로 변환
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      setExcelData(
        jsonData.map((item) => {
          const translatedItem = translateColumnKorToEng(item)
          translatedItem['student_id'] = translatedItem['student_id'].toString()
          translatedItem['department'] = selectedDepartments
          translatedItem['agree'] = parseInt(translatedItem['agree'])
          return translatedItem
        }),
      )
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department')
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const uploadToServer = async () => {
    if (selectedDepartments === '') {
      toast.error('Please select a department')
      return
    }
    try {
      // 서버로 JSON 데이터 전송
      for (let i = 0; i < excelData.length; i += 1000) {
        await axios.post('/api/alumni', {
          alumni: excelData.slice(i, i + 1000),
        })
        const progress = ((i + 1000) / excelData.length) * 100
        if (progress > 100) {
          setProgress(100)
        } else {
          setProgress(parseInt(progress))
        }
      }
      toast.info('Successfully uploaded alumni data')
    } catch (error) {
      if (error.response.status === 400 && error.response.data.errors) {
        const error_data = error.response.data.errors.map((error) => {
          return `Msg: ${error.msg}, Path: ${error.path}, Value: ${error?.value}`
        })
        toast.error('Failed to upload alumni data, Please check the console log')
        console.error(error_data)
      } else {
        console.error('Error upload alumni data:', error)
        toast.error('Failed to upload alumni data: Server error')
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // 엑셀 파일만 허용
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  })

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Excel File Uploader</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Departments:</CFormLabel>
                  <select
                    className="form-control"
                    value={selectedDepartments}
                    onChange={(e) => {
                      console.log(e.target.value)
                      setSelectedDepartments(e.target.value)
                    }}
                  >
                    {departments.map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CForm>
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the file here ...</p>
                ) : (
                  <p>이곳에 .xlsx 파일을 드롭해주세요</p>
                )}
              </div>
              {excelData && (
                <div>
                  <CButton color="primary" onClick={uploadToServer} style={{ marginTop: '20px' }}>
                    Upload to Server
                  </CButton>
                  <div className="progress mt-3 mb-3" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{
                        width: `${progress}%`,
                      }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progress}
                    </div>
                  </div>
                  <h6 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    업로드할 데이터 미리보기
                  </h6>
                  <pre style={{ textAlign: 'left' }}>
                    {JSON.stringify(excelData.slice(0, 10), null, 2)}
                  </pre>
                </div>
              )}
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

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
}

export default ExcelUploader
