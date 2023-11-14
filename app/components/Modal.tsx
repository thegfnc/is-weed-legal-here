'use client'

import { MdClose } from 'react-icons/md'

export enum ModalType {
  DISCLAIMER = 'DISCLAIMER',
  SOURCES = 'SOURCES',
}

type ModalProps = {
  type: ModalType | null
  onClose: () => void
}

const modalContent = {
  DISCLAIMER: {
    heading: 'DISCLAIMER',
    subHeading: 'We miiiiight be wrong…',
    body: (
      <div className='pt-6 leading-6'>
        The information provided on these pages is for entertainment purposes
        only and does not, and is not intended to, constitute legal advice.
        Marijuana laws and penalties are ever-changing. We do our best to be
        mindful of these changes and make updates as necessary. For the most
        up-to-date laws, consult your state statutes. For legal advice, please
        hire an attorney. If you spot a mistake or have additional information,
        please contact us and we will be happy to look into it.
      </div>
    ),
  },
  SOURCES: {
    heading: 'SOURCES',
    subHeading: null,
    body: (
      <div>
        <div>
          <h3 className='text-2xl'>NORML</h3>
          <a
            href='https://norml.org/'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            https://norml.org/
          </a>
        </div>
        <div className='pt-6'>
          <h3 className='text-2xl'>Wikipedia</h3>
          <a
            href='https://wikipedia.org/'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            https://wikipedia.org/
          </a>
        </div>
        <div className='pt-12 text-sm'>Last updated November 14, 2023</div>
      </div>
    ),
  },
}

export default function Modal({ type, onClose }: ModalProps) {
  if (!type) return null

  return (
    <div className='absolute left-0 top-0 h-screen w-screen text-left text-lg font-medium'>
      <div
        className='absolute left-0 top-0 h-screen w-screen bg-black opacity-40'
        onClick={onClose}
      ></div>
      <div className='pointer-events-none absolute left-0 top-0 flex h-screen w-screen items-center justify-center'>
        <div className='pointer-events-auto m-4 w-full max-w-xl border-2 border-brand-purple bg-white'>
          <div className='flex items-center justify-between border-b-2 border-brand-purple px-8 py-6'>
            <h2 className='leading-none'>{modalContent[type].heading}</h2>
            <MdClose size={24} onClick={onClose} className='cursor-pointer' />
          </div>
          <div className='px-8 pb-14 pt-12'>
            {modalContent[type].subHeading && (
              <h3 className='text-[32px] font-bold'>
                {modalContent[type].subHeading}
              </h3>
            )}
            {modalContent[type].body}
          </div>
        </div>
      </div>
    </div>
  )
}
