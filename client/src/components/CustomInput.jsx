import React from 'react'

import styles from '../styles'

// Only allow lowerCase, upperCase letters and number
const regex = /^[A-Za-z0-9]+$/

const CustomInput = ({ label, placeholder, value, handleValueChange }) => {
  return (
    <>
      <label htmlFor='name' className={styles.label}>
        {label}
      </label>

      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          if (event.target.value === '' || regex.test(event.target.value))
            handleValueChange(event.target.value)
        }}
        className={styles.input}
      />
    </>
  )
}

export default CustomInput
