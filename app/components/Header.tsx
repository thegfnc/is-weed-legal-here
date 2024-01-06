'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const isVisible = pathname !== '/'

  return (
    <Link
      href='/'
      className={`ease-out-expo text-[18px] font-bold leading-none transition-all duration-1000 ${
        isVisible ? ' translate-y-0 opacity-100' : ' translate-y-16 opacity-0'
      }`}
    >
      Is weed legal here?
    </Link>
  )
}

export default Header
