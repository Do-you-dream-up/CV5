import '../../../public/assets/Icomoon/style.css';

import { IconWrapper } from './style';
import { useMemo } from 'react';

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
      className: `dydu-icon ${className} ${icon}`,
      title: title || alt,
      onClick: onClick,
      size,
    }),
    [color, className, title, alt, onClick],
  );

  return <IconWrapper {...iconWrapperProps}></IconWrapper>;
};

export default Icon;
