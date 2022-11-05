import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../context'
import { Alert } from '../components'
import { battlegrounds } from '../assets'
import styles from '../styles'

const Battleground = () => {
  const navigate = useNavigate()
  const { showAlert, setShowAlert, setBattleground } = useGlobalContext()

  const handleBattlegroundChoice = (ground) => {
    setBattleground(ground.id)
    localStorage.setItem('@nft-card-game-battleground', ground.id)

    setShowAlert({
      status: true,
      type: 'info',
      message: `${ground.name} is battle ready!`,
    })

    setTimeout(() => {
      // -1 on navigate return to the last route
      navigate(-1)
    }, 1000)
  }

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <h1 className={`${styles.headText} text-center`}>
        Choose your
        <br />
        <span className='text-siteViolet'>Battle</span> Ground
      </h1>

      <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
        {battlegrounds.map((ground) => (
          <div
            key={ground.id}
            className={`${styles.flexCenter} ${styles.battleGroundCard}`}
            onClick={() => handleBattlegroundChoice(ground)}
          >
            <img
              src={ground.image}
              alt='ground'
              className={styles.battleGroundCardImg}
            />

            <div className='info absolute'>
              <p className={styles.battleGroundCardText}>{ground.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Battleground
