import { About } from '@/components/sections/About';
import { Achievements } from '@/components/sections/Achievements';
import { AiDev } from '@/components/sections/AiDev';
import { ArchitectureView } from '@/components/sections/ArchitectureView';
import { Collaboration } from '@/components/sections/Collaboration';
import { Contact } from '@/components/sections/Contact';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Pipeline } from '@/components/sections/Pipeline';
import { ProductThinking } from '@/components/sections/ProductThinking';
import { Stack } from '@/components/sections/Stack';
import { Work } from '@/components/sections/Work';
import { Ambient } from '@/components/shell/Ambient';
import { Footer } from '@/components/shell/Footer';
import { Nav } from '@/components/shell/Nav';
import { ScrollProgress } from '@/components/shell/ScrollProgress';
import { SmoothScroll } from '@/components/shell/SmoothScroll';
import { SystemStage } from '@/components/system/SystemStage';

/**
 * One continuous system rather than a stack of sections.
 *
 * `Ambient` and `SystemStage` are both fixed layers that persist for the whole
 * scroll. Each story section carries a `data-stage` attribute, and the shared 3D
 * system reads it to decide which of its sub-systems should be active — so the
 * transition between two sections is itself the animation.
 */
export default function Page() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Ambient />
      <SystemStage />
      <Nav />

      <main id="main" className="relative z-10">
        <Hero />
        <CurrentlyBuilding />
        <Pipeline />
        <Work />
        <AiDev />
        <ArchitectureView />
        <Stack />
        <ProductThinking />
        <Collaboration />
        <Experience />
        <Achievements />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
