import { Link } from 'wouter';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="font-display font-bold text-xl">NeighbourWorks</span>
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
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display">Support</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link href="#" className="hover:text-primary transition-colors">How it works</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Verification Process</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display">For Providers</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link href="#" className="hover:text-primary transition-colors">Join as a Provider</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/50">
        &copy; {new Date().getFullYear()} NeighbourWorks. A demo community marketplace.
      </div>
    </footer>
  );
}
