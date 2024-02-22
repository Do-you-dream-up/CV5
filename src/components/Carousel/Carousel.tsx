import slickStyle from 'slick-carousel/slick/slick.css';
import slickTheme from 'slick-carousel/slick/slick-theme.css';

import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Local } from '../../tools/storage';
import Slider from 'react-slick';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import useStyles from './styles';
import useViewport from '../../tools/hooks/useViewport';
import { useShadow } from '../../contexts/ShadowProvider';

/**
 * Typically used with the `Interaction` component.
 *
 * Format children in a carousel UI with previous and next controls.
 */

interface CarouselProps {
  children: any[];
  steps: Servlet.ChatResponseValues[];
}

const Carousel = ({ children, steps }: CarouselProps) => {
  const classes = useStyles();
  const { configuration } = useConfiguration();
  const { isMobile } = useViewport();
  const [index, setIndex] = useState<number>(0);
  const [step, setStep] = useState<any>(steps ? steps[0] : 0);
  const carouselRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [numberSlidesToShow, setNumberSlidesTosShow] = useState<number>(0);
  const [resizeCount, setResizeCount] = useState(0);
  const interactionWidth = useMemo(() => carouselRef?.current?.offsetWidth, [resizeCount]);
  const { shadowAnchor } = useShadow();

  const isFullScreen = isMobile || Local.get(Local.names.open) === 3;
  const automaticSidebar = isFullScreen
    ? !!configuration?.sidebar.automatic?.fullScreen
    : !!configuration?.sidebar.automatic?.desktop;
  const { sidebarActive, toggleSidebar } = useDialog();

  useEffect(() => {
    if (!shadowAnchor?.querySelector('#dydu-style-carousel')) {
      const style = document.createElement('style');
      style.innerHTML = slickStyle;
      style.innerHTML += slickTheme;
      style.id = 'dydu-style-carousel';
      shadowAnchor?.appendChild(style);
    }
  }, [slickStyle, slickTheme]);

  const onToggle = useCallback(
    (open) => {
      if (sidebarActive) {
        toggleSidebar &&
          toggleSidebar(open, {
            body: step.sidebar.content,
            ...step.sidebar,
          })();
      }
    },
    [sidebarActive, step, toggleSidebar],
  );

  // Method to change aria-hidden attribute on focus slide to false and other slides to true
  // Only use for carousel with steps for allow screen reader to read the content of slides
  const changeAriaHiddenAttributForSlides = useCallback(() => {
    const slideSelected = shadowAnchor?.querySelectorAll('[data-index="' + index + '"]');
    const otherSlides = shadowAnchor?.querySelectorAll('[data-index]:not([data-index="' + index + '"])');
    if (slideSelected) {
      slideSelected.forEach((element) => {
        element.setAttribute('aria-hidden', 'false');
      });
      otherSlides?.forEach((element) => {
        element.setAttribute('aria-hidden', 'true');
      });
    }
  }, [index, step]);

  useEffect(() => {
    if (steps && step?.sidebar) {
      setStep(steps[index]);
      onToggle(Local.get(Local.names.sidebar) || automaticSidebar);
      changeAriaHiddenAttributForSlides();
    }
  }, [index, steps, step, automaticSidebar, onToggle]);

  const renderSteps = () =>
    children?.map((item, i) => (
      <div
        children={item}
        key={i}
        onFocus={() => {
          setIndex(i), setStep(steps[index]), changeAriaHiddenAttributForSlides();
        }}
      />
    ));

  useEffect(() => {
    const observer = new ResizeObserver(() => setResizeCount((prevCount) => prevCount + 1));
    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => {
      if (carouselRef.current) observer.unobserve(carouselRef.current);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = shadowAnchor?.querySelector('#' + 'webpack-dev-server-client-overlay-div');
        const resizeObserverErr = shadowAnchor?.querySelector('#' + 'webpack-dev-server-client-overlay');
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

  useEffect(() => {
    if (interactionWidth < 660) {
      setNumberSlidesTosShow(1);
    } else if (interactionWidth > 660 && interactionWidth < 900) {
      setNumberSlidesTosShow(2);
    } else if (interactionWidth > 900 && interactionWidth < 1200) {
      setNumberSlidesTosShow(3);
    } else if (interactionWidth > 1200 && interactionWidth < 1500) {
      setNumberSlidesTosShow(4);
    } else {
      setNumberSlidesTosShow(5);
    }
  }, [interactionWidth]);

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: false,
    slidesToShow: numberSlidesToShow,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    arrows: true,
    focusOnSelect: true,
    accessibility: true,
  };

  return (
    <div ref={carouselRef} tabIndex={-1} className={c('dydu-carousel', classes.carousel)}>
      <Slider {...settings} afterChange={setIndex}>
        {renderSteps()}
      </Slider>
    </div>
  );
};

export default Carousel;
