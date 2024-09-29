import { safeExecute } from '$utils/helpers';

function animateNavbarDesktop() {
  const navMenu = document.querySelector('.nav_menus') as HTMLElement | null;
  const navMenuButtons = document.querySelectorAll('.nav_menu-button') as NodeListOf<HTMLElement>;
  const navItems = document.querySelectorAll('.nav_items') as NodeListOf<HTMLElement>;
  const navBackground = document.querySelector('.nav_background') as HTMLElement | null;

  if (!navMenu || !navMenuButtons.length || !navItems.length || !navBackground) return;

  let activeNavItem: HTMLElement | null = null;
  let hideTimeout: number | null = null;

  function showNavItem(navItem: HTMLElement) {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    if (activeNavItem && activeNavItem !== navItem) {
      hideNavItem(activeNavItem);
    }

    const { width, height } = navItem.getBoundingClientRect();
    const navMenuRect = navMenu?.getBoundingClientRect();
    const itemRect = navItem.getBoundingClientRect();
    const leftOffset = itemRect.left - (navMenuRect?.left ?? 0);

    if (!navBackground) return;

    navBackground.style.width = `${width}px`;
    navBackground.style.height = `${height}px`;
    navBackground.style.transform = `translateX(${leftOffset}px)`;
    navBackground.style.opacity = '1';
    navItem.style.visibility = 'visible';
    activeNavItem = navItem;
  }

  function hideNavItem(navItem: HTMLElement | null) {
    if (!navItem) return;
    if (activeNavItem !== navItem) return;
    if (!navBackground) return;

    navBackground.style.width = '0px';
    navBackground.style.height = '0px';
    navBackground.style.opacity = '0';
    navItem.style.visibility = 'hidden';
    activeNavItem = null;
  }

  function addHoverListeners(element: HTMLElement, targetItem: HTMLElement) {
    element.addEventListener('mouseenter', () => showNavItem(targetItem));
  }

  function handleMouseLeave(e: MouseEvent) {
    const { relatedTarget } = e;
    if (
      !relatedTarget ||
      (relatedTarget instanceof Element &&
        !relatedTarget.classList.contains('nav_menu-button') &&
        !relatedTarget.classList.contains('nav_items'))
    ) {
      hideTimeout = setTimeout(() => {
        hideNavItem(activeNavItem);
      }, 100);
    }
  }

  navMenuButtons.forEach((button, index) => {
    addHoverListeners(button, navItems[index]);
  });

  navItems.forEach((item) => {
    addHoverListeners(item, item);
    item.addEventListener('mouseleave', handleMouseLeave);
  });

  navMenu.addEventListener('mouseleave', handleMouseLeave);
}

function animateNavbarMobile() {
  const navMenuButtons = document.querySelectorAll('.nav_menu-button') as NodeListOf<HTMLElement>;
  const navItems = document.querySelectorAll('.nav_items') as NodeListOf<HTMLElement>;

  if (!navMenuButtons.length || !navItems.length) return;

  navMenuButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const targetItem = navItems[index];
      if (!targetItem) return;

      navItems.forEach((item) => {
        item.style.height = '0px';
        item.style.opacity = '0';
      });

      targetItem.style.height = '100%';
      targetItem.style.opacity = '1';
    });
  });
}

function animateNavbar() {
  const isDesktop = window.innerWidth > 991;
  if (isDesktop) {
    animateNavbarDesktop();
  } else {
    animateNavbarMobile();
  }
}

window.Webflow ||= [];
window.Webflow.push(() => {
  safeExecute(animateNavbar);
});
