import { Redirect } from 'expo-router';

import { useSession } from '@/store/useSession';

export default function Index() {
  const onboarded = useSession((state) => state.onboarded);
  return <Redirect href={onboarded ? '/(tabs)/explore' : '/onboarding'} />;
}
