import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Alert, ActionButton, Card, GameInfo, PlayerInfo } from '../components'
import { useGlobalContext } from '../context'
import {
  attack,
  attackSound,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from '../assets'
import { playAudio } from '../utils/animation.js'
import styles from '../styles'

const Battle = () => {
  const [player1, setPlayer1] = useState({})
  const [player2, setPlayer2] = useState({})

  const {
    contract,
    gameData,
    walletAddress,
    showAlert,
    setShowAlert,
    battleground,
  } = useGlobalContext()
  const { battleName } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let player01Address = null
        let player02Address = null

        const firstPlayerIsMe =
          gameData.activeBattle.players[0].toLowerCase() ===
          walletAddress.toLowerCase()

        if (firstPlayerIsMe) {
          player01Address = gameData.activeBattle.players[0]
          player02Address = gameData.activeBattle.players[1]
        } else {
          player01Address = gameData.activeBattle.players[1]
          player02Address = gameData.activeBattle.players[0]
        }

        const Player1TokenData = await contract.getPlayerToken(player01Address)
        const player01 = await contract.getPlayer(player01Address)
        const player02 = await contract.getPlayer(player02Address)

        const player1Attack = Number(Player1TokenData.attackStrength)
        const player1Defense = Number(Player1TokenData.defenseStrength)
        const player1Health = Number(player01.playerHealth)
        const player1Mana = Number(player01.playerMana)

        const player2Health = Number(player02.playerHealth)
        const player2Mana = Number(player02.playerMana)

        setPlayer1({
          ...player01,
          att: player1Attack,
          def: player1Defense,
          health: player1Health,
          mana: player1Mana,
        })

        setPlayer2({
          ...player02,
          att: 'x',
          def: 'x',
          health: player2Health,
          mana: player2Mana,
        })
      } catch (error) {
        console.error(error)
      }
    }

    if (contract && gameData.activeBattle) getPlayerInfo()
  }, [contract, gameData, battleName])

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleground}`}
    >
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <PlayerInfo player={player2} playerIcon={player02Icon} />

      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card card={player2} title={player2?.playerName} cardRef='' playerTwo />

        <div className='flex items-center flex-row'>
          <ActionButton
            imgUrl={attack}
            handleClick={() => {}}
            restStyles='mr-2 hover:border-yellow-400'
          />

          <Card
            card={player1}
            title={player1?.playerName}
            cardRef=''
            restStyles='mt-3'
          />

          <ActionButton
            imgUrl={defense}
            handleClick={() => {}}
            restStyles='ml-6 hover:border-red-600'
          />
        </div>
      </div>

      <PlayerInfo player={player1} playerIcon={player01Icon} />

      <GameInfo />
    </div>
  )
}

export default Battle
