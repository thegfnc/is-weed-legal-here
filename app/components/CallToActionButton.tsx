import { MdSearch } from 'react-icons/md'

type CallToActionButtonProps = {
  text: string
  linkUrl: string
}

const CallToActionButton = ({ text, linkUrl }: CallToActionButtonProps) => {
  return (
    <a
      className='flex items-center rounded-full border-2 border-brand-purple py-2 pl-4 pr-5 text-[16px] transition-colors hover:bg-brand-purple hover:text-brand-yellow md:text-[18px]'
      href={linkUrl}
      target='_blank'
    >
      <MdSearch size='24px' className='mr-3' /> {text}
    </a>
  )
}

export default CallToActionButton
