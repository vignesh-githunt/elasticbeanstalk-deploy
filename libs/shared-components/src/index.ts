import './lib/Vendor';
// import EasyPieChart from 'easy-pie-chart';
import Avatar from './lib/images/user/02.jpg';
import Logo from './lib/images/trucadence-logo.svg';
import LogoSmall from './lib/images/trucadence-logo-white-small.svg';
import { useTable, useSortBy, usePagination, useExpanded } from 'react-table';

export * from './lib/shared-components';
export { useTable, useSortBy, usePagination, useExpanded };

export { Button } from './lib/Common/Button';
export { ErrorBoundary } from './lib/Common/ErrorBoundary';
export { PageLoader } from './lib/Common/PageLoader';
export { ToggleFullscreen } from './lib/Common/ToggleFullscreen';
export { Avatar };
export { Logo };
export { LogoSmall };

export { Base } from './lib/Layout/Base';
export { BasePage } from './lib/Layout/BasePage';
export { BaseHorizontal } from './lib/Layout/BaseHorizontal';
export { ContentWrapper } from './lib/Layout/ContentWrapper';
export { Footer } from './lib/Layout/Footer';
export { CardTool } from './lib/Common/CardTool';
export * from './lib/Vendor';
export { ManageMenu } from './lib/Common/ManageMenu';
export * from './lib/Common/constants';
// export { Header } from './lib/Layout/Header'

// Charts
export { Sparkline } from './lib/Common/Sparklines';
export { Scrollable } from './lib/Common/Scrollable';
// export { FlotChart } from './lib/Charts/Flot';
// export { EasyPieChart };
// export { VectorMap } from "./Maps/VectorMap";

// Tracker
export { trackingManager } from './lib/SegmentTracker/lib/tracking';
export { useTracking } from './lib/SegmentTracker/react/hooks';
export { TrackingProvider } from './lib/SegmentTracker/react/provider-consumer';
export { withTracking } from './lib/SegmentTracker/react/with-tracking';

// Forms
export { FormValidator } from './lib/Forms/FormValidator';
