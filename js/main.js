// ===== 프로젝트 데이터 (여기만 수정하면 카드가 자동으로 바뀝니다) =====
const projects = [
  {
    title: '할 일 관리 앱',
    description: '드래그 앤 드롭으로 순서를 바꾸고, 로컬 저장소에 데이터를 보관하는 할 일 관리 앱입니다.',
    tags: ['JavaScript', 'HTML', 'CSS'],
    link: 'https://github.com/username/todo-app',
    demo: '#'
  },
  {
    title: '날씨 대시보드',
    description: '도시별 날씨를 검색하고 시간대별 예보를 차트로 보여주는 반응형 대시보드입니다.',
    tags: ['React', 'Chart.js', 'REST API'],
    link: 'https://github.com/username/weather-dashboard',
    demo: '#'
  },
  {
    title: '포트폴리오 템플릿',
    description: 'Tailwind CSS로 만든 다크 모드 지원 개인 포트폴리오 템플릿입니다.',
    tags: ['Tailwind CSS', 'HTML', 'JavaScript'],
    link: 'https://github.com/username/portfolio-template',
    demo: '#'
  }
];

// ===== 프로젝트 카드 렌더링 =====
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (p) => `
        <article class="fade-in project-card group flex flex-col rounded-3xl bg-surface shadow-card border border-line/5 p-6">
          <div class="mb-5 h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent font-mono font-bold text-lg">
            ${escapeHtml(p.title.charAt(0))}
          </div>
          <h3 class="text-xl font-bold text-ink group-hover:text-accent transition">${escapeHtml(p.title)}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">${escapeHtml(p.description)}</p>
          <ul class="mt-5 flex flex-wrap gap-2">
            ${p.tags
              .map(
                (t) =>
                  `<li class="px-2.5 py-1 rounded-md bg-surface-2 border border-line/10 font-mono text-xs font-medium text-ink/80">${escapeHtml(t)}</li>`
              )
              .join('')}
          </ul>
          <div class="mt-6 flex gap-5 font-mono text-sm font-semibold">
            <a href="${escapeHtml(p.link)}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">코드 보기 →</a>
            <a href="${escapeHtml(p.demo)}" class="text-muted hover:text-ink hover:underline">데모</a>
          </div>
        </article>`
    )
    .join('');
}

// HTML 특수문자 이스케이프 (데이터에 기호가 있어도 안전하게 표시)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== 모바일 메뉴 =====
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
  });

  // 메뉴 항목을 누르면 닫기
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== 다크 모드 (기본: 다크, 라이트는 html.light 클래스) =====
function applyTheme(isDark) {
  document.documentElement.classList.toggle('light', !isDark);
  const moon = document.querySelector('.icon-moon');
  const sun = document.querySelector('.icon-sun');
  // 다크 모드일 때는 해 아이콘(전환 후 라이트로 가는 버튼), 라이트일 때는 달 아이콘 표시
  if (moon && sun) {
    moon.classList.toggle('hidden', isDark);
    sun.classList.toggle('hidden', !isDark);
  }
}

function setupTheme() {
  const toggle = document.getElementById('theme-toggle');

  let isDark = !document.documentElement.classList.contains('light');
  applyTheme(isDark);

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    isDark = document.documentElement.classList.contains('light'); // 현재 라이트면 다크로 전환
    applyTheme(isDark);
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
      // 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 무시
    }
  });
}

// ===== 현재 섹션 메뉴 강조 (<홈> 처럼 꺾쇠 표시는 CSS에서) =====
function setupActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

// ===== 스크롤 시 페이드인 =====
function setupFadeIn() {
  const items = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  setupMobileMenu();
  setupTheme();
  setupActiveNav();
  setupFadeIn();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
