import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import React from 'react'

const PhoneNumber = ({value, onChange}) => {
  return (
     <PhoneInput
        country={'us'}
        value={value}
        onChange={(phone) => {
          onChange({ target: { value: phone } }); // This makes it compatible with react-hook-form
        }}
        inputStyle={{
          width: '100%',
          height: '40px',
          fontSize: '16px'
        }}
      />
  )
}

export default PhoneNumber