import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Craft workshop"
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            About CraftMarket
          </h1>
          <p className="mt-6 text-xl text-indigo-200 max-w-3xl">
            Connecting talented artisans with customers who appreciate unique, handcrafted products. 
            We're building a community where creativity thrives and craftsmanship is celebrated.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              At CraftMarket, we believe in the power of handmade. Our mission is to provide a platform 
              where artisans can showcase their unique creations and connect with customers who value 
              quality, authenticity, and the human touch in every product.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-indigo-500/10 p-2 ring-1 ring-indigo-500/20">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-6 text-gray-900">Empower Artisans</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                We provide tools, resources, and a marketplace for creators to turn their passion into a sustainable business.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-indigo-500/10 p-2 ring-1 ring-indigo-500/20">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25a9 9 0 01-9 9m9-11.25v-2.25a9 9 0 00-9-9m9 11.25l-2.25 1.313m0 0l-2.25 1.313M12 21a9 9 0 01-9-9v-2.25a9 9 0 019-9m0 11.25l2.25-1.313M12 21l2.25-1.313M12 21v-2.25a9 9 0 019-9m-9 11.25l-2.25-1.313" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-6 text-gray-900">Quality Assurance</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Every product on our platform is carefully curated to ensure the highest standards of craftsmanship and quality.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-indigo-500/10 p-2 ring-1 ring-indigo-500/20">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-6 text-gray-900">Build Community</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                We foster connections between makers and customers, creating a vibrant community of craft enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Our Story</h2>
                <p>
                  CraftMarket was born from a simple observation: there are countless talented artisans 
                  creating beautiful, unique products, but they often struggle to reach customers who would 
                  truly appreciate their work.
                </p>
                <p className="mt-6">
                  Our founders, passionate about supporting local craftspeople and preserving traditional 
                  skills, created this platform to bridge the gap between creators and customers. What started 
                  as a small community of local artisans has grown into a thriving marketplace connecting 
                  makers from around the world.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">What We Believe</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Every handmade item tells a story worth sharing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Quality craftsmanship deserves fair compensation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Sustainable practices benefit everyone</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Community support drives innovation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by creators and customers worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-indigo-200">
                Join thousands of artisans and customers who have made CraftMarket their home for unique, handcrafted products.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-indigo-200">Active Artisans</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">2,000+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-indigo-200">Products Sold</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">50,000+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-indigo-200">Happy Customers</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">25,000+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-indigo-200">Countries</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">45+</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to join our community?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Whether you're a creator looking to showcase your work or a customer seeking unique products, 
              we'd love to have you as part of our growing community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="/products" className="text-sm font-semibold leading-6 text-gray-900">
                Browse products <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
