import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useNavigate } from 'react-router-dom'

import { ABI, ADDRESS } from '../contract'
import { createEventListeners } from './createEventListeners'
import { GetParams } from '../utils/onboard'

const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
  // interact and connect with smart context
  const [walletAddress, setWalletAddress] = useState('')
  const [provider, setProvider] = useState('')
  const [contract, setContract] = useState('')
  const [battleName, setBattleName] = useState('')
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  })
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: 'info',
    message: '',
  })
  const [updateGameData, setUpdateGameData] = useState(0)
  const [battleground, setBattleground] = useState(() => {
    const preBattleground = localStorage.getItem('@nft-card-game-battleground')

    if (preBattleground) return preBattleground

    return 'bg-astral'
  })
  const [step, setStep] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const playerOneRef = useRef()
  const playerTwoRef = useRef()

  useEffect(() => {
    updateCurrentWalletAddress()

    window.ethereum.on('accountsChanged', updateCurrentWalletAddress)
  }, [])

  // Reset Web3 onboarding modal params
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams()

      setStep(currentStep.step)
    }

    resetParams()
    window.ethereum.on('chainChanged', () => resetParams())
    window.ethereum.on('accountsChanged', () => resetParams())
  }, [])

  // Set the smart contract and the provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const newProvider = new ethers.providers.Web3Provider(connection)
      const signer = newProvider.getSigner()
      const newContract = new ethers.Contract(ADDRESS, ABI, signer)

      setProvider(newProvider)
      setContract(newContract)
    }

    const timer = setTimeout(() => setSmartContractAndProvider(), 300)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!contract && step !== -1) return

    createEventListeners({
      navigate,
      contract,
      provider,
      walletAddress,
      setShowAlert,
      setUpdateGameData,
      playerOneRef,
      playerTwoRef,
    })
  }, [contract, step])

  // Clear Alert
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' })
      }, [5000])

      return () => clearTimeout(timer)
    }
  }, [showAlert])

  // Handle error messages
  useEffect(() => {
    if (!errorMessage) return
    const parsedErrorMessage = errorMessage?.reason
      ?.slice('execution reverted: '.length)
      .slice(0, -1)

    if (parsedErrorMessage) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: parsedErrorMessage,
      })
    }
  }, [errorMessage])

  // Set the gam data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles()
      const pendingBattles = fetchedBattles.filter(
        (battle) => battle.battleStatus === 0
      )

      let activeBattle

      fetchedBattles.forEach((battle) => {
        const ImInBattle = battle.players.find(
          (player) => player.toLowerCase() === walletAddress.toLocaleLowerCase()
        )
        const currentBattleHasAWinner = battle.winner.startsWith('0x00')

        if (ImInBattle && currentBattleHasAWinner) {
          activeBattle = battle
        }
      })

      setGameData({
        pendingBattles: pendingBattles.slice(1),
        activeBattle: activeBattle,
      })
    }

    if (contract) fetchGameData()
  }, [contract, updateGameData])

  // Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    // window.ethereum only exist because of core google extension
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    if (accounts) setWalletAddress(accounts[0])
  }

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        battleground,
        setBattleground,
        errorMessage,
        setErrorMessage,
        playerOneRef,
        playerTwoRef,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)
