// Otsuka Academy - Main Application
(function () {
    'use strict';

    const LEVELS = [
        window.LEVEL1_DATA,
        window.LEVEL2_DATA,
        window.LEVEL3_DATA,
        window.LEVEL4_DATA,
        window.LEVEL5_DATA,
        window.LEVEL6_DATA,
        window.LEVEL7_DATA,
        window.LEVEL8_DATA,
        window.LEVEL9_DATA,
        window.LEVEL10_DATA,
        window.LEVEL11_DATA,
        window.LEVEL12_DATA
    ];

    const PREFIX = 'otsuka-';
    const app = document.getElementById('app');

    function getProgress() {
        const data = localStorage.getItem(PREFIX + 'progress');
        return data ? JSON.parse(data) : {};
    }

    function saveProgress(prog) {
        localStorage.setItem(PREFIX + 'progress', JSON.stringify(prog));
    }

    function isLevelCompleted(levelNum) {
        const prog = getProgress();
        return prog['level' + levelNum] === true;
    }

    function completeLevel(levelNum) {
        const prog = getProgress();
        prog['level' + levelNum] = true;
        saveProgress(prog);
    }

    function getCompletedCount() {
        const prog = getProgress();
        let count = 0;
        for (let i = 1; i <= 12; i++) {
            if (prog['level' + i]) count++;
        }
        return count;
    }

    function isLevelUnlocked(levelNum) {
        if (levelNum === 1) return true;
        return isLevelCompleted(levelNum - 1);
    }

    function saveBestScore(levelNum, score) {
        const key = PREFIX + 'best-level' + levelNum;
        const prev = localStorage.getItem(key);
        if (!prev || parseInt(prev) < score) {
            localStorage.setItem(key, score.toString());
        }
    }

    function getBestScore(levelNum) {
        const val = localStorage.getItem(PREFIX + 'best-level' + levelNum);
        return val ? parseInt(val) : 0;
    }

    // Menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
            mobileNav.classList.toggle('active');
        });
    }

    // Nav links
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            mobileNav.classList.remove('active');
            const view = this.getAttribute('data-view');
            if (view === 'dashboard') renderDashboard();
            else if (view === 'levels') renderLevels();
            else if (view === 'progress') renderProgress();
        });
    });

    function renderDashboard() {
        const completed = getCompletedCount();
        const percent = Math.round((completed / 12) * 100);

        app.innerHTML = `
            <div class="dashboard-hero">
                <h2>大塚製薬 Academy へようこそ</h2>
                <p>エビリファイからポカリまで、独自路線の製薬企業を徹底的に学べるプラットフォームです。</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${completed}</div>
                    <div class="stat-label">完了レベル</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">12</div>
                    <div class="stat-label">全レベル</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${percent}%</div>
                    <div class="stat-label">達成率</div>
                </div>
            </div>
            <div class="progress-overview">
                <h3>全体の進捗</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percent}%"></div>
                </div>
                <div class="progress-text">${completed} / 12 レベル完了</div>
            </div>
            <h3 class="section-title">レベル一覧</h3>
            <div class="level-grid">
                ${LEVELS.map(function (lv, i) {
                    const num = i + 1;
                    const done = isLevelCompleted(num);
                    const unlocked = isLevelUnlocked(num);
                    let cls = '';
                    let badge = '';
                    if (done) { cls = 'completed'; badge = '<span class="level-badge badge-completed">完了</span>'; }
                    else if (unlocked) { badge = '<span class="level-badge badge-available">挑戦可能</span>'; }
                    else { cls = 'locked'; badge = '<span class="level-badge badge-locked">ロック</span>'; }
                    return `<div class="level-card ${cls}" data-level="${num}">
                        <div class="level-number">${num}</div>
                        <div class="level-info">
                            <h3>${lv.title}</h3>
                            <p>${lv.description}</p>
                        </div>
                        ${badge}
                    </div>`;
                }).join('')}
            </div>
        `;

        app.querySelectorAll('.level-card:not(.locked)').forEach(function (card) {
            card.addEventListener('click', function () {
                const lvNum = parseInt(this.getAttribute('data-level'));
                renderModule(lvNum);
            });
        });
    }

    function renderLevels() {
        app.innerHTML = `
            <h3 class="section-title">全レベル一覧</h3>
            <div class="level-grid">
                ${LEVELS.map(function (lv, i) {
                    const num = i + 1;
                    const done = isLevelCompleted(num);
                    const unlocked = isLevelUnlocked(num);
                    let cls = '';
                    let badge = '';
                    if (done) { cls = 'completed'; badge = '<span class="level-badge badge-completed">完了</span>'; }
                    else if (unlocked) { badge = '<span class="level-badge badge-available">挑戦可能</span>'; }
                    else { cls = 'locked'; badge = '<span class="level-badge badge-locked">ロック</span>'; }
                    return `<div class="level-card ${cls}" data-level="${num}">
                        <div class="level-number">${num}</div>
                        <div class="level-info">
                            <h3>${lv.title}</h3>
                            <p>${lv.description}</p>
                        </div>
                        ${badge}
                    </div>`;
                }).join('')}
            </div>
        `;

        app.querySelectorAll('.level-card:not(.locked)').forEach(function (card) {
            card.addEventListener('click', function () {
                const lvNum = parseInt(this.getAttribute('data-level'));
                renderModule(lvNum);
            });
        });
    }

    function renderModule(levelNum) {
        const lv = LEVELS[levelNum - 1];
        app.innerHTML = `
            <button class="back-btn" id="backBtn">&larr; 戻る</button>
            <div class="module-header">
                <h2>Level ${levelNum}: ${lv.title}</h2>
                <p>${lv.description}</p>
            </div>
            <div class="content-card">${lv.content}</div>
            <button class="start-quiz-btn" id="startQuizBtn">クイズに挑戦する（${lv.quiz.length}問）</button>
        `;

        document.getElementById('backBtn').addEventListener('click', function () {
            renderDashboard();
        });

        document.getElementById('startQuizBtn').addEventListener('click', function () {
            startQuiz(levelNum);
        });
    }

    function startQuiz(levelNum) {
        const lv = LEVELS[levelNum - 1];
        const quiz = new Quiz(lv.quiz, levelNum, function (score, total) {
            saveBestScore(levelNum, score);
            if (score >= 2) {
                completeLevel(levelNum);
            }
            renderQuizResult(levelNum, score, total);
        });
        quiz.render(app);
    }

    function renderQuizResult(levelNum, score, total) {
        const passed = score >= 2;
        app.innerHTML = `
            <button class="back-btn" id="backBtn">&larr; ダッシュボードへ</button>
            <div class="quiz-container">
                <div class="quiz-result">
                    <div class="result-icon">${passed ? '&#9733;' : '&#9888;'}</div>
                    <h3>${passed ? '合格おめでとうございます！' : 'もう一度挑戦しましょう'}</h3>
                    <div class="result-score">${score} / ${total}</div>
                    <p>${passed ? '次のレベルが解放されました。' : '合格には3問中2問以上の正解が必要です。'}</p>
                    <div class="btn-group">
                        ${passed && levelNum < 12 ? `<button class="btn-primary" id="nextLevelBtn">次のレベルへ</button>` : ''}
                        <button class="btn-secondary" id="retryBtn">もう一度挑戦</button>
                        <button class="btn-secondary" id="dashBtn">ダッシュボード</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('backBtn').addEventListener('click', renderDashboard);
        document.getElementById('dashBtn').addEventListener('click', renderDashboard);
        document.getElementById('retryBtn').addEventListener('click', function () {
            startQuiz(levelNum);
        });
        var nextBtn = document.getElementById('nextLevelBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                renderModule(levelNum + 1);
            });
        }
    }

    function renderProgress() {
        app.innerHTML = `
            <h3 class="section-title">進捗状況</h3>
            ${LEVELS.map(function (lv, i) {
                const num = i + 1;
                const done = isLevelCompleted(num);
                const best = getBestScore(num);
                return `<div class="progress-card">
                    <div class="progress-level-num ${done ? 'done' : ''}">${num}</div>
                    <div class="progress-info">
                        <h4>${lv.title}</h4>
                        <p>${done ? 'クリア済み - 最高スコア: ' + best + '/3' : '未完了'}</p>
                    </div>
                </div>`;
            }).join('')}
        `;
    }

    // Initial render
    renderDashboard();
})();
