import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../context'
import { PagehigherOrderComponent } from '../components'
import styles from '../styles'

const JoinBattle = () => {
  const navigate = useNavigate()
  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>
      <p className={styles.infoText} onClick={() => navigate('/create-battle')}>
        Or create a new battle
      </p>
    </>
  )
}

export default PagehigherOrderComponent(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join already existing battles</>
)
