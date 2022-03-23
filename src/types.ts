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
  exact: Rule[];
  fuzzy: Rule[];
  negative: Rule[];
};

export type WordWithFreq = {
  word: string;
  freq: number;
};
