import type {
  ParsedHanzi,
  ParsedIdiom,
  Rule,
  RuleSet,
  WordWithFreq,
} from '@/types';
import DICT_RAW from '@/assets/data/dict.txt?raw';
import FREQ_RAW from '@/assets/data/freq.txt?raw';

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

const matchOne = (
  candidate: Partial<ParsedHanzi>,
  rule: Rule,
  logic: 'AND' | 'OR' = 'AND'
) => {
  if (logic === 'AND') {
    if (rule.zi && rule.zi !== candidate.zi) return false;
    if (rule.initial && rule.initial !== candidate.initial) return false;
    if (rule.final && rule.final !== candidate.final) return false;
    if (rule.tone && rule.tone !== candidate.tone) return false;

    return true;
  } else {
    if (rule.zi && rule.zi === candidate.zi) return true;
    if (rule.initial && rule.initial === candidate.initial) return true;
    if (rule.final && rule.final === candidate.final) return true;
    if (rule.tone && rule.tone === candidate.tone) return true;

    return false;
  }
};

const exactMatch = (idiom: ParsedIdiom, rules: Rule[][]): boolean => {
  const chars = idiom.parsed;
  if (chars.length !== rules.length) return false;
  // 绿色标记的每一位都要匹配
  return chars.every((char, i) =>
    rules[i].every((rule) => matchOne(char, rule))
  );
};

const fuzzyMatch = (idiom: ParsedIdiom, rules: Rule[][]): boolean => {
  const chars = idiom.parsed;
  if (chars.length !== rules.length) return false;

  // 不能在黄色标记的那一位匹配
  if (chars.some((char, i) => rules[i].some((rule) => matchOne(char, rule)))) {
    return false;
  }
  // 但是所有规则最终都必须匹配
  return rules
    .flat()
    .every((rule) => chars.some((char) => matchOne(char, rule)));
};

// returns true if should exclude `idiom`
const excludeMatch = (idiom: ParsedIdiom, rules: Rule[]) => {
  // 只要任意一个匹配就匹配
  if (rules.length === 0) return false;
  return idiom.parsed.some((hanzi) =>
    rules.some((rule) => matchOne(hanzi, rule))
  );
};

const search = (ruleSet: RuleSet) => {
  const result = DICT.filter((idiom) => {
    if (excludeMatch(idiom, ruleSet.exclude)) {
      return false;
    }
    if (!exactMatch(idiom, ruleSet.exact)) {
      return false;
    }
    if (!fuzzyMatch(idiom, ruleSet.fuzzy)) {
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
    console.log('search', JSON.stringify(ruleSet, null, '  '));
    search(ruleSet);
  }
});

main();
