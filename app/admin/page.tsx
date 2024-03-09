import Heading from '../components/Heading'
import { CMSCountry, LegalStatus, LegalityByCountry } from '../types'
import transformCMSDataToLegalityByCountry from '../helpers/transformCMSDataToLegalityByCountry'
import { sanityFetch } from '../data/client'

type TableRow = {
  country: string
  administrativeAreaLevel1?: string
  administrativeAreaLevel2?: string
  locality?: string
  medicinal: LegalStatus
  recreational: LegalStatus
  quantity: string | null
}

const flattenLegalityData = (legalityData: LegalityByCountry) => {
  const tableRows: TableRow[] = []

  Object.entries(legalityData).forEach(([country, value]) => {
    tableRows.push({
      country,
      administrativeAreaLevel1: undefined,
      administrativeAreaLevel2: undefined,
      locality: undefined,
      medicinal: value.MEDICINAL,
      recreational: value.RECREATIONAL,
      quantity: value.QUANTITY,
    })

    if (value.administrativeAreaLevel1) {
      Object.entries(value.administrativeAreaLevel1).forEach(
        ([administrativeAreaLevel1, value]) => {
          tableRows.push({
            country,
            administrativeAreaLevel1,
            administrativeAreaLevel2: undefined,
            locality: undefined,
            medicinal: value.MEDICINAL,
            recreational: value.RECREATIONAL,
            quantity: value.QUANTITY,
          })

          if (value.administrativeAreaLevel2) {
            Object.entries(value.administrativeAreaLevel2).forEach(
              ([administrativeAreaLevel2, value]) => {
                tableRows.push({
                  country,
                  administrativeAreaLevel1,
                  administrativeAreaLevel2,
                  locality: undefined,
                  medicinal: value.MEDICINAL,
                  recreational: value.RECREATIONAL,
                  quantity: value.QUANTITY,
                })
              }
            )
          }

          if (value.locality) {
            Object.entries(value.locality).forEach(([locality, value]) => {
              tableRows.push({
                country,
                administrativeAreaLevel1,
                administrativeAreaLevel2: undefined,
                locality,
                medicinal: value.MEDICINAL,
                recreational: value.RECREATIONAL,
                quantity: value.QUANTITY,
              })
            })
          }
        }
      )
    }
  })

  return tableRows
}

const getAdditionalCellStyles = (legalStatus: LegalStatus) => {
  switch (legalStatus) {
    case LegalStatus.Illegal:
      return ' bg-brand-red/90 text-black'
    case LegalStatus.Decriminalized:
      return ' bg-brand-yellow/90 text-black'
    case LegalStatus.Legal:
      return ' bg-brand-green/90 text-black'
    case LegalStatus.Unknown:
      return ' bg-gray-300/90 text-black'
    default:
      return ' bg-gray-500/90 text-black'
  }
}

const TH_CLASS_NAME =
  'px-6 py-6 text-s font-medium text-gray-500 uppercase tracking-wider'

const TD_CLASS_NAME = 'px-6 py-4 text-sm border-r-2 border-slate-700'

const ALL_DATA_QUERY = `
  *[_type == 'IIHD_country'] | order(name) {
    name,
    isWeedLegalHere,
    labels,
    administrativeAreaLevel1 {
      children[]-> {
        name,
        isWeedLegalHere,
        administrativeAreaLevel2 {
          children[]-> {
            name,
            isWeedLegalHere
          }
        },
        locality {
          children[]-> {
            name,
            isWeedLegalHere
          }
        }
      }
    }
  }
`

export default async function Admin() {
  const data = await sanityFetch<CMSCountry[]>({
    query: ALL_DATA_QUERY,
    tags: [
      'IIHD_country',
      'IIHD_administrativeAreaLevel1',
      'IIHD_administrativeAreaLevel2',
      'IIHD_locality',
    ],
  })

  const transformedData = transformCMSDataToLegalityByCountry(data)

  const tableRows = flattenLegalityData(transformedData)

  return (
    <div className='my-10 w-full'>
      <Heading text='Legality Data' />
      <div className='mt-10 w-full overflow-scroll bg-black p-4'>
        <table className='w-full min-w-[1200px] table-fixed border-collapse border-inherit text-center indent-0 text-gray-100'>
          <thead className='sticky top-0 bg-white align-top'>
            <tr>
              <th className={TH_CLASS_NAME + ' text-left'}>Country</th>
              <th className={TH_CLASS_NAME}>
                Administrative Area Level 1 <br />
                <span className='text-xs'>(US States)</span>
              </th>
              <th className={TH_CLASS_NAME}>
                Administrative Area Level 2 <br />
                <span className='text-xs'>(US Counties)</span>
              </th>
              <th className={TH_CLASS_NAME}>
                Locality <br />
                <span className='text-xs'>(US Cities)</span>
              </th>
              <th className={TH_CLASS_NAME}>Medicinal</th>
              <th className={TH_CLASS_NAME}>Recreational</th>
              <th className={TH_CLASS_NAME}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(
              (
                {
                  country,
                  administrativeAreaLevel1,
                  administrativeAreaLevel2,
                  locality,
                  medicinal,
                  recreational,
                  quantity,
                },
                index
              ) => (
                <tr
                  key={
                    country +
                    administrativeAreaLevel1 +
                    administrativeAreaLevel2 +
                    locality
                  }
                  className={`border-b-2 border-slate-600 hover:bg-slate-600 ${
                    index % 2 === 1 ? 'bg-slate-800' : 'bg-transparent'
                  }`}
                >
                  <td
                    className={
                      TD_CLASS_NAME + ' border-l-2 border-slate-700 text-left'
                    }
                  >
                    {country}
                  </td>
                  <td className={TD_CLASS_NAME}>{administrativeAreaLevel1}</td>
                  <td className={TD_CLASS_NAME}>{administrativeAreaLevel2}</td>
                  <td className={TD_CLASS_NAME}>{locality}</td>
                  <td
                    className={
                      TD_CLASS_NAME + getAdditionalCellStyles(medicinal)
                    }
                  >
                    {medicinal}
                  </td>
                  <td
                    className={
                      TD_CLASS_NAME + getAdditionalCellStyles(recreational)
                    }
                  >
                    {recreational}
                  </td>
                  <td className={TD_CLASS_NAME}>{quantity}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
