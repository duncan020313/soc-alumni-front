// 필요한 React 및 CoreUI 컴포넌트 및 기타 라이브러리 가져오기
import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTableBody,
  CTable,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'

// 가상의 메시지 전송 상태 데이터 (실제 데이터는 여기 대신 서버에서 가져와야 함)
const messageStatusData = {
  total: 100,
  sent: 30,
  failed: 5,
  remaining: 65,
}

// 가상의 메시지 발송 기록 데이터 (실제 데이터는 여기 대신 서버에서 가져와야 함)
const messageHistory = [
  {
    id: 1,
    sent: 30,
    failed: 5,
    remaining: 15,
    details: [{ sender: 'User1', message: '안녕하세요' }],
  },
  { id: 2, sent: 25, failed: 3, remaining: 22, details: [{ sender: 'User2', message: 'Hello' }] },
  // ... 추가적인 메시지 발송 기록 데이터
]

// React 함수형 컴포넌트 정의
const MessageStatusScreen = () => {
  // 모달 상태를 관리하는 상태 변수
  const [modal, setModal] = useState(false)

  // 선택된 메시지 발송 기록을 관리하는 상태 변수
  const [selectedRecord, setSelectedRecord] = useState(null)

  // 모달 열기 함수
  const toggleModal = () => {
    setModal(!modal)
  }

  // 테이블의 자세히 보기 함수
  const handleViewDetails = (record) => {
    setSelectedRecord(record) // 여기에 실제 데이터가 있어야 함
    toggleModal()
  }

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setSelectedRecord(null)
    toggleModal()
  }

  return (
    <CContainer>
      <CRow>
        {/* 그래프 영역 */}
        <CCol md="6">
          <CCard>
            <CCardHeader>
              <strong>메시지 전송 상태</strong>
            </CCardHeader>
            <CCardBody>
              {/* 전체 발송 인원 */}
              <div className="text-center mb-4">
                <h4>전체 발송 인원</h4>
                <h2 className="font-weight-bold">{messageStatusData.total}</h2>
              </div>

              {/* 원 그래프 */}
              <CChartDoughnut
                data={{
                  labels: ['발송됨', '실패', '남은 인원'],
                  datasets: [
                    {
                      backgroundColor: ['#28A745', '#DC3545', '#007BFF'],
                      data: [
                        messageStatusData.sent,
                        messageStatusData.failed,
                        messageStatusData.remaining,
                      ],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 테이블 영역 */}
        <CCol md="6">
          <CCard>
            <CCardHeader>
              <strong>메시지 발송 기록</strong>
            </CCardHeader>
            <CCardBody>
              {/* CTable을 사용한 테이블 */}
              <CTable striped responsive>
                <CTableBody>
                  {messageHistory.map((record) => (
                    <CTableRow key={record.id} onClick={() => handleViewDetails(record)}>
                      <CTableDataCell>{record.id}</CTableDataCell>
                      <CTableDataCell>{record.sent}</CTableDataCell>
                      <CTableDataCell>{record.failed}</CTableDataCell>
                      <CTableDataCell>{record.remaining}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* 테이블의 자세히 보기 모달 */}
              <CModal visible={modal} size="lg">
                <CModalHeader closeButton>메시지 발송 기록 - 자세히 보기</CModalHeader>
                <CModalBody>
                  {/* 선택된 메시지 발송 기록의 자세한 내용 */}
                  {selectedRecord && (
                    <div>
                      <p>
                        <strong>메시지 보낸 사람 수:</strong> {selectedRecord.sent}
                      </p>
                      <p>
                        <strong>보낸 메시지:</strong>
                      </p>
                      <ul>
                        {selectedRecord.details.map((detail, index) => (
                          <li key={index}>
                            <strong>{detail.sender}:</strong> {detail.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={handleCloseModal}>
                    닫기
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default MessageStatusScreen
