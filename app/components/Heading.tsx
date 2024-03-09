export enum HeadingSizes {
  SMALL = 'text-[22px] md:text-[32px]',
  MEDIUM = 'text-[36px] md:text-[48px]',
  LARGE = 'text-[42px] md:text-[64px]',
}

type HeadingProps = {
  text: string
  size?: HeadingSizes
}

const Heading = ({ text, size = HeadingSizes.LARGE }: HeadingProps) => {
  return (
    <h1 className={'text-balance font-bold leading-[1.1] ' + size}>{text}</h1>
  )
}

export default Heading
