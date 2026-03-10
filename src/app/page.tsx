import { Hero } from "@/components/sections/Hero";
import { LatestWorks } from "@/components/sections/LatestWorks";
import { Services } from "@/components/sections/Services";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <LatestWorks />
      <Services />
      <Footer />
    </main>
  );
}
