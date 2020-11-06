import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


function SkeletonCircle({ height, width }) {
  const classes = useStyles({height, width});
  return <div className={c(classes.base, classes.circle)} />;
}


SkeletonCircle.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};


function SkeletonParagraph({ height, width }) {
  return (
    <div style={{width: '100%'}}>
      <SkeletonText width="80%" />
      <SkeletonRectangle height={height} width={width} />
      <SkeletonText width="60%" />
    </div>
  );
}


SkeletonParagraph.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};


function SkeletonRectangle({ height, width }) {
  const classes = useStyles({height, width});
  return <div className={c(classes.base, classes.rectangle)} />;
}


SkeletonRectangle.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};


function SkeletonText({ height, width }) {
  const classes = useStyles({height, width});
  return <div className={c(classes.base, classes.text)} />;
}


SkeletonText.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};


/**
 * Render a placeholder while waiting for content.
 */
export default function Skeleton({ children, height, hide, variant, width }) {
  const component = {
    circle: SkeletonCircle,
    paragraph: SkeletonParagraph,
    rectangle: SkeletonRectangle,
  }[variant] || SkeletonText;
  return hide ? React.createElement(component, {height, width}) : children;
}


Skeleton.defaultProps = {
  children: null,
  hide: true,
  variant: 'text',
};


Skeleton.propTypes = {
  children: PropTypes.node,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hide: PropTypes.any,
  variant: PropTypes.oneOf(['circle', 'paragraph', 'rectangle', 'text']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
