import { siteInfo } from '@/data/content';
import ContributionWordmark from './ContributionWordmark';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink px-6 pt-8 md:px-10 md:pt-12">
      <div className="relative mx-auto w-4/5 max-w-[1280px]">
        <ContributionWordmark />
      </div>
      <div className="relative mx-auto mt-8 flex max-w-[1600px] flex-col items-center justify-between gap-4 border-t border-hairline py-5 font-mono text-[11px] uppercase tracking-widest text-muted md:flex-row">
        <span>
          © {year} {siteInfo.name}
        </span>
        <a href="#top" className="transition-colors hover:text-accent">
          Back to top
        </a>
      </div>
    </footer>
  );
}
