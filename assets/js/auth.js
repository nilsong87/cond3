// auth.js - Sistema de Autenticação para Condomínio Premium

/**
 * Configurações globais
 */
const API_BASE_URL = 'https://api.condominiopremium.com/v1';
const TOKEN_KEY = 'condominium_auth_token';
const USER_DATA_KEY = 'condominium_user_data';

/**
 * Seletores DOM
 */
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');

/**
 * Event Listeners
 */
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', handleForgotPassword);
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', handleResetPassword);
}

/**
 * Função principal de login
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Validação básica
  if (!validateEmail(email)) {
    showAlert('Por favor, insira um e-mail válido', 'error');
    return;
  }
  
  if (password.length < 6) {
    showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }
  
  try {
    showLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Salva token e dados do usuário
      saveAuthData(data.token, data.user, rememberMe);
      
      // Redireciona com base no tipo de usuário
      redirectAfterLogin(data.user.role);
    } else {
      showAlert(data.message || 'Erro ao fazer login', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert('Erro de conexão com o servidor', 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * Função de registro de novo morador
 */
async function handleRegister(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('registerName').value,
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value,
    confirmPassword: document.getElementById('registerConfirmPassword').value,
    apartment: document.getElementById('registerApartment').value,
    phone: document.getElementById('registerPhone').value,
    cpf: document.getElementById('registerCpf').value
  };
  
  // Validações
  if (!validateRegisterForm(formData)) {
    return;
  }
  
  try {
    showLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('Registro realizado com sucesso! Aguarde aprovação.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      showAlert(data.message || 'Erro no registro', 'error');
    }
  } catch (error) {
    console.error('Register error:', error);
    showAlert('Erro de conexão com o servidor', 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * Função para recuperação de senha
 */
async function handleForgotPassword(e) {
  e.preventDefault();
  
  const email = document.getElementById('forgotEmail').value;
  
  if (!validateEmail(email)) {
    showAlert('Por favor, insira um e-mail válido', 'error');
    return;
  }
  
  try {
    showLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('E-mail de recuperação enviado com sucesso!', 'success');
    } else {
      showAlert(data.message || 'Erro ao enviar e-mail de recuperação', 'error');
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    showAlert('Erro de conexão com o servidor', 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * Função para resetar senha
 */
async function handleResetPassword(e) {
  e.preventDefault();
  
  const token = new URLSearchParams(window.location.search).get('token');
  const password = document.getElementById('resetPassword').value;
  const confirmPassword = document.getElementById('resetConfirmPassword').value;
  
  if (!token) {
    showAlert('Token inválido ou expirado', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showAlert('As senhas não coincidem', 'error');
    return;
  }
  
  if (password.length < 6) {
    showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }
  
  try {
    showLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('Senha alterada com sucesso!', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      showAlert(data.message || 'Erro ao alterar senha', 'error');
    }
  } catch (error) {
    console.error('Reset password error:', error);
    showAlert('Erro de conexão com o servidor', 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * Funções auxiliares
 */

// Validação de e-mail
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Validação de formulário de registro
function validateRegisterForm(formData) {
  if (formData.password !== formData.confirmPassword) {
    showAlert('As senhas não coincidem', 'error');
    return false;
  }
  
  if (formData.password.length < 6) {
    showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
    return false;
  }
  
  if (!validateEmail(formData.email)) {
    showAlert('Por favor, insira um e-mail válido', 'error');
    return false;
  }
  
  if (formData.name.length < 3) {
    showAlert('O nome deve ter pelo menos 3 caracteres', 'error');
    return false;
  }
  
  if (!formData.apartment) {
    showAlert('Por favor, informe o apartamento', 'error');
    return false;
  }
  
  return true;
}

// Salvar dados de autenticação
function saveAuthData(token, userData, rememberMe) {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
}

// Redirecionamento após login
function redirectAfterLogin(role) {
  switch(role) {
    case 'admin':
      window.location.href = 'admin/admin.html';
      break;
    case 'resident':
      window.location.href = 'resident/resident.html';
      break;
    case 'porter':
      window.location.href = 'porter/dashboard.html';
      break;
    default:
      window.location.href = 'dashboard.html';
  }
}

// Verificar autenticação ao carregar a página
function checkAuth() {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY);
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      redirectAfterLogin(user.role);
    } catch (error) {
      console.error('Error parsing user data:', error);
      clearAuthData();
    }
  }
}

// Limpar dados de autenticação
function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_DATA_KEY);
}

// Mostrar alerta
function showAlert(message, type = 'info') {
  const alertBox = document.createElement('div');
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  
  const container = document.querySelector('.auth-container') || document.body;
  container.prepend(alertBox);
  
  setTimeout(() => {
    alertBox.remove();
  }, 5000);
}

// Mostrar/ocultar loading
function showLoading(show) {
  const loader = document.getElementById('loadingOverlay');
  if (loader) {
    loader.style.display = show ? 'flex' : 'none';
  }
}

// Verificar autenticação quando o script carrega
document.addEventListener('DOMContentLoaded', checkAuth);

/**
 * Função de logout
 */
function logout() {
  clearAuthData();
  window.location.href = 'login.html';
}

// Exportar funções para uso em outros arquivos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    logout,
    checkAuth
  };
}