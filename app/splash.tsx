// Design-system preview of the Splash screen (also the native-splash handoff visual).
import { AppSplash } from '../src/components/splash';
import { Screen } from '../src/components/ui';

export default function SplashRoute() {
  return (
    <Screen padded={false}>
      <AppSplash hint="Splash • native icon → this screen → welcome" />
    </Screen>
  );
}
