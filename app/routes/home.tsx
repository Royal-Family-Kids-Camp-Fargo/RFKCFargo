import type { Route } from './+types/home';
import { authStore } from '../stores/authStore';
import { HomeNav } from '~/components/HomeNav';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { TypographyH1 } from '~/components/ui/typography/TypographH1';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RFK Central' },
    { name: 'description', content: 'RFK Central' },
  ];
}

export default function Home() {
  const user = authStore.getUser();

  return (
    <>
      <HomeNav />
      <div className="container max-w-none">
        <div
          className="w-full h-[400px] mb-8 bg-white bg-contain bg-center bg-no-repeat p-8 relative"
          style={{ backgroundImage: 'url("/2025-banner.jpg")' }}
        />

        <div className="text-center mb-8 max-w-7xl mx-8">
          <TypographyH1>Welcome to Royal Family Kids Camp</TypographyH1>
          <h2 className="text-xl text-muted-foreground mt-4">
            Join our community of volunteers and supporters making a difference
            in children's lives.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto">
          <Card className="transition-all hover:-translate-y-1 hover:shadow-lg w-full">
            <CardContent className="text-center p-8">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Volunteer Team
              </h2>
              <p className="mb-6">
                Help us create a safe, fun, and unforgettable camp experience
                for children who need it most.
              </p>
              <div className="flex flex-col gap-4">
                <Button className="w-full" asChild>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdJROfy0S53UwLY449Z6L2zjNvpDVvlrBDyHGGmYOvhbyjhyA/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    New Volunteer Registration
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeyYwuMEluMzOC8QXoXbzBdhtGY6KKoByFuSg_3cLjsGycQRg/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Returning Volunteer Registration
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:-translate-y-1 hover:shadow-lg w-full">
            <CardContent className="text-center p-8">
              <h2 className="text-3xl font-bold mb-4">
                Interested in Donating?
              </h2>
              <p className="mb-6">
                Your support helps kids have a chance to simply be kids, have
                fun, and know there are adults who care. Together, we can make
                lasting memories and foster brighter futures.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a
                  href="https://rivercityfargo.org/ftcfargo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Make a Donation
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
