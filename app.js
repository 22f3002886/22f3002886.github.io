(function () {
  const cfg = window.PORTFOLIO;
  const COMMANDS = ["help", "about", "projects", "skills", "experience", "education", "contact", "resume", "sudo", "clear"];

  const logEl    = document.getElementById("log");
  const form     = document.getElementById("form");
  const input    = document.getElementById("input");
  const screen   = document.getElementById("screen");
  const chips    = document.getElementById("chips");
  const clock    = document.getElementById("clock");
  const promptEl = document.getElementById("prompt");
  const musicBtn = document.getElementById("music");
  const musicLabel = document.getElementById("music-label");
  const meBtn    = document.getElementById("me");

  /* Tab elements */
  const tabTerm         = document.getElementById("tab-term");
  const tabResume       = document.getElementById("tab-resume");
  const tabResumeClose  = document.getElementById("tab-resume-close");
  const tabResumeLabel  = document.getElementById("tab-resume-label");
  const termPane        = document.getElementById("term-pane");
  const resumePane      = document.getElementById("resume-pane");
  const resumeIframe    = document.getElementById("resume-iframe");
  const resumeFilename  = document.getElementById("resume-filename");
  const resumeDownloadBtn = document.getElementById("resume-download-btn");
  const resumeExternalBtn = document.getElementById("resume-external-btn");
  const resumePaneClose = document.getElementById("resume-pane-close");

  const resumeUrl   = cfg.resumeUrl   || "ABHISHEK KUMAR_ML_Resume.pdf";
  const resumeLabel = cfg.resumeLabel || "ABHISHEK KUMAR_ML_Resume.pdf";

  if (resumeFilename) resumeFilename.textContent = resumeLabel;
  if (tabResumeLabel) tabResumeLabel.textContent = resumeLabel.length > 20 ? resumeLabel.slice(0, 17) + "..." : resumeLabel;
  if (resumeDownloadBtn) {
    resumeDownloadBtn.href = resumeUrl;
    resumeDownloadBtn.setAttribute("download", resumeLabel);
  }
  if (resumeExternalBtn) {
    resumeExternalBtn.href = resumeUrl;
  }

  const titlebarEl = document.querySelector(".titlebar");

  function openResumeTab() {
    if (titlebarEl) titlebarEl.classList.add("has-tabs");
    if (tabResume) {
      tabResume.style.display = "inline-flex";
      tabResume.classList.add("active");
      tabResume.setAttribute("aria-selected", "true");
    }
    if (tabTerm) {
      tabTerm.classList.remove("active");
      tabTerm.setAttribute("aria-selected", "false");
    }
    if (termPane) termPane.style.display = "none";
    if (resumePane) resumePane.style.display = "flex";

    if (resumeIframe && (!resumeIframe.getAttribute("src") || resumeIframe.getAttribute("src") === "")) {
      resumeIframe.setAttribute("src", resumeUrl);
    }
  }

  function openTermTab() {
    if (tabTerm) {
      tabTerm.classList.add("active");
      tabTerm.setAttribute("aria-selected", "true");
    }
    if (tabResume) {
      tabResume.classList.remove("active");
      tabResume.setAttribute("aria-selected", "false");
    }
    if (resumePane) resumePane.style.display = "none";
    if (termPane) termPane.style.display = "flex";

    if (input) input.focus();
  }

  function closeResumeTab(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (tabResume) {
      tabResume.style.display = "none";
      tabResume.classList.remove("active");
    }
    if (titlebarEl) titlebarEl.classList.remove("has-tabs");
    openTermTab();
  }

  window.__openResumeTab = openResumeTab;

  if (tabTerm) tabTerm.addEventListener("click", openTermTab);
  if (tabResume) {
    tabResume.addEventListener("click", function (e) {
      if (e.target.closest("#tab-resume-close")) return;
      openResumeTab();
    });
  }
  if (tabResumeClose) tabResumeClose.addEventListener("click", closeResumeTab);
  if (resumePaneClose) resumePaneClose.addEventListener("click", closeResumeTab);

  document.getElementById("name").textContent  = cfg.name;
  document.getElementById("title").textContent = cfg.title;
  document.title = cfg.name + " | " + cfg.title;

  promptEl.innerHTML = promptInner();

  COMMANDS.forEach(function (cmd, i) {
    if (i) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "|";
      chips.appendChild(sep);
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = cmd;
    btn.addEventListener("click", function () { run(cmd); });
    chips.appendChild(btn);
  });

  const past = [];
  let histIndex = -1;
  let busy      = false;
  let audio     = null;
  let playing   = false;

  /* ── utilities ─────────────────────────────────────────── */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function link(href, label, cls) {
    return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer"' +
      (cls ? ' class="' + cls + '"' : '') + '>' + esc(label) + "</a>";
  }

  function promptInner() {
    return (
      '<span class="user">'  + esc(cfg.username) + "</span>" +
      '<span class="host">@' + esc(cfg.hostname) + "</span>" +
      '<span class="path">:~$</span>'
    );
  }

  function scrollDown() { screen.scrollTop = screen.scrollHeight; }

  /* ── clock ──────────────────────────────────────────────── */
  function tick() {
    clock.textContent = new Date().toLocaleString("en-US", {
      month: "2-digit", day: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ── command text builders ─────────────────────────────── */
  function helpText() {
    return [
      "Available commands:",
      "",
      "  • help        Show this help message",
      "  • about       Background and what I'm about",
      "  • projects    Portfolio projects with links",
      "  • skills      Technical skills and tools",
      "  • experience  Work history",
      "  • education   Academic background",
      "  • contact     Email and social links",
      "  • resume      Download my résumé (PDF)",
      "  • sudo        Try to gain admin access (spoiler: no)",
      "  • clear       Clear the terminal screen",
      "",
      "↑ / ↓ arrow keys cycle through command history."
    ].join("\n");
  }

  /* Projects: rich box-drawing cards rendered as HTML */
  function projectsHTML() {
    let html = '<p class="proj-label">Featured Projects</p><div class="proj-grid">';
    cfg.projects.forEach(function (p, idx) {
      const num = String(idx + 1).padStart(2, '0');
      const techArr = Array.isArray(p.tech) ? p.tech : p.tech.split(',').map(function (t) { return t.trim(); });
      const badges  = techArr.map(function (t) { return '<span class="badge">' + esc(t) + '</span>'; }).join('');
      const btns    = [];
      if (p.github) btns.push('<a class="proj-btn proj-btn-gh"  href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">⌥ ' + esc(p.githubLabel) + '</a>');
      if (p.demo)   btns.push('<a class="proj-btn proj-btn-demo" href="' + esc(p.demo)   + '" target="_blank" rel="noopener noreferrer">↗ ' + esc(p.demoLabel)   + '</a>');
      html += '<div class="proj-card">';
      html += '<div class="proj-card-inner">';
      html += '<div class="proj-card-top"><span class="proj-num">' + num + '</span><h3 class="proj-name">' + esc(p.name) + '</h3></div>';
      html += '<div class="proj-tech">' + badges + '</div>';
      html += '<p class="proj-summary">' + esc(p.summary) + '</p>';
      if (p.details) html += '<p class="proj-detail">' + esc(p.details) + '</p>';
      if (btns.length) html += '<div class="proj-links">' + btns.join('') + '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  function skillsText() {
    const lines = ["Skills:", ""];
    cfg.skills.forEach(function (s) {
      lines.push("• " + s.group + ": " + s.items);
    });
    if (cfg.focus && cfg.focus.length) {
      lines.push("", "Current focus:");
      cfg.focus.forEach(function (f) { lines.push("• " + f); });
    }
    return lines.join("\n");
  }

  function experienceText() {
    if (!cfg.experience || !cfg.experience.length) {
      return "Experience data not set — add it in content.js.";
    }
    const lines = ["Work Experience:", ""];
    cfg.experience.forEach(function (e) {
      lines.push("  " + e.role + "  @  " + e.company);
      lines.push("  " + e.when);
      e.bullets.forEach(function (b) { lines.push("    • " + b); });
      lines.push("");
    });
    return lines.join("\n").trimEnd();
  }

  function educationText() {
    const lines = ["Education:", ""];
    cfg.education.forEach(function (e) {
      lines.push("  " + e.school);
      lines.push("  " + e.credential + "  ·  " + e.when);
      if (e.note) lines.push("  " + e.note);
      lines.push("");
    });
    return lines.join("\n").trimEnd();
  }

  function contactText() {
    return [
      "Get In Touch:",
      "",
      "Email:     " + cfg.email,
      "GitHub:    " + cfg.githubLabel + "||" + cfg.github,
      "LinkedIn:  " + cfg.linkedinLabel + "||" + cfg.linkedin,
      "Kaggle:    " + cfg.kaggleLabel + "||" + cfg.kaggle,
    ].join("\n");
  }

  function resumeHTML() {
    const label = cfg.resumeLabel || "ABHISHEK KUMAR_ML_Resume.pdf";
    return (
      "Opening " + esc(label) + " in a new terminal tab...\n\n" +
      '<button class="resume-btn" type="button" id="log-open-resume">' +
      '📄 View ' + esc(label) + ' (Tab)' +
      '</button>'
    );
  }

  function sudoText() {
    return [
      "[sudo] password for " + cfg.username + ":",
      "",
      "Sorry, try again.",
      "[sudo] password for " + cfg.username + ":",
      "",
      "sudo: 3 incorrect password attempts",
      "",
      "Nice try — this is a portfolio, not a real terminal.",
    ].join("\n");
  }

  /* ── render helpers ─────────────────────────────────────── */
  function renderBody(text) {
    return esc(text).replace(/([^&\n<]+)\|\|([^\s<]+)/g, function (_, label, href) {
      return link(href, label);
    });
  }

  /* ── command resolver ───────────────────────────────────── */
  function resolve(raw) {
    const cmd = raw.trim().toLowerCase();
    if (cmd === "help")                    return { html: renderBody(helpText()),    error: false };
    if (cmd === "about" || cmd === "whoami") return { html: renderBody(cfg.about),  error: false };
    if (cmd === "projects")                return { html: projectsHTML(),            error: false, raw: true };
    if (cmd === "skills")                  return { html: renderBody(skillsText()),  error: false };
    if (cmd === "experience")              return { html: renderBody(experienceText()), error: false };
    if (cmd === "education")               return { html: renderBody(educationText()), error: false };
    if (cmd === "contact")                 return { html: renderBody(contactText()), error: false };
    if (cmd === "resume")                  return { html: resumeHTML(),              error: false, raw: true };
    if (cmd === "sudo")                    return { html: renderBody(sudoText()),    error: false };
    if (cmd === "welcome")                 return { html: renderBody(cfg.welcome),   error: false };
    return {
      html: renderBody("bash: " + raw.trim() + ": command not found\n\nType 'help' to see available commands."),
      error: true,
    };
  }

  /* ── typewriter ─────────────────────────────────────────── */
  function typeInto(el, html, done) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const full = tmp.textContent || "";
    let i = 0;
    el.textContent = "";
    const step = function () {
      if (i >= full.length) { el.innerHTML = html; done(); return; }
      const jump = full.length > 700 ? 4 : full.length > 320 ? 2 : 1;
      i = Math.min(full.length, i + jump);
      el.textContent = full.slice(0, i);
      scrollDown();
      setTimeout(step, full.length > 500 ? 7 : 11);
    };
    step();
  }

  /* ── append entry ───────────────────────────────────────── */
  function appendEntry(command, html, isError, animate, isRaw) {
    const entry = document.createElement("div");
    entry.className = "entry";
    const line = document.createElement("div");
    line.className = "cmd-line";
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.innerHTML = promptInner();
    const typed = document.createElement("span");
    typed.className = "typed";
    typed.textContent = command;
    line.appendChild(prompt);
    line.appendChild(typed);
    const out = document.createElement("div");
    out.className = "out" + (isError ? " error" : "");
    entry.appendChild(line);
    entry.appendChild(out);
    logEl.appendChild(entry);
    if (!animate || isRaw) {
      out.innerHTML = html;
      scrollDown();
      if (isRaw) { busy = false; input.disabled = false; input.focus(); }
      return;
    }
    typeInto(out, html, function () {
      busy = false;
      input.disabled = false;
      input.focus();
      scrollDown();
    });
  }

  /* ── run ────────────────────────────────────────────────── */
  function run(raw) {
    const text = String(raw || "").trim();
    if (!text || busy) return;
    if (text.toLowerCase() === "clear") {
      logEl.innerHTML = "";
      input.value = "";
      histIndex = -1;
      input.focus();
      return;
    }
    busy = true;
    input.disabled = true;
    past.push(text);
    histIndex = -1;
    input.value = "";
    const result = resolve(text);
    appendEntry(text, result.html, result.error, true, result.raw);

    if (text.toLowerCase() === "resume") {
      setTimeout(function () {
        openResumeTab();
      }, 350);
    }
  }

  /* ── events ─────────────────────────────────────────────── */
  form.addEventListener("submit", function (e) { e.preventDefault(); run(input.value); });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.length) return;
      histIndex = histIndex < 0 ? past.length - 1 : Math.max(0, histIndex - 1);
      input.value = past[histIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex < 0) return;
      histIndex += 1;
      if (histIndex >= past.length) { histIndex = -1; input.value = ""; }
      else { input.value = past[histIndex]; }
    }
  });

  screen.addEventListener("click", function (e) {
    const rBtn = e.target.closest("#log-open-resume, .resume-btn");
    if (rBtn) {
      e.preventDefault();
      openResumeTab();
      return;
    }
    if (e.target.closest("a, button")) return;
    input.focus();
  });

  meBtn.addEventListener("click", function () { run("about"); });

  /* ── boot ───────────────────────────────────────────────── */
  function boot(animate) {
    appendEntry("welcome", renderBody(cfg.welcome), false, animate, false);
    if (!animate) input.focus();
  }

  /* ── Background Music Player ── */
  let bgAudio = null;
  const musicFile = cfg.musicFile || "music.mp3";
  const musicTitle = cfg.musicTitle || "Tum Hi Ho (Aashiqui 2)";

  const playIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const pauseIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  function toggleMusic() {
    if (!bgAudio) {
      bgAudio = new Audio(musicFile);
      bgAudio.loop = true;
      bgAudio.volume = 0.55;

      bgAudio.addEventListener("play", function () {
        musicBtn.setAttribute("aria-pressed", "true");
        musicBtn.innerHTML = pauseIcon + '<span>♪ Playing: ' + esc(musicTitle) + '</span>';
      });

      bgAudio.addEventListener("pause", function () {
        musicBtn.setAttribute("aria-pressed", "false");
        musicBtn.innerHTML = playIcon + '<span>Wanna hear some music</span>';
      });

      bgAudio.addEventListener("ended", function () {
        musicBtn.setAttribute("aria-pressed", "false");
        musicBtn.innerHTML = playIcon + '<span>Wanna hear some music</span>';
      });

      bgAudio.addEventListener("error", function (e) {
        console.error("Audio failed to load:", e);
        musicBtn.setAttribute("aria-pressed", "false");
        musicBtn.innerHTML = playIcon + '<span style="color:#f87171;">Could not load ' + esc(musicFile) + '</span>';
        setTimeout(function () {
          musicBtn.innerHTML = playIcon + '<span>Wanna hear some music</span>';
        }, 3500);
      });
    }

    if (!bgAudio.paused) {
      bgAudio.pause();
    } else {
      bgAudio.play().catch(function (err) {
        console.error("Audio playback error:", err);
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic);
  }

  /* ── 3D tilt on portrait ─────────────────────────────────── */
  (function () {
    const fig = document.querySelector(".portrait");
    if (!fig) return;
    const TILT = 14, P = 700;

    /* inject glare layer */
    const glare = document.createElement("div");
    glare.className = "portrait-glare";
    fig.appendChild(glare);

    fig.addEventListener("mousemove", function (e) {
      const r  = fig.getBoundingClientRect();
      const nx = (e.clientX - r.left)  / r.width  - 0.5;  /* -0.5 → 0.5 */
      const ny = (e.clientY - r.top)   / r.height - 0.5;
      const rX = ny * -TILT * 2;
      const rY = nx *  TILT * 2;
      fig.style.transition = "transform 0.08s ease";
      fig.style.transform  =
        "perspective(" + P + "px) rotateX(" + rX + "deg) rotateY(" + rY + "deg) scale3d(1.04,1.04,1.04)";
      glare.style.background =
        "radial-gradient(circle at " + ((nx + 0.5) * 100) + "% " + ((ny + 0.5) * 100) + "%, " +
        "rgba(255,255,255,0.18) 0%, transparent 65%)";
    });

    fig.addEventListener("mouseleave", function () {
      fig.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
      fig.style.transform  = "perspective(" + P + "px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      glare.style.background = "none";
    });
  })();

  boot(false);
})();