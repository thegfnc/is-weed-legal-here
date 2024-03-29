import Image from 'next/image'
import imageData, { MainImageData, MainImageType } from '@/app/data/images'

type MainImageProps = {
  type: MainImageType
}

const MainImage = ({ type }: MainImageProps) => {
  const data: MainImageData = imageData[type]

  return (
    <Image
      className='max-h-60 max-w-full'
      src={data.url}
      width={data.width}
      height={data.height}
      alt={data.alt}
      priority
    />
  )
}

export default MainImage
