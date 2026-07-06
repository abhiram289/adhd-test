/* ==========================================================
   Profile Display, Radar Chart & Adaptive Task Generator
   ========================================================== */
(function () {
    window.ADHD = window.ADHD || {};

    const TASK_TEMPLATES = {
        'clean bedroom': {
            low: [
                { title: 'Clear floor clutter', desc: 'Sort items on the floor and put them away.' },
                { title: 'Wipe surfaces', desc: 'Dust and wipe down your desk and shelves.' },
                { title: 'Make bed and vacuum', desc: 'Tidy your bed sheets and vacuum the carpet.' }
            ],
            medium: [
                { title: 'Sort clothes', desc: 'Gather dirty clothes and place them in the laundry hamper.' },
                { title: 'Clear trash and dishes', desc: 'Throw wrappers in the bin and return cups to the kitchen.' },
                { title: 'Organize desk', desc: 'Clear off books, papers, and laptop from your desk.' },
                { title: 'Make the bed', desc: 'Pull up the sheets, fluff pillows, and lay comforter flat.' },
                { title: 'Vacuum the floor', desc: 'Run the vacuum cleaner over the entire carpeted area.' }
            ],
            high: [
                { title: 'Pick up floor clothes', desc: 'Gather all dirty clothes from the floor and drop them in the hamper.' },
                { title: 'Put away clean clothes', desc: 'Hang shirts in the closet and put socks/underwear in their drawers.' },
                { title: 'Empty the trash', desc: 'Collect all wrappers, papers, and trash and put them in the trash bin.' },
                { title: 'Remove dishes', desc: 'Take any cups, mugs, plates, or cutlery back to the kitchen sink.' },
                { title: 'Wipe down the desk', desc: 'Move everything off your desk surface and wipe it down with cleaner.' },
                { title: 'Organize papers/books', desc: 'Stack loose books in the corner and place pens back in their holders.' },
                { title: 'Make the bed sheets', desc: 'Pull the fitted sheet tight, lay the flat sheet, and adjust the comforter.' },
                { title: 'Vacuum the corners', desc: 'Vacuum the floor, moving chairs out of the way to reach under the desk.' }
            ]
        },
        'research report': {
            low: [
                { title: 'Gather references', desc: 'Search for articles and save relevant reference links.' },
                { title: 'Create report outline', desc: 'Write down a bulleted outline for each major section.' },
                { title: 'Draft and review', desc: 'Write the introduction, body paragraphs, and proofread.' }
            ],
            medium: [
                { title: 'Search credible articles', desc: 'Find 3 credible source articles or papers on the topic.' },
                { title: 'Create structured outline', desc: 'Outline sections for Intro, 3 Body points, and Conclusion.' },
                { title: 'Draft intro and thesis', desc: 'Write your introduction and 1-sentence main thesis.' },
                { title: 'Draft body points', desc: 'Write 3 paragraphs supporting your thesis with sources.' },
                { title: 'Proofread and cite', desc: 'Check spelling and add your source bibliography links.' }
            ],
            high: [
                { title: 'Open search engine', desc: 'Open your browser and navigate to Google Scholar or your library database.' },
                { title: 'Save source links', desc: 'Search terms, select 3 articles, and copy their citation links to a document.' },
                { title: 'Draft outline bullet points', desc: 'Write a quick list containing 3 supporting points you plan to make.' },
                { title: 'Write introduction', desc: 'Write your opening paragraph including your core thesis statement.' },
                { title: 'Write body point 1', desc: 'Draft the first body section, incorporating evidence from source 1.' },
                { title: 'Write body point 2', desc: 'Draft the second body section, incorporating evidence from source 2.' },
                { title: 'Write body point 3', desc: 'Draft the third body section, incorporating evidence from source 3.' },
                { title: 'Run a spelling check', desc: 'Activate spellcheck, correct typos, and verify proper section headings.' },
                { title: 'Format bibliography', desc: 'Format your 3 source links at the bottom under references.' }
            ]
        },
        'pay bills': {
            low: [
                { title: 'Collect all bills', desc: 'Locate paper bills and online billing statements.' },
                { title: 'Pay bills online', desc: 'Log in to your bank and process the outstanding payments.' },
                { title: 'Record confirmations', desc: 'Note down payment dates and save confirmation numbers.' }
            ],
            medium: [
                { title: 'Gather bills', desc: 'Collect paper mail bills and search inbox for email invoices.' },
                { title: 'Log in to bank portal', desc: 'Open your bank account dashboard in your browser.' },
                { title: 'Pay utility bills', desc: 'Use bill pay to send money to electricity and water services.' },
                { title: 'Pay credit card bills', desc: 'Submit at least the minimum amount due on your credit card.' },
                { title: 'File confirmation', desc: 'Log the payment amounts and dates in your budget sheet.' }
            ],
            high: [
                { title: 'Collect paper & e-mail bills', desc: 'Stack paper envelopes on your desk and search email for "statement".' },
                { title: 'Log in securely', desc: 'Log in to your primary online bank account securely.' },
                { title: 'Pay electric bill online', desc: 'Navigate to your electric account provider, enter details, and pay.' },
                { title: 'Pay water bill online', desc: 'Navigate to your water provider portal and submit payment.' },
                { title: 'Pay credit card statement', desc: 'Log in to your credit card bank and pay statement or minimum balance.' },
                { title: 'Note confirmation codes', desc: 'Copy payment confirmations and write "PAID [Date]" on paper bills.' },
                { title: 'Organize paid documents', desc: 'File the paid invoices into a cabinet folder or recycle envelopes.' }
            ]
        },
        'morning routine': {
            low: [
                { title: 'Wake up and wash up', desc: 'Stretch, get out of bed, wash face, and brush teeth.' },
                { title: 'Dressed and fed', desc: 'Change into clothes and eat a quick breakfast.' },
                { title: 'Bag check and leave', desc: 'Grab keys/wallet and lock the front door.' }
            ],
            medium: [
                { title: 'Drink water and stretch', desc: 'Get out of bed, stretch, and drink a glass of water.' },
                { title: 'Brush teeth & wash face', desc: 'Brush teeth for 2 minutes and splash cold water on face.' },
                { title: 'Get dressed', desc: 'Change into clean clothes selected the night before.' },
                { title: 'Eat breakfast', desc: 'Eat cereal, toast, or fruit and take daily vitamins.' },
                { title: 'Grab bag and keys', desc: 'Check that you have keys, wallet, and phone, then lock up.' }
            ],
            high: [
                { title: 'Turn off alarm', desc: 'Turn off your morning alarm buzzer and sit up straight in bed.' },
                { title: 'Drink water', desc: 'Drink a full glass of fresh water placed on your bedside table.' },
                { title: 'Brush teeth', desc: 'Squeeze toothpaste on brush and brush all surfaces for 2 minutes.' },
                { title: 'Wash face & shower', desc: 'Splash cold water on your face and take a quick warm shower.' },
                { title: 'Select clean clothes', desc: 'Pick out clean underwear, socks, shirt, and pants, and put them on.' },
                { title: 'Eat breakfast cereal', desc: 'Pour a bowl of cereal or toast bread, and eat at the kitchen table.' },
                { title: 'Take vitamins', desc: 'Take any morning vitamins or supplements with a glass of juice.' },
                { title: 'Tidy kitchen counter', desc: 'Rinse your bowl/plate and place it neatly inside the kitchen sink.' },
                { title: 'Check pockets', desc: 'Put your phone, keys, and wallet in your pocket or backpack.' },
                { title: 'Lock front door', desc: 'Walk outside and lock the front door handle securely.' }
            ]
        }
    };

    window.ADHD.profile = {
        /**
         * Render the full profile results page.
         */
        render(container, profileData) {
            const { profile, details, timestamp, traits } = profileData;
            const scoring = window.ADHD.scoring;

            const dimensionKeys = [
                'attention_score',
                'working_memory_score',
                'task_initiation_score',
                'planning_score',
                'granularity_preference_score',
                'cognitive_load_tolerance_score'
            ];

            const date = new Date(timestamp);
            const dateStr = date.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const classification = profileData.classification || window.ADHD.scoring.classifyProfile(profile);

            container.innerHTML = `
                <div class="profile-container">
                    <div class="profile-hero">
                        <div style="font-size:3rem;margin-bottom:var(--space-md)">📊</div>
                        <h1>Your <span class="text-gradient">Cognitive Profile</span></h1>
                        <p>Assessment completed on ${dateStr}</p>
                    </div>

                    <div class="radar-chart-container">
                        <canvas id="radar-chart" width="420" height="420"></canvas>
                    </div>

                    <div class="classification-card" style="background: var(--bg-card); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl); text-align: left; max-width: 800px; margin-left: auto; margin-right: auto; box-shadow: var(--shadow-glow);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm)">
                            <div>
                                <span class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.05em">ADHD Executive Function Profile</span>
                                <h2 style="color: var(--accent); margin-top: 4px; font-size: 1.65rem">${classification.classification}</h2>
                            </div>
                            <span class="wm-tag" style="background: ${classification.severity === 'Significant' ? 'var(--amber-dim)' : classification.severity === 'Moderate' ? 'var(--amber-dim)' : 'var(--success-dim)'}; color: ${classification.severity === 'Significant' ? 'var(--amber)' : classification.severity === 'Moderate' ? 'var(--amber)' : 'var(--success)'}; border-color: transparent; font-size: 0.8rem; padding: 6px 14px; border-radius: var(--radius-full); font-weight: 600">
                                Support level: ${classification.severity}
                            </span>
                        </div>
                        <p style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: var(--space-lg); line-height: 1.7">${classification.description}</p>
                        
                        <div class="classification-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-lg)">
                            <div style="background: rgba(255,255,255,0.02); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border)">
                                <h4 style="color: var(--success); font-size: 0.9rem; margin-bottom: var(--space-sm); display: flex; align-items: center; gap: 6px">💪 What comes naturally</h4>
                                <ul style="padding-left: 18px; margin: 0; font-size: 0.85rem; color: var(--text-secondary)">
                                    ${classification.strengths.map(s => `<li style="margin-bottom:4px">${s}</li>`).join('')}
                                </ul>
                            </div>
                            <div style="background: rgba(255,255,255,0.02); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border)">
                                <h4 style="color: var(--amber); font-size: 0.9rem; margin-bottom: var(--space-sm); display: flex; align-items: center; gap: 6px">🌱 Where extra support helps</h4>
                                <ul style="padding-left: 18px; margin: 0; font-size: 0.85rem; color: var(--text-secondary)">
                                    ${classification.challenges.map(c => `<li style="margin-bottom:4px">${c}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div style="background: var(--accent-dim); border: 1px dashed var(--border-accent); padding: var(--space-md); border-radius: var(--radius-md); font-size: 0.9rem; color: var(--text-primary); line-height: 1.6">
                            <strong>💡 Adaptive Recommendation:</strong> ${classification.advice}
                        </div>
                    </div>

                    <div class="score-cards" id="score-cards"></div>

                    <div class="form-copy-banner">
                        <div>
                            <strong>Submitting this somewhere?</strong>
                            <p class="text-sm text-muted" style="margin-top:2px">Copy a plain-text summary of your results below and paste it into the form you were given.</p>
                        </div>
                        <button class="btn btn-primary" id="copy-summary-btn">📋 Copy My Results</button>
                    </div>

                    <details class="traits-card" style="background: var(--bg-card); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: var(--space-lg) var(--space-xl); margin-bottom: var(--space-xl); text-align: left; max-width: 800px; margin-left: auto; margin-right: auto;">
                        <summary style="cursor:pointer; color:var(--accent); font-weight:700; display:flex; align-items:center; gap:8px; list-style:none">🧠 See the details behind these scores</summary>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: var(--space-sm); margin-top: var(--space-md)">
                            ${Object.entries(traits || {}).map(([key, val]) => {
                                if (val === false || val === 999) return '';
                                let label = key.replace(/_/g, ' ');
                                label = label.charAt(0).toUpperCase() + label.slice(1);
                                let icon = '⚙️';
                                if (key.includes('focus') || key.includes('attention')) icon = '🎯';
                                else if (key.includes('memory') || key.includes('remind') || key.includes('written') || key.includes('chunk')) icon = '🧠';
                                else if (key.includes('starting') || key.includes('initiation') || key.includes('latency') || key.includes('procrastination') || key.includes('paralysis') || key.includes('nudge')) icon = '🚀';
                                else if (key.includes('planning') || key.includes('dependency') || key.includes('sequence')) icon = '📋';
                                else if (key.includes('granularity')) icon = '🔬';
                                else if (key.includes('complexity') || key.includes('overload') || key.includes('load')) icon = '⚡';
                                
                                let valText = val === true ? 'Active' : `Value: ${val}`;
                                return `
                                    <div style="background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.04); border-radius:var(--radius-md); padding:var(--space-sm) var(--space-md); display:flex; align-items:center; gap:8px">
                                        <span style="font-size:1.15rem">${icon}</span>
                                        <div>
                                            <div style="font-weight:600; font-size:0.85rem; color:var(--text-primary); line-height:1.2">${label}</div>
                                            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px">${valText}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </details>

                    <div class="planner-section" id="task-planner-root"></div>

                    <details class="profile-json">
                        <summary class="profile-json-header" style="cursor:pointer; list-style:none">
                            <h4 style="display:inline">📋 Raw Profile JSON (for developers)</h4>
                        </summary>
                        <div style="display:flex; justify-content:flex-end; margin: var(--space-sm) 0">
                            <button class="btn btn-ghost btn-sm" id="copy-json-btn">Copy JSON</button>
                        </div>
                        <pre id="profile-json-output"></pre>
                    </details>

                    <div class="submit-results-banner">
                        <div>
                            <h4 style="margin-bottom:4px">📤 Send us your results</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0">One click copies your results and opens the submission form - just paste and hit submit.</p>
                        </div>
                        <button class="btn btn-primary btn-lg" id="submit-results-btn">Copy &amp; Open Form</button>
                    </div>

                    <div class="profile-actions">
                        <button class="btn btn-secondary btn-lg" id="download-json-btn">⬇ Download Profile</button>
                        <button class="btn btn-secondary btn-lg" id="retake-btn">↻ Retake Assessment</button>
                    </div>
                </div>`;

            // Render score cards
            const cardsContainer = document.getElementById('score-cards');
            dimensionKeys.forEach(key => {
                const info = scoring.getDimensionInfo(key);
                const score = profile[key] || 0;
                const level = scoring.getScoreLevel(key === 'granularity_preference_score' ? 50 : score);
                const isGranularity = key === 'granularity_preference_score';
                const barClass = isGranularity ? 'medium' : level.cssClass;
                const descText = score >= 50 ? info.highText : info.lowText;

                const card = document.createElement('div');
                card.className = 'score-card';
                card.innerHTML = `
                    <div class="score-card-header">
                        <span class="score-card-icon">${info.icon}</span>
                        <span class="score-card-title">${info.name}</span>
                    </div>
                    <div class="score-card-value" style="color:${isGranularity ? 'var(--accent)' : level.color}">${score}</div>
                    <div class="score-bar-track">
                        <div class="score-bar-fill ${barClass}" data-score="${score}"></div>
                    </div>
                    <p class="score-card-desc">${descText}</p>`;
                cardsContainer.appendChild(card);
            });

            // Animate score bars
            requestAnimationFrame(() => {
                setTimeout(() => {
                    document.querySelectorAll('.score-bar-fill').forEach(bar => {
                        bar.style.width = bar.dataset.score + '%';
                    });
                }, 100);
            });

            // Render JSON
            const jsonOutput = document.getElementById('profile-json-output');
            jsonOutput.textContent = JSON.stringify(profile, null, 2);

            // Draw radar chart
            this.drawRadarChart(
                document.getElementById('radar-chart'),
                dimensionKeys.map(k => profile[k] || 0),
                dimensionKeys.map(k => scoring.getDimensionInfo(k).name)
            );

            // Render Task Planner
            this.renderPlanner(document.getElementById('task-planner-root'), profileData);

            // Copy plain-text summary (for pasting into a Google Form, email, etc.)
            document.getElementById('copy-summary-btn').addEventListener('click', () => {
                const lines = [];
                lines.push(`ADHD Adaptive Planner - Results`);
                lines.push(`Completed: ${dateStr}`);
                lines.push(`Classification: ${classification.classification}`);
                lines.push(`Support level: ${classification.severity}`);
                lines.push('');
                lines.push('Scores (0-100):');
                dimensionKeys.forEach(key => {
                    const info = scoring.getDimensionInfo(key);
                    const score = profile[key] || 0;
                    lines.push(`- ${info.name}: ${score}`);
                });
                lines.push('');
                lines.push('What comes naturally:');
                classification.strengths.forEach(s => lines.push(`- ${s}`));
                lines.push('');
                lines.push('Where extra support helps:');
                classification.challenges.forEach(c => lines.push(`- ${c}`));
                const summaryText = lines.join('\n');

                const btn = document.getElementById('copy-summary-btn');
                const resetLabel = () => setTimeout(() => btn.textContent = '📋 Copy My Results', 2000);

                navigator.clipboard.writeText(summaryText).then(() => {
                    btn.textContent = '✓ Copied - now paste it into the form';
                    resetLabel();
                }).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = summaryText;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    btn.textContent = '✓ Copied - now paste it into the form';
                    resetLabel();
                });
            });

            // Submit results (Google Form fallback) - copies the profile JSON
            // to the clipboard, then opens the submission form ready to paste into
            document.getElementById('submit-results-btn').addEventListener('click', () => {
                const GOOGLE_FORM_URL = 'https://forms.gle/TWbKfefAhw7teB4B9';
                const jsonText = JSON.stringify(profile, null, 2);
                const btn = document.getElementById('submit-results-btn');
                const resetLabel = () => setTimeout(() => btn.textContent = 'Copy & Open Form', 2500);

                const openForm = () => {
                    btn.textContent = '✓ Copied - paste it in the tab that opened';
                    window.open(GOOGLE_FORM_URL, '_blank', 'noopener');
                    resetLabel();
                };

                navigator.clipboard.writeText(jsonText).then(openForm).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = jsonText;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    openForm();
                });
            });

            // Copy JSON
            document.getElementById('copy-json-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(JSON.stringify(profile, null, 2)).then(() => {
                    const btn = document.getElementById('copy-json-btn');
                    btn.textContent = '✓ Copied!';
                    setTimeout(() => btn.textContent = 'Copy JSON', 2000);
                }).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = JSON.stringify(profile, null, 2);
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    const btn = document.getElementById('copy-json-btn');
                    btn.textContent = '✓ Copied!';
                    setTimeout(() => btn.textContent = 'Copy JSON', 2000);
                });
            });

            // Download JSON
            document.getElementById('download-json-btn').addEventListener('click', () => {
                const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `adhd-profile-${date.toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });

            // Retake
            document.getElementById('retake-btn').addEventListener('click', () => {
                if (confirm('Start a new assessment? Your current results are saved.')) {
                    // Clear profile to allow starting fresh
                    localStorage.removeItem('adhd_profile');
                    localStorage.removeItem('adhd_raw_assessment_data');
                    window.ADHD.app.restart();
                }
            });
        },

        /**
         * Render the Adaptive Task Planner panel.
         */
        renderPlanner(el, profileData) {
            el.innerHTML = `
                <h2>🚀 ADHD Adaptive <span class="text-gradient">Task Planner</span></h2>
                <p>Input any task or pick a preset template to see a checklist tailored to your cognitive strengths.</p>
                <div class="planner-card">
                    <div style="margin-bottom: var(--space-md)">
                        <label for="planner-task-input" style="display: block; font-weight: 600; margin-bottom: var(--space-xs)">Describe your task:</label>
                        <div style="display: flex; gap: var(--space-sm)">
                            <input type="text" class="input-field" id="planner-task-input" placeholder="e.g. Prepare dinner, Clean bedroom..." style="flex: 1">
                            <button class="btn btn-primary" id="planner-generate-btn">Generate</button>
                        </div>
                    </div>
                    <div>
                        <span class="text-xs text-muted" style="display: block; margin-bottom: 4px">Presets:</span>
                        <div class="template-chips" id="planner-preset-chips">
                            <button class="template-chip" data-task="clean bedroom">🧹 Clean Bedroom</button>
                            <button class="template-chip" data-task="research report">📝 Research Report</button>
                            <button class="template-chip" data-task="pay bills">✉️ Pay Bills</button>
                            <button class="template-chip" data-task="morning routine">⏰ Morning Routine</button>
                        </div>
                    </div>
                    
                    <div id="planner-output" style="margin-top: var(--space-lg)"></div>
                </div>`;

            const input = el.querySelector('#planner-task-input');
            const genBtn = el.querySelector('#planner-generate-btn');
            const outputArea = el.querySelector('#planner-output');
            const presetChips = el.querySelectorAll('.template-chip');

            genBtn.addEventListener('click', () => {
                const text = input.value.trim();
                if (text) {
                    // Deselect active chips
                    presetChips.forEach(c => c.classList.remove('active'));
                    this.generateTask(text, profileData, outputArea);
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') genBtn.click();
            });

            presetChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    presetChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    const taskKey = chip.dataset.task;
                    input.value = chip.textContent.slice(3); // Remove emoji
                    this.generateTask(taskKey, profileData, outputArea, true);
                });
            });
        },

        /**
         * Generate adaptive checklist steps and support cards.
         */
        generateTask(taskName, profileData, outputEl, isTemplate = false) {
            const cleanKey = taskName.toLowerCase().trim();
            const profile = profileData.profile || {};
            const traits = profileData.traits || {};

            // 1. Determine Granularity level
            let granularityLevel = 'medium';
            if (traits.prefers_high_granularity) granularityLevel = 'high';
            else if (traits.prefers_low_granularity) granularityLevel = 'low';

            // 2. Fetch steps
            let steps = [];
            if (isTemplate && TASK_TEMPLATES[cleanKey]) {
                steps = TASK_TEMPLATES[cleanKey][granularityLevel].map(s => ({ ...s }));
            } else {
                // Custom task parser
                const baseName = isTemplate ? taskName : taskName;
                if (granularityLevel === 'low') {
                    steps = [
                        { title: `Prepare for ${baseName}`, desc: 'Collect any initial files, tools, or items needed to begin.' },
                        { title: `Execute ${baseName}`, desc: 'Perform the core task actions or write-ups.' },
                        { title: `Finalize and tidy up`, desc: 'Review your work and clear your workspace.' }
                    ];
                } else if (granularityLevel === 'medium') {
                    steps = [
                        { title: `Clear workspace for ${baseName}`, desc: 'Create a quiet, clear space to execute your task.' },
                        { title: `Gather initial tools`, desc: 'Assemble links, papers, or physical items required.' },
                        { title: `Perform core action steps`, desc: 'Dive into the primary tasks of the activity.' },
                        { title: `Review output`, desc: 'Confirm everything is accurate and completed correctly.' },
                        { title: `Clean up workspace`, desc: 'Put tools away and log the task as finished.' }
                    ];
                } else {
                    steps = [
                        { title: `Set workspace`, desc: 'Clear physical desk or close unneeded tabs on laptop.' },
                        { title: `Gather items/reference`, desc: 'Acquire all folders, items, or logins for the activity.' },
                        { title: `Define first specific sub-step`, desc: `Outline the exact first physical item to do for ${baseName}.` },
                        { title: `Execute step 1 of task`, desc: 'Complete the initial core segment.' },
                        { title: `Take a 2-minute stretch`, desc: 'Roll shoulders, stretch legs, and refresh attention.' },
                        { title: `Complete remainder of task`, desc: 'Finish the remaining core operations.' },
                        { title: `Verify accuracy`, desc: 'Carefully scan for spelling, detail mistakes, or missing pieces.' },
                        { title: `Restore workspace`, desc: 'Put away supplies and close tabs to reset your space.' }
                    ];
                }
            }

            // 3. Inject planning phase grouping if phase grouping trait is active
            const usePhases = traits.needs_phase_grouping;
            
            // 4. Inject planning dependency markers if highlight dependencies trait is active
            if (traits.highlight_dependencies && steps.length > 2) {
                steps.forEach((step, idx) => {
                    if (idx > 0) {
                        step.desc += ` (⚠️ *Prerequisite: Complete step ${idx} first.*)`;
                    }
                });
            }

            // 5. Render Generator Output
            outputEl.innerHTML = `
                <div style="border-top: 1px dashed var(--border); padding-top: var(--space-lg); margin-top: var(--space-md)">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-md)">
                        <h3 style="color:var(--accent); font-weight:700">📋 Adapted Checklist</h3>
                        <span class="text-xs wm-tag">Granularity: ${granularityLevel.toUpperCase()}</span>
                    </div>
                    
                    <div id="planner-support-banners"></div>
                    <div id="planner-checklist-area"></div>
                </div>`;

            const bannerArea = outputEl.querySelector('#planner-support-banners');
            const checklistArea = outputEl.querySelector('#planner-checklist-area');

            // Support Banner - Attention
            if (traits.needs_focus_anchors) {
                const banner = document.createElement('div');
                banner.className = 'support-banner attention';
                banner.innerHTML = `<span>🎯</span><span><strong>Focus Anchor:</strong> Put your phone in silent mode, close extra browser tabs, and set a 15-minute timer before starting to lock in focus.</span>`;
                bannerArea.appendChild(banner);
            }

            // Support Banner - Task Initiation
            if (traits.highlight_first_step) {
                const banner = document.createElement('div');
                banner.className = 'support-banner initiation';
                banner.innerHTML = `<span>🚀</span><span><strong>Momentum Booster:</strong> Task initiation might feel hard right now. We highlighted the first step below. Simply complete that single step to start!</span>`;
                bannerArea.appendChild(banner);
            }

            // Support Banner - Planning
            if (traits.pre_sequenced_templates) {
                const banner = document.createElement('div');
                banner.className = 'support-banner planning';
                banner.innerHTML = `<span>📋</span><span><strong>Sequence Helper:</strong> We highlighted dependencies. Complete steps in the numbered order to avoid getting stuck!</span>`;
                bannerArea.appendChild(banner);
            }

            let wmFocusModeActive = false;
            let currentFocusStepIdx = 0;

            const renderChecklist = () => {
                checklistArea.innerHTML = '';

                // Working Memory Support - Focus Mode Toggle
                if (traits.max_visible_steps !== 999) {
                    const focusControls = document.createElement('div');
                    focusControls.style.marginBottom = 'var(--space-md)';
                    focusControls.innerHTML = `
                        <button class="btn btn-secondary btn-sm" id="wm-focus-toggle">
                            ${wmFocusModeActive ? '📊 Show Full List' : '🔍 Focus Mode (Single-Step)'}
                        </button>`;
                    checklistArea.appendChild(focusControls);

                    focusControls.querySelector('#wm-focus-toggle').addEventListener('click', () => {
                        wmFocusModeActive = !wmFocusModeActive;
                        renderChecklist();
                    });
                }

                if (wmFocusModeActive && traits.max_visible_steps !== 999) {
                    // Single Step focus view
                    const step = steps[currentFocusStepIdx];
                    const isInitiationHighlight = traits.highlight_first_step && currentFocusStepIdx === 0;
                    
                    const focusContainer = document.createElement('div');
                    focusContainer.className = 'wm-focus-mode';
                    
                    let highlightBorder = '';
                    if (isInitiationHighlight) {
                        highlightBorder = 'border-color: var(--amber)';
                    }
                    
                    focusContainer.style = highlightBorder;
                    focusContainer.innerHTML = `
                        <div class="text-xs text-muted">STEP ${currentFocusStepIdx + 1} OF ${steps.length}</div>
                        ${isInitiationHighlight ? '<span class="wm-tag" style="background:var(--amber-dim);color:var(--amber);margin: var(--space-sm) 0">🚀 FIRST ACTION</span>' : ''}
                        <div class="wm-focus-text">${step.title}</div>
                        <p class="step-desc" style="font-size:1rem; margin-bottom: var(--space-lg)">${step.desc}</p>
                        
                        <div style="display:flex; justify-content:center; gap:var(--space-md); align-items:center">
                            <button class="btn btn-ghost" id="focus-prev-btn" ${currentFocusStepIdx === 0 ? 'disabled' : ''}>← Previous</button>
                            <label style="display:flex;align-items:center;gap:var(--space-sm);cursor:pointer;background:var(--bg-base);padding:var(--space-sm) var(--space-md);border-radius:var(--radius-md);border:1px solid var(--border)">
                                <input type="checkbox" class="step-checkbox" id="focus-checkbox" ${step.completed ? 'checked' : ''}>
                                <span style="font-weight:500">${step.completed ? 'Completed!' : 'Mark Completed'}</span>
                            </label>
                            <button class="btn btn-ghost" id="focus-next-btn" ${currentFocusStepIdx === steps.length - 1 ? 'disabled' : ''}>Next →</button>
                        </div>
                        
                        <div class="score-bar-track" style="margin-top:var(--space-xl);height:6px">
                            <div class="score-bar-fill medium" style="width:${((currentFocusStepIdx + 1) / steps.length) * 100}%"></div>
                        </div>`;

                    checklistArea.appendChild(focusContainer);

                    // Handlers
                    focusContainer.querySelector('#focus-checkbox').addEventListener('change', (e) => {
                        step.completed = e.target.checked;
                    });
                    focusContainer.querySelector('#focus-prev-btn').addEventListener('click', () => {
                        if (currentFocusStepIdx > 0) {
                            currentFocusStepIdx--;
                            renderChecklist();
                        }
                    });
                    focusContainer.querySelector('#focus-next-btn').addEventListener('click', () => {
                        if (currentFocusStepIdx < steps.length - 1) {
                            currentFocusStepIdx++;
                            renderChecklist();
                        }
                    });
                } else {
                    // Full checklist view (normal / chunked by phases)
                    const listContainer = document.createElement('div');
                    listContainer.className = 'step-list';

                    let lastPhase = '';

                    steps.forEach((step, idx) => {
                        // Chunking logic for low cognitive load tolerance
                        if (usePhases) {
                            let currentPhase = '';
                            if (idx < Math.ceil(steps.length / 3)) {
                                currentPhase = 'Phase 1: Setup & Prepare';
                            } else if (idx < Math.ceil(steps.length * 2 / 3)) {
                                currentPhase = 'Phase 2: Core Action';
                            } else {
                                currentPhase = 'Phase 3: Finalize & Reset';
                            }

                            if (currentPhase !== lastPhase) {
                                const header = document.createElement('div');
                                header.className = 'phase-header';
                                header.textContent = currentPhase;
                                listContainer.appendChild(header);
                                lastPhase = currentPhase;
                            }
                        }

                        const card = document.createElement('div');
                        const isFirstStepHighlight = traits.highlight_first_step && idx === 0;
                        card.className = `step-card ${step.completed ? 'completed' : ''} ${isFirstStepHighlight ? 'highlight' : ''}`;
                        
                        card.innerHTML = `
                            <input type="checkbox" class="step-checkbox" data-index="${idx}" ${step.completed ? 'checked' : ''}>
                            <div class="step-content">
                                <div class="step-title">
                                    ${isFirstStepHighlight ? '<span class="wm-tag" style="background:var(--amber-dim);color:var(--amber);font-size:0.75rem;padding:2px 6px;margin-right:var(--space-sm)">🚀 FAST START</span>' : ''}
                                    ${idx + 1}. ${step.title}
                                </div>
                                <div class="step-desc">${step.desc}</div>
                            </div>`;
                        
                        listContainer.appendChild(card);
                    });

                    checklistArea.appendChild(listContainer);

                    // Add checklist handlers
                    listContainer.querySelectorAll('.step-checkbox').forEach(cb => {
                        cb.addEventListener('change', (e) => {
                            const idx = parseInt(cb.dataset.index);
                            steps[idx].completed = e.target.checked;
                            const card = cb.closest('.step-card');
                            if (e.target.checked) {
                                card.classList.add('completed');
                            } else {
                                card.classList.remove('completed');
                            }
                        });
                    });
                }
            };

            renderChecklist();
        },

        /**
         * Draw a radar / spider chart on a canvas.
         */
        drawRadarChart(canvas, values, labels) {
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const maxRadius = Math.min(cx, cy) - 55;
            const n = values.length;
            const angleStep = (Math.PI * 2) / n;
            const startAngle = -Math.PI / 2;

            ctx.clearRect(0, 0, w, h);

            // concentric rings
            const rings = [20, 40, 60, 80, 100];
            rings.forEach(ring => {
                const r = (ring / 100) * maxRadius;
                ctx.beginPath();
                for (let i = 0; i <= n; i++) {
                    const angle = startAngle + i * angleStep;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = 1;
                ctx.stroke();

                if (ring % 40 === 0 || ring === 100) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.font = '10px Inter, sans-serif';
                    ctx.fillText(ring.toString(), cx + 4, cy - r + 12);
                }
            });

            // axis lines
            for (let i = 0; i < n; i++) {
                const angle = startAngle + i * angleStep;
                const x = cx + maxRadius * Math.cos(angle);
                const y = cy + maxRadius * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(x, y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // data polygon
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const idx = i % n;
                const angle = startAngle + idx * angleStep;
                const r = (values[idx] / 100) * maxRadius;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(110, 147, 214, 0.15)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(110, 147, 214, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // data points
            for (let i = 0; i < n; i++) {
                const angle = startAngle + i * angleStep;
                const r = (values[i] / 100) * maxRadius;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);

                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#6e93d6';
                ctx.fill();
                ctx.strokeStyle = '#8ba9de';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.fillStyle = '#a5a9b2';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < n; i++) {
                const angle = startAngle + i * angleStep;
                const labelR = maxRadius + 35;
                let x = cx + labelR * Math.cos(angle);
                let y = cy + labelR * Math.sin(angle);

                const words = labels[i].split(' ');
                if (words.length > 1) {
                    const lineHeight = 14;
                    const totalHeight = words.length * lineHeight;
                    const startY = y - totalHeight / 2 + lineHeight / 2;
                    words.forEach((word, wi) => {
                        ctx.fillText(word, x, startY + wi * lineHeight);
                    });
                } else {
                    ctx.fillText(labels[i], x, y);
                }

                const scoreR = maxRadius + 18;
                const sx = cx + scoreR * Math.cos(angle);
                const sy = cy + scoreR * Math.sin(angle);
                ctx.fillStyle = '#edeef0';
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.fillText(values[i].toString(), sx, sy);
                ctx.fillStyle = '#a5a9b2';
                ctx.font = '11px Inter, sans-serif';
            }
        }
    };
})();
