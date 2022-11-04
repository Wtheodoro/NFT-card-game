import React from 'react'
import ReactTooltip from 'react-tooltip'

import styles from '../styles'

const healtPoints = 25

const healthLevel = (points) =>
  points > 13 ? 'bg-green-500' : points > 7 ? 'bg-orange-500' : 'bg-red-500'

const marginIndexing = (index) => (index === healtPoints - 1 ? 'mr-0' : 'mr-1')

const PlayerInfo = ({ player, playerIcon, marginTop }) => {
  // because max health is 25
  const arrayFromZeroToTwentyFour = [...Array(player.health).keys()]

  return (
    <div className={`${styles.flexCenter} ${marginTop ? 'mt-4' : 'mb-4'}`}>
      <img
        src={playerIcon}
        alt='player icon'
        className='w-14 h-14 object-contain rounded-full'
        data-for={`Player-${marginTop ? '1' : '2'}`}
        data-tip
      />
      {/* health */}
      <div
        data-for={`Health-${marginTop ? '1' : '2'}`}
        data-tip={`Health: ${player?.health}}`}
        className={styles.playerHealth}
      >
        {arrayFromZeroToTwentyFour.map((item, index) => (
          <div
            key={`player-item-${item}`}
            className={`${styles.playerHealthBar} ${healthLevel(
              player.health
            )} ${marginIndexing(index)}`}
          />
        ))}
      </div>

      {/* mana */}
      <div
        data-for={`Mana-${marginTop ? '1' : '2'}`}
        data-tip='Mana'
        className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana}`}
      >
        {player.mana || 0}
      </div>

      <ReactTooltip
        id={`Player-${marginTop ? '1' : '2'}`}
        effect='solid'
        backgroundColor='#7F46F0'
      >
        <p>
          <span className={styles.playerInfoSpan}>Name: </span>{' '}
          {player?.playerName}
        </p>
        <p>
          <span className={styles.playerInfoSpan}>Name: </span>{' '}
          {player?.playerAddress?.slice(0, 10)}
        </p>
      </ReactTooltip>

      <ReactTooltip
        id={`Health-${marginTop ? '1' : '2'}`}
        effect='solid'
        backgroundColor='#7F46F0'
      />

      <ReactTooltip
        id={`Mana-${marginTop ? '1' : '2'}`}
        effect='solid'
        backgroundColor='#7F46F0'
      />
    </div>
  )
}

export default PlayerInfo
