import React from 'react';

type ThumbnailContainerProps = {
  children: React.ReactNode;
};

function ThumbnailContainer({ children }: ThumbnailContainerProps) {
  return <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>;
}

export default React.memo(ThumbnailContainer);
