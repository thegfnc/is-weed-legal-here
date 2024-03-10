const modalContent = {
  DISCLAIMER: {
    heading: 'DISCLAIMER',
    subHeading: 'We miiiiight be wrong…',
    body: (
      <div className='pt-6 leading-6'>
        The information provided on these pages is for entertainment purposes
        only and does not, and is not intended to, constitute legal advice.
        Marijuana laws and penalties are ever-changing. We do our best to be
        mindful of these changes and make updates as necessary. For the most
        up-to-date laws, consult your state statutes. For legal advice, please
        hire an attorney. If you spot a mistake or have additional information,
        please contact us and we will be happy to look into it.
      </div>
    ),
  },
  SOURCES: {
    heading: 'SOURCES',
    subHeading: null,
    body: (
      <div>
        <div>
          <h3 className='text-2xl'>NORML</h3>
          <a
            href='https://norml.org/'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            https://norml.org/
          </a>
        </div>
        <div className='pt-6'>
          <h3 className='text-2xl'>Wikipedia</h3>
          <a
            href='https://wikipedia.org/'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            https://wikipedia.org/
          </a>
        </div>
        <div className='pt-12 text-sm'>Last updated March 10, 2024</div>
      </div>
    ),
  },
}

export default modalContent
