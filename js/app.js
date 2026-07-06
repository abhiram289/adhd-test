/* ==========================================================
   Main App Controller - State Machine & Navigation
   ========================================================== */
(function () {
    window.ADHD = window.ADHD || {};

    const ASSESSMENT_ORDER = [
        'working-memory',
        'attention',
        'task-initiation',
        'planning',
        'granularity-cognitive-load'
    ];

    let currentStep = -1; // -1 = landing, 0-6 = assessments, 7 = results
    let results = {};
    let header = null;
    let main = null;

    function init() {
        header = document.getElementById('app-header');
        main = document.getElementById('main-content');
        
        const existingProfile = window.ADHD.scoring.loadProfile();
        if (existingProfile) {
            // Directly load results if they've already onboarded
            currentStep = ASSESSMENT_ORDER.length;
            renderHeader();
            window.ADHD.profile.render(main, existingProfile);
        } else {
            showLanding();
        }
    }

    function renderHeader() {
        const assessments = window.ADHD.assessments;
        const inAssessment = currentStep >= 0 && currentStep < ASSESSMENT_ORDER.length;

        header.innerHTML = `
            <div class="header-inner">
                <div class="header-left">
                    ${inAssessment
                        ? `<button class="back-btn-round" id="back-btn" type="button" aria-label="Go back">←</button>`
                        : ''}
                    <div class="logo">
                        <div class="logo-icon">🧩</div>
                        <span>ADHD Adaptive Planner</span>
                    </div>
                </div>
                <div class="flex items-center gap-sm">
                    ${inAssessment
                        ? `<span class="text-sm text-muted">Step ${currentStep + 1} of ${ASSESSMENT_ORDER.length}</span>`
                        : ''}
                    ${inAssessment
                        ? `<button class="pause-btn" id="pause-btn" type="button">⏸ Take a break</button>`
                        : ''}
                </div>
            </div>
            ${currentStep >= 0 ? renderStepper() : ''}`;

        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', showPauseOverlay);
        }

        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', prevAssessment);
        }
    }

    function showPauseOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'pause-overlay';
        overlay.id = 'pause-overlay';
        overlay.innerHTML = `
            <div class="pause-card">
                <div class="pause-icon">🌿</div>
                <h3>Take your time</h3>
                <p>Your progress is saved right where you left off. Step away, breathe, stretch - come back whenever you're ready. There's no clock running on this pause.</p>
                <button class="btn btn-primary" id="resume-btn">Resume when ready →</button>
            </div>`;
        document.body.appendChild(overlay);
        const resumeBtn = document.getElementById('resume-btn');
        resumeBtn.addEventListener('click', () => overlay.remove());
        resumeBtn.focus();

        // Allow Escape to resume, same as clicking the button
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') overlay.remove();
        });
    }

    function renderStepper() {
        const assessments = window.ADHD.assessments;
        let html = '<div class="progress-stepper">';

        ASSESSMENT_ORDER.forEach((id, i) => {
            const a = assessments[id];
            let cls = '';
            if (i < currentStep || currentStep >= ASSESSMENT_ORDER.length) cls = 'completed';
            else if (i === currentStep) cls = 'active';

            html += `<div class="step ${cls}">
                <div class="step-dot" title="${a ? a.name : id}">
                    <span class="step-number">${i + 1}</span>
                    <span class="check-icon">✓</span>
                </div>
                ${i < ASSESSMENT_ORDER.length - 1 ? '<div class="step-connector"></div>' : ''}
            </div>`;
        });

        html += '</div>';
        return html;
    }

    function showLanding() {
        currentStep = -1;
        results = {};
        renderHeader();

        const assessments = window.ADHD.assessments;

        main.innerHTML = `
            <div class="landing">
                <div class="landing-icon">🧩</div>
                <h1>ADHD Adaptive <span class="text-gradient">Task Planner</span></h1>
                <p>Six short, interactive check-ins build a profile of how your brain focuses, remembers, and starts tasks - then we use it to shape instructions around your strengths.</p>

                <div class="calm-banner">
                    <span>💬</span>
                    <span><strong>Before you start:</strong> there are no right or wrong answers, nothing is being graded against anyone else, and you can pause at any point - a "Take a break" button stays visible the whole way through.</span>
                </div>

                <div class="landing-features">
                    ${ASSESSMENT_ORDER.map(id => {
                        const a = assessments[id];
                        return a ? `<div class="feature-chip"><span>${a.icon}</span><span>${a.shortName || a.name}</span></div>` : '';
                    }).join('')}
                </div>

                <div class="landing-meta">
                    <span>⏱ ~12-18 minutes, pause anytime</span>
                    <span>📊 6 short check-ins</span>
                    <span>🔒 Responses are saved anonymously</span>
                </div>

                <button class="btn btn-primary btn-lg" id="start-assessment-btn">
                    Begin Assessment →
                </button>

                ${renderPreviousProfile()}
            </div>`;

        document.getElementById('start-assessment-btn').addEventListener('click', () => {
            nextAssessment();
        });

        const viewPrevBtn = document.getElementById('view-prev-profile');
        if (viewPrevBtn) {
            viewPrevBtn.addEventListener('click', () => {
                const profileData = window.ADHD.scoring.loadProfile();
                if (profileData) {
                    currentStep = ASSESSMENT_ORDER.length;
                    renderHeader();
                    window.ADHD.profile.render(main, profileData);
                }
            });
        }
    }

    function renderPreviousProfile() {
        const prev = window.ADHD.scoring.loadProfile();
        if (!prev) return '';

        const date = new Date(prev.timestamp);
        const dateStr = date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

        return `
            <div class="assessment-card" style="margin-top:var(--space-xl);max-width:500px;width:100%;text-align:left">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">
                    <h4 style="font-size:0.9rem">Previous Profile</h4>
                    <span class="text-xs text-muted">${dateStr}</span>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-bottom:var(--space-md)">
                    ${Object.entries(prev.profile).map(([key, val]) => {
                        const info = window.ADHD.scoring.getDimensionInfo(key);
                        return `<span class="wm-tag" style="font-size:0.75rem">${info.icon} ${val}</span>`;
                    }).join('')}
                </div>
                <button class="btn btn-secondary btn-sm w-full" id="view-prev-profile">View Full Profile</button>
            </div>`;
    }

    function prevAssessment() {
        // Going back re-starts that step fresh, so check first -
        // losing typed answers unexpectedly is its own kind of stressor.
        const confirmed = window.confirm(
            currentStep === 0
                ? 'Go back to the start? Your answers on this step will be cleared.'
                : "Go back to the previous check-in? You'll redo it - your answer here will be cleared."
        );
        if (!confirmed) return;

        currentStep--;

        if (currentStep < 0) {
            showLanding();
            return;
        }

        renderHeader();

        const assessmentId = ASSESSMENT_ORDER[currentStep];
        const assessment = window.ADHD.assessments[assessmentId];
        delete results[assessmentId];

        main.innerHTML = '';
        main.className = '';

        assessment.init(main, (result) => {
            results[assessmentId] = result;
            showTransition(assessment, result);
        });
    }

    function nextAssessment() {
        currentStep++;

        if (currentStep >= ASSESSMENT_ORDER.length) {
            showResults();
            return;
        }

        renderHeader();

        const assessmentId = ASSESSMENT_ORDER[currentStep];
        const assessment = window.ADHD.assessments[assessmentId];

        if (!assessment) {
            console.error('Assessment not found:', assessmentId);
            nextAssessment();
            return;
        }

        // Clear and initialize
        main.innerHTML = '';
        main.className = '';

        // Smooth transition
        main.style.opacity = '0';
        main.style.transform = 'translateY(16px)';

        requestAnimationFrame(() => {
            main.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        });

        assessment.init(main, (result) => {
            results[assessmentId] = result;
            showTransition(assessment, result);
        });
    }

    function showTransition(assessment, result) {
        const isLast = currentStep >= ASSESSMENT_ORDER.length - 1;

        // Numeric scores are withheld here on purpose - a raw number
        // between assessments invites comparison/self-judgment mid-flow.
        // Full, contextualized results live on the final profile page.
        main.innerHTML = `
            <div class="transition-screen">
                <div style="font-size:2.5rem;margin-bottom:var(--space-md)">${assessment.icon}</div>
                <h3>${assessment.name} - done ✓</h3>
                <p style="max-width:360px;margin-top:var(--space-md)">${getTransitionMessage()}</p>

                ${!isLast ? `
                    <div class="mt-lg text-sm text-muted">
                        Next up: ${window.ADHD.assessments[ASSESSMENT_ORDER[currentStep + 1]]?.icon || ''} 
                        ${window.ADHD.assessments[ASSESSMENT_ORDER[currentStep + 1]]?.name || ''}
                        &nbsp;·&nbsp;${ASSESSMENT_ORDER.length - currentStep - 1} to go
                    </div>
                ` : ''}

                <div class="assessment-footer">
                    <button class="btn btn-ghost" id="transition-redo-btn">↺ Redo this one</button>
                    <button class="btn btn-primary btn-lg" id="transition-next-btn">
                        ${isLast ? '📊 View Your Profile' : 'Next Assessment →'}
                    </button>
                </div>
            </div>`;

        document.getElementById('transition-next-btn').addEventListener('click', nextAssessment);
        document.getElementById('transition-next-btn').focus();
        document.getElementById('transition-redo-btn').addEventListener('click', redoCurrentAssessment);
    }

    function redoCurrentAssessment() {
        const assessmentId = ASSESSMENT_ORDER[currentStep];
        const assessment = window.ADHD.assessments[assessmentId];
        delete results[assessmentId];

        renderHeader();
        main.innerHTML = '';
        main.className = '';

        assessment.init(main, (result) => {
            results[assessmentId] = result;
            showTransition(assessment, result);
        });
    }

    function getTransitionMessage() {
        const messages = [
            'Nice - that\'s one more piece of the picture.',
            'Captured. On to the next one whenever you\'re ready.',
            'Good. Every check-in adds detail, not a grade.',
            'That\'s in. No need to overthink it, keep going.'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function showResults() {
        currentStep = ASSESSMENT_ORDER.length;
        renderHeader();

        const profileData = window.ADHD.scoring.buildProfile(results);
        window.ADHD.scoring.saveProfile(profileData);
        window.ADHD.profile.render(main, profileData);
    }

    // Public API
    window.ADHD.app = {
        init,
        restart() {
            results = {};
            currentStep = -1;
            showLanding();
        },
        getCurrentStep() { return currentStep; },
        getResults() { return results; }
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
