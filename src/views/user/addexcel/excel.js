import React, { useState } from 'react'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import * as XLSX from 'xlsx'

const ExcelUploader = () => {
  const [excelData, setExcelData] = useState(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]

    // 엑셀 파일을 읽어서 JSON으로 변환
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      setExcelData(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const uploadToServer = async () => {
    try {
      // 서버로 JSON 데이터 전송
      const response = await axios.post('YOUR_SERVER_API_ENDPOINT', { data: excelData })
      console.log(response.data) // 서버 응답 확인
    } catch (error) {
      console.error('Error uploading to server:', error)
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
