const columnMapping = {
  student_id: {
    label: ['학번'],
  },
  korean_name: {
    label: ['국문명', '이름'],
  },
  english_name: {
    label: ['영문명'],
  },
  gender: {
    label: ['성별'],
  },
  birthday: {
    label: ['생년월일'],
  },
  email: {
    label: ['이메일'],
  },
  phone_number: {
    label: ['휴대폰', '휴대전화'],
  },
  country_name: {
    label: ['국적'],
  },
  country_code: {
    label: ['국가코드'],
  },
  address: {
    label: ['주소'],
  },
  consent_provide_info: {
    label: ['제공동의'],
  },
  consent_third_person: {
    label: ['제3자동의'],
  },
  company: {
    label: ['직장명'],
  },
  company_dept: {
    label: ['부서'],
  },
  company_position: {
    label: ['직위'],
  },
  degree: {
    label: ['과정'],
  },
  professor: {
    label: ['지도교수'],
  },
  department: {
    label: ['학과'],
  },
}

export const columns = () => {
  const columns = []
  Object.keys(columnMapping).forEach((key) => {
    columns.push({
      Header: columnMapping[key].label[0],
      accessor: key,
    })
  })
  return columns
}

export const translateColumnEngToKor = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    try {
      newObj[columnMapping[key].label] = obj[key]
    } catch (err) {
      void 0
    }
  })
  return newObj
}

export const translateColumnKorToEng = (obj) => {
  const newObj = {}
  const kv_reversed = Object.entries(columnMapping).reduce((acc, [key, value]) => {
    value.label.forEach((label) => {
      acc[label] = key
    })
    return acc
  }, {})
  Object.keys(obj).forEach((key) => {
    if (key in kv_reversed) {
      newObj[kv_reversed[key]] = obj[key].trim()
    }
  })
  return newObj
}

export const UTC2KOR = (date) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000)
}
