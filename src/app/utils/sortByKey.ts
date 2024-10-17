export function sortByKey<T>({ data, key, isAscending}: SortByKeyProps<T>) {
  return data.sort((_a, _b) => {
    const [a, b] = isAscending ? [_a, _b]: [_b, _a];

    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return a[key].localeCompare(b[key])
    }

    return (a[key] as number) - (b[key] as number)
  });
}

interface SortByKeyProps<T> {
  data: T[], 
  key: keyof T, 
  isAscending: boolean
}