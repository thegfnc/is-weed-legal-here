export enum MainImageType {
  Legal = 'Legal',
  Illegal = 'Illegal',
  SortOf = 'SortOf',
}

export type MainImageData = {
  url: string
  height: number
  width: number
  alt: string
}

const imageData: { [key in MainImageType]: MainImageData } = {
  [MainImageType.Legal]: {
    url: '/legal.gif',
    height: 240,
    width: 240,
    alt: 'Dancing stoned marijuana leaf cartoon',
  },
  [MainImageType.Illegal]: {
    url: '/illegal.webp',
    height: 240,
    width: 321,
    alt: 'Police cars seen from rearview mirror',
  },
  [MainImageType.SortOf]: {
    url: '/sort-of.gif',
    height: 240,
    width: 321,
    alt: 'Little kid saying "I know you\'re talking about smoking weed"',
  },
}

export default imageData
