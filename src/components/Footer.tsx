import { siteInfo } from '@/data/content';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-muted md:flex-row">
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
