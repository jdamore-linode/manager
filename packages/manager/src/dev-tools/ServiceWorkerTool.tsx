import * as React from 'react';
import { isMSWEnabled, setMSWEnabled } from './devToolsUtils';

export const ServiceWorkerTool = () => {
  return (
    <>
      <span style={{ marginRight: 8 }}>
        <span style={{ marginRight: 8 }}>Mock Service Worker:</span>
        {isMSWEnabled ? 'Enabled' : 'Disabled'}
      </span>
      <input
        checked={isMSWEnabled}
        onChange={(e) => setMSWEnabled(e.target.checked)}
        style={{ margin: 0 }}
        type="checkbox"
      />
    </>
  );
};
