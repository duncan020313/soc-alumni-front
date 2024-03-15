// 필요한 React 및 CoreUI 컴포넌트 및 기타 라이브러리 가져오기
import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CFormInput,
  CFormCheck,
} from '@coreui/react'
import axios from 'axios'

// React 함수형 컴포넌트 정의
const UserModificationTable = () => {
  // 모달 상태를 관리하는 상태 변수
  const [modal, setModal] = useState(false)

  // 요청 목록
  const [requests, setRequests] = useState([])

  // 선택된 유저 정보 수정 요청을 관리하는 상태 변수
  const [selectedRequests, setSelectedRequests] = useState([])

  // 검색어를 관리하는 상태 변수
  const [searchTerm, setSearchTerm] = useState('')

  // 초기 request 받기
  const fetchRequests = async () => {
    try {
      const result = await axios.get('/api/request')
      setRequests(result.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }
  useEffect(() => {
    fetchRequests()
  }, [])

  // 모달 열기 함수
  const toggleModal = () => {
    setModal(!modal)
  }

  // 선택된 유저 정보 수정 요청을 수락하는 함수
  const handleAcceptRequests = async () => {
    // 선택된 유저 정보 수정 요청에 대한 로직을 이곳에 추가
    try {
      await axios.post('/api/request/patch', {
        ids: selectedRequests,
      })
      await fetchRequests()
    } catch (e) {
      console.error('Error accepting requests:', e)
    }
    // 모달 닫기
    toggleModal()
  }

  // 검색어 입력 시 호출되는 함수
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // 특정 유저 정보 수정 요청을 선택하는 함수
  const handleSelectRequest = (request) => {
    // 선택된 유저 정보 수정 요청의 ID
    const requestId = request.id

    // 이미 선택된 요청인지 확인
    const isSelected = selectedRequests.includes(requestId)

    // 선택 상태 업데이트
    if (isSelected) {
      // 이미 선택된 경우 제거
      setSelectedRequests(selectedRequests.filter((id) => id !== requestId))
    } else {
      // 선택되지 않은 경우 추가
      setSelectedRequests([...selectedRequests, requestId])
    }
  }

  // 전체 선택/해제 함수
  const handleSelectAll = () => {
    // 전체 선택 상태에 따라 선택된 유저 정보 수정 요청 업데이트
    if (selectedRequests.length === requests.length) {
      // 이미 모두 선택된 경우 모두 해제
      setSelectedRequests([])
    } else {
      // 아닌 경우 현재 필터링된 요청들만 선택
      setSelectedRequests(filteredRequests.map((request) => request.id))
    }
  }

  // 검색된 유저 정보 수정 요청 데이터 필터링 함수
  const filteredRequests = requests.filter(
    (request) =>
      request.new_contents.korean_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.new_contents.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.new_contents.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.new_contents.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      {/* 수정 완료 버튼과 검색 입력 창을 가로로 배열 */}
      <CInputGroup className="mb-4">
        {/* 수정 완료 버튼 */}
        <CButton color="info" onClick={toggleModal} disabled={selectedRequests.length === 0}>
          수정 요청 적용
        </CButton>

        {/* 검색 입력 창 */}
        <CFormInput
          type="text"
          placeholder="유저 정보 수정 요청 검색"
          value={searchTerm}
          onChange={handleSearch}
        />
      </CInputGroup>

      {/* 유저 정보 수정 요청을 보여주는 테이블 */}
      <CTable striped responsive>
        <thead>
          <tr>
            <th>
              {/* 전체 선택 체크박스 */}
              <CFormCheck
                id="selectAll"
                checked={selectedRequests.length === filteredRequests.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>국명</th>
            <th>영문명</th>
            <th>전화번호</th>
            <th>이메일</th>
          </tr>
        </thead>
        <CTableBody>
          {filteredRequests.map((request) => (
            <CTableRow key={request.id}>
              <CTableDataCell>
                {/* 각 유저 정보 수정 요청의 체크박스 */}
                <CFormCheck
                  id={`selectRequest-${request.id}`}
                  checked={selectedRequests.includes(request.id)}
                  onChange={() => handleSelectRequest(request)}
                />
              </CTableDataCell>
              <CTableDataCell>{request.id}</CTableDataCell>
              <CTableDataCell>{request.new_contents.korean_name}</CTableDataCell>
              <CTableDataCell>{request.new_contents.english_name}</CTableDataCell>
              <CTableDataCell>{request.new_contents.phone_number}</CTableDataCell>
              <CTableDataCell>{request.new_contents.email}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* 선택된 유저 정보 수정 요청을 수락하는 모달 */}
      <CModal visible={modal}>
        <CModalHeader closeButton>수정 완료 확인</CModalHeader>
        <CModalBody>
          <p>정말로 선택한 유저 정보 수정 요청을 완료하시겠습니까?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>
            취소
          </CButton>
          {/* 수정 완료 버튼 및 이벤트 핸들러 */}
          <CButton color="primary" onClick={handleAcceptRequests}>
            수정 완료
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserModificationTable
