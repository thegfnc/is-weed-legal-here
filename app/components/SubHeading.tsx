type SubHeadingProps = {
  text: string
}

const SubHeading = ({ text }: SubHeadingProps) => {
  return (
    <div className='max-w-2xl text-balance text-[20px] md:text-[26px]'>
      {text}
    </div>
  )
}

export default SubHeading
