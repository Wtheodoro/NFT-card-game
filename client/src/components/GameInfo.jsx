import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CustomButton from './CustomButton'
import { useGlobalContext } from '../context'
import { alertIcon, gameRules } from '../assets'
import styles from '../styles'

const GameInfo = () => {
  const [showSideBar, setToggleSidebar] = useState(false)
  const { contract, gameData, setShowAlert } = useGlobalContext()
  const navigate = useNavigate()

  const handleBattleExit = async () => {}

  const toggleSidebar = () => setToggleSidebar(!showSideBar)

  const navigateToBattleground = () => navigate('/battleground')

  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={toggleSidebar}
        >
          <img src={alertIcon} alt='info' className={styles.gameInfoIconImg} />
        </div>
      </div>

      <div
        className={`${styles.gameInfoSidebar} ${
          showSideBar ? 'translate-x-0' : 'translate-x-full'
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className='flex flex-col'>
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={toggleSidebar}
            >
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules: </h3>

          <div className='mt-3'>
            {gameRules.map((rule, index) => (
              <p key={rule} className={styles.gameInfoText}>
                <span className='font-bold'>{index + 1}</span>. {rule}
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton handleClick={navigateToBattleground}>
            Change Battleground
          </CustomButton>

          <CustomButton handleClick={handleBattleExit}>
            Exit Battle
          </CustomButton>
        </div>
      </div>
    </>
  )
}

export default GameInfo
