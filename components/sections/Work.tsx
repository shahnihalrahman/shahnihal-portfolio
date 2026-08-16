'use client';

import { useCallback, useState } from 'react';

import { ProjectModal } from '@/components/work/ProjectModal';
import { ProjectStory } from '@/components/work/ProjectStory';
import { SectionHead } from '@/components/ui/Primitives';
import { projects } from '@/lib/projects';

/**
 * The visual centre of the page.
 *
 * Each product gets a full storytelling block with a sticky product window
 * rather than a card in a grid, so the section is walked through rather than
 * skimmed. The modal remains for the complete case detail.
 */
export function Work() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  return (
    <section id="work" data-stage="work" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="02"
          kicker="Featured products"
          narrative="What I've built"
          title={
            <>
              Things I&rsquo;ve <span className="text-gradient">Actually Built</span>
            </>
          }
          lede="Two of these are real codebases, and the screens shown are captured from the real builds — the technology on each was read out of the repository, not recalled from memory. One is still in development and says so. One is a set of practices rather than a product."
        />

        <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
          {projects.map((project, i) => (
            <ProjectStory
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setOpenId(project.id)}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
