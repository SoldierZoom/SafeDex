import { ReactTyped } from 'react-typed'

const features = [
  {
    name: 'Safety Scores.',
    description: (
    <>
      Each property is assigned a unique Safety Score calculated from real UK crime data sourced from{' '}
      <a tabIndex={0}
        href="https://data.police.uk" 
        target="_blank" 
        rel="noreferrer"
        className="font-medium text-indigo-600 hover:underline"
      >
        data.police.uk
      </a>
      {' '}against community safety measures.
    </>
    ),
  },

  {
    name: 'Crime Map.',
    description: 'An interactive Map displaying property listings, and relevant crime and safety markers within the surrounding areas.',
  },
  {
    name: 'Smart Filters.',
    description: 'Add Filters and Search through listings that match your personal safety needs. ',
  },
  {
    name: 'Personalisation.',
    description: 'Save properties and neighbourhoods to view later. ',
  },
]

// Taken from https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections 
export default function FeatureSection() {
  return (
    <div className="overflow-hidden sm:py-32 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg font-mono">
              <h2 className="font-mono text-2xl font-semibold text-black"> OUR SAFEDEX STRATEGY </h2>

                {/* TAKEN FROM A YOUTUBE VIDEO I LOST THE LINK :( */}
              <p className="relative mt-2 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                    The{' '}
                    <ReactTyped
                        strings={['safe','SafeDex']}
                        typeSpeed={120}
                        backSpeed={120}
                        backDelay={5000}
                        loop
                        className="text-black"
                    />
                    <br />way to find homes.
                </p>
    
              <p className="mt-6 text-xl text-slate-600">
                SafeDex integrates real UK crime data into property searching so you can make fully-informed decisions about where you live.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-xl text-slate-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative ">
                    <dt className="inline font-semibold text-slate-900">
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          {/* ADD SCREENSHOT HERE OR MAKE IT INTERACTIVE*/}
          <div className="w-full h-96 bg-slate-100 flex items-center justify-center text-slate-400">
            Map screenshot will be added here (maybe interactive preview)
          </div>
        </div>
      </div>
    </div>
  )
}