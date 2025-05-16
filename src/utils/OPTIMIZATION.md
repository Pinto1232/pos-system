# React Performance Optimization Guide

This guide provides best practices and utilities for optimizing React components
and preventing unnecessary re-renders.

## Common Re-rendering Issues

1. **Creating new functions in render**: Functions created during render have a
   new reference on each render, causing child components to re-render.
2. **Creating new objects/arrays in render**: Similar to functions, new
   objects/arrays cause re-renders in child components.
3. **Missing dependency arrays**: Incomplete dependency arrays in `useEffect`,
   `useMemo`, or `useCallback` can cause stale closures or excessive re-renders.
4. **Prop drilling**: Passing props through many components can cause render
   cascades.
5. **Large component trees**: Components with many children can cause
   performance issues.

## Optimization Techniques

### 1. Memoization

Use React's built-in memoization hooks to prevent unnecessary recalculations:

```jsx
// Memoize values
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// Memoize components
const MemoizedComponent = React.memo(MyComponent)
```

### 2. Proper Dependency Arrays

Always include all dependencies in hooks:

```jsx
// Good
useEffect(() => {
  fetchData(userId)
}, [userId, fetchData])

// Bad - missing dependency
useEffect(() => {
  fetchData(userId)
}, [])
```

### 3. Component Splitting

Split large components into smaller, focused components:

```jsx
// Before
function LargeComponent({ user, posts, comments }) {
  // Lots of logic and rendering
}

// After
function UserProfile({ user }) {
  /* User-specific rendering */
}
function PostList({ posts }) {
  /* Post-specific rendering */
}
function CommentSection({ comments }) {
  /* Comment-specific rendering */
}

function LargeComponent({ user, posts, comments }) {
  return (
    <>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <CommentSection comments={comments} />
    </>
  )
}
```

### 4. Context Optimization

Optimize context providers to prevent unnecessary re-renders:

```jsx
function MyProvider({ children }) {
  const [state, setState] = useState(initialState)

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      state,
      setState,
    }),
    [state]
  )

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  )
}
```

## Utility Functions

### withOptimization HOC

Wrap components with the `withOptimization` HOC for automatic optimization:

```jsx
import { withOptimization } from '@/utils/withOptimization'

function MyComponent(props) {
  // Component logic
}

export default withOptimization(MyComponent, {
  memo: true,
  deepComparison: true,
  trackRenders: process.env.NODE_ENV === 'development',
})
```

### useDeepMemo and useDeepCallback

Use these hooks when dealing with complex objects in dependencies:

```jsx
import { useDeepMemo, useDeepCallback } from '@/hooks/useOptimizedMemo'

// Deep comparison of dependencies
const memoizedValue = useDeepMemo(() => {
  return computeExpensiveValue(complexObject)
}, [complexObject])

// Deep comparison for callback dependencies
const memoizedCallback = useDeepCallback(() => {
  doSomething(complexObject)
}, [complexObject])
```

### useDebouncedState

Debounce state updates to prevent rapid re-renders:

```jsx
import useDebouncedState from '@/hooks/useDebouncedState'

function SearchComponent() {
  // Updates after 300ms of inactivity
  const [debouncedQuery, setDebouncedQuery, query, setQuery] =
    useDebouncedState('', 300)

  // Use query for immediate UI updates
  // Use debouncedQuery for API calls

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

## Performance Monitoring

Use the `useRenderTracker` hook to monitor component renders:

```jsx
import { useRenderTracker } from '@/utils/optimizationUtils'

function MyComponent(props) {
  useRenderTracker('MyComponent', props)
  // Component logic
}
```

## Best Practices Checklist

- [ ] Use `React.memo` for pure functional components
- [ ] Use `useMemo` for expensive calculations
- [ ] Use `useCallback` for event handlers and functions passed to child
      components
- [ ] Include all dependencies in dependency arrays
- [ ] Memoize context values
- [ ] Split large components into smaller ones
- [ ] Use the React DevTools Profiler to identify unnecessary renders
- [ ] Consider using the optimization utilities provided in this codebase
