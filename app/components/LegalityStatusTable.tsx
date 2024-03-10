import { GetLegalityDataForLocationReturn } from '../helpers/getLegalityDataForLocation'

type LegalityStatusTableProps = {
  legalityData: GetLegalityDataForLocationReturn
}

export default function LegalityStatusTable({
  legalityData,
}: LegalityStatusTableProps) {
  const closestMatchData =
    legalityData.closestMatchKey && legalityData[legalityData.closestMatchKey]

  if (!closestMatchData) {
    return null
  }

  return (
    <div>
      <h2 className='text-3xl font-bold leading-normal md:text-[32px]'>
        Legality Status
      </h2>
      <div className='mt-8 border-2 border-brand-purple text-[13px] sm:text-sm md:text-base'>
        <div className='grid grid-cols-3 px-4 py-4 font-bold uppercase lg:px-6'>
          <div className='pr-[10px]'>Type</div>
          <div className='pr-[10px]'>Status</div>
          <div>Quantity</div>
        </div>
        <div className='grid grid-cols-3 border-t-2 border-brand-purple px-4 lg:px-6'>
          <div className='py-4 pr-[10px]'>Medicinal</div>
          <div className='py-4 pr-[10px] capitalize'>
            {closestMatchData.isWeedLegalHere?.medicinal?.legalStatus || '–'}
          </div>
          <div className='py-4'>
            {closestMatchData.isWeedLegalHere?.medicinal?.quantity || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px]'>
            Recreational
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px] capitalize'>
            {closestMatchData.isWeedLegalHere?.recreational?.legalStatus || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4'>
            {closestMatchData.isWeedLegalHere?.recreational?.quantity || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px]'>
            THCA
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px] capitalize'>
            {closestMatchData.isWeedLegalHere?.thca?.legalStatus || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4'>
            {closestMatchData.isWeedLegalHere?.thca?.quantity || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px]'>
            Delta 8
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px] capitalize'>
            {closestMatchData.isWeedLegalHere?.delta8?.legalStatus || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4'>
            {closestMatchData.isWeedLegalHere?.delta8?.quantity || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px]'>
            Delta 9
          </div>
          <div className='border-t-2 border-brand-purple py-4 pr-[10px] capitalize'>
            {closestMatchData.isWeedLegalHere?.delta9?.legalStatus || '–'}
          </div>
          <div className='border-t-2 border-brand-purple py-4'>
            {closestMatchData.isWeedLegalHere?.delta9?.quantity || '–'}
          </div>
        </div>
      </div>
    </div>
  )
}
