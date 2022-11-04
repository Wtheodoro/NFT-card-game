import { ethers } from 'ethers'

import { ABI } from '../contract'

const AddNewEvent = (eventFilter, provider, callback) => {
  provider.removeListener(eventFilter) // make sure to not have multiple listeners for the same event at the same time

  provider.on(eventFilter, (logs) => {
    const parseLogs = new ethers.utils.Interface(ABI).parseLog(logs)

    callback(parseLogs)
  })
}

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer()

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

  const NewBattleEventFilter = contract.filters.NewBattle()

  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log('new battle created', args, walletAddress)

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player1.toLowerCase()
    )
      navigate(`/battle/${args.battleName}`)

    setUpdateGameData((prev) => prev + 1)
  })
}
