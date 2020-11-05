import React from 'react'
import { TrackingProvider } from './provider-consumer'

export const withTracking = () => Component => props => {
  const {...rest } = props
  return (
    <TrackingProvider>
      <Component {...rest} />
    </TrackingProvider>
  )
}
