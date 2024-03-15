import React from 'react'

// Department
const DepartmentList = React.lazy(() => import('./views/department/list/list'))

// alumniData
const alumniAddExcel = React.lazy(() => import('./views/alumni/addexcel/excel'))
const alumniData = React.lazy(() => import('./views/alumni/data/data'))
const alumniDownload = React.lazy(() => import('./views/alumni/download/download'))
const alumniedit = React.lazy(() => import('./views/alumni/edit/edit'))

// request
const RequestList = React.lazy(() => import('./views/request/list/list'))

// message
const SendMessage = React.lazy(() => import('./views/message/send/send'))
const MessageStatus = React.lazy(() => import('./views/message/status/status'))

const routes = [
  { path: '/department/list', name: 'departmentlist', element: DepartmentList },
  { path: '/alumni', name: 'alumni', element: alumniData, exact: true },
  { path: '/alumni/addexcel', name: 'alumniaddexcel', element: alumniAddExcel },
  { path: '/alumni/data', name: 'alumnidata', element: alumniData },
  { path: '/alumni/download', name: 'alumniedit', element: alumniDownload },
  { path: '/alumni/edit', name: 'alumniedit', element: alumniedit },
  { path: 'request/list', name: 'requestlist', element: RequestList },
  { path: '/message', name: 'message', element: SendMessage, exact: true },
  { path: '/message/send', name: 'messagesend', element: SendMessage },
  { path: '/message/status', name: 'messagestatus', element: MessageStatus },
]

export default routes
