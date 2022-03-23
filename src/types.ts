export type ParsedHanzi = {
  initial: string;
  final: string;
  tone: number;
  zi: string;
};

export type ParsedIdiom = {
  word: string;
  parsed: Partial<ParsedHanzi>[];
};

export type Rule = Partial<ParsedHanzi>;

export type RuleSet = {
  exact: Rule[][]; // 绿色
  fuzzy: Rule[][]; // 橙色
  exclude: Rule[]; // 全局排除
};

export type WordWithFreq = {
  word: string;
  freq: number;
};

export type PartState = 'none' | 'exact' | 'fuzzy' | 'exclude';
