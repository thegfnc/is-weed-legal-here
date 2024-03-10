'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdLanguage, MdOutlineShoppingBag } from 'react-icons/md'

const Header = () => {
  const pathname = usePathname()
  const isVisible = pathname !== '/'

  return (
    <header className='relative flex min-h-10 w-full items-center justify-center'>
      <div className='absolute left-0 top-0'>
        <Link
          href='https://isweedlegalhere.bigcartel.com/'
          target='_blank'
          className='flex max-w-10 items-center overflow-hidden whitespace-nowrap rounded-full p-2 transition-all duration-700 ease-in-out will-change-[max-width] hover:bg-gray-800/5 md:hover:max-w-48'
        >
          <div>
            <MdOutlineShoppingBag
              size='24px'
              title='Shop Is weed legal here? merch'
            />
          </div>
          <div className='ml-[10px] mr-2 text-sm font-bold'>Shop our merch</div>
        </Link>
      </div>
      <div>
        <Link
          href='/'
          className={`block text-[18px] font-bold leading-none transition-all duration-500 ease-out-expo ${
            isVisible
              ? ' visible translate-y-0 opacity-100'
              : ' invisible translate-y-6 opacity-0'
          }`}
        >
          Is weed legal here?
        </Link>
      </div>
      <div className='absolute right-0 top-0'>
        <Link
          href='/browse'
          className='flex max-w-10 items-center overflow-hidden whitespace-nowrap rounded-full p-2 transition-all duration-700 ease-in-out will-change-[max-width] hover:bg-gray-800/5 md:hover:max-w-48'
        >
          <div>
            <MdLanguage size='24px' title='Browse the world' />
          </div>
          <div className='ml-[10px] mr-2 text-sm font-bold'>
            Browse the world
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header
