import { safeExecute } from '$utils/helpers';

function slideTrustFeatures() {
  const sectionElement = document.querySelector('.section_trust') as HTMLElement | null;
  const containerElement = document.querySelector(
    '.container-large.is-trust'
  ) as HTMLElement | null;
  const headerElement = document.querySelector('.payment_header.is-trust') as HTMLElement | null;
  const imagesElement = document.querySelector('.trust_images') as HTMLElement | null;
  const sliderElement = document.querySelector('.trust_images-slider') as HTMLElement | null;
  const imageWrapperElements = document.querySelectorAll(
    '.trust_image-wrapper'
  ) as NodeListOf<HTMLElement>;
  const desktopContentElements = document.querySelectorAll(
    '.trust_contents .trust_content'
  ) as NodeListOf<HTMLElement>;
  const mobileContentElements = document.querySelectorAll(
    '.trust_image-wrapper .trust_content'
  ) as NodeListOf<HTMLElement>;
  const bulletElements = document.querySelectorAll('.trust_bullet') as NodeListOf<HTMLElement>;

  if (
    !sectionElement ||
    !containerElement ||
    !headerElement ||
    !imagesElement ||
    !sliderElement ||
    !imageWrapperElements ||
    !desktopContentElements ||
    !mobileContentElements ||
    !bulletElements
  ) {
    return;
  }

  let lastScrollY = 0;
  let sliderWidth = 0;
  let totalImages = 0;
  let scrollSpeed = 0;
  const scrollFactor = 1;

  const images = {
    1: {
      backgroundColor: 'var(--base-color-brand--pale-blue-lily)',
    },
    2: {
      backgroundColor: 'var(--base-color-brand--light-mint)',
    },
    3: {
      backgroundColor: 'var(--base-color-brand--yellow-light)',
    },
    4: {
      backgroundColor: 'var(--base-color-brand--light-violet)',
    },
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll);
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      });
    },
    {
      threshold: 0.95,
    }
  );

  observer.observe(headerElement);

  function onScroll() {
    if (!sectionElement) {
      return;
    }

    if (!parseInt(getComputedStyle(sectionElement).minHeight)) {
      setMinHeight();
      initSliderRightPosition();
    }

    if (!isStickyAttached(containerElement)) {
      return;
    }

    if (lastScrollY === 0) {
      lastScrollY = window.scrollY - 1;
      observeImage();
    }

    const currentScrollY = window.scrollY;
    const scrollDiff = currentScrollY - lastScrollY;

    scrollSpeed = scrollDiff * scrollFactor;

    if (scrollDiff > 0) {
      scrollingDown(scrollSpeed);
    } else if (scrollDiff < 0) {
      scrollingUp(scrollSpeed);
    }

    lastScrollY = currentScrollY;
  }

  function isStickyAttached(element: Element | null) {
    if (!element) {
      return false;
    }

    return parseInt(getComputedStyle(element).top) === element.getBoundingClientRect().top;
  }

  function setMinHeight() {
    if (!sectionElement || !containerElement || !sliderElement) {
      return;
    }

    const sectionHeight = parseInt(getComputedStyle(sectionElement).height);
    const containerTop = parseInt(getComputedStyle(containerElement).top);
    sliderWidth = parseInt(getComputedStyle(sliderElement).width);
    totalImages = sliderElement.children.length;
    sectionElement.style.minHeight = `${sectionHeight + containerTop + sliderWidth * (totalImages - 1)}px`;
  }

  function observeImage() {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentIndex = parseInt(entry.target.getAttribute('data-index') || '0');

            const contentElements = isDesktop()
              ? desktopContentElements
              : Array.from(mobileContentElements).reverse();

            toggleBackgroundColor(currentIndex);
            toggleContentActiveClass(currentIndex, contentElements);
            toggleBulletActiveClass(currentIndex);
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    imageWrapperElements.forEach((imageWrapperElement) => {
      imageObserver.observe(imageWrapperElement);
    });
  }

  function isDesktop() {
    const minDesktopWidth = 992;
    return window.screen.width >= minDesktopWidth;
  }

  function toggleBackgroundColor(index: number) {
    if (!imagesElement) {
      return;
    }

    imagesElement.style.backgroundColor = images[index as keyof typeof images].backgroundColor;
  }

  function toggleContentActiveClass(
    index: number,
    contentElements: HTMLElement[] | NodeListOf<HTMLElement>
  ) {
    const zeroIndexed = index - 1;
    contentElements.forEach((contentElement, i) => {
      if (zeroIndexed === i) {
        contentElement.classList.add('is-active');
      } else {
        contentElement.classList.remove('is-active');
      }
    });
  }

  function toggleBulletActiveClass(index: number) {
    const zeroIndexed = index - 1;
    bulletElements.forEach((bulletElement, i) => {
      if (zeroIndexed === i) {
        bulletElement.classList.add('is-active');
      } else {
        bulletElement.classList.remove('is-active');
      }
    });
  }

  function imageWrapperWidth() {
    if (!imageWrapperElements.length) {
      return;
    }
    return imageWrapperElements[0].getBoundingClientRect().width.toString();
  }

  function initSliderRightPosition() {
    if (!sliderElement) {
      return;
    }

    sliderElement.style.right = `${imageWrapperWidth()}px`;
  }

  function rightPosition() {
    if (!sliderElement) {
      return 0;
    }

    return parseInt(getComputedStyle(sliderElement).right);
  }

  function scrollingDown(scrollSpeed: number) {
    if (!sliderElement) {
      return;
    }

    const newRight = rightPosition() - Math.abs(scrollSpeed);
    sliderElement.style.right = `${newRight}px`;
    return newRight;
  }

  function scrollingUp(scrollSpeed: number) {
    if (!sliderElement) {
      return;
    }

    const newRight = rightPosition() + Math.abs(scrollSpeed);
    sliderElement.style.right = `${newRight}px`;
    return newRight;
  }
}

window.Webflow ||= [];
window.Webflow.push(() => {
  safeExecute(slideTrustFeatures);
});
