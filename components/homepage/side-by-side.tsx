import Image from 'next/image';
import { OrbitingCirclesComponent } from './orbiting-circles';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';

const features = [
  {
    name: '2 ML Models.',
    description:
      'Utilize the power of machine learning to match lost items with found items. Raydar uses two to ensure the highest accuracy.',
    icon: '/monitor.svg', // Path to the icon in the public directory
  },
  {
    name: 'Search and Analyze',
    description: 'Search for belongings and analyze hot spots for lost items. Raydar uses a heat map to show you where items are most likely to be found.',
    icon: '/search.svg', // Path to the icon in the public directory
  },
  {
    name: 'Get Alerts.',
    description: 'Receive notifications when a match is found. Raydar will notify you when your lost item is found.',
    icon: '/bell.svg', // Path to the icon in the public directory
  },
];

export default function SideBySide() {
  return (
    <div className="overflow-hidden ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}>
                The Inner Workings of the Ray
              </p>
              <p className="mt-6 leading-8 text-gray-600 dark:text-gray-400">
                How Raydar uses innovative tech to transform the lost and found
              </p>
              <dl className="mt-10 max-w-xl space-y-8 leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold dark:text-gray-100 text-gray-900">
                      <Image
                        src={feature.icon}
                        alt={feature.name}
                        width={20}
                        height={20}
                        className="absolute left-1 top-1 h-5 w-5"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline dark:text-gray-400">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <OrbitingCirclesComponent />
        </div>
      </div>
    </div>
  );
}