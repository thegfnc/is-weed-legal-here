export enum MainImageType {
  Legal = 'Legal',
  Illegal = 'Illegal',
}

export type MainImageData = {
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

export default imageData
