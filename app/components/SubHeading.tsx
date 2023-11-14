type SubHeadingProps = {
  text: string
}

const SubHeading = ({ text }: SubHeadingProps) => {
  return (
    <h2
      className='mt-12 max-w-xl text-[20px] md:mt-12 md:text-[26px]'
      // @ts-ignore
      style={{ textWrap: 'balance' }}
    >
      {text}
    </h2>
  )
}

export default SubHeading
