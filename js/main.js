// ========== 요소 선택 ==========
const header = document.querySelector('#header');
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const topBtn = document.querySelector('#top-btn');
const themeToggle = document.querySelector('#theme-toggle');

// ========== 다크 모드 토글 + localStorage 저장/복원 ==========
const THEME_KEY = 'theme';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
};

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

// ========== 햄버거 메뉴 토글 ==========
const toggleMenu = () => {
  const isActive = navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(isActive));
};

hamburger.addEventListener('click', toggleMenu);

// ========== 부드러운 스크롤 (네비 링크) ==========
const closeMenu = () => {
  navMenu.classList.remove('active');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
};

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
  });
});

// ========== 스크롤에 따른 헤더 스타일 & Top 버튼 표시 ==========
const HEADER_SCROLL_THRESHOLD = 60;
const TOP_BTN_SCROLL_THRESHOLD = 300;

const handleScroll = () => {
  const { scrollY } = window;
  header.classList.toggle('scrolled', scrollY > HEADER_SCROLL_THRESHOLD);
  topBtn.classList.toggle('show', scrollY > TOP_BTN_SCROLL_THRESHOLD);
};

window.addEventListener('scroll', handleScroll);

// ========== Top 버튼 클릭 시 맨 위로 이동 ==========
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
