import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useGetMeta } from '@workspace/api-client-react';

interface LocationContextType {
  countryId: number | null;
  cityId: number | null;
  communityId: number | null;
  setCountryId: (id: number | null) => void;
  setCityId: (id: number | null) => void;
  setCommunityId: (id: number | null) => void;
  currencySymbol: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [countryId, setCountryId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const { data: meta } = useGetMeta();

  useEffect(() => {
    if (meta?.countries && meta.countries.length > 0 && !countryId) {
      setCountryId(meta.countries[0].id);
    }
  }, [meta, countryId]);

  const activeCountry = meta?.countries?.find(c => c.id === countryId);
  const currencySymbol = activeCountry?.currencySymbol || '$';

  return (
    <LocationContext.Provider value={{
      countryId, cityId, communityId,
      setCountryId, setCityId, setCommunityId,
      currencySymbol
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
