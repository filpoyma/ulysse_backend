import React from 'react';
import IconLeftNav from '../../assets/icons/leftNav.svg';
import IconRightNav from '../../assets/icons/leftNav.svg';

export const LeftNav = React.memo(
  ({ disabled, onClick }: { onClick: () => void; disabled: boolean }) => {
    return (
      <button
        type="button"
        className="image-gallery-icon image-gallery-left-nav"
        disabled={disabled}
        onClick={onClick}
        aria-label="Previous Slide">
        <IconLeftNav />
      </button>
    );
  },
);
export const RightNav = React.memo(
  ({ disabled, onClick }: { onClick: () => void; disabled: boolean }) => {
    return (
      <button
        type="button"
        className="image-gallery-icon image-gallery-right-nav"
        disabled={disabled}
        onClick={onClick}
        aria-label="Previous Slide">
        <IconRightNav />
      </button>
    );
  },
);
