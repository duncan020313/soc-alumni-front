// 필요한 React 및 CoreUI 컴포넌트 및 기타 라이브러리 가져오기
import React, { useState } from 'react'
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
  CFormCheck,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// 가상의 유저 데이터 (실제 데이터는 여기 대신 서버에서 가져와야 함)
const users = [
  { id: 1, name: '사용자1', email: 'user1@example.com', phoneNumber: '010-1234-5678' },
  { id: 2, name: '사용자2', email: 'user2@example.com', phoneNumber: '010-2345-6789' },
  // ... 추가적인 유저 데이터
]

// React 함수형 컴포넌트 정의
const MessageScreen = () => {
  // 모달 상태를 관리하는 상태 변수
  const [modal, setModal] = useState(false)

  // 선택된 유저들을 관리하는 상태 변수
  const [selectedUsers, setSelectedUsers] = useState([])

  // 메시지 보내기 방식을 관리하는 상태 변수 (email 또는 text)
  const [messageMethod, setMessageMethod] = useState('email')

  // 메시지 입력을 관리하는 상태 변수
  const [messageContent, setMessageContent] = useState('')

  // 비밀번호 입력을 관리하는 상태 변수
  const [password, setPassword] = useState('')

  // 모달 열기 함수
  const toggleModal = () => {
    setModal(!modal)
  }

  // 유저 선택 함수
  const handleSelectUser = (user) => {
    const userId = user.id

    // 이미 선택된 유저인지 확인
    const isSelected = selectedUsers.includes(userId)

    // 선택 상태 업데이트
    if (isSelected) {
      // 이미 선택된 경우 제거
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      // 선택되지 않은 경우 추가
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // 메시지 보내기 방식 선택 함수
  const handleSelectMethod = (method) => {
    setMessageMethod(method)
  }

  // 비밀번호 입력 함수
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  // 메시지 보내기 함수
  const handleSendMessage = () => {
    // 선택된 유저들에게 메시지 보내는 로직 추가
    // (예: 서버로 메시지 전송)

    // 모달 닫기
    toggleModal()
  }

  return (
    <>
      {/* 메시지 보내기 버튼 */}
      <CButton
        color="primary"
        onClick={toggleModal}
        disabled={selectedUsers.length === 0}
        className="mb-4"
      >
        메시지 보내기
      </CButton>

      {/* 유저 목록을 보여주는 테이블 */}
      <CTable striped responsive>
        <thead>
          <tr>
            <th>
              {/* 전체 선택 체크박스 */}
              <CFormCheck
                id="selectAll"
                checked={selectedUsers.length === users.length}
                onChange={() =>
                  setSelectedUsers(
                    selectedUsers.length === users.length ? [] : users.map((user) => user.id),
                  )
                }
              />
            </th>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
          </tr>
        </thead>
        <CTableBody>
          {users.map((user) => (
            <CTableRow key={user.id}>
              <CTableDataCell>
                {/* 각 유저의 체크박스 */}
                <CFormCheck
                  id={`selectUser-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user)}
                />
              </CTableDataCell>
              <CTableDataCell>{user.id}</CTableDataCell>
              <CTableDataCell>{user.name}</CTableDataCell>
              <CTableDataCell>{user.email}</CTableDataCell>
              <CTableDataCell>{user.phoneNumber}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* 메시지 보내기 모달 */}
      <CModal visible={modal} size="xl">
        <CModalHeader closeButton>메시지 보내기</CModalHeader>
        <CModalBody>
          {/* 메시지 보내기 방식 선택 */}
          <CFormLabel>메시지 보내기 방식</CFormLabel>
          <div>
            <CFormCheck
              inline
              type="radio"
              id="emailMethod"
              label="이메일"
              checked={messageMethod === 'email'}
              onChange={() => handleSelectMethod('email')}
            />
            <CFormCheck
              inline
              type="radio"
              id="textMethod"
              label="문자 메시지"
              checked={messageMethod === 'text'}
              onChange={() => handleSelectMethod('text')}
            />
          </div>
          {/* 메시지 내용 입력 */}
          <CFormLabel>메시지 내용</CFormLabel>
          <ReactQuill
            theme="snow"
            value={messageContent}
            onChange={setMessageContent}
            minHeight="500px"
          />
          ;<CFormLabel>비밀번호</CFormLabel>
          <CFormInput value={password} onChange={handlePassword} type="password" />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>
            취소
          </CButton>
          {/* 메시지 보내기 버튼 및 이벤트 핸들러 */}
          <CButton color="primary" onClick={handleSendMessage}>
            메시지 보내기
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default MessageScreen
