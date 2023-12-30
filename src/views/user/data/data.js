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
        const response = await axios.get('/api/alumni')
        setAlumniData(response.data)
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
        accessor: 'name',
      },
      {
        Header: '학번',
        accessor: 'studentNumber',
      },
      {
        Header: '성별',
        accessor: 'gender',
      },
      {
        Header: '국가 코드',
        accessor: 'countryCode',
      },
      {
        Header: '생일',
        accessor: 'birthday',
      },
      {
        Header: '휴대전화',
        accessor: 'phoneNumber',
      },
      {
        Header: '이메일',
        accessor: 'email',
      },
      {
        Header: '개인 정보 동의 여부',
        accessor: 'privacyAgreement',
      },
      {
        Header: '최종 학력',
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

  // eslint-disable-next-line react/prop-types
  const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
    // eslint-disable-next-line react/prop-types
    const count = preGlobalFilteredRows.length

    return (
      <CFormInput
        type="text"
        placeholder={`검색 (${count}개의 행 중에서 필터링됨)`}
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    )
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>동문 정보 테이블</h5>
            </CCardHeader>
            <CCardBody>
              <GlobalFilter
                preGlobalFilteredRows={rows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
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
