// src/components/DepartmentList.js
import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CButton,
} from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [newDepartmentEnglishName, setNewDepartmentEnglishName] = useState('')

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department')
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const addDepartment = async () => {
    try {
      if (!newDepartmentName || !newDepartmentEnglishName) {
        toast.error('Please enter department name and english name')
        return
      }
      const response = await axios.post(
        '/api/department',
        {
          name: newDepartmentName,
          en_name: newDepartmentEnglishName,
        },
        { withCredentials: true },
      )
      console.log('Department added successfully:', response.data)

      toast.success('Department added successfully')
      setNewDepartmentName('')
      setNewDepartmentEnglishName('')
      await fetchDepartments() // 목록 업데이트
    } catch (error) {
      console.error('Error adding department:', error)
      toast.error('Failed to add department')
    }
  }

  const deleteDepartment = async (id) => {
    try {
      const response = await axios.get(`/api/department/${id}/delete`)
      if (response.status === 204) {
        console.log('Department deleted successfully')
        toast.success('Department deleted successfully')
        await fetchDepartments() // 목록 업데이트
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      toast.error('Failed to delete department')
    }
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Department List</h5>
            </CCardHeader>
            <CCardBody>
              <CTable striped responsive>
                <CTableHead>
                  <tr>
                    <th>Name</th>
                    <th>English Name</th>
                    <th>Delete</th>
                  </tr>
                </CTableHead>
                <CTableBody>
                  {departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.name}</td>
                      <td>{department.en_name}</td>
                      <td>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => deleteDepartment(department.id)}
                        >
                          Delete
                        </CButton>
                      </td>
                    </tr>
                  ))}
                </CTableBody>
              </CTable>
              <div className="mt-4">
                <h5>Add New Department</h5>
                <div className="mb-3">
                  <label htmlFor="newDepartmentName" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="newDepartmentName"
                    className="form-control"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newDepartmentEnglishName" className="form-label">
                    English Name:
                  </label>
                  <input
                    type="text"
                    id="newDepartmentEnglishName"
                    className="form-control"
                    value={newDepartmentEnglishName}
                    onChange={(e) => setNewDepartmentEnglishName(e.target.value)}
                  />
                </div>
                <CButton color="primary" onClick={addDepartment}>
                  Add Department
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </CContainer>
  )
}

export default DepartmentList
