import Heading from '../components/Heading'
import legalityByCountry from '../data/legality-by-country'
import { LegalStatus, LegalityByCountry } from '../types'

const thClassName =
  'px-6 py-6 text-s font-medium text-gray-500 uppercase tracking-wider'

const tdClassName =
  'px-6 py-4 whitespace-nowrap text-sm text-gray-100 text-nowrap border-r-2 border-slate-700'

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

export default function Admin() {
  const tableRows = flattenLegalityData(legalityByCountry)

  return (
    <div className='m-10'>
      <div className='mb-10'>
        <Heading text='Legality Data' />
      </div>
      <table className='min-w-full table-fixed border-collapse border-inherit text-center indent-0'>
        <thead className='sticky top-0 bg-white align-top'>
          <tr>
            <th className={thClassName + ' text-left'}>Country</th>
            <th className={thClassName}>
              Administrative Area Level 1 <br />
              <span className='text-xs'>(US States)</span>
            </th>
            <th className={thClassName}>
              Administrative Area Level 2 <br />
              <span className='text-xs'>(US Counties)</span>
            </th>
            <th className={thClassName}>
              Locality <br />
              <span className='text-xs'>(US Cities)</span>
            </th>
            <th className={thClassName}>Medicinal</th>
            <th className={thClassName}>Recreational</th>
            <th className={thClassName}>Quantity</th>
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
                key={country}
                className={`border-b-2 border-slate-600 hover:bg-slate-600 ${
                  index % 2 === 1 ? 'bg-slate-800' : 'bg-transparent'
                }`}
              >
                <td className={tdClassName + ' text-left'}>{country}</td>
                <td className={tdClassName}>{administrativeAreaLevel1}</td>
                <td className={tdClassName}>{administrativeAreaLevel2}</td>
                <td className={tdClassName}>{locality}</td>
                <td
                  className={tdClassName + getAdditionalCellStyles(medicinal)}
                >
                  {medicinal}
                </td>
                <td
                  className={
                    tdClassName + getAdditionalCellStyles(recreational)
                  }
                >
                  {recreational}
                </td>
                <td className={tdClassName}>{quantity}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
