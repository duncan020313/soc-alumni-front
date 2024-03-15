const columnMapping = {
  student_id: {
    label: '학번',
  },
  korean_name: {
    label: '국문명',
  },
  english_name: {
    label: '영문명',
  },
  gender: {
    label: '성별',
  },
  birthday: {
    label: '생년월일',
  },
  email: {
    label: '이메일',
  },
  phone_number: {
    label: '휴대폰',
  },
  country_name: {
    label: '국적',
  },
  country_code: {
    label: '국가코드',
  },
  address: {
    label: '주소',
  },
  consent_provide_info: {
    label: '정보제공동의',
  },
  consent_third_person: {
    label: '제3자제공동의',
  },
  company: {
    label: '회사',
  },
  company_dept: {
    label: '부서',
  },
  comapny_position: {
    label: '직급',
  },
  degree: {
    label: '과정',
  },
  professor: {
    label: '지도교수',
  },
  department: {
    label: '학과',
  },
}

export const translateColumnEngToKor = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    try {
      newObj[columnMapping[key].label] = obj[key]
    } catch (err) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}

export const translateColumnKorToEng = (obj) => {
  const newObj = {}
  const kv_reversed = Object.entries(columnMapping).reduce((acc, [key, value]) => {
    acc[value.label] = key
    return acc
  }, {})
  Object.keys(obj).forEach((key) => {
    if (kv_reversed[key] === undefined) {
      void 0
    } else {
      newObj[kv_reversed[key]] = obj[key]
    }
  })
  return newObj
}
