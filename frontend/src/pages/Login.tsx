import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Building2, Eye, EyeOff, AlertCircle, Mail, Lock, User, CheckCircle2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  // Switch between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState('sarah@vendorbridge.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form states
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // WebGL 3D Hologram ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    // ─── 1. Setup Scene, Camera, Renderer ───────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ─── 2. Procedural Glow Sprite Texture ──────────────────────────
    const createGlowTexture = () => {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, 'rgba(16, 185, 129, 1)');     // Pure neon green center
        grad.addColorStop(0.25, 'rgba(16, 185, 129, 0.7)'); // Soft inner bloom
        grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.15)'); // Soft outer halo
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');      // Transparent edge
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(c);
    };

    const particleTexture = createGlowTexture();

    // ─── 3. Mathematically Perfect Fibonacci Sphere ──────────────────
    const particleCount = 7000;
    const sphereRadius = 2.0;
    const sphereGeo = new THREE.BufferGeometry();
    const spherePositions = new Float32Array(particleCount * 3);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI * (1 - 1 / goldenRatio);

    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = sphereRadius * Math.sin(inclination) * Math.cos(azimuth);
      const y = sphereRadius * Math.sin(inclination) * Math.sin(azimuth);
      const z = sphereRadius * Math.cos(inclination);

      spherePositions[i * 3] = x;
      spherePositions[i * 3 + 1] = y;
      spherePositions[i * 3 + 2] = z;
    }

    sphereGeo.setAttribute('position', new THREE.BufferAttribute(spherePositions, 3));

    // ─── 4. Twinkling Shader Material ────────────────────────────────
    const uTime = { value: 0 };
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: uTime,
        uColor: { value: new THREE.Color(0x10b981) }, // Emerald Green
        uTexture: { value: particleTexture },
      },
      vertexShader: `
        uniform float uTime;
        varying float vTwinkle;
        void main() {
          float phase = sin(position.x * 12.0 + position.y * 8.0 + position.z * 4.0 + uTime * 3.0);
          vTwinkle = 0.6 + 0.4 * phase;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = (20.0 * (0.7 + 0.3 * vTwinkle)) / -mvPosition.z;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform sampler2D uTexture;
        varying float vTwinkle;
        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          if (texColor.a < 0.01) discard;
          gl_FragColor = vec4(uColor, texColor.a * (0.5 + 0.5 * vTwinkle));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const spherePoints = new THREE.Points(sphereGeo, sphereMat);
    scene.add(spherePoints);

    // ─── 5. Distant Green Twinkling Background Stars ──────────────────
    const starsCount = 800;
    const starsGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 80;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starTexture = createGlowTexture();
    const starsMat = new THREE.PointsMaterial({
      color: 0x059669,
      size: 0.12,
      map: starTexture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starfield = new THREE.Points(starsGeo, starsMat);
    scene.add(starfield);

    // ─── 6. Mouse Interaction & Drag-to-Rotate Physics ────────────────
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.0012 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y,
      };

      rotationVelocity.y = deltaMove.x * 0.005;
      rotationVelocity.x = deltaMove.y * 0.005;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const attachRef = parent;
    attachRef.addEventListener('mousedown', onPointerDown);
    attachRef.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    attachRef.addEventListener('touchstart', onPointerDown, { passive: true });
    attachRef.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // ─── 7. Animation Loop ──────────────────────────────────────────
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      spherePoints.rotation.y += rotationVelocity.y;
      spherePoints.rotation.x += rotationVelocity.x;

      starfield.rotation.y -= 0.0001;

      uTime.value += 0.012;

      if (!isDragging) {
        rotationVelocity.x *= 0.96;
        rotationVelocity.y = rotationVelocity.y * 0.96 + 0.0012 * 0.04;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ─── 8. Handle Resize ───────────────────────────────────────────
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      attachRef.removeEventListener('mousedown', onPointerDown);
      attachRef.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      attachRef.removeEventListener('touchstart', onPointerDown);
      attachRef.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      particleTexture.dispose();
      starTexture.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Invalid credentials. Try any email + password.');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!companyName || !fullName || !email || !taxId || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Space glow lights */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-green-950/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Column: 3D Earth Canvas */}
      <div className="flex-1 relative flex items-center justify-center min-h-[45vh] lg:min-h-screen cursor-grab active:cursor-grabbing select-none z-10">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
        
        {/* Futuristic Dashboard overlay overlays */}
        <div className="absolute bottom-8 left-8 hidden lg:block text-left space-y-1 bg-slate-900/40 border border-white/5 backdrop-blur-md px-4 py-3 rounded-xl pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold">Quantum Core Online</p>
          </div>
          <p className="text-white text-sm font-bold">Vector Field: Particle Sphere</p>
          <p className="text-slate-400 text-[10px]">Click & Drag sphere to rotate hologram</p>
        </div>
      </div>

      {/* Right Column: Premium Login/Signup Card */}
      <div className="w-full lg:w-[480px] flex items-center justify-center px-6 py-12 lg:py-0 bg-slate-950/30 lg:border-l lg:border-white/5 backdrop-blur-sm relative z-20">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          {isLogin ? (
            /* Form container card (Glassmorphic - Login) */
            <div className="bg-[#111827]/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] space-y-6">
              
              {/* Header / Logo */}
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex-shrink-0" />
                <div>
                  <p className="text-white font-heading font-extrabold text-lg leading-tight tracking-tight">VendorBridge</p>
                  <p className="text-emerald-400/80 text-[10px] uppercase tracking-widest font-semibold leading-tight">Procurement ERP</p>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">Welcome Back</h1>
                <p className="text-slate-400 text-xs mt-1">Sign in to access your secure quantum workspace</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Work Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all"
                      placeholder="you@company.com"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 text-slate-400 hover:text-slate-200 transition-fast"
                    >
                      {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200 transition-fast">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/10 bg-slate-900/80 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    Remember Me
                  </label>
                  <button type="button" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-fast">
                    Forgot Password?
                  </button>
                </div>

                {/* Error messages */}
                {error && (
                  <div className="flex items-center gap-2 text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 hover:opacity-95 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Establishing Connection…
                    </span>
                  ) : 'Authenticate Credentials'}
                </button>
              </form>

              {/* Toggle to Signup */}
              <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
                Don't have an onboarding profile?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-fast"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            /* Form container card (Glassmorphic - Signup) */
            <div className="bg-[#111827]/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.1)] space-y-4">
              
              {/* Header / Logo */}
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-xl object-cover border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)] flex-shrink-0" />
                <div>
                  <p className="text-white font-heading font-extrabold text-base leading-tight tracking-tight">VendorBridge</p>
                  <p className="text-emerald-400/80 text-[9px] uppercase tracking-widest font-semibold leading-tight">Procurement ERP</p>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-heading font-extrabold text-white tracking-tight">Onboarding Profile</h1>
                <p className="text-slate-400 text-[11px] mt-0.5">Submit credentials to register a node</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-3">
                {/* Company Name */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs transition-all"
                      placeholder="e.g. Acme Corporation"
                      required
                    />
                  </div>
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs transition-all"
                      placeholder="representative name"
                      required
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Work Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs transition-all"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Tax ID (EIN/TIN)</label>
                  <div className="relative flex items-center">
                    <Shield className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs transition-all"
                      placeholder="XX-XXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Confirm Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Error messages */}
                {error && (
                  <div className="flex items-center gap-2 text-[11px] text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 mt-1 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 hover:opacity-95 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting request...' : 'Register Credentials'}
                </button>
              </form>

              {/* Toggle to Signin */}
              <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
                Already registered in the ERP?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-fast"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 text-center text-slate-500 text-[10px] space-y-1">
            <p>© 2026 VendorBridge · Autonomous Space-ERP System</p>
            <p>Connection encrypted via TLS 1.3 · Node Secure</p>
          </div>
        </motion.div>
      </div>

      {/* Success Modal Popup Box */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-sm bg-[#111827] border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-bold text-white">Signup Successful</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Your supplier onboarding profile has been registered in the VendorBridge system successfully.
                </p>
              </div>

              <button
                onClick={handleSuccessModalClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:opacity-95 text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99]"
              >
                Go to Sign In
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
