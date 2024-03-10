import { PortableText } from '@portabletext/react'
import { TypedObject } from '@portabletext/types'

type OverviewProps = { body: TypedObject[] }

export default function Overview({ body }: OverviewProps) {
  return (
    <div>
      <h2 className='text-3xl font-bold leading-normal md:text-[32px]'>
        Overview
      </h2>
      <div className='portable-text mt-6 text-base leading-tight md:text-[20px]'>
        <PortableText value={body} />
      </div>
    </div>
  )
}
