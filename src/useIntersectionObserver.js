import { useEffect } from 'react';

const useIntersectionObserver = (selector, options = {}) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          const delay = entry.target.dataset.delay;
          if (delay) {
            entry.target.style.transitionDelay = delay;
          }
        }
      });
    }, { threshold: 0.1, ...options });

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector, options]);
};

export default useIntersectionObserver;