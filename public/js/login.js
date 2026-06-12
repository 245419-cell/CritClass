const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

signInBtn.addEventListener('click', () => {
  signInBtn.classList.add('active');
  signUpBtn.classList.remove('active');
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
});

signUpBtn.addEventListener('click', () => {
  signUpBtn.classList.add('active');
  signInBtn.classList.remove('active');
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
});
