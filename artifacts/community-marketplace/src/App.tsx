import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { LocationProvider } from '@/context/LocationContext';
import { Layout } from '@/components/layout/Layout';

// Pages
import Home from '@/pages/home';
import ProvidersList from '@/pages/providers/index';
import ProviderProfile from '@/pages/providers/[id]';
import JobsList from '@/pages/jobs/index';
import PostJob from '@/pages/jobs/new';
import JobDetail from '@/pages/jobs/[id]';
import SavedProviders from '@/pages/saved';
import AdsPage from '@/pages/ads';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/providers" component={ProvidersList} />
          <Route path="/providers/:id" component={ProviderProfile} />
          <Route path="/jobs/new" component={PostJob} />
          <Route path="/jobs/:id" component={JobDetail} />
          <Route path="/jobs" component={JobsList} />
          <Route path="/saved" component={SavedProviders} />
          <Route path="/ads" component={AdsPage} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocationProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </LocationProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
