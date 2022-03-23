import { reactive, ref } from 'vue';
import { RuleSet, WordWithFreq } from '@/types';
import SearchWorker from '@/logic/search?worker';
import { cloneDeep } from 'lodash-es';

export default function useSearch(ruleSet: RuleSet) {
  const state = reactive({
    ready: false,
    busy: false,
  });

  const result = ref<WordWithFreq[] | null>(null);

  const searchWorker = new SearchWorker();

  searchWorker.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'READY') {
      state.ready = true;
    }
    if (e.data && e.data.action === 'RESULT') {
      result.value = e.data.result as WordWithFreq[];
      state.busy = false;
    }
  });

  const search = () => {
    searchWorker.postMessage({
      action: 'SEARCH',
      ruleSet: cloneDeep(ruleSet),
    });
    state.busy = true;
  };

  return { state, search, result };
}
