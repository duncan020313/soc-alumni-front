import React, { useEffect, useState } from 'react'
import { useTable, useFilters, useGlobalFilter } from 'react-table'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CFormInput } from '@coreui/react'
import axios from 'axios'

const AlumniTable = () => {
  const [alumniData, setAlumniData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/alumni/all')
        const data = response.data.map((alumni) => {
          const birthday = alumni['birthday']
          alumni['birthday'] = `${birthday.slice(0, 4)}년 ${birthday.slice(
            5,
            7,
          )}월 ${birthday.slice(8, 10)}일`
          const degree = alumni['degree']
          const student_id = degree.map((d) => d['student_id'])
          const education = degree.sort((a, b) => b['id'] - a['id']).reverse()[0]['name']
          alumni['student_id'] = student_id.join(', ')
          alumni['agree'] = alumni['agree'] ? '동의' : '비동의'
          alumni['education'] = education
          return alumni
        })
        setAlumniData(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching alumni data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const data = React.useMemo(() => alumniData, [alumniData])

  const columns = React.useMemo(
    () => [
      {
        Header: '이름',
        accessor: 'korean_name',
      },
      {
        Header: '영문 이름',
        accessor: 'english_name',
      },
      {
        Header: '학번',
        accessor: 'student_id',
      },
      {
        Header: '성별',
        accessor: 'gender',
      },
      {
        Header: '국가',
        accessor: 'country_name',
      },
      {
        Header: '생일',
        accessor: 'birthday',
      },
      {
        Header: '휴대전화',
        accessor: 'phone_number',
      },
      {
        Header: '이메일',
        accessor: 'email',
      },
      {
        Header: '개인 정보 동의 여부',
        accessor: 'agree',
      },
      {
        Header: '과정',
        accessor: 'education',
      },
    ],
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useFilters, useGlobalFilter)

  const { globalFilter } = state

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>동문 정보 테이블</h5>
            </CCardHeader>
            <CCardBody>
              <CFormInput
                className="mb-3"
                type="text"
                placeholder={`검색 (${rows.length}개의 행 중에서 필터링됨)`}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <table {...getTableProps()} className="table table-bordered">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th key={column.id} {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, index) => {
                    prepareRow(row)
                    return (
                      <tr key={index} {...row.getRowProps()}>
                        {row.cells.map((cell, cellIndex) => (
                          <td key={cellIndex} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {loading && <p>Loading...</p>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AlumniTable
