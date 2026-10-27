import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });
};

const CardSwap = ({
  width = 420,
  height = 280,
  cardDistance = 35,
  verticalDistance = 45,
  delay = 4000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 4,
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const nextOrderRef = useRef(null);
  const tlRef = useRef(null);
  const intervalRef = useRef(null);
  const container = useRef(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 420;

  const effWidth = isSmallMobile
    ? Math.min(windowWidth - 48, 305)
    : isMobile
      ? Math.min(windowWidth - 64, 340)
      : width;

  const effHeight = isMobile ? Math.round(effWidth * 0.68) : height;
  const effCardDist = isMobile ? 14 : cardDistance;
  const effVertDist = isMobile ? 20 : verticalDistance;
  const effSkew = isMobile ? 2 : skewAmount;

  const swap = useCallback(() => {
    const total = refs.length;
    if (total < 2) return;

    if (tlRef.current && tlRef.current.isActive()) {
      tlRef.current.progress(1);
      if (nextOrderRef.current) {
        order.current = nextOrderRef.current;
        nextOrderRef.current = null;
      }
    }

    const [front, ...rest] = order.current;
    const elFront = refs[front]?.current;
    if (!elFront) return;

    const nextOrder = [...rest, front];
    nextOrderRef.current = nextOrder;

    const durDrop = isMobile ? 0.32 : 0.4;
    const durMove = isMobile ? 0.38 : 0.48;
    const durReturn = isMobile ? 0.35 : 0.44;
    const ease = 'power2.out';

    const tl = gsap.timeline({
      onComplete: () => {
        order.current = nextOrder;
        nextOrderRef.current = null;
      }
    });
    tlRef.current = tl;

    const dropDistance = effHeight * 0.75 + 30;
    tl.to(
      elFront,
      {
        y: dropDistance,
        opacity: 0.6,
        duration: durDrop,
        ease: 'power2.in'
      },
      0
    );

    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, effCardDist, effVertDist, total);

      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: durMove,
          ease
        },
        0.1 + i * 0.04
      );
      tl.set(el, { zIndex: slot.zIndex }, 0.1);
    });

    const backSlot = makeSlot(total - 1, effCardDist, effVertDist, total);
    tl.set(elFront, { zIndex: backSlot.zIndex }, durDrop * 0.85);
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        opacity: 1,
        duration: durReturn,
        ease
      },
      durDrop * 0.85
    );
  }, [refs, isMobile, effHeight, effCardDist, effVertDist]);

  useEffect(() => {
    const total = refs.length;
    order.current.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (el) {
        placeNow(el, makeSlot(i, effCardDist, effVertDist, total), effSkew);
      }
    });
  }, [refs, effCardDist, effVertDist, effSkew, effWidth, effHeight]);

  useEffect(() => {
    if (delay > 0) {
      intervalRef.current = window.setInterval(swap, delay);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [swap, delay]);

  useEffect(() => {
    if (!pauseOnHover) return;
    const node = container.current;
    if (!node) return;

    const pause = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    const resume = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (delay > 0) intervalRef.current = window.setInterval(swap, delay);
    };

    node.addEventListener('mouseenter', pause);
    node.addEventListener('mouseleave', resume);
    return () => {
      node.removeEventListener('mouseenter', pause);
      node.removeEventListener('mouseleave', resume);
    };
  }, [pauseOnHover, swap, delay]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const handleClick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if (delay > 0) intervalRef.current = window.setInterval(swap, delay);
    }
    swap();
  };

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: {
            width: effWidth,
            height: effHeight,
            ...(child.props.style ?? {})
          },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{
        width: effWidth,
        height: effHeight,
        cursor: 'pointer'
      }}
      onClick={handleClick}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
