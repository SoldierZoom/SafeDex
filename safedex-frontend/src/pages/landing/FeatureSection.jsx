import { ReactTyped } from 'react-typed'
import mapScreenshot from './assets/images/mapScreenshot.png'
import listingPreview from './assets/images/listingPreview.png'

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
        className="font-medium text-blue-700 hover:underline"
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
              <h2 className="font-mono text-2xl font-semibold text-black dark:text-white hc:text-hc-text"> OUR SAFEDEX STRATEGY </h2>

                {/* TAKEN FROM A YOUTUBE VIDEO I LOST THE LINK :( */}
              <p className="relative mt-2 text-5xl font-semibold tracking-tight text-black sm:text-6xl dark:text-white hc:text-hc-text">
                    The{' '}
                    <ReactTyped
                        strings={['safe','SafeDex']}
                        typeSpeed={120}
                        backSpeed={120}
                        backDelay={5000}
                        loop
                        className="text-black dark:text-white hc:text-hc-text"
                    />
                    <br />way to find homes.
                </p>
    
              <p className="mt-6 text-xl text-slate-900 dark:text-slate-100 hc:text-hc-text">
                SafeDex integrates real UK crime data into property searching so you can make fully-informed decisions about where you live.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-xl text-slate-800 lg:max-w-none dark:text-slate-300 hc:text-hc-text">
                {features.map((feature) => (
                  <div key={feature.name} className="relative ">
                    <dt className="inline font-semibold text-slate-900 dark:text-white hc:text-hc-text">
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Preview Images */}
          <div className="flex flex-col gap-4 w-full">
            <div className="relative rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-slate-200 dark:border-slate-700 hc:border-hc-border shadow-lg">
              <img
                src={listingPreview}
                alt="SafeDex individual listing showing safety score"
                className="w-full h-56 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white font-mono text-xs px-3 py-1 rounded-full">
                Safety Score
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-slate-200 dark:border-slate-700 hc:border-hc-border shadow-lg">
              <img
                src={mapScreenshot}
                alt="SafeDex crime heatmap showing Birmingham crime data"
                className="w-full h-56 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white font-mono text-xs px-3 py-1 rounded-full">
                Crime Heatmap
              </div>
            </div>
            {/*add safety score breakdown and favourites here*/}
            
            <div className="flex justify-end">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}