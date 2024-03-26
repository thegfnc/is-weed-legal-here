'use client'

import { useState } from 'react'
import { feedbackIntegration } from '@sentry/react'

import Modal, { ModalType } from './Modal'

const Footer = () => {
  const client = feedbackIntegration({
    // Additional SDK configuration goes in here, for example:
    autoInject: false,
    colorScheme: 'dark',
    formTitle: 'Report an Error',
    messagePlaceholder:
      'What went wrong? Let us know if you encountered incorrect data or a bug.',
    submitButtonLabel: 'Send Report',
  })

  const [modalType, setModalType] = useState<ModalType | null>(null)

  return (
    <footer className='flex flex-col items-center'>
      <div className='flex flex-col gap-2 text-[14px] md:flex-row'>
        <div className='flex justify-center gap-2'>
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
          <span className='hidden md:block'>·</span>
          <button
            className='underline-offset-2 hover:underline'
            onClick={() => setModalType(ModalType.DISCLAIMER)}
          >
            Disclaimer
          </button>
          <span>·</span>
          <a
            href='https://github.com/thegfnc/is-weed-legal-here'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            GitHub
          </a>
          <span>·</span>
          <button
            className='underline-offset-2 hover:underline'
            onClick={() => client && client.openDialog()}
          >
            Report an error
          </button>
        </div>
      </div>
      <Modal type={modalType} onClose={() => setModalType(null)} />
    </footer>
  )
}

export default Footer
