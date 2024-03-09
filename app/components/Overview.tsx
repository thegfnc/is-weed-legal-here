import { PortableText } from '@portabletext/react'
import { TypedObject } from '@portabletext/types'

type OverviewProps = { body: TypedObject[] }

export default function Overview({ body }: OverviewProps) {
  return (
    <div>
      <h2 className='text-[32px] font-bold leading-normal'>Overview</h2>
      <div className='portable-text mt-6 text-[20px] leading-tight'>
        <PortableText value={body} />
      </div>
    </div>
  )
}
