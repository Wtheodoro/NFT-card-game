import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../context'
import { logo, heroImg } from '../assets'
import styles from '../styles'
import Alert from './Alert'

const PagehigherOrderComponent = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext()
  const navigate = useNavigate()

  return (
    <div className={styles.hocContainer}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <div className={styles.hocContentBox}>
        <img
          src={logo}
          alt='logo'
          className={styles.hocLogo}
          onClick={() => navigate('/')}
        />

        <div className={styles.hocBodyWrapper}>
          <div className='flex flex-row w-full'>
            <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
          </div>

          <p className={`${styles.normalText} my-10`}>{description}</p>

          <main>
            <Component />
          </main>
        </div>

        <footer>
          <p className={styles.footerText}>
            Made with ❤️ by{' '}
            <a
              href='https://www.walisontsx.com/'
              target='__blank'
              className='text-siteViolet font-semibold'
            >
              Walison
            </a>
          </p>
        </footer>
      </div>

      <div>
        <img
          src={heroImg}
          alt='hero-img'
          className='w-full xl:h-full object-cover'
        />
      </div>
    </div>
  )
}

export default PagehigherOrderComponent
