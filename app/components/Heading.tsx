type HeadingProps = {
  text: string
}

const Heading = ({ text }: HeadingProps) => {
  return (
    <h1
      className='text-[48px] font-bold leading-none md:text-[64px]'
      // @ts-ignore
      style={{ textWrap: 'balance' }}
    >
      {text}
    </h1>
  )
}

export default Heading
