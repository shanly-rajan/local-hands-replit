import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground font-display">
            Page not found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        <div>
          <Link href="/">
            <Button className="w-full sm:w-auto rounded-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
