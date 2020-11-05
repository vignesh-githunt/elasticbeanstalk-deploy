import { createContext } from 'react'

export const TrackingContext = createContext({
  track: () => {},
  identify: () => {},
  page: () => {},
  group: () => {},
  alias: () => {}
})
