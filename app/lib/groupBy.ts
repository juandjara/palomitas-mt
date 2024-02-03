type groupByPredicate<T = unknown> = (val: T, index?: number, arr?: T[]) => string

export default function groupBy<T = unknown>(array: T[], predicate: groupByPredicate<T>) {
  const cb = typeof predicate === 'function' ? predicate : (o: T) => o[predicate]
  return array.reduce(function(groups, item) {
    const val = cb(item)
    groups[val] = groups[val] || []
    groups[val].push(item)
    return groups
  }, {} as Record<string, T[]>)
}
