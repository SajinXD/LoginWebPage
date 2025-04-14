        // Import the Firebase modules
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
        import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
        import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAir3oGfBxyusNpY5_EHLqojXv8ZBlSM9Q",
            authDomain: "loginwebpage-e8baf.firebaseapp.com",
            projectId: "loginwebpage-e8baf",
            storageBucket: "loginwebpage-e8baf.firebasestorage.app",
            messagingSenderId: "771550598169",
            appId: "1:771550598169:web:1480554a90b8145b770688",
            measurementId: "G-K4J6G8Q1DY",
            databaseURL: "https://loginwebpage-e8baf-default-rtdb.asia-southeast1.firebasedatabase.app/"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getDatabase(app);

        // Theme management
        document.addEventListener('DOMContentLoaded', function() {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme');
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const themeText = themeToggle.querySelector('.theme-text');
            
            // Apply saved theme if it exists
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light Mode';
            }
            
            // Theme toggle functionality
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('theme', 'dark');
                    themeIcon.textContent = '☀️';
                    themeText.textContent = 'Light Mode';
                } else {
                    localStorage.setItem('theme', 'light');
                    themeIcon.textContent = '🌙';
                    themeText.textContent = 'Dark Mode';
                }
            });

            // Tab switching
            const loginTab = document.getElementById('loginTab');
            const signupTab = document.getElementById('signupTab');
            const loginFormContainer = document.getElementById('loginFormContainer');
            const signupFormContainer = document.getElementById('signupFormContainer');

            loginTab.addEventListener('click', function() {
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
                loginFormContainer.classList.add('active');
                signupFormContainer.classList.remove('active');
            });

            signupTab.addEventListener('click', function() {
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
                signupFormContainer.classList.add('active');
                loginFormContainer.classList.remove('active');
            });

            // Login form submission
            const loginForm = document.getElementById('loginForm');
            const loginMessage = document.getElementById('loginMessage');

            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const rememberMe = document.getElementById('remember').checked;
                
                try {
                    // Sign in with Firebase Authentication
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    
                    // If remember me is checked, persist the auth state
                    if (rememberMe) {
                        // Firebase Auth persists by default in modern browsers
                        // This is a placeholder for any additional logic you might want
                        localStorage.setItem('userEmail', email);
                    }
                    
                    // Update login status in Realtime Database
                    const lastLoginRef = ref(db, 'users/' + user.uid + '/lastLogin');
                    await set(lastLoginRef, {
                        timestamp: new Date().toISOString(),
                        device: navigator.userAgent
                    });
                    
                    // Success message and redirect
                    loginMessage.textContent = "Login successful!";
                    loginMessage.className = "message success";
                    
                    // Simulate redirect (in a real app, you would redirect to a dashboard)
                    setTimeout(() => {
                        alert("Login successful! Redirecting to dashboard...");
                        // window.location.href = "/dashboard.html";
                    }, 1500);
                    
                } catch (error) {
                    // Handle errors
                    console.error("Login error:", error);
                    loginMessage.textContent = error.message;
                    loginMessage.className = "message error";
                }
            });
            
            const signupForm = document.getElementById('signupForm');
            const signupMessage = document.getElementById('signupMessage');

            signupForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                                
                if (password !== confirmPassword) {
                    signupMessage.textContent = "Passwords don't match";
                    signupMessage.className = "message error";
                    return;
                }
                
                try {                
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                                       
                    const userRef = ref(db, 'users/' + user.uid);
                    await set(userRef, {
                        name: name,
                        email: email,
                        createdAt: new Date().toISOString(),
                        lastLogin: {
                            timestamp: new Date().toISOString(),
                            device: navigator.userAgent
                        }
                    });
                    
                    
                    signupMessage.textContent = "Account created successfully!";
                    signupMessage.className = "message success";
                    
                    // Reset form
                    signupForm.reset();
                    
                    // Switch to login tab after a delay
                    setTimeout(() => {
                        loginTab.click();
                    }, 1500);
                    
                } catch (error) {
                    // Handle errors
                    console.error("Signup error:", error);
                    signupMessage.textContent = error.message;
                    signupMessage.className = "message error";
                }
            });

            // Forgot password link
            const forgotPassword = document.getElementById('forgotPassword');
            forgotPassword.addEventListener('click', function(e) {
                e.preventDefault();
                alert("Password reset functionality would be implemented here.");
                // In a real app, you would use Firebase's sendPasswordResetEmail() method
            });
        });