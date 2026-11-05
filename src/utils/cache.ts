export interface CacheLine { valid: boolean; tag: string; data: string; dirty: boolean; age: number }
export interface CacheState {
  cache: CacheLine[][]; hits: number; misses: number; sequence: number;
  lastAccess: { addr: number; tag: number; setIdx: number; offset: number; hit: boolean; replacedWay?: number } | null;
}
export function emptyCache(): CacheState {
  return { cache: Array.from({ length: 4 }, () => Array.from({ length: 2 }, () => ({ valid: false, tag: '-', data: 'Empty', dirty: false, age: 0 }))), hits: 0, misses: 0, sequence: 0, lastAccess: null };
}
export function parseCacheAddress(input: string): number | null {
  if (!/^(?:0x)?[0-9a-f]{1,4}$/i.test(input.trim())) return null;
  return Number.parseInt(input.trim().replace(/^0x/i, ''), 16);
}
/** Pure read-access transition; sequence numbers make LRU deterministic. */
export function accessCache(state: CacheState, addr: number): CacheState {
  if (!Number.isInteger(addr) || addr < 0 || addr > 65535) return state;
  const offset = addr & 15, setIdx = (addr >> 4) & 3, tag = addr >> 6;
  const tagHex = '0x' + tag.toString(16).toUpperCase().padStart(3, '0');
  const cache = state.cache.map(set => set.map(line => ({ ...line })));
  const set = cache[setIdx];
  const hitIndex = set.findIndex(line => line.valid && line.tag === tagHex);
  const hit = hitIndex !== -1;
  let way = hitIndex;
  if (!hit) {
    way = set.findIndex(line => !line.valid);
    if (way === -1) way = set[0].age <= set[1].age ? 0 : 1;
    set[way] = { valid: true, tag: tagHex, data: `Mem[0x${(addr & ~15).toString(16).toUpperCase()}]`, dirty: false, age: 0 };
  }
  set[way].age = state.sequence + 1;
  return { cache, sequence: state.sequence + 1, hits: state.hits + Number(hit), misses: state.misses + Number(!hit), lastAccess: { addr, tag, setIdx, offset, hit, ...(!hit ? { replacedWay: way } : {}) } };
}
