import icomoonStyle from '../../../public/assets/Icomoon/style.css';

import { IconWrapper } from './style';
import { useEffect, useMemo } from 'react';
import { useShadow } from '../../contexts/ShadowProvider';

interface IconWrapperPropsInterface {
  color?: string;
  className?: string;
  alt: string;
  title?: string;
  onClick?: () => void;
}

interface IconPropsInterface extends IconWrapperPropsInterface {
  size?: number;
  icon: string;
  ariaLabel?: string;
}

const Icon = ({
  className = '',
  color,
  size = 16,
  icon = '',
  onClick,
  alt = '',
  title = undefined,
  ariaLabel,
}: IconPropsInterface) => {
  const { shadowAnchor } = useShadow();

  useEffect(() => {
    if (!shadowAnchor?.querySelector('#dydu-icons')) {
      // We need to add style in both DOM and Shadow DOM to display icons
      const styleShadow = document.createElement('style');
      styleShadow.textContent = icomoonStyle;
      styleShadow.id = 'dydu-icons';
      shadowAnchor?.appendChild(styleShadow);

      const style = document.createElement('style');
      style.textContent = icomoonStyle;
      document.head.append(style);
    }
  }, [icomoonStyle]);

  const iconWrapperProps = useMemo<IconWrapperPropsInterface>(
    () => ({
      color: color,
      className: `dydu-icon ${className} ${icon}`,
      title: title || alt,
      onClick: onClick,
      size,
    }),
    [color, className, title, alt, onClick],
  );

  return <IconWrapper {...iconWrapperProps} aria-label={ariaLabel}></IconWrapper>;
};

export default Icon;
