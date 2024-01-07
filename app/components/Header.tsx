'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const isVisible = pathname !== '/'

  return (
    <header>
      <Link
        href='/'
        className={`ease-out-expo block text-[18px] font-bold leading-none transition-all duration-1000 ${
          isVisible
            ? ' visible translate-y-0 opacity-100'
            : ' invisible translate-y-8 opacity-0'
        }`}
      >
        Is weed legal here?
      </Link>
    </header>
  )
}

export default Header
