import React,{useMemo} from 'react'
import PropTypes from 'prop-types'

import { trackingManager } from '../lib/tracking'
import { TrackingContext } from './context'

export const TrackingProvider = ({children,onTrackingEvent}) => {


const tracker = useMemo(
  () => trackingManager({}),
  []
)

 return (
    <TrackingContext.Provider value={tracker}>
      {children}
    </TrackingContext.Provider>
  )
}

TrackingProvider.propTypes = {
  children: PropTypes.node,
  onTrackingEvent: PropTypes.func
}
