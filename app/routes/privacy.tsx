import type { Route } from './+types/home';
import { HomeNav } from '~/components/HomeNav';
import { TypographyH1 } from '~/components/ui/typography/TypographH1';
import { Card } from '~/components/ui/card';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Privacy Policy - RFK Central' },
    { name: 'description', content: 'Privacy Policy for RFK Central' },
  ];
}

export default function Privacy() {
  return (
    <>
      <HomeNav />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="text-center mb-12">
            <TypographyH1>Privacy Policy</TypographyH1>
            <p className="text-muted-foreground mt-2">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-base leading-relaxed">
                Kraft Digital ("we," "us," or "our") operates the RFKCFargo application (the "Service"). 
                This page informs you of our policies regarding the collection, use, and disclosure of personal data 
                when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            {/* Information Collection and Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Collection and Use</h2>
              <p className="text-base leading-relaxed mb-6">
                We collect several different types of information for various purposes to provide and 
                improve our Service to you, and to offer a better automation experience.
              </p>

              <h3 className="text-xl font-semibold mb-3">Types of Data Collected</h3>
              <div className="pl-4">
                <h4 className="text-lg font-medium mb-2">Personal Data</h4>
                <p className="text-base leading-relaxed mb-4">
                  While using our Service, we may ask you to provide us with certain personally identifiable 
                  information that can be used to contact or identify you ("Personal Data"). 
                  Personally identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Approximate location data</li>
                  <li>Contacts or friend lists (if you choose to provide them)</li>
                  <li>Photos, videos, or other media (if you choose to provide them)</li>
                  <li>User-generated content (such as camp itineraries, packing lists, notes)</li>
                  <li>App usage data</li>
                </ul>
              </div>
            </section>

            {/* How Data is Collected */}
            <section>
              <h3 className="text-xl font-semibold mb-3">How Data is Collected</h3>
              <p className="text-base leading-relaxed mb-4">Most of the Personal Data we collect is provided directly by you when you:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Register for an account</li>
                <li>Create or manage camp plans</li>
                <li>Voluntarily provide information through app features</li>
                <li>Contact us for support</li>
              </ul>
            </section>

            {/* Use of Data */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Use of Data</h2>
              <p className="text-base leading-relaxed mb-4">Kraft Digital uses the collected data for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>To provide and maintain our Service</li>
                <li>To personalize your experience within the app</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-base mb-2">
                  We do <strong>not</strong> use your data for marketing or advertising purposes.
                </p>
                <p className="text-base">
                  We do <strong>not</strong> use your data to comply with legal obligations unless explicitly required by law.
                </p>
              </div>
            </section>

            {/* Data Storage and Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
              <p className="text-base leading-relaxed">
                The security of your data is important to us. Your data is stored with cloud providers. 
                We implement security measures, including role-based access controls, to protect your 
                Personal Data from unauthorized access, use, or disclosure.
              </p>
            </section>

            {/* Data Protection Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights</h2>
              <p className="text-base leading-relaxed mb-4">You have the following data protection rights:</p>
              <ul className="space-y-4">
                <li>
                  <strong className="text-primary">The right to access:</strong>
                  <p className="mt-1">You have the right to request copies of your personal data.</p>
                </li>
                <li>
                  <strong className="text-primary">The right to rectification:</strong>
                  <p className="mt-1">You have the right to request that we correct any information you believe is inaccurate.</p>
                </li>
                <li>
                  <strong className="text-primary">The right to erasure:</strong>
                  <p className="mt-1">You can request the deletion of your Personal Data by contacting us.</p>
                </li>
                <li>
                  <strong className="text-primary">The right to object to processing:</strong>
                  <p className="mt-1">You have the right to object to our processing of your personal data.</p>
                </li>
                <li>
                  <strong className="text-primary">The right to data portability:</strong>
                  <p className="mt-1">You have the right to request that we transfer your data to another organization.</p>
                </li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-base leading-relaxed">
                Our Service does not address anyone under the age of 18 ("Children"). 
                We do not knowingly collect personally identifiable information from anyone under the age of 18.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-base leading-relaxed mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>By email: <a href="mailto:jase@jasekraft.com" className="text-primary hover:underline">jase@jasekraft.com</a></li>
                <li>Legal Name of Organization: Kraft Digital</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </>
  );
} 