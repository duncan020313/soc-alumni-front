import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilDescription, cilSpeedometer, cilPaperPlane } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: '대시보드',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: '유저',
  },
  {
    component: CNavItem,
    name: '엑셀로 유저 추가',
    to: '/user/addexcel',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '유저 데이터 조회',
    to: '/user/data',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '요청',
  },
  {
    component: CNavItem,
    name: '요청 데이터 조회',
    to: '/request/list',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '발송',
  },
  {
    component: CNavItem,
    name: '메시지 발송하기',
    to: '/message/send',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '메시지 발송현황',
    to: '/message/status',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },
]

export default _nav
