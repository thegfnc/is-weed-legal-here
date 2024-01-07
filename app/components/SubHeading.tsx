type SubHeadingProps = {
  text: string
}

const SubHeading = ({ text }: SubHeadingProps) => {
  return (
    <h2 className='mt-12 max-w-xl text-balance text-[20px] md:mt-12 md:text-[26px]'>
      {text}
    </h2>
  )
}

export default SubHeading
