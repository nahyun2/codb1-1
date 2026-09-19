// ========== 새로고침 시 이전 스크롤 위치 복원 방지 ==========
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// ========== 요소 선택 ==========
const header = document.querySelector('#header');
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const topBtn = document.querySelector('#top-btn');
const themeToggle = document.querySelector('#theme-toggle');
const projectsFilter = document.querySelector('#projects-filter');
const projectsStatus = document.querySelector('#projects-status');
const projectsGrid = document.querySelector('#projects-grid');
const heroTagline = document.querySelector('#hero-tagline');
const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const messageError = document.querySelector('#message-error');
const formSuccess = document.querySelector('#form-success');

const GITHUB_USERNAME = 'nahyun2';
const MAX_PROJECTS = 6;

// ========== 다크 모드 토글 + localStorage 저장/복원 ==========
const THEME_KEY = 'theme';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
};

const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem(THEME_KEY);

applyTheme(savedTheme ?? (prefersDarkQuery.matches ? 'dark' : 'light'));

// 사용자가 직접 토글한 적이 없다면 시스템 다크 모드 설정 변경을 실시간으로 반영
prefersDarkQuery.addEventListener('change', (event) => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

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

// ========== Hero 섹션 타이핑 효과 (반복) ==========
const TAGLINE_TEXT = '감자에서 사람이 되고 있는 개발자입니다:D';
const HIGHLIGHT_WORD = '감자';
const TYPING_SPEED_MS = 120;
const ERASING_SPEED_MS = 60;
const PAUSE_AFTER_TYPE_MS = 1500;
const PAUSE_AFTER_ERASE_MS = 400;

const renderTagline = (visibleLength) => {
  const highlightLength = Math.min(visibleLength, HIGHLIGHT_WORD.length);
  const restLength = visibleLength - highlightLength;
  const highlightedPart = TAGLINE_TEXT.slice(0, highlightLength);
  const restPart = TAGLINE_TEXT.slice(HIGHLIGHT_WORD.length, HIGHLIGHT_WORD.length + restLength);
  heroTagline.innerHTML = `<span class="highlight-potato">${highlightedPart}</span>${restPart}`;
};

const runTaglineTypingLoop = () => {
  let index = 0;
  let isDeleting = false;

  const tick = () => {
    if (!isDeleting) {
      index += 1;
      renderTagline(index);

      if (index === TAGLINE_TEXT.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE_MS);
        return;
      }

      setTimeout(tick, TYPING_SPEED_MS);
    } else {
      index -= 1;
      renderTagline(index);

      if (index === 0) {
        isDeleting = false;
        setTimeout(tick, PAUSE_AFTER_ERASE_MS);
        return;
      }

      setTimeout(tick, ERASING_SPEED_MS);
    }
  };

  tick();
};

if (heroTagline) {
  runTaglineTypingLoop();
}

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
let currentProjects = [];
let activeLanguage = '전체';

const renderLoading = () => {
  projectsFilter.innerHTML = '';
  projectsGrid.innerHTML = '';
  projectsStatus.textContent = '로딩 중...';
};

const renderEmpty = () => {
  projectsFilter.innerHTML = '';
  projectsGrid.innerHTML = '';
  projectsStatus.textContent = '표시할 프로젝트가 없습니다.';
};

const renderProjectsError = () => {
  projectsFilter.innerHTML = '';
  projectsGrid.innerHTML = '';
  projectsStatus.innerHTML = `
    <p>프로젝트를 불러올 수 없습니다.</p>
    <button id="retry-btn" type="button" class="btn btn-outline">다시 시도</button>
  `;
  document.querySelector('#retry-btn').addEventListener('click', fetchProjects);
};

const renderProjects = (repos) => {
  projectsStatus.textContent = '';

  if (repos.length === 0) {
    projectsGrid.innerHTML = '';
    projectsStatus.textContent = '해당 언어로 작성된 프로젝트가 없습니다.';
    return;
  }

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

const applyLanguageFilter = (language) => {
  activeLanguage = language;

  projectsFilter.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.language === language);
  });

  const filtered = language === '전체'
    ? currentProjects
    : currentProjects.filter((repo) => repo.language === language);

  renderProjects(filtered);
};

const renderLanguageFilters = (repos) => {
  const languages = ['전체', ...new Set(repos.map((repo) => repo.language).filter(Boolean))];

  projectsFilter.innerHTML = languages
    .map((language) => `<button type="button" class="filter-btn" data-language="${language}">${language}</button>`)
    .join('');

  projectsFilter.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguageFilter(btn.dataset.language));
  });
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

    currentProjects = filteredRepos;
    renderLanguageFilters(filteredRepos);
    applyLanguageFilter('전체');
  } catch (error) {
    renderProjectsError();
  }
};

fetchProjects();

// ========== Contact 폼 유효성 검사 & 실제 전송 (Formspree) ==========
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submitBtn = contactForm.querySelector('button[type="submit"]');

const validateName = () => {
  const value = nameInput.value.trim();
  nameError.textContent = value ? '' : '이름을 입력해주세요.';
  return Boolean(value);
};

const validateEmail = () => {
  const value = emailInput.value.trim();
  if (!value) {
    emailError.textContent = '이메일을 입력해주세요.';
    return false;
  }
  if (!EMAIL_REGEX.test(value)) {
    emailError.textContent = '올바른 이메일 형식이 아닙니다.';
    return false;
  }
  emailError.textContent = '';
  return true;
};

const validateMessage = () => {
  const value = messageInput.value.trim();
  messageError.textContent = value ? '' : '메시지를 입력해주세요.';
  return Boolean(value);
};

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
messageInput.addEventListener('input', validateMessage);

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formSuccess.textContent = '';

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (!(isNameValid && isEmailValid && isMessageValid)) {
    return;
  }

  submitBtn.disabled = true;
  formSuccess.style.color = '';
  formSuccess.textContent = '전송 중...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
    });

    if (!response.ok) {
      throw new Error('메시지 전송에 실패했습니다.');
    }

    formSuccess.textContent = '메시지가 성공적으로 전송되었습니다!';
    contactForm.reset();
  } catch (error) {
    formSuccess.style.color = 'var(--color-error)';
    formSuccess.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    submitBtn.disabled = false;
  }
});

// ========== Intersection Observer 스크롤 애니메이션 ==========
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealElements.forEach((element) => revealObserver.observe(element));
