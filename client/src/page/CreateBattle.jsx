import React from 'react'

import { PagehigherOrderComponent } from '../components'

const CreateBattle = () => {
  return (
    <div>
      <h1 className='text-white text-xl'>Hello from Create Battle </h1>
    </div>
  )
}

export default PagehigherOrderComponent(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>
)