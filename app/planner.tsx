// Student AI Project Planner: idea → 11-part plan → Save → Track todos → Update.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../src/theme';
import { generatePlan } from '../src/lib/planner';
import { createSavedPlan, togglePlanTodo, planProgress, updatePlanIdea, removePlan, type SavedPlan } from '../src/lib/savedPlans';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar } from '../src/components/ui';

const KEY = 'amp-plans';

// Student AI Project Planner: idea → PRD-lite → stack → tasks → deploy.
// Deterministic offline engine (LLM hook can replace generatePlan later).
export default function Planner() {
  const [idea, setIdea] = useState('I want an AI system that automatically answers Facebook inquiries and saves leads.');
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editIdea, setEditIdea] = useState('');
  const plan = generatePlan(idea.trim() || 'My AI app idea');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((s) => {
      if (s) {
        try {
          setPlans(JSON.parse(s) as SavedPlan[]);
        } catch {
          // corrupted — start fresh
        }
      }
    });
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(KEY, JSON.stringify(plans)).catch(() => {});
  }, [plans]);

  const sections: { title: string; hint: string; items: string[] }[] = [
    { title: 'Features (what it does)', hint: 'Start small — one core workflow first.', items: plan.features },
    { title: 'TODOs (your build order)', hint: 'Save the plan to check these off as you build.', items: plan.todos },
    { title: 'Phases (plan → ship)', hint: 'Same rhythm pros use: PRD → scaffold → AI → test → deploy.', items: plan.phases },
    { title: 'Stack (what to use)', hint: 'Beginner-safe defaults. Change only if you know why.', items: plan.stack },
    { title: 'Database (what to store)', hint: 'One row per real thing. Owner + RLS for multi-user.', items: plan.database },
    { title: 'APIs (how parts talk)', hint: 'Keys stay server-side — never in the mobile app.', items: plan.apis },
    { title: 'AI plan (prompts + guardrails)', hint: 'System prompt, JSON output, caps and error handling.', items: plan.aiPlan },
    { title: 'Deployment (go live)', hint: 'Test on device → internal track → production + monitoring.', items: plan.deployment },
  ];

  function save() {
    const rec = createSavedPlan(idea.trim() || 'My AI app idea', plan);
    setPlans((p) => [rec, ...p]);
    setOpenId(rec.id);
  }

  const open = plans.find((p) => p.id === openId) ?? null;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>INDEPENDENT BUILDER TOOL • SAVE + TRACK + UPDATE</Eyebrow>
        <H1>AI Project Planner</H1>
        <Body>Describe your idea in plain words. Get a buildable plan: definition, features, stack, architecture, phases, tools, database, APIs, AI, deploy — then save and track it.</Body>

        <Text style={s.label}>What do you want to build? (1–3 sentences is enough)</Text>
        <TextInput
          value={idea}
          onChangeText={setIdea}
          multiline
          placeholder="Example: I want a mobile app for my bakery with AI replies…"
          placeholderTextColor="#64748b"
          style={s.input}
        />

        <Card>
          <Muted>1 • PROJECT DEFINITION</Muted>
          <Text style={s.def}>{plan.definition}</Text>
          <View style={s.chips}>
            <Chip label="MVP-first" tone="success" />
            <Chip label="Beginner-safe stack" tone="accent" />
          </View>
        </Card>

        <Card>
          <Muted>4 • ARCHITECTURE (HOW IT FITS TOGETHER)</Muted>
          <Text style={s.arch}>{plan.architecture}</Text>
          <Muted>7 • Tools: {plan.tools.join(' • ')}</Muted>
        </Card>

        {sections.map((sec, i) => (
          <Card key={sec.title}>
            <Text style={s.secT}>
              {[2, 6, 5, 3, 8, 9, 10, 11][i]} • {sec.title}
            </Text>
            <Muted>{sec.hint}</Muted>
            {sec.items.map((it) => (
              <Text key={it} style={s.item}>
                • {it}
              </Text>
            ))}
          </Card>
        ))}

        <Pressable onPress={save} style={s.save}>
          <Text style={s.saveT}>Save Project ({plans.length} saved)</Text>
        </Pressable>
        <Muted>Numbers above = the 11 generated parts: definition, features, stack, architecture, phases, todos, tools, database, APIs, AI plan, deployment.</Muted>

        <H2>Saved projects — track + update</H2>
        {plans.length === 0 && <Muted>No saved plans yet. Generate above, then Save Project.</Muted>}
        {plans.map((p) => {
          const pct = planProgress(p);
          const isOpen = openId === p.id;
          const isEditing = editingId === p.id;
          return (
            <Card key={p.id} style={isOpen ? s.open : undefined}>
              <Pressable onPress={() => setOpenId(isOpen ? null : p.id)}>
                <Text style={s.pTitle}>{p.idea.slice(0, 90)}</Text>
                <Muted>
                  {p.todosDone.filter(Boolean).length}/{p.plan.todos.length} todos • {pct}% {pct === 100 ? '✓ shippable' : ''}
                </Muted>
                <ProgressBar pct={pct} />
              </Pressable>
              {isOpen && (
                <View>
                  <Text style={s.secT}>Track progress — tap todos</Text>
                  {p.plan.todos.map((t, i) => (
                    <Pressable
                      key={t}
                      onPress={() => setPlans((ps) => ps.map((x) => (x.id === p.id ? togglePlanTodo(x, i) : x)))}
                      style={[s.todo, p.todosDone[i] && s.todoDone]}
                    >
                      <Text style={s.todoDot}>{p.todosDone[i] ? '✓' : '○'}</Text>
                      <Text style={s.todoT}>{t}</Text>
                    </Pressable>
                  ))}
                  {isEditing ? (
                    <View>
                      <TextInput value={editIdea} onChangeText={setEditIdea} multiline style={s.input} placeholderTextColor="#64748b" />
                      <View style={s.row}>
                        <Pressable
                          onPress={() => {
                            const np = generatePlan(editIdea.trim() || p.idea);
                            setPlans((ps) => ps.map((x) => (x.id === p.id ? updatePlanIdea(x, editIdea.trim() || p.idea, np) : x)));
                            setEditingId(null);
                          }}
                          style={s.small}
                        >
                          <Text style={s.smallT}>Regenerate plan</Text>
                        </Pressable>
                        <Pressable onPress={() => setEditingId(null)} style={s.ghost}>
                          <Text style={s.ghostT}>Cancel</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View style={s.row}>
                      <Pressable
                        onPress={() => {
                          setEditIdea(p.idea);
                          setEditingId(p.id);
                        }}
                        style={s.small}
                      >
                        <Text style={s.smallT}>Update plan</Text>
                      </Pressable>
                      <Pressable onPress={() => setPlans((ps) => removePlan(ps, p.id))} style={s.ghost}>
                        <Text style={s.ghostT}>Delete</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </Card>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  label: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginTop: 12 },
  input: { backgroundColor: Theme.colors.card, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 14, marginVertical: 8, minHeight: 96, borderWidth: 1, borderColor: Theme.colors.border, fontSize: 15, lineHeight: 22 },
  def: { color: Theme.colors.text, fontSize: 16, lineHeight: 24, fontWeight: '600', marginTop: 6 },
  arch: { color: Theme.colors.text, fontSize: 14, lineHeight: 21, marginTop: 6 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  secT: { color: Theme.colors.text, fontWeight: '800', fontSize: 16 },
  item: { color: Theme.colors.text, fontSize: 14, lineHeight: 21, marginVertical: 2 },
  save: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 16, borderRadius: Theme.radius.sm, alignItems: 'center', marginTop: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  saveT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold },
  open: { borderColor: Theme.colors.primary },
  pTitle: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 15 },
  todo: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md, padding: 12, marginVertical: 4, minHeight: Theme.touch.min },
  todoDone: { borderColor: Theme.colors.success },
  todoDot: { color: Theme.colors.success, fontFamily: Theme.fonts.bold },
  todoT: { color: '#fff', fontFamily: Theme.fonts.regular, flex: 1 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  small: { backgroundColor: Theme.colors.primary, borderRadius: Theme.radius.sm, paddingHorizontal: 16, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  smallT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold },
  ghost: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.sm, paddingHorizontal: 16, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  ghostT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
});
