import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useFlexLayout, usePagination } from 'react-table'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import axios from 'axios'
import { columns as C } from '../../../utils'

const AlumniTable = () => {
  const [alumniData, setAlumniData] = useState([])
  const [pageCount, setPageCount] = useState(0) // 서버로부터 받은 총 페이지 수
  const pageSize = 100 // 한 페이지에 보여줄 항목 수
  const [pageIndex, setPageIndex] = useState(0) // 현재 페이지 인덱스 (0부터 시작)

  const fetchAlumni = async (pageIndex, pageSize) => {
    try {
      const response = await axios.get(`/api/alumni/all?page=${pageIndex + 1}&limit=${pageSize}`)
      const data = response.data
        .map((alumni) => {
          const birthday = alumni['birthday']
          alumni['birthday'] = `${birthday.slice(0, 4)}년 ${birthday.slice(
            5,
            7,
          )}월 ${birthday.slice(8, 10)}일`
          const degree = alumni['degree']
          if (degree.length !== 0) {
            return degree.map((d) => {
              const copiedAlumni = { ...alumni }
              delete copiedAlumni['degree']
              copiedAlumni['student_id'] = d.student_id
              copiedAlumni['agree'] = alumni['agree'] ? '동의' : '비동의'
              copiedAlumni['degree'] = d.name
              return copiedAlumni
            })
          } else {
            return alumni
          }
        })
        .flat()
      console.log(data)
      setAlumniData(data) // 데이터 배열이 `alumni` 속성에 있다고 가정
      setPageCount(response.data.totalPages) // 총 페이지 수가 `totalPages` 속성에 있다고 가정
    } catch (error) {
      console.error('Error fetching alumni data:', error)
    }
  }

  useEffect(() => {
    fetchAlumni(pageIndex, pageSize)
  }, [pageIndex, pageSize])

  const data = React.useMemo(() => alumniData, [alumniData])
  const columns = React.useMemo(C, [])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex, pageSize },
      manualPagination: true,
      pageCount: pageCount,
    },
    useSortBy,
    usePagination,
    useFlexLayout,
  )

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>동문 정보 테이블</h5>
            </CCardHeader>
            <CCardBody>
              {/* 테이블 컨테이너의 최대 높이를 600px로 조정하고, overflowY를 'auto'로 설정하여 내용이 많을 때 스크롤이 생기도록 함. */}
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table {...getTableProps()} className="table table-bordered">
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            key={column.id}
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                          >
                            {column.render('Header')}
                            <span>
                              {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                            </span>
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
              </div>
              {/* 페이지네이션 주변의 여백을 추가하여 버튼과 테이블 간 거리를 늘림. mt-4 클래스를 사용하여 상단 여백을 추가함. */}
              <div className="d-flex justify-content-center mt-4">
                <CPagination aria-label="Page navigation">
                  <CPaginationItem
                    disabled={pageIndex <= 0}
                    onClick={() => setPageIndex(pageIndex - 1)}
                  >
                    Previous
                  </CPaginationItem>
                  {[...Array(pageCount).keys()].map((number) => (
                    <CPaginationItem
                      key={number}
                      active={number === pageIndex}
                      onClick={() => setPageIndex(number)}
                    >
                      {number + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={pageIndex >= pageCount - 1}
                    onClick={() => setPageIndex(pageIndex + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AlumniTable
