// ========== 요소 선택 ==========
const header = document.querySelector('#header');
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const topBtn = document.querySelector('#top-btn');
const themeToggle = document.querySelector('#theme-toggle');
const projectsStatus = document.querySelector('#projects-status');
const projectsGrid = document.querySelector('#projects-grid');

const GITHUB_USERNAME = 'nahyun2';
const MAX_PROJECTS = 6;

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

// ========== GitHub API 연동 (Projects) ==========
const renderLoading = () => {
  projectsGrid.innerHTML = '';
  projectsStatus.textContent = '로딩 중...';
};

const renderEmpty = () => {
  projectsGrid.innerHTML = '';
  projectsStatus.textContent = '표시할 프로젝트가 없습니다.';
};

const renderProjectsError = () => {
  projectsGrid.innerHTML = '';
  projectsStatus.innerHTML = `
    <p>프로젝트를 불러올 수 없습니다.</p>
    <button id="retry-btn" type="button" class="btn btn-outline">다시 시도</button>
  `;
  document.querySelector('#retry-btn').addEventListener('click', fetchProjects);
};

const renderProjects = (repos) => {
  projectsStatus.textContent = '';
  projectsGrid.innerHTML = repos
    .map(({ name, description, html_url: htmlUrl, language, stargazers_count: stars }) => `
      <article class="project-card">
        <h3>${name}</h3>
        <p>${description ?? '설명이 없습니다.'}</p>
        <p>⭐ ${stars}${language ? ` · ${language}` : ''}</p>
        <a href="${htmlUrl}" target="_blank" rel="noopener" class="btn btn-outline">GitHub에서 보기</a>
      </article>
    `)
    .join('');
};

const fetchProjects = async () => {
  renderLoading();
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API 요청 한도(rate limit)를 초과했습니다.');
      }
      throw new Error('GitHub 저장소 목록을 불러오지 못했습니다.');
    }

    const repos = await response.json();

    const filteredRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, MAX_PROJECTS);

    if (filteredRepos.length === 0) {
      renderEmpty();
      return;
    }

    renderProjects(filteredRepos);
  } catch (error) {
    renderProjectsError();
  }
};

fetchProjects();
