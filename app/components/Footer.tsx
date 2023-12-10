import { useState } from 'react'
import { BrowserClient, Feedback, getCurrentHub } from '@sentry/react'

import Modal, { ModalType } from './Modal'
import { CurrentLocation } from '../types/CurrentLocation'
import BrowserLocationButton from './BrowserLocationButton'

type FooterProps = {
  currentLocation: CurrentLocation | null
  setCurrentLocation: (state: CurrentLocation) => void
}

const Footer = ({ currentLocation, setCurrentLocation }: FooterProps) => {
  const client = getCurrentHub().getClient<BrowserClient>()
  const feedback = client?.getIntegration(Feedback)

  const [modalType, setModalType] = useState<ModalType | null>(null)

  return (
    <>
      {currentLocation && (
        <BrowserLocationButton setCurrentLocation={setCurrentLocation} />
      )}
      <div className='flex flex-col gap-2 text-[14px] sm:flex-row'>
        <div className='flex gap-2'>
          <span> &copy; {new Date().getFullYear()}</span>
          <a
            href='https://www.thegoodfornothings.club/'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            The Good for Nothings Club
          </a>
        </div>
        <div className='flex justify-center gap-2'>
          <span className='hidden sm:block'>·</span>
          <button
            className='underline-offset-2 hover:underline'
            onClick={() => setModalType(ModalType.DISCLAIMER)}
          >
            Disclaimer
          </button>
          <span>·</span>
          <button
            className='underline-offset-2 hover:underline'
            onClick={() => setModalType(ModalType.SOURCES)}
          >
            Sources
          </button>
          <span>·</span>
          <button
            className='underline-offset-2 hover:underline'
            onClick={() => feedback && feedback.openDialog()}
          >
            Report Error
          </button>
        </div>
      </div>
      <Modal type={modalType} onClose={() => setModalType(null)} />
    </>
  )
}

export default Footer
