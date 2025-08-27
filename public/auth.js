(function(){
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

  // Simple localStorage-backed user store
  const STORE_KEY = 'bioark_users';
  function getUsers(){ try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } }
  function setUsers(list){ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }
  function upsertUser(user){
    const list = getUsers();
    const idx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) list[idx] = user; else list.push(user);
    setUsers(list);
  }
  // Seed an admin if missing (from existing admin.json email as a hint)
  (function seedAdmin(){
    const list = getUsers();
    const hasAdmin = list.some(u => u.role === 'Admin');
    if (!hasAdmin){
      // Default admin placeholder; user可在Admin中改密或后续接入真实后台
      upsertUser({ email: 'admin@bioark.com', name: 'BioArk Admin', password: 'Admin123!', role: 'Admin' });
    }
  })();

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
    const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password){
      signinError.hidden = false; signinError.textContent = 'Invalid email or password.'; return;
    }
    // Set session token
    localStorage.setItem('bioark_auth_user', JSON.stringify({ email: user.email, name: user.name, role: user.role }));
    // 兼容现有 Admin Portal 登录标记（用于进入 /admin）
    if (user.role === 'Admin'){
      localStorage.setItem('bioark_admin_token', 'ok');
      window.location.href = '/admin';
    } else {
      window.location.href = '/';
    }
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
    const exists = getUsers().some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists){ signupError.hidden = false; signupError.textContent = 'Email already registered.'; return; }
    // 默认注册为普通用户
    upsertUser({ email, name, password, role: 'User' });
    // 自动登录并跳转首页
    localStorage.setItem('bioark_auth_user', JSON.stringify({ email, name, role: 'User' }));
    window.location.href = '/';
  });

  // Default view
  activate('signin');
})();
