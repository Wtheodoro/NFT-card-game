import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../context'
import { CustomButton, PagehigherOrderComponent } from '../components'
import styles from '../styles'

const JoinBattle = () => {
  const { contract, gameData, setShowAlert, setBattleName, walletAddress } =
    useGlobalContext()
  const navigate = useNavigate()

  const battlesThatExcludesMe = gameData.pendingBattles.filter(
    (battle) => !battle.players.includes(walletAddress)
  )

  const handleJoinClick = async (battleName) => {
    setBattleName(battleName)

    try {
      await contract.JoinBattle(battleName)

      setShowAlert({
        status: true,
        type: 'success',
        message: `Joining ${battleName}...`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          battlesThatExcludesMe.map((battle, index) => (
            <div key={battle.name + index} className={styles.flexBetween}>
              <p className={styles.joinBattleTitle}>
                {index + 1}. {battle.name}
              </p>
              <CustomButton handleClick={() => handleJoinClick(battle.name)}>
                Join
              </CustomButton>
            </div>
          ))
        ) : (
          <p className={styles.joinLoading}>
            Reload the page to see new battles
          </p>
        )}
      </div>
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
