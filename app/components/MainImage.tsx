import Image from 'next/image'

export enum MainImageType {
  Legal = 'Legal',
  Illegal = 'Illegal',
}

type MainImageData = {
  url: string
  height: number
  width: number
  alt: string
}

const imageData: { [key in MainImageType]: MainImageData } = {
  [MainImageType.Legal]: {
    url: '/weed.png',
    height: 240,
    width: 240,
    alt: 'Stoned marijuana leaf cartoon',
  },
  [MainImageType.Illegal]: {
    url: '/police.png',
    height: 240,
    width: 321,
    alt: 'Police car seen from rearview mirror',
  },
}

type MainImageProps = {
  type: MainImageType
}

const MainImage = ({ type }: MainImageProps) => {
  const data: MainImageData = imageData[type]

  return (
    <Image
      className='mt-12'
      src={data.url}
      width={data.width}
      height={data.height}
      alt={data.alt}
      priority
    />
  )
}

export default MainImage
