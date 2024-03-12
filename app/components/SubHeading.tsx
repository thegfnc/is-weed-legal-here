type SubHeadingProps = {
  text: string
}

const SubHeading = ({ text }: SubHeadingProps) => {
  return (
    <div className='text-balance text-[20px] leading-tight md:text-[26px]'>
      {text}
    </div>
  )
}

export default SubHeading
