import { ScrollView, StyleSheet } from 'react-native';
import { PRODUCT, TARGET_USERS, TARGET_USER_DETAILS, LEARNING_PHILOSOPHY, STUDENT_JOURNEY } from '../../src/constants/branding';
import { Screen, H1, Body, Muted, Card, Chip, LinkButton, Bullet } from '../../src/components/ui';

export default function Welcome() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Muted>STEP 1 OF 3 • MEET YOUR SCHOOL (NEXT: 11-STEP WIZARD → PLAN)</Muted>
        <H1>What is Vibe Coding?</H1>
        <Body>
          You describe what you want in plain words. An AI coding assistant builds it. You learn to guide, test and ship —
          no coding experience required.
        </Body>
        <Card>
          <Muted>{PRODUCT.name.toUpperCase()}</Muted>
          <Body>{PRODUCT.tagline}</Body>
        </Card>

        <H1>Who is this for?</H1>
        {TARGET_USER_DETAILS.map((t) => (
          <Card key={t.user}>
            <Chip label={t.user} tone="accent" />
            <Body>{t.pitch}</Body>
          </Card>
        ))}

        <H1>How you will learn</H1>
        <Body>WHY before HOW. Small steps. Every click demonstrated. Reproducible projects.</Body>
        {LEARNING_PHILOSOPHY.map((p) => (
          <Bullet key={p}>{p}</Bullet>
        ))}

        <H1>Where you will end up</H1>
        <Muted>{STUDENT_JOURNEY.join('  →  ')}</Muted>
        <Body>Independent System Builder: plan, build, test and deploy your own AI apps and automations.</Body>

        <LinkButton href="/(onboarding)/assessment" title="Continue → beginner wizard (3 questions + 8 big ideas)" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export { styles };
