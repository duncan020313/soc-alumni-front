import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import axios from 'axios'
import { Modal } from 'react-bootstrap'

const EmailLogViewer = () => {
  const [logs, setLogs] = useState([])
  const [selectedLog, setSelectedLog] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/message/log')
      const data = response.data.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
      setLogs(data)
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const getBadge = (status) => {
    switch (status) {
      case 'Success':
        return 'success'
      case 'Failed':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const toggleModal = (log) => {
    setSelectedLog(log)
    setModalOpen(!modalOpen)
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Email Log Viewer</h5>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableDataCell>Title</CTableDataCell>
                    <CTableDataCell>Sent Date</CTableDataCell>
                    <CTableDataCell>Recipients Count</CTableDataCell>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>Details</CTableDataCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {logs.map((log) => (
                    <CTableRow key={log.id}>
                      <CTableDataCell>{log.title}</CTableDataCell>
                      <CTableDataCell>{log.sent_at}</CTableDataCell>
                      <CTableDataCell>{log.receiver.length}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color={getBadge(log.status)}
                          shape="pill"
                          size="sm"
                          onClick={() => toggleModal(log)}
                        >
                          {log.status}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          shape="pill"
                          size="sm"
                          onClick={() => toggleModal(log)}
                        >
                          View Details
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* react-bootstrap Modal */}
      <Modal show={modalOpen} onHide={() => toggleModal(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Email Log Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div>
              <p>
                <strong>Title:</strong> {selectedLog.title}
              </p>
              <p>
                <strong>Sent Date:</strong> {selectedLog.sent_at}
              </p>
              <p>
                <strong>Recipients Count:</strong> {selectedLog.receiver.length}
              </p>
              <p>
                <strong>Status:</strong> {selectedLog.status}
              </p>
              <p>
                <strong>Content:</strong>
                <div dangerouslySetInnerHTML={{ __html: selectedLog.content }} />
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </CContainer>
  )
}

export default EmailLogViewer
