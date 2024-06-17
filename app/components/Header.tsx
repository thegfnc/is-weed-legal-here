'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaInstagram } from 'react-icons/fa'
import { MdClose, MdOutlineMenu } from 'react-icons/md'

type MenuLink = {
  title: string
  href: string
  target?: string
  noFollowExceptHome?: boolean
}

const menuLinks: MenuLink[] = [
  {
    title: 'Explore',
    href: '/browse',
  },
  {
    title: 'Shop',
    href: 'https://shop.thegoodfornothings.club/collections/is-weed-legal-here',
    target: '_blank',
    noFollowExceptHome: true,
  },
]

const mobileMenuLinks: MenuLink[] = [
  {
    title: 'Home',
    href: '/',
  },
  ...menuLinks,
  {
    title: 'Buy us a coffee',
    href: 'https://buy.stripe.com/14k4gz95J2wxb609AA',
    target: '_blank',
  },
]

const Header = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isHomePage = pathname === '/'

  return (
    <>
      <header className='relative flex min-h-6 w-full items-center justify-center'>
        <div className='absolute bottom-0 left-0 top-0 hidden items-center gap-6 md:flex'>
          {menuLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full font-medium underline-offset-4 hover:underline ${pathname === link.href ? 'underline' : ''}`}
              target={link.target}
              rel={
                link.noFollowExceptHome && pathname !== '/'
                  ? 'nofollow'
                  : undefined
              }
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className='absolute bottom-[-8px] left-[-4px] top-[-8px] flex cursor-pointer items-center rounded-full p-2 transition-colors hover:bg-black/10 active:bg-black/20 md:hidden'>
          <MdOutlineMenu
            size='24px'
            onClick={() => setIsMobileMenuOpen(true)}
          />
        </div>
        <Link
          href='/'
          className={`block text-[18px] font-bold leading-none transition-all duration-500 ease-out-expo ${
            !isHomePage
              ? ' visible translate-y-0 opacity-100'
              : ' invisible translate-y-6 opacity-0'
          }`}
        >
          Is weed legal here?
        </Link>
        <div className='absolute bottom-[-8px] right-[-4px] top-[-8px] flex min-h-6 items-center gap-3 md:right-[-8px]'>
          <Link
            href='https://buy.stripe.com/14k4gz95J2wxb609AA'
            target='_blank'
            className='hidden rounded-lg border-2 border-brand-purple p-2 px-3 py-1 text-sm font-medium leading-6 transition-colors hover:bg-brand-purple hover:text-brand-yellow active:bg-brand-purple/90 md:block'
          >
            Buy us a coffee
          </Link>
          <Link
            href='https://www.instagram.com/isweedlegalhere/'
            target='_blank'
            className='rounded-full p-2 transition-colors hover:bg-black/10 active:bg-black/20'
          >
            <FaInstagram size='24px' />
          </Link>
        </div>
      </header>
      <div
        className={`fixed bottom-0 left-0 right-0 top-0 z-10 bg-brand-yellow px-4 py-20 transition-all duration-500 ease-out-expo ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-[-100%]'}`}
      >
        <div className='absolute right-4 top-4'>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className='rounded-full p-2 transition-colors hover:bg-black/10 active:bg-black/20'
          >
            <MdClose size='24px' />
          </button>
        </div>
        <ul className='flex flex-col gap-8'>
          {mobileMenuLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`p-4 text-center text-2xl font-semibold underline-offset-4 hover:underline ${pathname === link.href ? 'underline' : ''}`}
                target={link.target}
                onClick={() => setIsMobileMenuOpen(false)}
                rel={
                  link.noFollowExceptHome && pathname !== '/'
                    ? 'nofollow'
                    : undefined
                }
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Header
