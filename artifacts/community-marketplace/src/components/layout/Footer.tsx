import { Link } from 'wouter';
import { Heart, Home } from 'lucide-react';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={`bg-secondary text-secondary-foreground py-12 mt-auto ${className ?? ''}`}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Home className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl">Neighbourly</span>
          </Link>
          <p className="text-secondary-foreground/70 text-sm">
            The customer has choice. The provider has opportunity. The community creates trust.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display">Marketplace</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link href="/providers" className="hover:text-primary transition-colors">Find a Provider</Link></li>
            <li><Link href="/jobs" className="hover:text-primary transition-colors">Community Jobs</Link></li>
            <li><Link href="/jobs/new" className="hover:text-primary transition-colors">Post a Job</Link></li>
            <li><Link href="/ads" className="hover:text-primary transition-colors">Community Ads</Link></li>
            <li><Link href="/saved" className="hover:text-primary transition-colors">Saved Providers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display">Discover</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link href="/providers?sort=rating" className="hover:text-primary transition-colors">Top-Rated Providers</Link></li>
            <li><Link href="/providers?sort=value" className="hover:text-primary transition-colors">Best Value Providers</Link></li>
            <li><Link href="/providers?verifiedOnly=true" className="hover:text-primary transition-colors">Verified Providers</Link></li>
            <li><Link href="/providers?sort=newest" className="hover:text-primary transition-colors">Newest Providers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display">Jobs Board</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link href="/jobs?status=open" className="hover:text-primary transition-colors">Open Jobs</Link></li>
            <li><Link href="/jobs?status=providers_interested" className="hover:text-primary transition-colors">Providers Interested</Link></li>
            <li><Link href="/jobs/new" className="hover:text-primary transition-colors">Post a New Job</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/50">
        &copy; {new Date().getFullYear()} Neighbourly. A demo community marketplace.
      </div>
    </footer>
  );
}
