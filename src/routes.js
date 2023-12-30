import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// UserData
const UserAddExcel = React.lazy(() => import('./views/user/addexcel/excel'))
const UserData = React.lazy(() => import('./views/user/data/data'))

// Request
const RequestList = React.lazy(() => import('./views/request/list/list'))

// message
const SendMessage = React.lazy(() => import('./views/message/send/send'))
const MessageStatus = React.lazy(() => import('./views/message/status/status'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user', name: 'user', element: UserData, exact: true },
  { path: '/user/addexcel', name: 'useraddexcel', element: UserAddExcel },
  { path: '/user/data', name: 'userdata', element: UserData },
  { path: '/request', name: 'request', element: RequestList, exact: true },
  { path: '/request/list', name: 'requestlist', element: RequestList },
  { path: '/message', name: 'message', element: SendMessage, exact: true },
  { path: '/message/send', name: 'messagesend', element: SendMessage },
  { path: '/message/status', name: 'messagestatus', element: MessageStatus },
]

export default routes
