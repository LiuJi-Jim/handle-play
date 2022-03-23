import { Rule } from '@/types';
import { isEmpty } from 'lodash-es';

export const EMPTY_RULE: Rule = {
  zi: undefined,
  initial: undefined,
  final: undefined,
  tone: undefined,
};

export const isEmptyRule = (rule: Rule): boolean => {
  const keys = Object.keys(rule) as Array<keyof Rule>;
  return keys.every((key) => isEmpty(rule[key]));
};
