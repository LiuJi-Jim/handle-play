import type {
  ParsedHanzi,
  ParsedIdiom,
  Rule,
  RuleSet,
  WordWithFreq,
} from '@/types';
import DICT_RAW from '@/assets/data/dict.txt?raw';
import FREQ_RAW from '@/assets/data/freq.txt?raw';
import { isEmptyRule } from '@/utils';

const DICT: ParsedIdiom[] = [];
const FREQ: Record<string, number> = {};

const parseDict = (raw: string) => {
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [word, ...parsed] = line.split('|');
    DICT.push({
      word,
      parsed: parsed.map((str) => {
        const slices = str.split(',');
        const [zi, initial, final] = slices;
        const tone = parseInt(slices[3], 10);
        return {
          zi,
          initial,
          final,
          tone: tone === 0 ? undefined : tone,
        };
      }),
    });
  }
};

const parseFreq = (raw: string) => {
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [word, num] = line.split(' ');
    FREQ[word] = parseInt(num, 10);
  }
};

const main = async () => {
  parseDict(DICT_RAW);
  parseFreq(FREQ_RAW);
  postMessage({ action: 'READY' });
};

const matchOne = (candidate: Partial<ParsedHanzi>, rule: Rule) => {
  if (rule.zi && rule.zi !== candidate.zi) return false;
  if (rule.initial && rule.initial !== candidate.initial) return false;
  if (rule.final && rule.final !== candidate.final) return false;
  if (rule.tone && rule.tone !== candidate.tone) return false;

  return true;
};

const matchWord = (idiom: ParsedIdiom, rules: Rule[]): boolean => {
  const chars = idiom.parsed;
  if (chars.length !== rules.length) return false;
  return chars.every((candidate, i) => matchOne(candidate, rules[i]));
};

const maybeWord = (idiom: ParsedIdiom, rules: Rule[]) => {
  if (rules.length === 0) return true;
  return rules.every((rule) =>
    idiom.parsed.some((hanzi) => matchOne(hanzi, rule))
  );
};

// returns true if should exclude `idiom`
const excludeWord = (idiom: ParsedIdiom, rules: Rule[]) => {
  if (rules.length === 0) return false;
  return idiom.parsed.some((hanzi) =>
    rules.some((rule) => matchOne(hanzi, rule))
  );
};

// returns true if should exclude `idiom`
const negativeWord = (idiom: ParsedIdiom, rules: Rule[][]): boolean => {
  const chars = idiom.parsed;
  if (chars.length !== rules.length) return false;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (rules[i].some((rule) => matchOne(char, rule))) {
      return true;
    }
  }
  return false;
};

const search = (ruleSet: RuleSet) => {
  const { exact, fuzzy, exclude, negative } = ruleSet;
  const result = DICT.filter((candidate) => {
    if (excludeWord(candidate, exclude)) {
      return false;
    }
    if (negativeWord(candidate, negative)) {
      return false;
    }
    if (!matchWord(candidate, exact)) {
      return false;
    }
    if (!maybeWord(candidate, fuzzy)) {
      return false;
    }
    return true;
  }).map((idiom): WordWithFreq => {
    const { word } = idiom;
    const freq = FREQ[word] || 0;
    return { word, freq };
  });
  postMessage({
    action: 'RESULT',
    result,
  });
};

self.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'SEARCH') {
    const ruleSet = e.data.ruleSet as RuleSet;
    search(ruleSet);
  }
});

main();
