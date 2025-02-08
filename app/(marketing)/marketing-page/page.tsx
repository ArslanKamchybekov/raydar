import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import Link from "next/link"
import PageWrapper from "@/components/wrapper/page-wrapper"
import { VideoPlayer } from "@/components/video-player"
import Image from "next/image"

export const metadata: Metadata = {
  metadataBase: new URL("https://raydar.uic.edu"),
  keywords: ["UIC", "lost and found", "students", "similarity matches", "data analysis", "alerts"],
  title: "Raydar - UIC Lost and Found",
  openGraph: {
    description: "Find your lost items on UIC campus with Raydar - the smart lost and found platform.",
    images: ["/raydar-og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raydar - UIC Lost and Found",
    description: "Find your lost items on UIC campus with Raydar - the smart lost and found platform.",
    siteId: "raydar_uic",
    creator: "@raydar_uic",
    creatorId: "1234567890",
    images: ["/raydar-twitter-image.jpg"],
  },
}

export default async function LandingPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col min-h-screen items-center mt-[2.5rem] p-3 w-full">
        <h1 className="scroll-m-20 max-w-[800px] text-5xl font-bold tracking-tight text-center">
        Find What You&apos;ve Lost On Campus with Raydar
        </h1>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg text-center mt-4 dark:text-gray-400">
          Raydar is the smart lost and found platform for UIC students. Upload images, get matches, and find your
          belongings faster.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/upload" className="mt-2">
            <Button size="lg">Upload Lost Item</Button>
          </Link>
          <Link href="/search" className="mt-2">
            <Button size="lg" variant="outline">
              Search Database
            </Button>
          </Link>
        </div>
        <div className="mb-3 mt-[3rem] max-w-[900px] w-full">
          <VideoPlayer videoSrc="https://example.com/raydar-demo.mp4" />
        </div>
        <div className="flex flex-col min-h-screen max-w-[900px] items-center mb-[2rem]">
          <article className="w-full mx-auto pb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">How Raydar Works</h2>

            <section className="mb-12">
              <h3 className="mt-10 scroll-m-20 border-b pb-2 mb-3 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
                Similarity Matches
              </h3>
              <p className="text-md mb-5 leading-relaxed">
                Upload a picture or sketch of your lost item, and our advanced AI will scan our database for similar
                items. Get instant matches and increase your chances of finding your belongings.
              </p>
              <Image
                src="/similarity-matches.jpg"
                alt="Similarity Matches Demo"
                width={800}
                height={400}
                className="rounded-lg shadow-md"
              />
            </section>

            <section className="mb-12">
              <h3 className="mt-10 scroll-m-20 border-b pb-2 mb-3 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
                Data Analysis
              </h3>
              <p className="text-md mb-5 leading-relaxed">
                Raydar uses cutting-edge data analysis to identify hotspots where items are most frequently lost. Stay
                informed about campus trends and take preventive measures.
              </p>
              <Image
                src="/data-analysis.jpg"
                alt="Data Analysis Dashboard"
                width={800}
                height={400}
                className="rounded-lg shadow-md"
              />
            </section>

            <section className="mb-12">
              <h3 className="mt-10 scroll-m-20 border-b pb-2 mb-3 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
                Alerts and Information
              </h3>
              <p className="text-md mb-5 leading-relaxed">
                Set up custom alerts for your lost items. Our system will notify you when potential matches are found or
                when items fitting your description are turned in.
              </p>
              <ul className="flex flex-col gap-1 list-disc ml-8 mb-4">
                <li className="mb-2">
                  <strong>Customizable Filters:</strong> Narrow down your search with specific criteria.
                </li>
                <li className="mb-2">
                  <strong>Real-time Notifications:</strong> Get instant alerts via email or push notifications.
                </li>
                <li className="mb-2">
                  <strong>Campus-wide Network:</strong> Connect with the entire UIC community to find your items.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 mb-3 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Why Choose Raydar?
              </h2>
              <p className="text-md mb-5 leading-relaxed">
                Raydar is more than just a lost and found system. It&apos;s a smart platform designed specifically for UIC
                students to make the process of recovering lost items quick, easy, and efficient.
              </p>
              <ol className="flex flex-col gap-1 list-decimal ml-8 mb-4">
                <li className="mb-2">
                  <strong>UIC-Specific:</strong> Tailored for our campus layout and community.
                </li>
                <li className="mb-2">
                  <strong>User-Friendly:</strong> Intuitive interface for easy reporting and searching.
                </li>
                <li className="mb-2">
                  <strong>Privacy-Focused:</strong> Your data is secure and only used to help find your items.
                </li>
                <li className="mb-2">
                  <strong>Community-Driven:</strong> Harness the power of the UIC student body to increase find rates.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 mb-3 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Get Started with Raydar
              </h2>
              <p className="text-md mb-5 leading-relaxed">
                Join the Raydar community today and never worry about losing your belongings on campus again. It&apos;s free
                fast, and could save you hours of searching.
              </p>
              <div className="flex gap-4 mt-6 justify-center">
                <Link href="/signup" className="mt-2">
                  <Button size="lg">Create an Account</Button>
                </Link>
                <Link href="/how-it-works" className="mt-2">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </PageWrapper>
  )
}

