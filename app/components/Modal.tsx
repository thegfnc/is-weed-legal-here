import { MdClose } from 'react-icons/md'
import modalContent from '@/app/data/modals'

export enum ModalType {
  DISCLAIMER = 'DISCLAIMER',
  SOURCES = 'SOURCES',
}

type ModalProps = {
  type: ModalType | null
  onClose: () => void
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
          <div className='flex items-center justify-between border-b-2 border-brand-purple px-7 py-5'>
            <h2 className='mt-0.5 leading-none'>
              {modalContent[type].heading}
            </h2>
            <div
              className='cursor-pointer p-1 transition-colors hover:bg-gray-200 active:bg-gray-300'
              onClick={onClose}
            >
              <MdClose size={24} />
            </div>
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
