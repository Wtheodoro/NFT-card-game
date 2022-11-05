import { ethers } from 'ethers'

import { ABI } from '../contract'
import { playAudio, sparcle } from '../utils/animation.js'
import { defenseSound } from '../assets'

const emptyAccountAddress = '0x0000000000000000000000000000000000000000'

const AddNewEvent = (eventFilter, provider, callback) => {
  provider.removeListener?.(eventFilter) // make sure to not have multiple listeners for the same event at the same time

  provider?.on?.(eventFilter, (logs) => {
    const parseLogs = new ethers.utils.Interface(ABI).parseLog(logs)

    callback(parseLogs)
  })
}

//* Get battle card coordinates
const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect()

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  }
}

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  playerOneRef,
  playerTwoRef,
}) => {
  const NewPlayerEventFilter = contract.filters?.NewPlayer()
  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log('new player created', args)

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player has been successfully registered.',
      })
    }
  })

  const NewGameTokenEventFilter = contract.filters?.NewGameToken()
  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    console.log('New game token created!', args.owner)

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player game token has been successfully generated',
      })

      navigate('/create-battle')
    }
  })

  const NewBattleEventFilter = contract.filters?.NewBattle()
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log('new battle created', args, walletAddress)

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    )
      navigate(`/battle/${args.battleName}`)

    setUpdateGameData((prev) => prev + 1)
  })

  const BattleMoveEventFilter = contract.filters?.BattleMove()
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log('Battle move initiated!', args)
  })

  const RoundEndedEventFilter = contract.filters?.RoundEnded()
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log('Round ended!!', args, walletAddress)

    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccountAddress) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(playerOneRef))
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(playerTwoRef))
        }
      } else {
        playAudio(defenseSound)
      }
    }

    setUpdateGameData((prev) => prev + 1)
  })

  const BattleEndedEventFilter = contract.filters?.BattleEnded()
  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    console.log('Battle ended!', args, walletAddress)

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'You won!',
      })
    }

    if (walletAddress.toLowerCase() === args.loser?.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'You lost!',
      })
    }

    navigate('/create-battle')
  })
}
