(function(){
  // Detect base path (e.g., "/bioark-website-renaissance") for GitHub Pages; empty on local dev
  const basePath = (function(){
    try {
      const host = window.location.hostname;
      const isGhPages = /\.github\.io$/.test(host);
      if (isGhPages) {
        const segs = window.location.pathname.split('/').filter(Boolean);
        return segs.length ? '/' + segs[0] : '';
      }
      return '';
    } catch { return ''; }
  })();
  const tabs = document.querySelectorAll('.tab');
  const forms = {
    signin: document.getElementById('form-signin'),
    signup: document.getElementById('form-signup')
  };
  const signinError = document.getElementById('signin-error');
  const signupError = document.getElementById('signup-error');

  function activate(target){
    tabs.forEach(t => {
      const isActive = t.dataset.target === target;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });
    Object.entries(forms).forEach(([key, el]) => {
      el.classList.toggle('active', key === target);
    });
    clearError();
  }

  function clearError(){
    if (signinError){ signinError.hidden = true; signinError.textContent = ''; }
    if (signupError){ signupError.hidden = true; signupError.textContent = ''; }
  }

  tabs.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    const target = t.dataset.target;
    if(target) activate(target);
  }));
  document.querySelectorAll('[data-switch]')?.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('data-switch');
      if(target) activate(target);
    });
  });

  // Backend API base (set via ?api=..., or window.BIOARK_API_BASE, else default localhost)
  const API_BASE = (function(){
    try {
      const fromQuery = new URLSearchParams(window.location.search).get('api');
      if (fromQuery) return fromQuery;
    } catch {}
    if (window && window.BIOARK_API_BASE) return window.BIOARK_API_BASE;
    return 'http://localhost:4242';
  })();
  const TOKEN_KEY = 'bioark_auth_token';

  // Sign in handler
  forms.signin.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    const inputs = forms.signin.querySelectorAll('input');
    const email = inputs[0].value.trim();
    const password = inputs[1].value;
    if (!email || !password){
      signinError.hidden = false; signinError.textContent = 'Please enter email and password.'; return;
    }
    fetch(API_BASE + '/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(async r => {
      if (!r.ok) {
        const t = await r.json().catch(() => ({}));
        throw new Error(t.error || 'Sign in failed');
      }
      return r.json();
    }).then(({ token, user }) => {
      // Only store token locally; user data后端管理
      localStorage.setItem(TOKEN_KEY, token);
      if (user.role === 'Admin') {
        localStorage.setItem('bioark_admin_token', 'ok');
        window.location.href = basePath + '/admin';
      } else {
        window.location.href = basePath + '/';
      }
    }).catch(err => {
      signinError.hidden = false; signinError.textContent = err.message || 'Sign in failed';
    });
  });

  // Sign up handler
  forms.signup.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    const inputs = forms.signup.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    if (!name || !email || !password){
      signupError.hidden = false; signupError.textContent = 'Please fill in all fields.'; return;
    }
    fetch(API_BASE + '/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(async r => {
      if (!r.ok) {
        const t = await r.json().catch(() => ({}));
        throw new Error(t.error || 'Sign up failed');
      }
      return r.json();
    }).then(({ token }) => {
      localStorage.setItem(TOKEN_KEY, token);
      window.location.href = basePath + '/';
    }).catch(err => {
      signupError.hidden = false; signupError.textContent = err.message || 'Sign up failed';
    });
  });

  // Default view
  activate('signin');
})();
