import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilList,
  cilPaperPlane,
  cilArrowThickBottom,
  cilUserPlus,
  cilPen,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: '학과',
  },
  {
    component: CNavItem,
    name: '학과 목록',
    to: '/admin/department/list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '동문',
  },
  {
    component: CNavItem,
    name: '엑셀로 동문 추가',
    to: '/admin/alumni/addexcel',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '동문 데이터 다운로드',
    to: '/admin/alumni/download',
    icon: <CIcon icon={cilArrowThickBottom} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '동문 데이터 조회',
    to: '/admin/alumni/data',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '동문 데이터 수정',
    to: '/admin/alumni/edit',
    icon: <CIcon icon={cilPen} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '요청',
  },
  {
    component: CNavItem,
    name: '요청 목록',
    to: '/admin/request/list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '발송',
  },
  {
    component: CNavItem,
    name: '메시지 발송하기',
    to: '/admin/message/send',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '메시지 발송현황',
    to: '/admin/message/status',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },
]

export default _nav
