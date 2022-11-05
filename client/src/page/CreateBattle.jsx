import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  PagehigherOrderComponent,
  CustomButton,
  CustomInput,
  GameLoad,
} from '../components'
import { useGlobalContext } from '../context'
import styles from '../styles'

const CreateBattle = () => {
  const [waitBattle, setWaitBattle] = useState(false)

  const { contract, battleName, setBattleName, gameData, setErrorMessage } =
    useGlobalContext()
  const navigate = useNavigate()

  useEffect(() => {
    const battleIsPending = gameData?.activeBattle?.battleStatus === 0
    const battleHasBegan = gameData?.activeBattle?.battleStatus === 1

    if (battleHasBegan) navigate(`/battle/${gameData.activeBattle.name}`)
    if (battleIsPending) setWaitBattle(true)
  }, [gameData])

  const handleCreateBattleClick = async () => {
    if (!battleName || !battleName.trim()) return null

    try {
      await contract.createBattle(battleName)

      setWaitBattle(true)
    } catch (error) {
      setErrorMessage(error)
    }
  }

  return (
    <>
      {waitBattle && <GameLoad />}

      <div className='flex flex-col mb-5'>
        <CustomInput
          label='Battle'
          placeholder='Enter battle name'
          value={battleName}
          handleValueChange={setBattleName}
        />
        <CustomButton handleClick={handleCreateBattleClick} restStyles='mt-6'>
          Create battle
        </CustomButton>
      </div>

      <p className={styles.infoText} onClick={() => navigate('/join-battle')}>
        Or join already existing battles
      </p>
    </>
  )
}

export default PagehigherOrderComponent(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>
)
