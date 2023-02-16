import '../../../public/assets/Icomoon/style.css';

import IcomoonReact from 'icomoon-react';
import { IconWrapper } from './style';
import React, { useMemo } from 'react';
import iconSet from './selection.json';

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
}

const Icon = ({
  className = '',
  color,
  size = 16,
  icon = '',
  onClick,
  alt = '',
  title = undefined,
}: IconPropsInterface) => {
  const iconWrapperProps = useMemo<IconWrapperPropsInterface>(
    () => ({
      color: color,
      className: `${className} ${icon}`,
      title: title || alt,
      alt: alt,
      onClick: onClick,
    }),
    [color, className, title, alt, onClick],
  );

  return (
    <IconWrapper {...iconWrapperProps}>
      <IcomoonReact iconSet={iconSet} color={color} size={size} icon={icon} />
    </IconWrapper>
  );
};

export default Icon;
