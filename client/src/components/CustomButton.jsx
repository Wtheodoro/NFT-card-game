import React from 'react'
import styles from '../styles'

const CustomButton = ({ children, handleClick, restStyles }) => {
  return (
    <button
      type='button'
      onClick={handleClick}
      className={`${styles.btn} ${restStyles}`}
    >
      {children}
    </button>
  )
}

export default CustomButton
