type HeadingProps = {
  text: string
}

const Heading = ({ text }: HeadingProps) => {
  return (
    <h1 className='text-balance text-[48px] font-bold leading-tight md:text-[64px]'>
      {text}
    </h1>
  )
}

export default Heading
