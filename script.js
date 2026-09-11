/* ═══════════════════════════════════════════════════════════
   GIOFFREDO — AI DEVELOPER PORTFOLIO
   Data injection, interactions, HUD micro-systems
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ─────────────────────────────────────────────
       SVG icon helpers
    ───────────────────────────────────────────── */
    const icons = {
        arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
        arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>',
        code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>',
        brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3A2.5 2.5 0 0 0 7 5.5v.6A3 3 0 0 0 5 9a3 3 0 0 0-.7 5.9A3.4 3.4 0 0 0 9 19.2V20a2 2 0 0 0 4 .4V5.5A2.5 2.5 0 0 0 9.5 3z"/><path d="M14.5 3A2.5 2.5 0 0 1 17 5.5v.6a3 3 0 0 1 2 2.9 3 3 0 0 1 .7 5.9 3.4 3.4 0 0 1-4.7 4.3V20a2 2 0 0 1-4 .4"/></svg>',
        cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5M3 7l9 5"/></svg>',
        gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>',
        github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.05.77 2.12v3.15c0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
        linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.31h4.52V23H.24zM8.34 8.31h4.33v2h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92V23h-4.51v-7.14c0-1.7-.03-3.89-2.37-3.89-2.37 0-2.73 1.85-2.73 3.76V23H8.34z"/></svg>',
        instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.4" y1="6.6" x2="17.41" y2="6.6"/></svg>'
    };

    // Monochrome brand logos (Simple Icons CDN) with inline fallback.
    const brandIcon = (slug, name) =>
        `<span class="brand-ic-wrap"><span class="brand-ic-fallback mono">${name.slice(0, 2).toUpperCase()}</span><img class="brand-ic" src="https://cdn.simpleicons.org/${slug}/c8d6e4" alt="${name}" loading="lazy" onerror="this.remove()"></span>`;

    /* ═════════════════════════════════════════════════════
       DATA — edit me ✏️  (all copy, links, numbers live here)
    ═════════════════════════════════════════════════════ */

    // --- Expertise ----------------------------------------------------------
    const skills = [
        { icon: brandIcon('python', 'Python'),    name: 'Python',          code: '// primary language', level: 5, desc: 'AI pipelines, automation, data tooling and backend logic.', tag: 'CORE' },
        { icon: brandIcon('javascript', 'JS'),    name: 'JavaScript',      code: '// the web glue',      level: 4, desc: 'Interactive apps, APIs and tooling across the stack.', tag: 'WEB' },
        { icon: brandIcon('react', 'React'),      name: 'React',           code: '// ui systems',        level: 4, desc: 'Component-driven interfaces with clean state management.', tag: 'UI' },
        { icon: icons.chip,                       name: 'AI Development',  code: '// llm & agents',      level: 5, desc: 'AI products, assistants and intelligent features in production.', tag: 'CORE' },
        { icon: icons.brain,                      name: 'Machine Learning',code: '// models',           level: 4, desc: 'Pipelines, fine-tuning, embeddings and applied ML.', tag: 'AI' },
        { icon: icons.cube,                       name: 'WebGL / Three.js',code: '// gpu & shaders',     level: 3, desc: 'Immersive real-time 3D and generative web experiences.', tag: '3D' },
        { icon: brandIcon('nodedotjs', 'Node'),   name: 'Node.js',         code: '// runtimes & apis',  level: 4, desc: 'Server-side services, realtime systems and tooling.', tag: 'API' },
        { icon: brandIcon('git', 'Git'),          name: 'Git',             code: '// version control',  level: 4, desc: 'Clean history, branching strategies and collaboration.', tag: 'DEV' }
    ];

    // --- Experience & education ----------------------------------------------
    const work = [
        {
            period: '2023 — PRESENT', now: true, role: 'AI Developer', where: 'Freelance / Independent',
            desc: 'Building AI-powered assistants, automation systems and interactive products that solve real workflows end-to-end.',
            tags: ['Python', 'LLMs', 'Automation']
        },
        {
            period: '2021 — 2023', now: false, role: 'Software Developer', where: 'Startup / Agency',
            desc: 'Shipped web applications, APIs and internal tools used daily by real teams and users.',
            tags: ['JavaScript', 'APIs', 'Databases']
        },
        {
            period: '2020 — 2021', now: false, role: 'Web Developer', where: 'Freelance',
            desc: 'Designed and delivered responsive sites, landing pages and small-business solutions.',
            tags: ['HTML/CSS', 'JavaScript', 'UI']
        }
    ];
    const edu = [
        {
            period: '2023 — 2024', now: false, role: 'AI & ML Specialization', where: 'Applied Track — Online',
            desc: 'Deep dives into LLMs, prompt engineering, retrieval and applied AI product development.',
            tags: ['LLMs', 'RAG', 'MLOps']
        },
        {
            period: '2019 — 2023', now: false, role: 'Computer Science', where: 'University — Indonesia',
            desc: 'Software engineering, algorithms and the mathematical foundations of machine learning.',
            tags: ['Algorithms', 'Data', 'ML']
        },
        {
            period: 'CONTINUOUS', now: false, role: 'Self-taught Lab', where: 'Docs · papers · late builds',
            desc: 'Relentless exploration of new tools through experiments, side projects and community.',
            tags: ['Experiments', 'Research', 'Builds']
        }
    ];

    // --- Projects / selected work ---------------------------------------------
    // 1st entry = featured. Update `live` / `source` (or leave '#' → placeholder toast) when real links exist.
    const projects = [
        {
            no: '01', name: 'Neural Desk', year: '2026 — AI', cat: 'AI DEVELOPMENT', glyph: 'ND',
            grad: 'radial-gradient(90% 90% at 28% 18%, rgba(227,32,43,.24), rgba(18,4,6,.6) 52%, #0a0506 100%)',
            desc: 'An AI work companion that turns scattered notes, files and chats into a single searchable command surface.',
            tags: ['Python', 'LLMs', 'RAG', 'React'],
            overview: 'Knowledge workers juggle notes, documents and chat history across a dozen tools. Neural Desk unifies them behind one assistant that actually has context.',
            problem: 'Off-the-shelf assistants answer generic questions but forget your world — your files, your decisions, your vocabulary. Embedding every tool cost-effectively at personal scale was the hard constraint.',
            solution: 'A local-first retrieval layer over embeddings + a lightweight agent loop that routes queries to the right source, cites answers and learns your shortcuts over time.',
            stack: ['Python', 'OpenAI API', 'Chroma', 'React', 'FastAPI'],
            role: 'Solo — concept to deployment: retrieval architecture, agent orchestration, UI.',
            result: ['Cut daily lookup time by roughly an hour for early users', 'Ships as a local-first desktop + web app', 'Open architecture: swap in any model or vector store'],
            live: '#', source: '#'
        },
        {
            no: '02', name: 'Aurora Pipeline', year: '2026 — AUTOMATION', cat: 'AUTOMATION', glyph: 'ƒ(x)',
            grad: 'radial-gradient(90% 90% at 72% 20%, rgba(255,120,130,.2), rgba(20,6,8,.55) 55%, #0b0507 100%)',
            desc: 'End-to-end automation that ingests raw data, processes it with AI and triggers actions across your tools.',
            tags: ['Python', 'Pandas', 'Webhooks'],
            overview: 'A configurable automation backbone for teams drowning in repetitive data chores.',
            problem: 'Manual data wrangling created constant drift — numbers were re-typed, decisions lagged, and no single system owned the truth.',
            solution: 'Modular pipeline stages (ingest → clean → model → act) each swappable, monitored and replayable, connected by webhooks to the tools teams already use.',
            stack: ['Python', 'Pandas', 'Docker', 'Webhooks', 'PostgreSQL'],
            role: 'Architecture + core engine; template integrations for common SaaS tools.',
            result: ['Removes hours of weekly manual work per workflow', 'Every stage auditable — full replay & lineage', 'Runs unattended with failure alerts'],
            live: '#', source: '#'
        },
        {
            no: '03', name: 'Signal Board', year: '2025 — WEB', cat: 'WEB PLATFORM', glyph: '</>',
            grad: 'radial-gradient(90% 90% at 20% 80%, rgba(227,32,43,.16), rgba(16,4,6,.55) 55%, #090506 100%)',
            desc: 'A realtime web platform with clean architecture, live dashboards and a deliberately pleasant UX.',
            tags: ['JavaScript', 'WebSockets', 'CSS'],
            overview: 'A realtime operations dashboard that turns live event streams into decisions people can act on.',
            problem: 'Teams were reacting to stale dashboards — by the time data refreshed, the moment had passed.',
            solution: 'Event-sourced backend pushing over WebSockets, with a front-end tuned for glanceability: signal over decoration, focus modes and keyboard-first navigation.',
            stack: ['Node.js', 'WebSockets', 'React', 'CSS', 'Redis'],
            role: 'Full-stack: realtime layer, dashboard design system and performance tuning.',
            result: ['Sub-second updates at scale', 'Design system reused across three products', '100/100 Lighthouse on the marketing route'],
            live: '#', source: '#'
        },
        {
            no: '04', name: 'Model Δ', year: '2025 — ML', cat: 'MACHINE LEARNING', glyph: 'Δ→y',
            grad: 'radial-gradient(90% 90% at 80% 75%, rgba(227,32,43,.12), rgba(12,5,8,.5) 60%, #080507 100%)',
            desc: 'Applied ML experiment — training, evaluating and shipping a model that predicts on real-world data.',
            tags: ['Python', 'scikit-learn', 'Jupyter'],
            overview: 'An applied machine-learning project that went from notebook to a served prediction endpoint.',
            problem: 'Public datasets are clean; real data is messy, skewed and full of leaks. The challenge was building trust in predictions that drive decisions.',
            solution: 'Rigorous EDA, feature engineering and honest evaluation (backtesting, ablation) before serving the model behind a tiny API with drift monitoring.',
            stack: ['Python', 'scikit-learn', 'pandas', 'FastAPI', 'MLflow'],
            role: 'End-to-end: data, modeling, evaluation and production serving.',
            result: ['Accuracy gains verified by backtest, not just holdout', 'Model + monitoring live behind a REST endpoint', 'Full experiment log reproducible'],
            live: '#', source: '#'
        },
        {
            no: '05', name: 'Monogrid CLI', year: '2024 — TOOLS', cat: 'DEV TOOLING', glyph: '$ _',
            grad: 'radial-gradient(90% 90% at 30% 70%, rgba(210,214,222,.12), rgba(10,10,12,.5) 60%, #070708 100%)',
            desc: 'A collection of CLI utilities and templates that make everyday developer workflows faster and safer.',
            tags: ['Python', 'Bash', 'CLI'],
            overview: 'Developer tooling for repetitive, error-prone jobs — scaffolding, validation and cleanup.',
            problem: 'Every project re-created the same boilerplate by hand, and destructive cleanup scripts were copy-pasted with fear.',
            solution: 'A single installable CLI with idempotent generators, dry-run safety on every destructive command and consistent, colorful output.',
            stack: ['Python', 'Typer', 'Bash', 'Git'],
            role: 'Design + implementation of the full command surface.',
            result: ['New project scaffold in under a second', 'Dry-run everywhere — zero accidental deletions', 'Actively used in personal + client work'],
            live: '#', source: '#'
        }
    ];

    // --- Archive (digital file cabinet) ----------------------------------------
    const archive = [
        { year: '2026', dir: 'AI',    name: 'Vector Memory Lab',   sub: 'RAG experiments, chunking strategies & recall curves.', tags: ['ai', 'rag'], size: '4.2 KB' },
        { year: '2026', dir: 'WEB',   name: 'Design System v1',    sub: 'Tokens, type scale and components for rapid product UI.', tags: ['design', 'css'], size: '1.8 KB' },
        { year: '2025', dir: 'EXP',   name: 'Prompt Engine',       sub: 'Sandbox for prompt patterns, evals and temperature sweeps.', tags: ['ai', 'wip'], size: '9.6 KB' },
        { year: '2025', dir: 'AUTO',  name: 'Scraper Toolkit',     sub: 'Modular scraping kit with politeness + caching built in.', tags: ['python', 'data'], size: '3.4 KB' },
        { year: '2024', dir: 'AI',    name: 'TinyNN Playground',   sub: 'From-scratch neural networks — the educational kind.', tags: ['ml', 'legacy'], size: '6.1 KB' },
        { year: '2024', dir: 'WEB',   name: 'Landing Pack',        sub: 'Reusable animated landing sections, pre-AI era.', tags: ['ui', 'html'], size: '2.9 KB' }
    ];

    // --- Contact channels + socials (placeholders — swap for real handles) ------
    const channels = [
        { icon: icons.mail,      label: 'email',     value: 'hello@gioffredo.dev',     href: 'mailto:hello@gioffredo.dev', external: false },
        { icon: icons.github,    label: 'github',    value: 'github.com/gioffredo',    href: 'https://github.com/gioffredo', external: true },
        { icon: icons.linkedin,  label: 'linkedin',  value: 'linkedin.com/in/gioffredo', href: 'https://www.linkedin.com/in/gioffredo', external: true },
        { icon: icons.instagram, label: 'instagram', value: '@gioffredo.dev',          href: 'https://www.instagram.com/gioffredo.dev', external: true }
    ];
    const socials = [
        { icon: icons.github,    label: 'GitHub',     href: 'https://github.com/gioffredo' },
        { icon: icons.linkedin,  label: 'LinkedIn',   href: 'https://www.linkedin.com/in/gioffredo' },
        { icon: icons.instagram, label: 'Instagram',  href: 'https://www.instagram.com/gioffredo.dev' },
        { icon: icons.mail,      label: 'Email',      href: 'mailto:hello@gioffredo.dev' }
    ];

    /* ─────────────────────────────────────────────
       Builders
    ───────────────────────────────────────────── */

    function buildSkills() {
        const grid = $('#skillsGrid');
        if (!grid) return;
        grid.innerHTML = skills.map((s, i) => `
            <article class="skill-card" style="transition-delay:${(i % 4) * 0.08}s">
                <span class="sk-idx mono">SKL_${String(i + 1).padStart(2, '0')}</span>
                <div class="sk-top">
                    <span class="sk-ic" aria-hidden="true">${s.icon}</span>
                    <div>
                        <h3 class="sk-name">${s.name}</h3>
                        <p class="sk-code mono">${s.code}</p>
                    </div>
                </div>
                <p class="sk-desc">${s.desc}</p>
                <div class="sk-foot">
                    <span class="sk-level" aria-label="Level ${s.level} of 5">
                        ${[1, 2, 3, 4, 5].map(l => `<i class="${l <= s.level ? 'on' : ''}"></i>`).join('')}
                    </span>
                    <span class="sk-tag mono">${s.tag}</span>
                </div>
            </article>`).join('');
    }

    function buildTimeline() {
        const tl = (el, list, type) => {
            if (!el) return;
            el.innerHTML = list.map(item => `
                <article class="tl-item${item.now ? ' is-now' : ''}">
                    <span class="tl-dot" aria-hidden="true"></span>
                    <div class="tl-card">
                        <div class="tl-top">
                            <span class="tl-year">${item.period}</span>
                            <span class="tl-chip">${item.now ? '● current' : type}</span>
                        </div>
                        <h3 class="tl-role">${item.role}</h3>
                        <p class="tl-where">${item.where}</p>
                        <p class="tl-desc">${item.desc}</p>
                        <div class="tl-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</div>
                    </div>
                </article>`).join('');
        };
        tl($('#tlWork'), work, 'WORK');
        tl($('#tlEdu'), edu, 'EDU');
    }

    function buildWork() {
        const featured = $('#workFeatured');
        const grid = $('#workGrid');
        if (featured) {
            const p = projects[0];
            featured.innerHTML = `
                <article class="case case-featured" data-case="0" tabindex="0" role="button"
                         aria-label="Open project details — ${p.name}">
                    <div class="case-visual" style="--cv-g:${p.grad}">
                        <span class="case-cat mono">${p.cat}</span>
                        <span class="case-open mono">OPEN CASE ${icons.arrowUpRight}</span>
                        <span class="case-glyph" aria-hidden="true">${p.glyph}</span>
                        <span class="case-index" aria-hidden="true">0${p.no}</span>
                    </div>
                    <div class="case-info">
                        <span class="case-no mono">PROJECT ${p.no}</span>
                        <h3 class="case-name">${p.name}</h3>
                        <p class="case-year">${p.year}</p>
                        <p class="case-desc">${p.desc}</p>
                        <div class="case-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
                        <span class="case-cta mono">View case study ${icons.arrowUpRight}</span>
                    </div>
                </article>`;
        }
        if (grid) {
            grid.innerHTML = projects.slice(1).map((p, i) => `
                <article class="case case-tile" style="transition-delay:${(i % 2) * 0.09}s" data-case="${i + 1}" tabindex="0" role="button"
                         aria-label="Open project details — ${p.name}">
                    <div class="case-visual" style="--cv-g:${p.grad}">
                        <span class="case-cat mono">${p.cat}</span>
                        <span class="case-open mono">OPEN ${icons.arrowUpRight}</span>
                        <span class="case-glyph" aria-hidden="true">${p.glyph}</span>
                        <span class="case-index" aria-hidden="true">${p.no}</span>
                    </div>
                    <div class="case-info">
                        <span class="case-no mono">PROJECT ${p.no}</span>
                        <h3 class="case-name">${p.name}</h3>
                        <p class="case-year">${p.year}</p>
                        <p class="case-desc">${p.desc}</p>
                        <div class="case-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
                        <span class="case-cta mono">View case ${icons.arrowUpRight}</span>
                    </div>
                </article>`).join('');
        }
    }

    function buildArchive() {
        const panel = $('#archivePanel');
        if (!panel) return;
        panel.innerHTML = `
            <div class="arch-head mono">
                <span>#</span><span>YEAR</span><span>DIR</span><span>FILENAME</span><span>TAGS</span><span>SIZE</span><span></span>
            </div>` +
            archive.map((a, i) => `
            <div class="arch-row" tabindex="0" role="link"
                 aria-label="Archive: ${a.name}"
                 data-placeholder="Archive item — attach the real project URL in script.js (archive array)">
                <span class="ar-idx">${String(i + 1).padStart(2, '0')}</span>
                <span class="ar-year">${a.year}</span>
                <span class="ar-dir">${a.dir}</span>
                <div class="ar-name">
                    <strong>${a.name}</strong>
                    <em>${a.sub}</em>
                </div>
                <div class="ar-tags">${a.tags.map(t => `<span>#${t}</span>`).join('')}</div>
                <span class="ar-size">${a.size}</span>
                <span class="ar-arrow mono">→</span>
            </div>`).join('');
        const foot = $('#archiveFoot');
        if (foot) {
            foot.innerHTML = `
                <span>Total files: ${String(archive.length).padStart(2, '0')}</span>
                <span>Index: <span class="ok">● synced</span></span>
                <span>Last read: just now</span>`;
        }
    }

    function buildContact() {
        const box = $('.contact-channels');
        if (box) {
            box.innerHTML = channels.map((c, i) => `
                <a class="channel" href="${c.href}" ${c.external ? 'target="_blank" rel="noopener"' : ''}>
                    <span class="ch-idx mono">CH_0${i + 1}</span>
                    <span class="ch-ic" aria-hidden="true">${c.icon}</span>
                    <span class="ch-body">
                        <span class="ch-label mono">${c.label}</span>
                        <span class="ch-value mono">${c.value}</span>
                    </span>
                    <span class="ch-go" aria-hidden="true">${icons.arrowUpRight}</span>
                </a>`).join('');
        }
        const footerSocial = $('#footerSocial');
        if (footerSocial) {
            footerSocial.innerHTML = socials.map(s => `
                <a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${s.icon}<span>${s.label}</span></a>`).join('');
        }
        const mmSocials = $('#mmSocials');
        if (mmSocials) {
            mmSocials.innerHTML = socials.map(s => `<a href="${s.href}" target="_blank" rel="noopener">${s.label.toUpperCase()}</a>`).join('');
        }
    }

    /* ─────────────────────────────────────────────
       Word-split heading reveals
    ───────────────────────────────────────────── */
    function splitHeadings() {
        if (prefersReducedMotion.matches) return;
        $$('[data-split]').forEach(el => {
            if (el.dataset.splitDone) return;
            el.dataset.splitDone = '1';
            // Only plain-text descendants should be split (keep inner elements intact).
            const textNodes = [];
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
                acceptNode(n) {
                    return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            });
            while (walker.nextNode()) textNodes.push(walker.currentNode);

            let idx = 0;
            textNodes.forEach(node => {
                const frag = document.createDocumentFragment();
                const tokens = node.textContent.split(/(\s+)/);
                tokens.forEach(tok => {
                    if (!tok.trim()) { frag.appendChild(document.createTextNode(tok)); return; }
                    const hm = document.createElement('span');
                    hm.className = 'hm';
                    hm.setAttribute('aria-hidden', 'true');
                    const hw = document.createElement('span');
                    hw.className = 'hw';
                    hw.textContent = tok;
                    hw.style.transitionDelay = (idx * 0.055) + 's';
                    hm.appendChild(hw);
                    frag.appendChild(hm);
                    idx++;
                });
                node.parentNode.replaceChild(frag, node);
            });
            el.classList.add('split');
        });
    }

    /* ─────────────────────────────────────────────
       Preloader
    ───────────────────────────────────────────── */
    let booted = false; // reveal animations wait until the boot veil lifts
    function initPreloader() {
        const pre = $('#preloader');
        const boot = () => {
            booted = true;
            if (pre) pre.classList.add('done');
            document.body.classList.remove('lock');
        };
        if (!pre) { boot(); return; }
        document.body.classList.add('lock');
        window.addEventListener('load', () => setTimeout(boot, 450));
        setTimeout(boot, 2800); // safety net
    }

    /* ─────────────────────────────────────────────
       Navbar: scroll state, scrollspy, rails, mobile
    ───────────────────────────────────────────── */
    function initNav() {
        const navbar = $('#navbar');
        const progress = $('#scrollProgress');
        const sections = ['home', 'about', 'skills', 'experience', 'projects', 'archive', 'contact']
            .map(id => document.getElementById(id)).filter(Boolean);
        const navLinks = $$('.nav-link');
        const railItems = $$('.rail-item');

        const onScroll = () => {
            const y = window.scrollY;
            navbar.classList.toggle('scrolled', y > 24);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

            let current = 'home';
            sections.forEach(sec => {
                if (y >= sec.offsetTop - window.innerHeight * 0.35) current = sec.id;
            });
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
            railItems.forEach(r => r.classList.toggle('is-active', r.dataset.rail === current));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Show rails once the layout settles (avoids overlap flash on load)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => document.body.classList.add('rail-live'));
        });

        // Mobile menu
        const burger = $('#hamburger');
        const menu = $('#mobileMenu');
        if (burger && menu) {
            const toggle = (open) => {
                burger.classList.toggle('active', open);
                menu.classList.toggle('open', open);
                burger.setAttribute('aria-expanded', open);
                menu.setAttribute('aria-hidden', !open);
                document.body.classList.toggle('lock', open);
            };
            burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
            $$('.m-link', menu).forEach(l => l.addEventListener('click', () => toggle(false)));
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && menu.classList.contains('open')) toggle(false);
            });
        }
    }

    /* ─────────────────────────────────────────────
       Custom cursor
    ───────────────────────────────────────────── */
    function initCursor() {
        if (!finePointer || prefersReducedMotion.matches) return;
        const dot = $('#cursorDot');
        const ring = $('#cursorRing');
        const label = $('#cursorLabel');
        if (!dot || !ring) return;
        document.body.classList.add('custom-cursor');

        let mx = innerWidth / 2, my = innerHeight / 2;
        let rx = mx, ry = my;
        let shown = false;

        window.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            if (!shown) { shown = true; dot.style.opacity = 1; ring.style.opacity = 1; }
            dot.style.transform = `translate(${mx}px, ${my}px)`;
            const t = e.target.closest('a, button, .case, .arch-row, .channel, [role="button"]');
            const isCase = !!e.target.closest('.case');
            ring.classList.toggle('hover', !!t && !isCase);
            ring.classList.toggle('view', isCase);
            if (label) label.textContent = isCase ? 'VIEW' : '';
            const isText = e.target.closest('input, textarea');
            dot.style.opacity = isText ? 0 : (shown ? 1 : 0);
            ring.style.opacity = isText ? 0 : (shown ? 1 : 0);
        });
        document.addEventListener('mouseleave', () => {
            shown = false; dot.style.opacity = 0; ring.style.opacity = 0;
        });

        (function loop() {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(loop);
        })();
    }

    /* ─────────────────────────────────────────────
       Reveal on scroll + counters
    ───────────────────────────────────────────── */
    function initReveal() {
        const els = $$('.reveal, [data-split], .case, .skill-card');
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                if (!booted) { // wait for the boot veil before revealing
                    io.unobserve(e.target);
                    const retry = () => { if (booted) io.observe(e.target); else setTimeout(retry, 140); };
                    retry();
                    return;
                }
                const el = e.target;
                el.classList.add('in');
                if (el.style.transitionDelay) {
                    const ms = (parseFloat(el.style.transitionDelay) || 0) * 1000;
                    setTimeout(() => { el.style.transitionDelay = '0s'; }, ms + 1200);
                }
                io.unobserve(el);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
        els.forEach(el => io.observe(el));

        // Counters
        const counterIO = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                if (prefersReducedMotion.matches || !target) { el.textContent = target + suffix; return; }
                const dur = 1500;
                const start = performance.now();
                (function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(eased * target) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = target + suffix;
                })(start);
                counterIO.unobserve(el);
            });
        }, { threshold: 0.6 });
        $$('.stat-num').forEach(el => counterIO.observe(el));
    }

    /* ─────────────────────────────────────────────
       Project detail modal
    ───────────────────────────────────────────── */
    function initModal() {
        const modal = $('#projectModal');
        const content = $('#modalContent');
        const file = $('#pmFile');
        const closeBtn = $('#modalClose');
        if (!modal || !content) return;

        let lastFocus = null;

        const fill = (p) => {
            file.textContent = `CASE://${p.no}`;
            const linkBtn = (label, href, icon) =>
                `<a class="btn ${href === '#' ? 'btn-line' : 'btn-prime'}" href="${href}"
                    ${href === '#' ? `data-placeholder="${label} link — add the real URL in script.js (projects array)"` : (label === 'View source' ? 'target="_blank" rel="noopener"' : '')}>${icon}<span class="btn-lbl">${label}</span></a>`;
            content.innerHTML = `
                <div class="pm-top mono">
                    <span class="pm-cat">${p.cat}</span>
                    <span class="pm-year">${p.year}</span>
                </div>
                <h3 class="pm-title" id="pmTitle">${p.name}</h3>
                <p class="pm-lead">${p.overview}</p>
                <div class="pm-blocks">
                    <div class="pm-block"><h4>Problem</h4><p>${p.problem}</p></div>
                    <div class="pm-block"><h4>Solution</h4><p>${p.solution}</p></div>
                    <div class="pm-block"><h4>Stack</h4><ul>${p.stack.map(t => `<li>${t}</li>`).join('')}</ul></div>
                    <div class="pm-block"><h4>Role</h4><p>${p.role}</p></div>
                    <div class="pm-block pm-result"><h4>Result</h4><p>${p.result.map(r => `— ${r}<br>`).join('')}</p></div>
                </div>
                <div class="pm-links">
                    ${linkBtn('View live', p.live, icons.arrowUpRight)}
                    ${linkBtn('View source', p.source, icons.code)}
                </div>`;
        };

        const open = (p) => {
            fill(p);
            lastFocus = document.activeElement;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lock');
            closeBtn.focus();
        };
        const close = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lock');
            if (lastFocus) lastFocus.focus();
        };

        document.addEventListener('click', e => {
            const c = e.target.closest('.case[data-case]');
            if (c) {
                e.preventDefault();
                const p = projects[parseInt(c.dataset.case, 10)];
                if (p) open(p);
            }
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                const c = e.target.closest('.case[data-case]');
                if (c) { e.preventDefault(); e.target.click(); }
            }
        });
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('open')) close();
        });
    }

    /* ─────────────────────────────────────────────
       Placeholder-link toast
    ───────────────────────────────────────────── */
    function initPlaceholders() {
        const toast = $('#toast');
        let timer;
        const show = (msg) => {
            if (!toast) return;
            toast.textContent = msg || 'Placeholder — point this to the real destination in script.js.';
            toast.classList.add('show');
            clearTimeout(timer);
            timer = setTimeout(() => toast.classList.remove('show'), 3600);
        };
        document.addEventListener('click', e => {
            const el = e.target.closest('[data-placeholder]');
            if (el) { e.preventDefault(); show(el.dataset.placeholder); }
        });
    }

    /* ─────────────────────────────────────────────
       Misc: clock, year, to-top
    ───────────────────────────────────────────── */
    function initMisc() {
        const clock = $('#clock');
        if (clock) {
            const fmt = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            });
            const tick = () => { clock.textContent = fmt.format(new Date()); };
            tick();
            setInterval(tick, 1000);
        }
        const year = $('#year');
        if (year) year.textContent = new Date().getFullYear();
        const toTop = $('#toTop');
        if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ─────────────────────────────────────────────
       Hero core fallback hooks (3D module degrades gracefully)
    ───────────────────────────────────────────── */
    function initCoreHooks() {
        const stage = $('#coreStage');
        if (!stage) return;
        const markUnavailable = () => {
            if (stage.classList.contains('ready')) return;
            stage.classList.add('no-webgl');
            const msg = $('#coreMessage');
            if (msg) msg.hidden = false;
        };
        const modScript = document.querySelector('script[src="solar-system.js"]');
        if (modScript) modScript.addEventListener('error', markUnavailable);
        setTimeout(markUnavailable, 8000); // safety net
    }

    /* ── Boot ── */
    document.addEventListener('DOMContentLoaded', () => {
        buildSkills();
        buildTimeline();
        buildWork();
        buildArchive();
        buildContact();
        splitHeadings();
        initPreloader();
        initNav();
        initCursor();
        initCoreHooks();
        initModal();
        initReveal();
        initPlaceholders();
        initMisc();
    });
})();
