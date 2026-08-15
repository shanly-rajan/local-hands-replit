import { Link, useLocation } from 'wouter';
import { Home, Search, Briefcase, Heart, PlusCircle } from 'lucide-react';

const navItems = [
  { href: '/',          icon: Home,        label: 'Home' },
  { href: '/providers', icon: Search,      label: 'Providers' },
  { href: '/jobs',      icon: Briefcase,   label: 'Jobs' },
  { href: '/saved',     icon: Heart,       label: 'Saved' },
  { href: '/jobs/new',  icon: PlusCircle,  label: 'Post Job', primary: true },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-stretch h-16">
        {navItems.map(({ href, icon: Icon, label, primary }) => {
          const active = href === '/' ? location === '/' : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                primary
                  ? 'text-primary'
                  : active
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${primary && !active ? 'stroke-[2.5]' : ''}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
