'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdLanguage } from 'react-icons/md'

const Header = () => {
  const pathname = usePathname()
  const isVisible = pathname !== '/'

  return (
    <header className='relative flex min-h-10 w-full items-center justify-center'>
      <div>
        <Link
          href='/'
          className={`ease-out-expo block text-[18px] font-bold leading-none transition-all duration-500 ${
            isVisible
              ? ' visible translate-y-0 opacity-100'
              : ' invisible translate-y-8 opacity-0'
          }`}
        >
          Is weed legal here?
        </Link>
      </div>
      <div className='absolute right-0 top-0'>
        <Link href='/browse' className='block p-2'>
          <MdLanguage size='24px' title='Browse locations' />
        </Link>
      </div>
    </header>
  )
}

export default Header
