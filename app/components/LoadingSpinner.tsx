import Image from 'next/image'

export default function LoadingSpinner() {
  return (
    <div className='flex h-full items-center justify-center'>
      <Image
        src='/loading-spinner-dark.svg'
        width='42'
        height='42'
        alt='Loading spinner'
      />
    </div>
  )
}
