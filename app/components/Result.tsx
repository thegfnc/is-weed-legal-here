import MainImage from '@/app/components/MainImage'
import SubHeading from '@/app/components/SubHeading'
import Heading, { HeadingSizes } from '@/app/components/Heading'
import CallToActionButton from '@/app/components/CallToActionButton'
import { MainImageType } from '../data/images'

type ResultProps = {
  heading: string
  headingSize?: HeadingSizes
  subHeading?: string
  imageType?: MainImageType | null
  ctaLinkUrl?: string | null
  ctaButtonText?: string
}

export default function Result({
  heading,
  headingSize = HeadingSizes.LARGE,
  subHeading,
  imageType,
  ctaLinkUrl,
  ctaButtonText,
}: ResultProps) {
  return (
    <>
      <div className='max-w-6xl'>
        <Heading text={heading} size={headingSize} />
      </div>
      {subHeading && (
        <div>
          <SubHeading text={subHeading} />
        </div>
      )}
      {imageType && <MainImage type={imageType} />}
      {ctaButtonText && ctaLinkUrl && (
        <CallToActionButton text={ctaButtonText} linkUrl={ctaLinkUrl} />
      )}
    </>
  )
}
