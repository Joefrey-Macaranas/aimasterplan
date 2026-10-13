jest.mock('react-native', () => ({
  Platform: { OS: 'web', select: (o: any) => o.web ?? o.default },
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import { nextMode, lightColors, darkColors } from '../src/store/theme';

describe('theme mode toggle (logo tap)', () => {
  it('flips light <-> dark', () => {
    expect(nextMode('light')).toBe('dark');
    expect(nextMode('dark')).toBe('light');
  });
  it('has distinct bg/text for modes', () => {
    expect(lightColors.bg).toBe('#ffffff');
    expect(darkColors.bg).toBe('#0B1020');
    expect(lightColors.text).not.toBe(darkColors.text);
    expect(lightColors.card).not.toBe(darkColors.card);
  });
  it('keeps same color keys', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });
});
