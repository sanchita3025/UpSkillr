// Global App Data State
const appState = {
    username: 'User',
    theme: 'dark',
    cgpa: 0,
    skills: [],
    projects: [],
    careerGoal: 'Software Engineer',
    extractedSkills: [],
    readinessScore: 0,
    softSkills: {
        comm: 5,
        prob: 5,
        design: 5
    },
    // New Upgraded Fields
    email: '',
    otp: '',
    resumeScore: 0,
    githubScore: 0,
    linkedinScore: 0,
    rankIndia: 0,
    rankState: 0,
    notifications: {
        tip: '',
        question: ''
    },
    // Analyzer Details
    analysisDetails: {
        resume: { score: 0, level: '', feedback: '', breakdown: '', problems: [], improvements: [], prediction: '' },
        github: { score: 0, level: '', feedback: '', breakdown: '', problems: [], improvements: [] },
        linkedin: { score: 0, level: '', feedback: '', breakdown: '', problems: [], improvements: [] }
    },
    recommendations: {
        level: 'Beginner',
        justification: '',
        projects: [],
        certificates: []
    }
};

// --- Form Navigation & Logic (login.html) --- //

// Order of steps to power the Back button
const stepOrder = [
    'step-theme',
    'step-login',
    'step-otp',
    'step-language',
    'step-academic',
    'step-skills',
    'step-softskills',
    'step-projects',
    'step-career',
    'step-links'
];
let currentStepIdx = 0;

function handleBack() {
    if (currentStepIdx > 0) {
        nextStep(stepOrder[currentStepIdx - 1]);
    } else {
        window.location.href = 'index.html';
    }
}

function selectTheme(element, themeId) {
    // Remove active class from all
    document.querySelectorAll('.theme-card').forEach(el => el.classList.remove('active'));
    // Add active to selected
    element.classList.add('active');

    // Update state and apply temporarily
    appState.theme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);
}

function nextStep(stepId) {
    // Update index for back button
    currentStepIdx = stepOrder.indexOf(stepId);

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        step.classList.add('hidden');
    });

    // Attempt dynamic greeting update if username is entered
    const usernameInput = document.getElementById('username');
    let nameText = '';
    if (usernameInput && usernameInput.value.trim() !== '') {
        nameText = usernameInput.value.trim() + ', ';
    }

    // Show target step
    const target = document.getElementById(stepId);
    if (target) {
        if (stepId === 'step-language') {
            const h2 = target.querySelector('h2');
            if (h2) h2.innerText = nameText ? `Hello ${usernameInput.value.trim()} !!` : 'Select Language';

            const subtitle = target.querySelector('.subtitle');
            if (subtitle) subtitle.innerText = nameText ? `Please select your language to continue.` : 'Global Language Selection';
        } else if (stepId === 'step-academic') {
            const h2 = target.querySelector('h2');
            if (h2) h2.innerText = nameText ? `${usernameInput.value.trim()}'s Academic Profile` : 'Academic Profile';
        } else if (stepId === 'step-career') {
            const subtitle = target.querySelector('.subtitle');
            if (subtitle) subtitle.innerText = nameText ? `What role are you aiming for, ${usernameInput.value.trim()}?` : 'What role are you aiming for?';
        } else if (stepId === 'step-softskills') {
            const h2 = target.querySelector('#soft-title');
            if (h2) h2.innerText = nameText ? `${usernameInput.value.trim()}'s Soft Skills` : 'Soft Skills';
        }

        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

// --- SIMULATED OTP LOGIC --- //
function sendOTP() {
    const email = document.getElementById('email').value;
    if (!email || !email.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }

    // Generate 6 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    appState.otp = otp;
    appState.email = email;

    console.log("Simulated OTP sent to " + email + ": " + otp);
    alert("Simulated OTP sent to your email! (Check console for code: " + otp + ")");

    nextStep('step-otp');
}

function moveFocus(current, nextId) {
    if (current.value.length === 1) {
        const next = document.getElementById(nextId);
        if (next) next.focus();
    }
}

function verifyOTP() {
    const inputs = document.querySelectorAll('.otp-input');
    let enteredOtp = "";
    inputs.forEach(input => enteredOtp += input.value);

    if (enteredOtp === appState.otp) {
        nextStep('step-language');
    } else {
        document.getElementById('otp-error').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('otp-error').classList.add('hidden');
        }, 3000);
    }
}

function updateCgpaMax() {
    const scale = document.getElementById('cgpa-scale').value;
    const input = document.getElementById('cgpa');
    input.max = scale;
    if (parseFloat(input.value) > scale) input.value = scale;
}

function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        document.getElementById('file-status').classList.remove('hidden');
        document.getElementById('file-status').innerText = "File: " + input.files[0].name + " uploaded (Simulated)";
    }
}

// Add Skill Tag
function addSkill() {
    const nameInput = document.getElementById('skill-name');
    const levelSelect = document.getElementById('skill-level');

    if (nameInput.value.trim() !== '') {
        const skillName = nameInput.value.trim();
        const level = levelSelect.value;

        appState.skills.push({ name: skillName, level: level });

        updateSkillsList();
        nameInput.value = ''; // clear
    }
}

function updateSkillsList() {
    const container = document.getElementById('skills-list');
    if (!container) return;
    container.innerHTML = '';
    appState.skills.forEach((skill, index) => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        let colorClass = 'bg-blue';
        if (skill.level === 'Intermediate') colorClass = 'bg-yellow';
        if (skill.level === 'Advanced') colorClass = 'bg-green';

        tag.innerHTML = `
            <span>${skill.name}</span>
            <span class="badge ${colorClass}">${skill.level}</span>
            <i class="fa fa-times" onclick="removeSkill(${index})"></i>
        `;
        container.appendChild(tag);
    });
}

function removeSkill(index) {
    appState.skills.splice(index, 1);
    updateSkillsList();
}

function addSkillNA() {
    // Clear existing skills and just add N/A
    appState.skills = [{ name: 'N/A', level: 'Beginner' }];
    updateSkillsList();
    // Auto advance
    nextStep('step-softskills');
}

// Add Project
function addProject() {
    const titleInput = document.getElementById('project-title');
    const techInput = document.getElementById('project-tech');

    if (titleInput.value.trim() !== '') {
        appState.projects.push({
            title: titleInput.value.trim(),
            tech: techInput.value.trim()
        });
        updateProjectsList();
        titleInput.value = '';
        techInput.value = '';
    }
}

function updateProjectsList() {
    const container = document.getElementById('projects-list');
    if (!container) return;
    container.innerHTML = '';
    appState.projects.forEach((proj, index) => {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div>
                <strong>${proj.title}</strong>
                <p class="text-sm text-secondary">${proj.tech}</p>
            </div>
            <i class="fa fa-trash" onclick="removeProject(${index})"></i>
        `;
        container.appendChild(item);
    });
}

function removeProject(index) {
    appState.projects.splice(index, 1);
    updateProjectsList();
}

function addProjectNA() {
    appState.projects = [{ title: 'N/A', tech: 'N/A' }];
    updateProjectsList();
    // Auto advance
    nextStep('step-career');
}

// Start AI Analysis Simulation
function startAnalysis() {
    // Collect mandatory inputs
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const cgpaInput = document.getElementById('cgpa');

    // Check missing fields (simple validation for flow)
    if (!usernameInput || usernameInput.value.trim() === '') {
        alert("Please enter a username to proceed.");
        nextStep('step-login');
        return;
    }
    if (!cgpaInput || cgpaInput.value.trim() === '') {
        alert("Please enter your CGPA to proceed.");
        nextStep('step-academic');
        return;
    }
    if (appState.skills.length === 0) {
        alert("Please add at least one skill or click 'N/A'.");
        nextStep('step-skills');
        return;
    }

    appState.username = usernameInput.value;

    const langSelect = document.getElementById('user-language');
    if (langSelect) appState.language = langSelect.value;

    // Save Soft Skills from sliders
    const comm = document.getElementById('skill-comm');
    const prob = document.getElementById('skill-prob');
    const design = document.getElementById('skill-design');
    if (comm && prob && design) {
        appState.softSkills = {
            comm: parseInt(comm.value),
            prob: parseInt(prob.value),
            design: parseInt(design.value)
        };
    }

    // CGPA Scale Handling & Normalization
    const cgpaScale = parseFloat(document.getElementById('cgpa-scale').value);
    const rawCgpaValue = parseFloat(cgpaInput.value);

    // Normalize to 10
    if (cgpaScale === 4) {
        appState.cgpa = rawCgpaValue * 2.5;
    } else {
        appState.cgpa = rawCgpaValue;
    }

    let goal = document.getElementById('career-goal').value;
    if (goal === 'Other') goal = document.getElementById('other-career').value;
    if (goal) appState.careerGoal = goal;

    nextStep('step-analysis');

    const terminal = document.getElementById('terminal-log');
    terminal.innerHTML = '';

    const messages = [
        "> Initializing Simulated NLP Engine...",
        "> Scanning Resume for skills, projects, certificates...",
        "> [Simulated AI] Found matches for " + appState.careerGoal + "...",
        "> Fetching public metadata from GitHub & LinkedIn URLs...",
        "> Calculating industry readiness & national ranking...",
        "> Synthesizing career path suggestions...",
        "✔ Advanced Analysis Complete!"
    ];

    let delay = 1000;
    messages.forEach((msg, idx) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = idx === messages.length - 1 ? 'text-success font-bold' : '';
            p.innerText = msg;
            terminal.appendChild(p);
            terminal.scrollTop = terminal.scrollHeight;
        }, delay);
        delay += 1000;
    });

    // Realistic Readiness Score Calculation
    let baseScore = 0;
    if (appState.cgpa >= 8) baseScore += 20;
    else if (appState.cgpa >= 7) baseScore += 15;
    else baseScore += 10;

    let skillScore = appState.skills.length * 5;
    baseScore += Math.min(skillScore, 30);

    baseScore += Math.min(appState.projects.length * 10, 30);
    appState.readinessScore = Math.min(baseScore + 10, 100);

    // --- CONSISTENT SCORING ENGINE ---

    // 1. Resume Scoring (Max 100)
    // Breakdown: Skills (25), Projects (25), Experience (20), Certs (10), Formatting (20)
    let resScore = 0;
    const resDet = { problems: [], improvements: [], breakdown: '', prediction: '' };
    
    // Skills (Max 25)
    const skillVal = Math.min(appState.skills.length * 5, 25);
    resScore += skillVal;
    
    // Projects (Max 25)
    const projVal = Math.min(appState.projects.length * 10, 25);
    resScore += projVal;
    
    // Experience (Simulated - Max 20)
    const expVal = appState.projects.length > 2 ? 15 : 5;
    resScore += expVal;
    
    // Certs (Simulated - Max 10)
    const certVal = appState.skills.length > 4 ? 8 : 2;
    resScore += certVal;
    
    // Formatting (Simulated - Max 20)
    const hasResume = document.getElementById('resume-upload').files[0];
    const formVal = hasResume ? 20 : 5;
    resScore += formVal;

    appState.resumeScore = resScore;
    resDet.breakdown = `Skills: ${skillVal}/25 • Projects: ${projVal}/25 • Exp: ${expVal}/20 • Certs: ${certVal}/10 • Form: ${formVal}/20`;
    
    if (skillVal < 20) {
        resDet.problems.push("Limited skill variety detected");
        resDet.improvements.push("Add 5+ core domain skills ➔ <b>+10 pts</b>");
    }
    if (projVal < 20) {
        resDet.problems.push("Fewer than 3 projects mentioned");
        resDet.improvements.push("Add 2 real-world projects ➔ <b>+10 pts</b>");
    }
    if (!hasResume) {
        resDet.problems.push("No resume file uploaded for format scan");
        resDet.improvements.push("Upload PDF for AI Formatting check ➔ <b>+15 pts</b>");
    }
    resDet.prediction = `Your score can reach ${Math.min(resScore + 25, 95)}+ with these fixes.`;
    
    const resLevelObj = getScoreLevel(resScore);
    appState.analysisDetails.resume = { ...resDet, score: resScore, level: resLevelObj.level, feedback: resLevelObj.feedback };

    // 2. GitHub Scoring
    const gitReadme = document.getElementById('github-readme').value;
    const gitProjCount = parseInt(document.getElementById('github-project-count').value) || 0;
    let gitScore = 0;
    const gitDet = { problems: [], improvements: [], breakdown: '' };
    
    const countPoints = Math.min(gitProjCount * 12, 60);
    const readmePoints = gitReadme === 'Yes' ? 40 : 10;
    gitScore = countPoints + readmePoints;
    
    appState.githubScore = gitScore;
    gitDet.breakdown = `Repos: ${countPoints}/60 • Documentation: ${readmePoints}/40`;
    
    if (gitProjCount < 5) {
        gitDet.problems.push(`Low project count (${gitProjCount})`);
        gitDet.improvements.push("Build 5+ repositories ➔ <b>+25 pts</b>");
    }
    if (gitReadme === 'No') {
        gitDet.problems.push("Missing repository READMEs");
        gitDet.improvements.push("Add README.md to main repos ➔ <b>+30 pts</b>");
    }
    
    const gitLevelObj = getScoreLevel(gitScore);
    appState.analysisDetails.github = { ...gitDet, score: gitScore, level: gitLevelObj.level, feedback: gitLevelObj.feedback };

    // 3. LinkedIn Scoring
    const linkUrl = document.getElementById('linkedin-url').value;
    let linkScore = 0;
    const linkDet = { problems: [], improvements: [], breakdown: '' };
    
    if (!linkUrl) {
        linkScore = 25;
        linkDet.problems.push("LinkedIn shadow profile (URL missing)");
        linkDet.improvements.push("Connect profile URL ➔ <b>+50 pts</b>");
    } else {
        linkScore = 68; 
        linkDet.problems.push("Vague headline detected");
        linkDet.improvements.push("Use clear role-based headline ➔ <b>+15 pts</b>");
        linkDet.problems.push("About section is generic");
        linkDet.improvements.push("Add skills-focused summary ➔ <b>+17 pts</b>");
    }
    
    appState.linkedinScore = linkScore;
    linkDet.breakdown = `Profile Authority: ${linkScore}/100`;
    
    const linkLevelObj = getScoreLevel(linkScore);
    appState.analysisDetails.linkedin = { ...linkDet, score: linkScore, level: linkLevelObj.level, feedback: linkLevelObj.feedback };

    // Intelligent Recommendation Engine
    generateRecommendations();

    // Simulated Ranking Logic
    const avgScore = (appState.readinessScore + appState.resumeScore + appState.githubScore + appState.linkedinScore) / 4;
    appState.rankIndia = Math.floor(100000 - (avgScore * 950));
    appState.rankState = Math.floor(5000 - (avgScore * 45));

    // Simulated Notifications
    const tips = {
        'Software Engineer': "Focus on Data Structures & System Design today.",
        'Data Scientist': "Try analyzing a Kaggle dataset to boost your portfolio.",
        'Full Stack Developer': "Practice building a small React component using Tailwind CSS.",
        'Default': "Complete one leetcode problem every day."
    };
    appState.notifications.tip = tips[appState.careerGoal] || tips['Default'];
    appState.notifications.question = "What is the time complexity of searching an element in a balanced BST?";

    // Save to local storage
    localStorage.setItem('upSkillrData', JSON.stringify(appState));

    // Redirect to dashboard after analysis finishes
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, delay + 1000);
}

// --- Dashboard & Roadmap Logic --- //

// Mock Translation Strings
const translations = {
    'Spanish': {
        // Dashboard
        'dash-welcome': 'Bienvenido',
        'dash-desc': 'Tu análisis de habilidades y ruta de aprendizaje para el rol de',
        'readiness-title': 'Puntuación de Preparación',
        'on-track': '¡Vas por buen camino!',
        'your-score': 'Tu Puntuación',
        'ind-avg': 'Promedio de la Industria',
        'radar-title': 'Radar de Habilidades',
        'gap-title': 'Análisis de Brecha de Habilidades',
        'gap-desc': 'Basado en tu objetivo, necesitas enfocarte en estas habilidades:',
        'aligned-title': 'Habilidades Alineadas',
        'rec-roles-title': 'Roles Recomendados',
        'rec-roles-desc': 'Basado en tu perfil actual, estos roles son ideales:',
        'view-roadmap-btn': 'Ver Hoja de Ruta',
        'chat-bot-title': 'Asistente de IA (Carrera)',
        // Roadmap
        'roadmap-title': 'Tu Hoja de Ruta de Aprendizaje',
        'roadmap-desc': 'Sigue estos pasos para mejorar tus habilidades. (Fechas estimadas).',
        'overall-progress': 'Progreso General',
        'industry-trends': 'Tendencias de la Industria 2026',
        'industry-trends-desc': 'Habilidades más demandadas hoy.'
    },
    'Hindi': {
        // Dashboard
        'dash-welcome': 'स्वागत है',
        'dash-desc': 'भूमिका के लिए आपका कौशल विश्लेषण और सीखने का मार्ग',
        'readiness-title': 'तत्परता स्कोर',
        'on-track': 'आप सही रास्ते पर हैं!',
        'your-score': 'आपका स्कोर',
        'ind-avg': 'उद्योग औसत',
        'radar-title': 'कौशल रडार',
        'gap-title': 'कौशल अंतर विश्लेषण',
        'gap-desc': 'आपके लक्ष्य के आधार पर, आपको इन कौशलों पर ध्यान केंद्रित करने की आवश्यकता है:',
        'aligned-title': 'संरेखित कौशल',
        'rec-roles-title': 'अनुशंसित नौकरी भूमिकाएं',
        'rec-roles-desc': 'आपके प्रोफ़ाइल के आधार पर, ये भूमिकाएँ आदर्श हैं:',
        'view-roadmap-btn': 'सीखने का रोडमैप देखें',
        'chat-bot-title': 'कैरियर एआई',
        // Roadmap
        'roadmap-title': 'आपका व्यक्तिगत लर्निंग रोडमैप',
        'roadmap-desc': 'अपने कौशल अंतर को पाटने के लिए इन चरणों का पालन करें।',
        'overall-progress': 'समग्र प्रगति',
        'industry-trends': 'उद्योग रुझान 2026',
        'industry-trends-desc': 'बाज़ार में सबसे अधिक मांग वाले कौशल।'
    },
    'Japanese': {
        // Dashboard
        'dash-welcome': 'ようこそ',
        'dash-desc': 'の役割に向けたあなたのパーソナライズされたスキル分析と学習パス',
        'readiness-title': '準備スコア',
        'on-track': '順調です！',
        'your-score': 'あなたのスコア',
        'ind-avg': '業界平均',
        'radar-title': 'スキルレーダー',
        'gap-title': 'スキルギャップ分析',
        'gap-desc': '目標に基づいて、以下のスキルに集中する必要があります:',
        'aligned-title': '一致したスキル',
        'rec-roles-title': 'おすすめの職種',
        'rec-roles-desc': '現在のスキルセットに基づき、これらの役割が適しています:',
        'view-roadmap-btn': 'ロードマップを見る',
        'chat-bot-title': 'キャリア AI',
        // Roadmap
        'roadmap-title': 'パーソナライズされた学習ロードマップ',
        'roadmap-desc': 'スキルギャップを埋めるためにこれらのステップに従ってください。',
        'overall-progress': '全体の進捗',
        'industry-trends': '業界のトレンド 2026',
        'industry-trends-desc': '現在最も需要の高いスキル。'
    }
};

function applyTranslation() {
    const lang = appState.language || 'English';
    if (translations[lang]) {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }
}

function initDashboard() {
    const saved = localStorage.getItem('upSkillrData');
    if (saved) Object.assign(appState, JSON.parse(saved));

    document.getElementById('dash-username').innerText = appState.username;
    document.getElementById('dash-career').innerText = appState.careerGoal;

    // Animate Score
    const scoreText = document.getElementById('dash-score-text');
    const scoreBar = document.getElementById('dash-score-bar');
    const scoreCircle = document.getElementById('dash-score-circle');

    const score = appState.readinessScore || 70;

    setTimeout(() => {
        scoreBar.style.width = score + '%';
        scoreText.innerText = score + '%';

        let current = 0;
        const interval = setInterval(() => {
            if (current >= score) {
                clearInterval(interval);
                scoreCircle.innerText = score + '%';
                scoreCircle.style.background = `conic-gradient(var(--accent) ${score}%, transparent 0%)`;
            } else {
                current += 2; // Jump by 2
                scoreCircle.innerText = current + '%';
                scoreCircle.style.background = `conic-gradient(var(--accent) ${current}%, transparent 0%)`;
            }
        }, 30);
    }, 500);

    // Update Simulated Stats
    document.getElementById('stat-resume').innerText = appState.resumeScore || '---';
    document.getElementById('stat-github').innerText = appState.githubScore || '---';
    document.getElementById('stat-linkedin').innerText = appState.linkedinScore || '---';

    // Update Rankings
    document.getElementById('rank-india').innerText = appState.rankIndia ? `# ${appState.rankIndia.toLocaleString()}` : '# ---';
    document.getElementById('rank-state').innerText = appState.rankState ? `# ${appState.rankState.toLocaleString()}` : '# ---';

    // Update Notifications
    if (appState.notifications) {
        document.getElementById('notif-tip').innerText = appState.notifications.tip || 'No tips available.';
        document.getElementById('notif-question').innerText = appState.notifications.question || 'Wait for tomorrow!';
    }

    // Render Deep Analysis
    if (appState.analysisDetails) {
        // Resume
        document.getElementById('stat-resume').innerText = appState.resumeScore;
        document.getElementById('resume-badge').innerText = appState.analysisDetails.resume.level;
        document.getElementById('resume-feedback-text').innerText = appState.analysisDetails.resume.feedback;
        document.getElementById('resume-breakdown').innerText = appState.analysisDetails.resume.breakdown;
        document.getElementById('resume-prediction').innerText = appState.analysisDetails.resume.prediction;
        renderAnalysisList('resume-problems', appState.analysisDetails.resume.problems);
        renderAnalysisList('resume-improvements', appState.analysisDetails.resume.improvements);
        
        // GitHub
        document.getElementById('stat-github').innerText = appState.githubScore;
        document.getElementById('github-badge').innerText = appState.analysisDetails.github.level;
        document.getElementById('github-feedback-text').innerText = appState.analysisDetails.github.feedback;
        document.getElementById('github-breakdown').innerText = appState.analysisDetails.github.breakdown;
        renderAnalysisList('github-problems', appState.analysisDetails.github.problems);
        renderAnalysisList('github-improvements', appState.analysisDetails.github.improvements);
        
        // LinkedIn
        document.getElementById('stat-linkedin').innerText = appState.linkedinScore;
        document.getElementById('linkedin-badge').innerText = appState.analysisDetails.linkedin.level;
        document.getElementById('linkedin-feedback-text').innerText = appState.analysisDetails.linkedin.feedback;
        document.getElementById('linkedin-breakdown').innerText = appState.analysisDetails.linkedin.breakdown;
        renderAnalysisList('linkedin-problems', appState.analysisDetails.linkedin.problems);
        renderAnalysisList('linkedin-improvements', appState.analysisDetails.linkedin.improvements);
    }

    // Render Recommendations
    if (appState.recommendations) {
        document.getElementById('rec-level-badge').innerText = `Level: ${appState.recommendations.level}`;
        document.getElementById('rec-justification').innerText = appState.recommendations.justification;
        
        const projectContainer = document.getElementById('project-recommendations');
        projectContainer.innerHTML = appState.recommendations.projects.map(p => `
            <div class="rec-card">
                <span class="rec-title">${p.name}</span>
                <p class="rec-desc">${p.description}</p>
                <div class="rec-tags">
                    ${p.skills.map(s => `<span class="rec-tag">${s}</span>`).join('')}
                </div>
                <p class="rec-why"><i class="fa fa-info-circle"></i> ${p.why}</p>
            </div>
        `).join('');

        const certContainer = document.getElementById('certificate-recommendations');
        certContainer.innerHTML = appState.recommendations.certificates.map(c => `
            <div class="rec-card">
                <span class="rec-title">${c.name}</span>
                <p class="rec-desc">${c.learn}</p>
                <p class="rec-why" style="border:none; padding:0;"><i class="fa fa-check-circle"></i> ${c.why}</p>
            </div>
        `).join('');
    }

    // Mock Skills Gap logic
    const allRequiredSkills = {
        'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'Docker', 'Cloud', 'Linux', 'Testing'],
        'AI Engineer': ['Linear Algebra', 'Neural Networks', 'PyTorch', 'Model Deployment', 'MLOps', 'Computer Vision'],
        'Data Scientist': ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL', 'Deep Learning'],
    };

    // Fallback to Software Engineer if not mapped
    const requiredSkills = allRequiredSkills[appState.careerGoal] || allRequiredSkills['Software Engineer'];

    // User Skills
    const userSkills = appState.skills.map(s => s.name.toLowerCase());
    appState.extractedSkills.forEach(s => userSkills.push(s.toLowerCase()));

    const missingContainer = document.getElementById('missing-skills');
    const alignedContainer = document.getElementById('aligned-skills');

    if (missingContainer && alignedContainer) {
        missingContainer.innerHTML = '';
        alignedContainer.innerHTML = '';

        requiredSkills.forEach(req => {
            if (userSkills.includes(req.toLowerCase())) {
                alignedContainer.innerHTML += `<div class="aligned-skill-pill">${req}</div>`;
            } else {
                missingContainer.innerHTML += `<div class="missing-skill-pill">${req}</div>`;
            }
        });

        if (alignedContainer.innerHTML === '') alignedContainer.innerHTML = '<p class="text-secondary text-sm">No aligned skills detected yet.</p>';

        let warningMessage = 'Your professional profile partially matches your chosen career goal.';
        if (missingContainer.innerHTML === '') {
            missingContainer.innerHTML = '<p class="text-success text-sm">You have all the core skills!</p>';
            warningMessage = 'Your profile perfectly matches your career goal!';
        } else if (appState.readinessScore < 40) {
            warningMessage = 'You currently lack many core skills required for this role. Follow the roadmap to improve.';
        }

        const alignMsgEl = document.getElementById('career-align-message');
        if (alignMsgEl) alignMsgEl.innerText = warningMessage;
    }

    // Dynamic Readiness Score Texts
    const trackTextEl = document.querySelector('[data-translate="on-track"]');
    if (trackTextEl) {
        if (score >= 70) {
            trackTextEl.innerText = "You are on right path! 🚀";
            trackTextEl.className = "text-success font-bold mb-2";
        } else {
            trackTextEl.innerText = "You can do better! 💡";
            trackTextEl.className = "text-warning font-bold mb-2";
            trackTextEl.style.color = "var(--warning)";
        }
    }

    // Recommended Roles logic based on skills
    let roleOptions = `
        <div class="role-card" onclick="window.location.href='roadmap.html'">
            <h4>QA Engineer</h4>
            <p>90% Match based on your testing skills.</p>
        </div>
        <div class="role-card" onclick="window.location.href='roadmap.html'">
            <h4>Junior Developer</h4>
            <p>Perfect starting role.</p>
        </div>
    `;

    if (appState.careerGoal.includes('Software') || appState.careerGoal.includes('Web')) {
        roleOptions = `
            <div class="role-card" onclick="window.location.href='roadmap.html'">
                <h4>Backend Developer</h4>
                <p>92% Match with your current backend knowledge.</p>
            </div>
            <div class="role-card" onclick="window.location.href='roadmap.html'">
                <h4>Frontend Engineer</h4>
                <p>Great match for your web architecture skills.</p>
            </div>
        `;
    } else if (appState.careerGoal.includes('Data') || appState.careerGoal.includes('AI')) {
        roleOptions = `
            <div class="role-card" onclick="window.location.href='roadmap.html'">
                <h4>Data Analyst</h4>
                <p>Strong match based on statistics and Python.</p>
            </div>
            <div class="role-card" onclick="window.location.href='roadmap.html'">
                <h4>Machine Learning Engineer</h4>
                <p>High match for your AI and Neural Network knowledge.</p>
            </div>
        `;
    }

    const rolesContainer = document.getElementById('recommended-roles');
    if (rolesContainer) {
        rolesContainer.innerHTML = roleOptions;
    }

    // Draw Radar Chart
    const ctx = document.getElementById('radarChart');
    if (ctx) {
        // Build values dynamically taking in soft skills (1-10 scaled to 1-100)
        let softComm = (appState.softSkills && appState.softSkills.comm) ? appState.softSkills.comm * 10 : 50;
        let softProb = (appState.softSkills && appState.softSkills.prob) ? appState.softSkills.prob * 10 : 50;
        let softDesign = (appState.softSkills && appState.softSkills.design) ? appState.softSkills.design * 10 : 50;
        let technicalScore = Math.min(score + 10, 100); // Fake technical avg based on readiness

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Programming', 'Problem Solving', 'System Design', 'Cloud', 'AI/ML', 'Communication'],
                datasets: [{
                    label: 'Your Skill Profile',
                    data: [technicalScore, softProb, softDesign, (score > 50 ? score - 10 : 30), 50, softComm],
                    backgroundColor: 'rgba(0, 225, 255, 0.2)',
                    borderColor: 'rgba(0, 225, 255, 1)',
                    pointBackgroundColor: '#040d21',
                    pointBorderColor: '#00e1ff',
                    borderWidth: 2
                }, {
                    label: 'Industry Average',
                    data: [85, 80, 75, 70, 65, 80],
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderDash: [5, 5],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#94a3b8', font: { size: 12 } },
                        ticks: { display: false, min: 0, max: 100 }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff' }, position: 'bottom' }
                }
            }
        });
    }

    applyTranslation();
}

function initRoadmap() {
    const saved = localStorage.getItem('upSkillrData');
    if (saved) Object.assign(appState, JSON.parse(saved));

    // Dynamic Roadmap based on missing skills or career goal
    const allRequiredSkills = {
        'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'Docker', 'Cloud Fundamentals', 'Linux', 'Unit Testing'],
        'Full Stack Developer': ['React/Vue/Angular', 'Node.js/Django', 'REST APIs', 'SQL/NoSQL databases', 'Git Version Control', 'Web Hosting/Deployment', 'CSS Architecture'],
        'Backend Developer': ['API Design', 'Microservices', 'Database Optimization', 'Authentication', 'Caching strategies', 'Docker & CI/CD'],
        'Frontend Developer': ['Advanced JavaScript', 'React/Next.js', 'State Management', 'Web Accessibility (a11y)', 'Responsive Design', 'CSS Preprocessors'],
        'AI Engineer': ['Linear Algebra', 'Neural Networks', 'PyTorch/TensorFlow', 'Model Deployment', 'MLOps', 'Computer Vision/NLP'],
        'Machine Learning Engineer': ['Advanced Statistics', 'Feature Engineering', 'Algorithm Tuning', 'Scikit-Learn', 'Data Pipelines', 'Deep Learning Concepts'],
        'Data Scientist': ['Python Data Science Stack', 'Statistical Modeling', 'Machine Learning', 'Data Visualization', 'Advanced SQL', 'A/B Testing'],
        'Data Analyst': ['Excel/Spreadsheets', 'SQL Queries', 'Tableau/PowerBI', 'Data Cleaning', 'Basic Statistics', 'Business Intelligence Fundamentals'],
        'Cybersecurity Analyst': ['Network Security', 'Cryptography', 'Ethical Hacking', 'Risk Management', 'Security Protocols', 'Threat Intelligence'],
        'Cloud Architect': ['AWS/Azure/GCP Architecture', 'Infrastructure as Code', 'Serverless computing', 'Cloud Security', 'Kubernetes'],
        'N/A': ['Career Exploration', 'Basic Programming Concepts', 'Professional Communication', 'Resume Building']
    };

    const requiredSkills = allRequiredSkills[appState.careerGoal] || allRequiredSkills['Software Engineer'];
    const userSkills = appState.skills.map(s => s.name.toLowerCase());
    appState.extractedSkills.forEach(s => userSkills.push(s.toLowerCase()));

    // Find missing skills
    let missingSkills = requiredSkills.filter(req => !userSkills.includes(req.toLowerCase()));

    // In case there are very few missing skills detected but they chose a new career goal, ensure we have at least 3 things to show.
    if (missingSkills.length < 3 && appState.careerGoal !== 'N/A') {
        missingSkills = requiredSkills.slice(0, 3);
    }

    // Generate dynamic roadmap
    const roadmapData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let currentMonthIdx = new Date().getMonth();

    if (missingSkills.length === 0) {
        roadmapData.push({ title: 'Explore Core Tech Principles', platform: 'freeCodeCamp', status: 'pending', timeline: 'Continuous' });
        roadmapData.push({ title: 'Build a Personal Portfolio', platform: 'GitHub Pages', status: 'pending', timeline: 'Next Week' });
        roadmapData.push({ title: 'Consult Career Counselor', platform: 'University Services', status: 'pending', timeline: 'ASAP' });
    } else {
        missingSkills.forEach((skill, idx) => {
            const estimatedMonth = months[(currentMonthIdx + idx) % 12];
            let platform = 'Coursera';
            if (skill.includes('Cloud') || skill.includes('Docker') || skill.includes('Kubernetes')) platform = 'AWS Training / Cloud Guru';
            if (skill.includes('Git') || skill.includes('Hosting') || skill.includes('CI/CD')) platform = 'GitHub Learning / NetlifyDocs';
            if (skill.includes('System') || skill.includes('Architecture') || skill.includes('API')) platform = 'Educative.io / FreeCodeCamp';
            if (skill.includes('Data') || skill.includes('Machine') || skill.includes('ML') || skill.includes('Statistics')) platform = 'DataCamp / Kaggle';
            if (skill.includes('React') || skill.includes('CSS') || skill.includes('JavaScript')) platform = 'Frontend Masters / MDN';
            if (skill.includes('Security') || skill.includes('Hacking') || skill.includes('Network')) platform = 'TryHackMe / HackTheBox';

            roadmapData.push({
                title: 'Learn ' + skill,
                platform: platform,
                status: 'pending',
                timeline: 'Target: ' + estimatedMonth + ' 2026'
            });
        });

        // Add final step
        roadmapData.push({ title: 'Final Project & Certification', platform: 'Coursera / AWS / Google', status: 'pending', timeline: 'Target: ' + months[(currentMonthIdx + missingSkills.length) % 12] + ' 2026' });
    }

    // Attempt to pull saved roadmap status from local storage if exists
    const savedStatus = JSON.parse(localStorage.getItem('roadmapStatus_' + appState.username) || '{}');

    const timeline = document.getElementById('roadmap-timeline');
    if (timeline) {
        timeline.innerHTML = '';

        let completedCount = 0;

        roadmapData.forEach((step, idx) => {
            const stepId = 'step_' + idx;
            // Override status if we clicked it before
            if (savedStatus[stepId]) step.status = savedStatus[stepId];

            let statusClass = 'status-pending';
            let statusText = 'Not Started';
            let stepClass = '';

            if (step.status === 'completed') {
                statusClass = 'status-completed';
                statusText = 'Completed';
                stepClass = 'completed';
                completedCount++;
            }

            timeline.innerHTML += `
                <div class="roadmap-step ${stepClass}" id="${stepId}">
                    <div class="step-dot"></div>
                    <div class="step-header">
                        <div class="step-title">Step ${idx + 1}: ${step.title}</div>
                        <div class="step-status ${statusClass}">${statusText}</div>
                    </div>
                    <div class="step-meta">
                        <span><i class="far fa-calendar-alt"></i> ${step.timeline}</span>
                        <span><i class="fa fa-graduation-cap"></i> Recommended Platform: <a href="#" onclick="event.preventDefault()">${step.platform}</a></span>
                    </div>
                    <div class="step-actions">
                        <button class="btn btn-outline" onclick="toggleStepStatus('${stepId}')">Mark as Complete</button>
                    </div>
                </div>
            `;
        });

        const progress = Math.round((completedCount / roadmapData.length) * 100);
        setTimeout(() => {
            const pct = document.getElementById('roadmap-percentage');
            const bar = document.getElementById('roadmap-progress-bar');
            if (pct) pct.innerText = progress + '%';
            if (bar) bar.style.width = progress + '%';
        }, 500);
    }

    applyTranslation();
}

function toggleStepStatus(stepIdStr) {
    const stepDiv = document.getElementById(stepIdStr);
    const statusDiv = stepDiv.querySelector('.step-status');
    const savedStatus = JSON.parse(localStorage.getItem('roadmapStatus_' + appState.username) || '{}');

    if (statusDiv.innerText === 'Completed') {
        statusDiv.innerText = 'Not Started';
        statusDiv.className = 'step-status status-pending';
        stepDiv.className = 'roadmap-step';
        savedStatus[stepIdStr] = 'pending';
    } else {
        statusDiv.innerText = 'Completed';
        statusDiv.className = 'step-status status-completed';
        stepDiv.className = 'roadmap-step completed';
        savedStatus[stepIdStr] = 'completed';
    }

    localStorage.setItem('roadmapStatus_' + appState.username, JSON.stringify(savedStatus));

    // Recalculate visually
    const total = document.querySelectorAll('.roadmap-step').length;
    const completed = document.querySelectorAll('.roadmap-step.completed').length;
    let progress = 0;
    if (total > 0) {
        progress = Math.round((completed / total) * 100);
    }

    document.getElementById('roadmap-percentage').innerText = progress + '%';
    document.getElementById('roadmap-progress-bar').style.width = progress + '%';

    // Trigger Feedback Modal on 100% completion
    if (progress === 100 && total > 0) {
        if (!localStorage.getItem('upskillr_feedback_submitted_' + appState.username)) {
            setTimeout(() => {
                const modal = document.getElementById('feedback-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    initStars();
                }
            }, 800); // slight delay after completing the last step
        }
    }
}

// Feedback Modal Logic
let currentRating = 0;
function initStars() {
    const stars = document.querySelectorAll('#star-rating i');
    stars.forEach(star => {
        // Hover effects
        star.addEventListener('mouseover', function () {
            const val = parseInt(this.getAttribute('data-val'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-val')) <= val) {
                    s.style.color = '#fbbf24'; // Warning yellow
                } else {
                    s.style.color = 'var(--text-secondary)';
                }
            });
        });

        // Return to clicked state on mouseout
        star.addEventListener('mouseout', function () {
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-val')) <= currentRating) {
                    s.style.color = '#fbbf24';
                } else {
                    s.style.color = 'var(--text-secondary)';
                }
            });
        });

        // Click to set rating
        star.addEventListener('click', function () {
            currentRating = parseInt(this.getAttribute('data-val'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-val')) <= currentRating) {
                    s.style.color = '#fbbf24';
                } else {
                    s.style.color = 'var(--text-secondary)';
                }
            });
        });
    });
}

function submitFeedback() {
    if (currentRating === 0) {
        alert("Please select a star rating!");
        return;
    }
    alert(`Thank you for your ${currentRating}-star feedback! 🌟`);
    localStorage.setItem('upskillr_feedback_submitted_' + appState.username, 'true');
    closeFeedback();
}

function closeFeedback() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('upSkillrData');
    window.location.href = 'index.html';
}

function toggleNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.classList.toggle('hidden');
    document.getElementById('notif-dot').classList.add('hidden');
}

function renderAnalysisList(id, list) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = list.length > 0
        ? list.map(item => `<li>${item}</li>`).join('')
        : '<li style="background:none; color:var(--text-secondary); opacity:0.5">Perfect! No issues found.</li>';
}

function getScoreLevel(score) {
    if (score >= 71) return { level: 'Advanced', feedback: 'Strong profile with minor improvements needed' };
    if (score >= 41) return { level: 'Intermediate', feedback: 'Good profile but needs improvement in some areas' };
    return { level: 'Beginner', feedback: 'Profile needs major improvement' };
}

function generateRecommendations() {
    const goal = appState.careerGoal;
    const projectCount = appState.projects.filter(p => p.title !== 'N/A').length;
    let level = 'Beginner';
    
    if (projectCount >= 4) level = 'Advanced';
    else if (projectCount >= 2) level = 'Intermediate';

    appState.recommendations.level = level;

    // Justification logic
    if (appState.githubScore < 50) {
        appState.recommendations.justification = "Your GitHub visibility is currently low. Building these specific projects and documenting them properly will validate your coding skills to recruiters.";
    } else if (appState.resumeScore < 60) {
        appState.recommendations.justification = "Your resume lacks technical depth. Adding these industry-standard projects and certifications will make your profile stand out during screening.";
    } else {
        appState.recommendations.justification = `As an ${level} candidate, you should focus on specialization to bridge the final gap between your current skills and a top-tier ${goal} role.`;
    }

    const data = {
        'Software Engineer': {
            Beginner: {
                projects: [
                    { name: 'Interactive Task Manager', description: 'Build a CRUD application with local storage and category filtering.', skills: ['HTML', 'CSS', 'JavaScript'], why: 'Demonstrates basic logic and DOM manipulation.' },
                    { name: 'Weather Forecast Dashboard', description: 'Fetch and display real-time weather data using a public API.', skills: ['Fetch API', 'JSON', 'Async/Await'], why: 'Shows your ability to work with external data.' }
                ],
                certs: [
                    { name: 'Responsive Web Design', why: 'Essential for modern frontend development.', learn: 'HTML5, CSS3, Flexbox, and Grid.' },
                    { name: 'JavaScript Algorithms', why: 'Core logic foundations.', learn: 'Basic data structures and problem solving.' }
                ]
            },
            Intermediate: {
                projects: [
                    { name: 'Personal Portfolio v2', description: 'A sleek, responsive portfolio with dark mode and smooth scroll animations.', skills: ['React/Vue', 'Tailwind CSS', 'Framer Motion'], why: 'Crucial for personal branding and showcasing aesthetics.' },
                    { name: 'E-commerce Product Page', description: 'A detailed product page with cart functionality and image galleries.', skills: ['State Management', 'Complex UI', 'Local Storage'], why: 'Shows handle of complex application state.' }
                ],
                certs: [
                    { name: 'Advanced CSS & Sass', why: 'Master modern styling techniques.', learn: 'Sass, Animations, and Layout patterns.' },
                    { name: 'React Development', why: 'The most in-demand frontend library.', learn: 'Hooks, Context API, and Routing.' }
                ]
            },
            Advanced: {
                projects: [
                    { name: 'Full-Stack Social Platform', description: 'A mini social network with authentication, posts, and real-time updates.', skills: ['Node.js', 'Express', 'MongoDB', 'Socket.io'], why: 'Proves you can handle entire system architectures.' },
                    { name: 'Trello Clone (Kanban)', description: 'Complex drag-and-drop task management system.', skills: ['React-Beautiful-Dnd', 'Redux', 'Backend API'], why: 'Highly complex UI logic and database sync.' }
                ],
                certs: [
                    { name: 'Node.js Developer', why: 'Master backend engineering.', learn: 'REST APIs, Authentication, and Security.' },
                    { name: 'AWS Cloud Practitioner', why: 'Cloud knowledge is mandatory for senior roles.', learn: 'Deployment, EC2, S3, and Serverless.' }
                ]
            }
        },
        'AI/ML': {
            Beginner: {
                projects: [
                    { name: 'Handwritten Digit Recognizer', description: 'Use MNIST dataset to train a basic neural network.', skills: ['Python', 'TensorFlow', 'NumPy'], why: 'The Hello World of AI/ML.' },
                    { name: 'Simple Linear Regression', description: 'Predict house prices using a small historical dataset.', skills: ['Scikit-learn', 'Matplotlib'], why: 'Foundational for predictive modeling.' }
                ],
                certs: [
                    { name: 'Python for Data Science', why: 'The primary language for AI.', learn: 'Libraries like Pandas and NumPy.' },
                    { name: 'AI For Everyone', why: 'High-level understanding of AI concepts.', learn: 'AI terminology and workflows.' }
                ]
            },
            Intermediate: {
                projects: [
                    { name: 'Movie Recommendation System', description: 'Build a content-based or collaborative filtering engine.', skills: ['Pandas', 'Cosine Similarity', 'Streamlit'], why: 'A classic real-world application of ML.' },
                    { name: 'Stock Price Sentiment Tracker', description: 'Analyze news headlines to predict market sentiment.', skills: ['NLP', 'Web Scraping', 'NLTK'], why: 'Shows multi-modal skill sets.' }
                ],
                certs: [
                    { name: 'Machine Learning Specialization', why: 'Deep dive into standard algorithms.', learn: 'Supervised and Unsupervised learning.' },
                    { name: 'Deep Learning Specialization', why: 'Essential for neural network mastery.', learn: 'CNNs, RNNs, and LSTMs.' }
                ]
            },
            Advanced: {
                projects: [
                    { name: 'Real-time Object Detection', description: 'Detect and label objects in a live video stream.', skills: ['OpenCV', 'YOLO v8', 'Python'], why: 'Highly advanced Computer Vision project.' },
                    { name: 'Custom GPT-style Chatbot', description: 'Fine-tune a large language model on a specific dataset.', skills: ['HuggingFace', 'PyTorch', 'Fine-tuning'], why: 'State-of-the-art Generative AI demonstration.' }
                ],
                certs: [
                    { name: 'Natural Language Processing', why: 'Specialization in text-based AI.', learn: 'Transformers, BERT, and Attention.' },
                    { name: 'Google Professional ML Engineer', why: 'Industry-standard certification.', learn: 'MLOps, Pipelines, and Scale.' }
                ]
            }
        },
        'Data Scientist': {
            Beginner: {
                projects: [
                    { name: 'Titanic Survival Analysis', description: 'Clean and explore the Titanic dataset to predict survival rates.', skills: ['Pandas', 'Matplotlib', 'Exploratory Data Analysis'], why: 'Essential for data cleaning and viz.' },
                    { name: 'Sales Insights Dashboard', description: 'Interactive dashboard showing sales trends over time.', skills: ['Python', 'Plotly', 'Excel'], why: 'Shows ability to communicate data insights.' }
                ],
                certs: [
                    { name: 'Data Analysis with Python', why: 'Core library mastery.', learn: 'Numpy, Pandas, and Matplotlib.' },
                    { name: 'Data Visualization', why: 'Critical for presentations.', learn: 'Tableau or PowerBI basics.' }
                ]
            },
            Intermediate: {
                projects: [
                    { name: 'Uber Data Analysis', description: 'Analyze trip patterns and peak hours in a large urban dataset.', skills: ['Big Data', 'Seaborn', 'Folium'], why: 'Demonstrates handling of large datasets.' },
                    { name: 'Customer Segmentation (RFM)', description: 'Segment customers based on Recency, Frequency, and Monetary value.', skills: ['K-Means Clustering', 'Marketing Analytics'], why: 'Practical business application of DS.' }
                ],
                certs: [
                    { name: 'Applied Data Science', why: 'Bridge theory and practice.', learn: 'Regression, Classification, and Clustering.' },
                    { name: 'SQL for Data Science', why: 'Mandatory skill for data extraction.', learn: 'Queries, Joins, and DB design.' }
                ]
            },
            Advanced: {
                projects: [
                    { name: 'Fraud Detection System', description: 'Identify fraudulent transactions in real-time using anomaly detection.', skills: ['Isolation Forest', 'Model Deployment', 'Flask'], why: 'High-stake real-world problem solving.' },
                    { name: 'Supply Chain Optimization', description: 'Optimize logistics and inventory using linear programming.', skills: ['Optimization', 'Operations Research', 'Python'], why: 'Advanced business impact demonstration.' }
                ],
                certs: [
                    { name: 'Data Science Specialization', why: 'Comprehensive mastery.', learn: 'Statistical Inference and Regression.' },
                    { name: 'Cloud Data Engineering', why: 'Deploying models at scale.', learn: 'Spark, Hadoop, and BigQuery.' }
                ]
            }
        }
    };

    // Default to Software Engineer if domain not listed
    const domain = data[goal] || data['Software Engineer'];
    appState.recommendations.projects = domain[level].projects;
    appState.recommendations.certificates = domain[level].certs;
}

