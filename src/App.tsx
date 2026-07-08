import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Mail,
  Gift,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  X,
  Camera,
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  Printer,
  RefreshCw,
  Check,
  Eye,
  Heart,
  ShieldCheck,
  Compass,
  Plus,
  Edit3,
  Trash2,
  User as UserIcon,
  FileText,
  Sparkles,
  Lock,
  Building,
  Target
} from 'lucide-react';

import { TabType, MonthlyStat } from './types';
import { INITIAL_MONTHLY_STATS } from './data';
import {
  Employee,
  Attendance,
  getEmployees,
  saveEmployee,
  deleteEmployee,
  getAttendances,
  saveAttendance,
  changePassword
} from './utils/db';

import CircularProgress from './components/CircularProgress';
import WorkoutGauge from './components/WorkoutGauge';
import StatsChart from './components/StatsChart';

export default function App() {
  // Theme & session states
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'KARYAWAN_INTERNAL' | 'KARYAWAN_OUTSOURCING' | 'KARYAWAN_MAGANG' | 'KLIEN'>('KARYAWAN_OUTSOURCING');
  
  // Login fields
  const [selectedLoginRole, setSelectedLoginRole] = useState<string>('ADMIN');
  const [loginEmail, setLoginEmail] = useState('admin@bss.co.id');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('bss-dashboard');

  // DB Lists state
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [attendancesList, setAttendancesList] = useState<Attendance[]>([]);

  // Simulation charts state
  const [stats, setStats] = useState<MonthlyStat[]>(INITIAL_MONTHLY_STATS);
  const [workoutGaugeVal, setWorkoutGaugeVal] = useState(81);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterClient, setFilterClient] = useState('');

  // Modals state
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditingSelf, setIsEditingSelf] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'pribadi' | 'kontrak' | 'keuangan'>('pribadi');

  // Form inputs for CRUD
  const [formData, setFormData] = useState<Employee>({
    id: '',
    email: '',
    nikKtp: '',
    namaLengkap: '',
    nikKaryawan: '',
    tempatLahir: '',
    tanggalLahir: '',
    pendidikan: '',
    namaIbuKandung: '',
    alamat: '',
    gender: 'LAKI_LAKI',
    jabatan: '',
    role: 'KARYAWAN_OUTSOURCING',
    periodePkwtAwal: '',
    periodePkwtAkhir: '',
    pencatatanPkwt: '',
    nomorPkwt: '',
    upah: 0,
    rekeningMandiri: '',
    noBpjsKesehatan: '',
    noBpjsKetenagakerjaan: '',
    npwp: '',
    statusKaryawan: 'BELUM_KAWIN',
    note: '',
    noTlp: '',
    noDarurat: '',
    ukuranBaju: 'L',
    ukuranCelana: '32',
    ukuranSepatu: '40',
    typeOust: 'Outsourcing',
    batch: '',
    cuti: '12',
    clientAssigned: 'PT. Pertamina'
  });

  // Self change password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Webcam & Location states (For clock in)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsError, setGpsError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceSuccessMsg, setAttendanceSuccessMsg] = useState(false);
  const [assignedClientLocation, setAssignedClientLocation] = useState('Remote / WFH (Rumah)');

  // Selected Log for detail popup modal
  const [selectedLog, setSelectedLog] = useState<Attendance | null>(null);

  // Notifications popup panels
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const employees = getEmployees();
    setEmployeesList(employees);
    setAttendancesList(getAttendances());

    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const found = employees.find(e => e.id === storedUserId);
        if (found) {
          setCurrentUser(found);
          setRole(found.role);
          setIsLoggedIn(true);
          setAssignedClientLocation(found.clientAssigned || 'Remote / WFH (Rumah)');
        }
      }
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  }, []);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const employees = getEmployees();
    const found = employees.find(emp => emp.email.toLowerCase() === loginEmail.toLowerCase());

    if (!found) {
      setLoginError('Email tidak terdaftar!');
      return;
    }

    const checkPass = found.password || 'password123';
    if (checkPass !== loginPassword) {
      setLoginError('Password salah!');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', found.id);
      localStorage.setItem('userRole', found.role);
    }

    setCurrentUser(found);
    setRole(found.role);
    setIsLoggedIn(true);
    setAssignedClientLocation(found.clientAssigned || 'Remote / WFH (Rumah)');
    setActiveTab('bss-dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Switcher Simulation handler
  const handleUserSwitcherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const employees = getEmployees();
    const found = employees.find(emp => emp.id === selectedId);
    if (found) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', found.id);
        localStorage.setItem('userRole', found.role);
      }
      setCurrentUser(found);
      setRole(found.role);
      setAssignedClientLocation(found.clientAssigned || 'Remote / WFH (Rumah)');
      setCapturedImage(null);
      setAttendanceSuccessMsg(false);
      setPasswordError('');
      setPasswordSuccess('');
      setActiveTab('bss-dashboard');
    }
  };

  // Stats adding helper (Fito visual mockup chart compat)
  const handleAddStat = (newStat: MonthlyStat) => {
    setStats((prev) => {
      const idx = prev.findIndex((s) => s.month === newStat.month);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = newStat;
        return updated;
      }
      return [...prev, newStat];
    });
  };

  // Close top dropdowns
  const closeAllDropdowns = () => {
    setShowNotifications(false);
    setShowMessages(false);
    setShowGifts(false);
    setShowProfile(false);
  };

  // CRUD Tambah Karyawan
  const handleAddOpen = () => {
    setSelectedEmployee(null);
    setActiveFormTab('pribadi');
    setFormData({
      id: '',
      email: '',
      nikKtp: '',
      namaLengkap: '',
      nikKaryawan: '',
      tempatLahir: '',
      tanggalLahir: '',
      pendidikan: '',
      namaIbuKandung: '',
      alamat: '',
      gender: 'LAKI_LAKI',
      jabatan: '',
      role: 'KARYAWAN_OUTSOURCING',
      periodePkwtAwal: '',
      periodePkwtAkhir: '',
      pencatatanPkwt: '',
      nomorPkwt: '',
      upah: 4500000,
      rekeningMandiri: '',
      noBpjsKesehatan: '',
      noBpjsKetenagakerjaan: '',
      npwp: '',
      statusKaryawan: 'BELUM_KAWIN',
      note: '',
      noTlp: '',
      noDarurat: '',
      ukuranBaju: 'L',
      ukuranCelana: '32',
      ukuranSepatu: '40',
      typeOust: 'Outsourcing',
      batch: '',
      cuti: '12',
      clientAssigned: 'PT. Pertamina'
    });
    setIsCrudModalOpen(true);
  };

  // CRUD Edit Karyawan
  const handleEditOpen = (emp: Employee) => {
    setSelectedEmployee(emp);
    setActiveFormTab('pribadi');
    setFormData({ ...emp });
    setIsCrudModalOpen(true);
  };

  // CRUD Hapus Karyawan
  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
      deleteEmployee(id);
      setEmployeesList(getEmployees());
    }
  };

  // CRUD Submit
  const handleCrudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmployee({
      ...formData,
      upah: Number(formData.upah)
    });
    setIsCrudModalOpen(false);
    setEmployeesList(getEmployees());
  };

  // Self Profile Submit (Employee edit contacts/seragam)
  const handleSelfProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      email: formData.email,
      noTlp: formData.noTlp,
      noDarurat: formData.noDarurat,
      alamat: formData.alamat,
      ukuranBaju: formData.ukuranBaju,
      ukuranCelana: formData.ukuranCelana,
      ukuranSepatu: formData.ukuranSepatu
    };
    saveEmployee(updated);
    setCurrentUser(updated);
    setEmployeesList(getEmployees());
    setIsEditingSelf(false);
    alert('Profil Anda berhasil diperbarui!');
  };

  // Self Change Password Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentUser) return;

    const currentPass = currentUser.password || 'password123';
    if (oldPassword !== currentPass) {
      setPasswordError('Password lama tidak sesuai!');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal harus 6 karakter!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password baru tidak cocok!');
      return;
    }

    changePassword(currentUser.id, newPassword);
    const updated = { ...currentUser, password: newPassword };
    setCurrentUser(updated);
    setEmployeesList(getEmployees());
    
    setPasswordSuccess('Password Anda berhasil diperbarui!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Camera initialization hook (for clock tab)
  useEffect(() => {
    if (!isLoggedIn || activeTab !== 'bss-absensi') return;
    if (role === 'ADMIN' || role === 'KLIEN') return;

    let stream: MediaStream | null = null;
    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError('Gagal mengakses kamera. Menggunakan visual simulasi (Fallback)');
        generateMockSelfie();
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLoggedIn, activeTab, role]);

  // GPS Location fetcher hook (for clock tab)
  useEffect(() => {
    if (!isLoggedIn || activeTab !== 'bss-absensi') return;
    if (role === 'ADMIN' || role === 'KLIEN') return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        () => {
          setGpsError('Izin GPS ditolak/tidak aktif. Menggunakan koordinat simulasi.');
          generateMockCoords();
        }
      );
    } else {
      setGpsError('Browser tidak mendukung GPS. Menggunakan koordinat simulasi.');
      generateMockCoords();
    }
  }, [isLoggedIn, activeTab, role]);

  const generateMockSelfie = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
    ];
    let picked = avatars[0];
    if (currentUser?.id === 'emp-1') picked = avatars[0];
    if (currentUser?.id === 'emp-2') picked = avatars[1];
    if (currentUser?.id === 'emp-3') picked = avatars[2];
    if (currentUser?.id === 'emp-4') picked = avatars[3];
    setCapturedImage(picked);
  };

  const generateMockCoords = () => {
    setGpsLocation({
      latitude: -6.2088 + (Math.random() - 0.5) * 0.04,
      longitude: 106.8456 + (Math.random() - 0.5) * 0.04
    });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
      }
    } else {
      generateMockSelfie();
    }
  };

  const handleClockSubmit = (type: 'Clock-In' | 'Clock-Out') => {
    if (!currentUser || !capturedImage || !gpsLocation) return;
    setIsSubmittingAttendance(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const logList = getAttendances();
    const existingIndex = logList.findIndex(l => l.userId === currentUser.id && l.date === todayStr);

    if (type === 'Clock-Out' && existingIndex !== -1) {
      const updatedLog = {
        ...logList[existingIndex],
        checkOut: new Date().toISOString()
      };
      saveAttendance(updatedLog);
    } else {
      const newLog: Attendance = {
        id: 'att-' + Date.now(),
        userId: currentUser.id,
        nama: currentUser.namaLengkap,
        role: currentUser.role,
        date: todayStr,
        checkIn: new Date().toISOString(),
        checkOut: null,
        photoUrl: capturedImage,
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        locationName: assignedClientLocation,
        status: 'HADIR'
      };
      saveAttendance(newLog);
    }

    setTimeout(() => {
      setIsSubmittingAttendance(false);
      setAttendanceSuccessMsg(true);
      setAttendancesList(getAttendances());
      setCapturedImage(null);
    }, 1200);
  };

  // Filtered employees for Admin/Client tables
  const filteredEmployees = useMemo(() => {
    return employeesList.filter(emp => {
      const matchesSearch = emp.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (emp.nikKaryawan && emp.nikKaryawan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (emp.jabatan && emp.jabatan.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole ? emp.role === filterRole : true;
      let matchesClient = true;
      if (role === 'KLIEN') {
        matchesClient = emp.clientAssigned === currentUser?.clientAssigned && emp.role !== 'KLIEN';
      } else if (filterClient) {
        matchesClient = emp.clientAssigned === filterClient;
      }
      return matchesSearch && matchesRole && matchesClient && emp.role !== 'KLIEN';
    });
  }, [employeesList, searchTerm, filterRole, filterClient, role, currentUser]);

  const uniqueClients = useMemo(() => {
    return Array.from(new Set(employeesList.filter(e => e.clientAssigned).map(e => e.clientAssigned)));
  }, [employeesList]);

  // Employee Count Report per Mitra Perusahaan (Client)
  const clientCountReport = useMemo(() => {
    const activeStaff = employeesList.filter(emp => emp.role !== 'ADMIN' && emp.role !== 'KLIEN');
    const counts: { [key: string]: { total: number; internal: number; outsourcing: number; magang: number } } = {};
    
    activeStaff.forEach(emp => {
      const client = emp.clientAssigned || 'Belum Ditempatkan';
      if (!counts[client]) {
        counts[client] = { total: 0, internal: 0, outsourcing: 0, magang: 0 };
      }
      counts[client].total += 1;
      if (emp.role === 'KARYAWAN_INTERNAL') counts[client].internal += 1;
      else if (emp.role === 'KARYAWAN_OUTSOURCING') counts[client].outsourcing += 1;
      else if (emp.role === 'KARYAWAN_MAGANG') counts[client].magang += 1;
    });

    return Object.entries(counts).map(([client, data]) => ({
      client,
      ...data
    })).sort((a, b) => b.total - a.total);
  }, [employeesList]);

  // Today's attendance stats for admin & clients
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = useMemo(() => {
    return attendancesList.filter(att => att.date === todayStr);
  }, [attendancesList, todayStr]);

  const filteredLogs = useMemo(() => {
    return attendancesList.filter(log => {
      const matchesSearch = log.nama.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesClient = true;
      if (role === 'KLIEN') {
        const clientName = currentUser?.clientAssigned;
        const emp = employeesList.find(e => e.id === log.userId);
        matchesClient = emp ? emp.clientAssigned === clientName : false;
      }
      return matchesSearch && matchesClient;
    });
  }, [attendancesList, searchTerm, role, currentUser, employeesList]);

  // Employee stats calculations
  const myLogs = useMemo(() => {
    return attendancesList.filter(log => log.userId === currentUser?.id);
  }, [attendancesList, currentUser]);

  const myTodayLog = useMemo(() => {
    return myLogs.find(log => log.date === todayStr);
  }, [myLogs, todayStr]);

  const presentPercent = useMemo(() => {
    const presentCount = myLogs.filter(l => l.status === 'HADIR').length;
    return Math.min(100, Math.round((presentCount / 22) * 100));
  }, [myLogs]);

  // Layout Side Navigation mapping
  const navItems = useMemo(() => {
    const items = [{ name: 'Dashboard', path: 'bss-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> }];
    if (role === 'ADMIN') {
      items.push({ name: 'Master Karyawan', path: 'bss-karyawan', icon: <Users className="w-5 h-5" /> });
      items.push({ name: 'Laporan Absensi', path: 'bss-absensi', icon: <Clock className="w-5 h-5" /> });
    } else if (role === 'KLIEN') {
      items.push({ name: 'Laporan Pekerja', path: 'bss-karyawan', icon: <Users className="w-5 h-5" /> });
      items.push({ name: 'Rekapan Absensi', path: 'bss-absensi', icon: <Clock className="w-5 h-5" /> });
    } else {
      items.push({ name: 'Absen Harian', path: 'bss-absensi', icon: <Clock className="w-5 h-5" /> });
      items.push({ name: 'Profil & Password', path: 'bss-karyawan', icon: <Users className="w-5 h-5" /> });
    }
    return items;
  }, [role]);

  const roleDisplayNames = {
    'ADMIN': 'Administrator',
    'KARYAWAN_INTERNAL': 'Karyawan Internal',
    'KARYAWAN_OUTSOURCING': 'Karyawan Outsourcing',
    'KARYAWAN_MAGANG': 'Karyawan Magang',
    'KLIEN': 'Klien / Partner'
  };

  const getProfileImage = (user: Employee | null) => {
    if (!user) return 'https://i.pravatar.cc/100';
    if (user.role === 'ADMIN') return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
    if (user.role === 'KLIEN') return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100';
    if (user.id === 'emp-1') return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
    if (user.id === 'emp-2') return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100';
    if (user.id === 'emp-3') return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100';
    if (user.id === 'emp-4') return 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100';
    return `https://i.pravatar.cc/100?u=${user.id}`;
  };

  // --- RENDER LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
        {/* Left Green Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-emerald-600 text-white flex-1 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full rotate-45"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-white/5 rounded-full rotate-45"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-md">
              <Heart className="w-5 h-5 fill-emerald-600 stroke-emerald-600" />
            </div>
            <span className="text-xl font-black">PT. BSS APP</span>
          </div>

          <div className="relative z-10 max-w-lg space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Sistem Informasi Absensi & Data Karyawan</h1>
            <p className="text-emerald-100 leading-relaxed text-sm">
              Kelola data master personal, penugasan kontrak kerja mitra, laporan absensi digital selfie-GPS, dan parameter penggajian secara digital terintegrasi.
            </p>
          </div>

          <p className="relative z-10 text-xs text-emerald-200">
            Copyright © PT. BSS Outsourcing Indonesia 2026
          </p>
        </div>

        {/* Right Form Card */}
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Sign In</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-6">Pilih profile simulasi atau masukkan kredensial terdaftar.</p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Simulation selector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Simulasi Role (Autofill)</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 outline-none text-slate-800 dark:text-slate-100"
                  value={selectedLoginRole}
                  onChange={(e) => {
                    const r = e.target.value;
                    setSelectedLoginRole(r);
                    const defaults: { [key: string]: { email: string; pass: string } } = {
                      'ADMIN': { email: 'admin@bss.co.id', pass: 'password123' },
                      'KARYAWAN_INTERNAL': { email: 'sholeh@bss.co.id', pass: 'password123' },
                      'KARYAWAN_OUTSOURCING': { email: 'desi@bss.co.id', pass: 'password123' },
                      'KARYAWAN_MAGANG': { email: 'hilmy@bss.co.id', pass: 'password123' },
                      'KLIEN': { email: 'hr.pertamina@pertamina.com', pass: 'password123' }
                    };
                    if (defaults[r]) {
                      setLoginEmail(defaults[r].email);
                      setLoginPassword(defaults[r].pass);
                    }
                  }}
                >
                  <option value="ADMIN">Admin (Administrator Utama)</option>
                  <option value="KARYAWAN_INTERNAL">Karyawan Internal (Muhamad Sholeh)</option>
                  <option value="KARYAWAN_OUTSOURCING">Karyawan Outsourcing (Desi Putri)</option>
                  <option value="KARYAWAN_MAGANG">Karyawan Magang (Hilmy Nur)</option>
                  <option value="KLIEN">Klien / Mitra (Pertamina HR)</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {loginError && (
                <div className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/50">
                  ⚠️ {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER LOGGED IN MAIN LAYOUT ---
  return (
    <div className={darkMode ? 'dark font-sans text-slate-100' : 'font-sans text-slate-800'}>
      <div className="min-h-screen bg-[#f5f7f5] dark:bg-slate-950 flex transition-colors duration-300">
        
        {/* Mobile Sidebar Backdrop Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 shrink-0 border-r border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between z-50 lg:z-40 no-print ${
            sidebarOpen 
              ? 'w-64 px-5 py-6 translate-x-0' 
              : 'w-64 lg:w-0 overflow-hidden px-0 py-6 border-r-0 -translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Logo Area */}
              <div className="flex items-center gap-2.5 pb-6 border-b border-slate-50 dark:border-slate-800/80 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                  <span className="font-black text-lg">B</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight leading-none truncate">
                    PT. BSS
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 tracking-wider uppercase mt-1">
                    Outsourcing
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2 overflow-y-auto max-h-[65vh] pr-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                  Menu ({roleDisplayNames[role]})
                </p>
                <ul className="space-y-1.5">
                  {navItems.map((item) => {
                    const isActive = activeTab === item.path;
                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => {
                            setActiveTab(item.path as TabType);
                            if (window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-left block cursor-pointer ${
                            isActive
                              ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span>{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Logout bottom area */}
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800/80">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN BODY LAYOUT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative z-10">
          
          {/* TOP NAVBAR HEADER */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 py-4 px-6 sticky top-0 z-30 flex items-center justify-between transition-colors duration-300 no-print">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight capitalize">
                {activeTab === 'bss-dashboard' && 'Overview'}
                {activeTab === 'bss-karyawan' && (role === 'KARYAWAN_INTERNAL' || role === 'KARYAWAN_OUTSOURCING' || role === 'KARYAWAN_MAGANG' ? 'Profil Saya' : 'Karyawan')}
                {activeTab === 'bss-absensi' && (role === 'ADMIN' || role === 'KLIEN' ? 'Laporan Absensi' : 'Absensi Harian')}
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Simulation switcher */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:inline">Simulasi:</span>
                <select 
                  value={currentUser?.id || ''} 
                  onChange={handleUserSwitcherChange}
                  className="bg-transparent border-0 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-1 focus:ring-0 max-w-[140px]"
                >
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.id} className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                      {emp.namaLengkap.split(' ').slice(0,2).join(' ')} ({roleDisplayNames[emp.role]?.replace('Karyawan ', '')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme toggle moon button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-amber-400 cursor-pointer transition-all border border-slate-100 dark:border-slate-800"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notification bell mock */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setShowNotifications(!showNotifications);
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 cursor-pointer transition-all border border-slate-100 dark:border-slate-800"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-[9px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center">
                    2
                  </span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-extrabold text-xs">Notifikasi BSS</span>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50 max-h-60 overflow-y-auto">
                      <div className="p-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Absensi Harian Sukses</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Clock-in terekam di Head Office.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setShowProfile(!showProfile);
                  }}
                  className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-500/30 cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center bg-slate-100"
                >
                  <img
                    src={getProfileImage(currentUser)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl py-1 z-50 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800/80">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{currentUser?.namaLengkap || 'Guest'}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{roleDisplayNames[role] || 'No Role'}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('bss-karyawan');
                        setShowProfile(false);
                      }} 
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" /> Profil Saya
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* MAIN PAGE CONTENT CONTAINER */}
          <main className="p-6 flex-1 space-y-6">
            
            {/* TABS 1: BSS-DASHBOARD (OVERVIEW) */}
            {activeTab === 'bss-dashboard' && (
              <div className="animate-fade-in space-y-6">
                
                {/* 1.1 ADMIN DASHBOARD VIEW */}
                {role === 'ADMIN' && (
                  <>
                    {/* KPI statistics rings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                      <CircularProgress
                        percent={100}
                        color="#2dc84c"
                        iconName="Users"
                        label="Total Karyawan"
                        value={`${employeesList.length} Org`}
                        subtitle="Total Karyawan"
                      />
                      <CircularProgress
                        percent={Math.round((todayLogs.length / (employeesList.length || 1)) * 100)}
                        color="#ff3366"
                        iconName="Clock"
                        label="Kehadiran"
                        value={`${todayLogs.length} Org`}
                        subtitle="Hadir Hari Ini"
                      />
                      <CircularProgress
                        percent={uniqueClients.length * 20}
                        color="#ff9f43"
                        iconName="Building"
                        label="Mitra Klien"
                        value={`${uniqueClients.length} Klien`}
                        subtitle="Mitra Klien Aktif"
                      />
                      <CircularProgress
                        percent={85}
                        color="#00a8ff"
                        iconName="ShieldCheck"
                        label="Kepatuhan GPS"
                        value="95%"
                        subtitle="Akurasi Lokasi"
                      />
                      <CircularProgress
                        percent={78}
                        color="#2bcbba"
                        iconName="Trophy"
                        label="Avg Skor"
                        value="85 Pts"
                        subtitle="Kinerja Staff"
                      />
                    </div>

                    {/* Chart layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <StatsChart stats={stats} onAddStat={handleAddStat} />
                      </div>
                      <div className="lg:col-span-1">
                        <WorkoutGauge percent={workoutGaugeVal} onSetPercent={setWorkoutGaugeVal} />
                      </div>
                    </div>

                    {/* Report of employees count per Client (Mitra Perusahaan) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                      <div className="mb-4">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white">Laporan Karyawan per Mitra Klien (Perusahaan)</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Jumlah sebaran tenaga kerja PT. BSS aktif di masing-masing perusahaan mitra.</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="pb-3 pr-4">Nama Perusahaan Klien</th>
                              <th className="pb-3 text-center">Internal</th>
                              <th className="pb-3 text-center">Outsourcing</th>
                              <th className="pb-3 text-center">Magang</th>
                              <th className="pb-3 text-right">Total Karyawan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {clientCountReport.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400">Belum ada data penempatan.</td>
                              </tr>
                            ) : (
                              clientCountReport.map((row) => (
                                <tr key={row.client} className="text-slate-600 dark:text-slate-300 font-semibold">
                                  <td className="py-3.5 pr-4 text-slate-800 dark:text-slate-200 font-bold">{row.client}</td>
                                  <td className="py-3.5 text-center">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                                      {row.internal}
                                    </span>
                                  </td>
                                  <td className="py-3.5 text-center">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400">
                                      {row.outsourcing}
                                    </span>
                                  </td>
                                  <td className="py-3.5 text-center">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400">
                                      {row.magang}
                                    </span>
                                  </td>
                                  <td className="py-3.5 text-right font-black text-emerald-500 text-sm">{row.total} Orang</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* 1.2 KLIEN DASHBOARD VIEW */}
                {role === 'KLIEN' && (
                  <>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                      <h2 className="text-lg font-bold text-slate-850 dark:text-white">Selamat Datang, {currentUser?.namaLengkap}</h2>
                      <p className="text-xs text-slate-400 mt-1">Dashboard monitoring penugasan tenaga kerja PT. BSS di <strong>{currentUser?.clientAssigned}</strong>.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <CircularProgress
                        percent={100}
                        color="#2dc84c"
                        iconName="Users"
                        label="Total Pekerja"
                        value={`${filteredEmployees.length} Orang`}
                        subtitle="Total Pekerja Aktif"
                      />
                      <CircularProgress
                        percent={Math.round((todayLogs.filter(log => filteredEmployees.some(e => e.id === log.userId)).length / (filteredEmployees.length || 1)) * 100)}
                        color="#ff9f43"
                        iconName="Clock"
                        label="Hadir Hari Ini"
                        value={`${todayLogs.filter(log => filteredEmployees.some(e => e.id === log.userId)).length} Org`}
                        subtitle="Pekerja Masuk"
                      />
                      <CircularProgress
                        percent={98}
                        color="#00a8ff"
                        iconName="ShieldCheck"
                        label="Akurasi Lokasi"
                        value="98%"
                        subtitle="GPS Validasi"
                      />
                    </div>
                  </>
                )}

                {/* 1.3 KARYAWAN DASHBOARD VIEW */}
                {role !== 'ADMIN' && role !== 'KLIEN' && (
                  <>
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                      <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/5 rounded-full"></div>
                      <div className="relative z-10 space-y-2">
                        <h2 className="text-2xl font-black">Halo, {currentUser?.namaLengkap || 'Rekan BSS'}!</h2>
                        <p className="text-emerald-100 text-sm max-w-xl">
                          Portal absensi digital dan profil mandiri staff PT. BSS. Anda terdaftar sebagai <strong>{roleDisplayNames[role]}</strong> penugasan di <strong>{currentUser?.clientAssigned}</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Circular metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                      <CircularProgress
                        percent={presentPercent}
                        color="#2dc84c"
                        iconName="Clock"
                        label="Kehadiran"
                        value={`${myLogs.length} Hari`}
                        subtitle="Hadir Bulan Ini"
                      />
                      <CircularProgress
                        percent={95}
                        color="#ff3366"
                        iconName="MapPin"
                        label="GPS Akurasi"
                        value="95%"
                        subtitle="Tingkat Akurasi"
                      />
                      <CircularProgress
                        percent={currentUser?.cuti ? Math.round((Number(currentUser.cuti) / 12) * 100) : 0}
                        color="#ff9f43"
                        iconName="Calendar"
                        label="Sisa Cuti"
                        value={currentUser?.cuti ? `${currentUser.cuti} Hari` : '0 Hari'}
                        subtitle="Hak Cuti"
                      />
                      <CircularProgress
                        percent={85}
                        color="#00a8ff"
                        iconName="Trophy"
                        label="Skor Kerja"
                        value="85 Poin"
                        subtitle="Evaluasi Kinerja"
                      />
                    </div>

                    {/* Clock In info box */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800 pb-3">Kehadiran Hari Ini ({todayStr})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs font-semibold space-y-2">
                          <div className="flex justify-between">
                            <span>Jam Masuk (Clock-In):</span>
                            <span className="text-emerald-500 font-extrabold">
                              {myTodayLog?.checkIn ? new Date(myTodayLog.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Jam Pulang (Clock-Out):</span>
                            <span className="text-amber-500 font-extrabold">
                              {myTodayLog?.checkOut ? new Date(myTodayLog.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center">
                          <button
                            onClick={() => setActiveTab('bss-absensi')}
                            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/10 cursor-pointer text-center"
                          >
                            {myTodayLog?.checkIn ? 'Menuju Portal Absen Pulang' : 'Lakukan Absen Masuk Sekarang'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* TABS 2: BSS-KARYAWAN (MASTER / PROFILE) */}
            {activeTab === 'bss-karyawan' && (
              <div className="animate-fade-in space-y-6">
                
                {/* 2.1 ADMIN VIEW (CRUD Database) */}
                {role === 'ADMIN' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Database Master Karyawan</h2>
                        <p className="text-xs text-slate-400 mt-1">Kelola data kontrak PKWT, BPJS, rekening payroll, dan seragam kerja karyawan.</p>
                      </div>
                      <button
                        onClick={handleAddOpen}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition shadow-md shadow-emerald-500/15 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Karyawan</span>
                      </button>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="Cari nama, NIK, jabatan..." 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-850 dark:text-slate-100"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <div className="flex gap-4">
                        <select
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer w-44"
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                        >
                          <option value="">Semua Role</option>
                          <option value="KARYAWAN_INTERNAL">Karyawan Internal</option>
                          <option value="KARYAWAN_OUTSOURCING">Karyawan Outsourcing</option>
                          <option value="KARYAWAN_MAGANG">Karyawan Magang</option>
                        </select>
                        <select
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer w-44"
                          value={filterClient}
                          onChange={(e) => setFilterClient(e.target.value)}
                        >
                          <option value="">Semua Mitra Klien</option>
                          {uniqueClients.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Table list */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3.5 px-6">NIK / Nama</th>
                              <th className="py-3.5 px-6">Tipe Role</th>
                              <th className="py-3.5 px-6">Jabatan</th>
                              <th className="py-3.5 px-6">Penempatan Mitra</th>
                              <th className="py-3.5 px-6">Akhir Kontrak</th>
                              <th className="py-3.5 px-6 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredEmployees.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center py-12 text-slate-400">Tidak ada data karyawan.</td>
                              </tr>
                            ) : (
                              filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 text-slate-700 dark:text-slate-350">
                                  <td className="py-3 px-6">
                                    <div className="font-extrabold text-slate-850 dark:text-white">{emp.namaLengkap}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">NIK: {emp.nikKaryawan || '-'}</div>
                                  </td>
                                  <td className="py-3 px-6">
                                    <span className={`px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase ${
                                      emp.role === 'KARYAWAN_INTERNAL' 
                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                        : emp.role === 'KARYAWAN_OUTSOURCING'
                                          ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20'
                                          : 'bg-sky-50 text-sky-600 dark:bg-sky-950/20'
                                    }`}>
                                      {emp.role.replace('KARYAWAN_', '')}
                                    </span>
                                  </td>
                                  <td className="py-3 px-6 font-semibold">{emp.jabatan || '-'}</td>
                                  <td className="py-3 px-6 font-semibold">{emp.clientAssigned || '-'}</td>
                                  <td className="py-3 px-6 text-slate-400">
                                    {emp.periodePkwtAkhir ? new Date(emp.periodePkwtAkhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    <div className="flex gap-2 justify-center">
                                      <button onClick={() => handleEditOpen(emp)} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl transition cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                                      <button onClick={() => handleDeleteEmployee(emp.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* 2.2 KLIEN VIEW (View Only) */}
                {role === 'KLIEN' && (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Pekerja Penugasan</h2>
                      <p className="text-xs text-slate-400 mt-1">Daftar tenaga kerja PT. BSS aktif yang ditugaskan di perusahaan Anda.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                              <th className="py-3.5 px-6">NIK / Nama</th>
                              <th className="py-3.5 px-6">Tipe Pekerja</th>
                              <th className="py-3.5 px-6">Jabatan</th>
                              <th className="py-3.5 px-6">Sisa Cuti</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredEmployees.map((emp) => (
                              <tr key={emp.id} className="text-slate-650">
                                  <td className="py-3 px-6 font-bold text-slate-850 dark:text-white">{emp.namaLengkap}</td>
                                  <td className="py-3 px-6 font-semibold">{emp.role.replace('KARYAWAN_', '')}</td>
                                  <td className="py-3 px-6 font-semibold">{emp.jabatan || '-'}</td>
                                  <td className="py-3 px-6">{emp.cuti || '0'} Hari</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* 2.3 KARYAWAN VIEW (Self profile + Ubah Password) */}
                {role !== 'ADMIN' && role !== 'KLIEN' && currentUser && (
                  <div className="space-y-6">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Profil Saya</h2>
                        <p className="text-xs text-slate-400">Informasi kontrak penempatan kerja dan pengaturan sandi keamanan akun BSS Anda.</p>
                      </div>
                      {!isEditingSelf ? (
                        <button onClick={() => {
                          setFormData({ ...currentUser });
                          setIsEditingSelf(true);
                        }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition shadow-md shadow-emerald-500/15 cursor-pointer">
                          Edit Informasi Kontak & Seragam
                        </button>
                      ) : (
                        <button onClick={() => setIsEditingSelf(false)} className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer">
                          Batal Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSelfProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Box 1: Data Pribadi */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                          <h3 className="text-sm font-bold text-slate-750 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2"><UserIcon className="w-4.5 h-4.5 text-emerald-500" /> Data Pribadi</h3>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                            <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed" value={currentUser.namaLengkap} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">NIK Karyawan BSS</label>
                            <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.nikKaryawan || ''} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">Email Utama</label>
                            <input type="email" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-4 py-2.5 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">No Telepon</label>
                            <input type="text" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-4 py-2.5 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.noTlp || ''} onChange={(e) => setFormData({ ...formData, noTlp: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">No Darurat</label>
                            <input type="text" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-4 py-2.5 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.noDarurat || ''} onChange={(e) => setFormData({ ...formData, noDarurat: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">Alamat Rumah</label>
                            <textarea rows={2} disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-4 py-2.5 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.alamat || ''} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
                          </div>
                        </div>

                        {/* Box 2: Kontrak & Penempatan */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                          <h3 className="text-sm font-bold text-slate-755 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2"><FileText className="w-4.5 h-4.5 text-emerald-500" /> Kontrak & Penempatan</h3>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">Mitra Penempatan Kerja</label>
                            <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.clientAssigned || ''} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">Jabatan Pekerjaan</label>
                            <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.jabatan || ''} />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400">Nomor PKWT Kerja</label>
                            <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.nomorPkwt || ''} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400">Awal PKWT</label>
                              <input type="date" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.periodePkwtAwal || ''} />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400">Akhir PKWT</label>
                              <input type="date" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.periodePkwtAkhir || ''} />
                            </div>
                          </div>
                        </div>

                        {/* Box 3: Keuangan, Seragam */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-755 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2"><CreditCard className="w-4.5 h-4.5 text-emerald-500" /> Bank & Seragam</h3>
                            <div className="space-y-1 mt-4">
                              <label className="block text-[9px] font-bold text-slate-400">Rekening Mandiri Payroll</label>
                              <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.rekeningMandiri || ''} />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400">Nomor NPWP</label>
                              <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.npwp || ''} />
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Ukuran Seragam Kerja</h4>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-bold text-slate-400">Baju</label>
                                  <select disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-2.5 py-2 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750'}`} value={formData.ukuranBaju} onChange={(e) => setFormData({ ...formData, ukuranBaju: e.target.value })}>
                                    <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-bold text-slate-400">Celana</label>
                                  <input type="text" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-2.5 py-2 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750'}`} value={formData.ukuranCelana || ''} onChange={(e) => setFormData({ ...formData, ukuranCelana: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-bold text-slate-400">Sepatu</label>
                                  <input type="text" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-2.5 py-2 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750'}`} value={formData.ukuranSepatu || ''} onChange={(e) => setFormData({ ...formData, ukuranSepatu: e.target.value })} />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {isEditingSelf && (
                            <button type="submit" className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md transition cursor-pointer mt-4">
                              Simpan Perubahan
                            </button>
                          )}
                        </div>

                      </div>
                    </form>

                    {/* Change Password Panel */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 max-w-md mt-6 space-y-4">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> Keamanan & Ubah Password</h3>
                      
                      {passwordError && (
                        <div className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/50">
                          ⚠️ {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                          ✓ {passwordSuccess}
                        </div>
                      )}

                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password Lama</label>
                          <input type="password" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password Baru (Min. 6 Karakter)</label>
                          <input type="password" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Konfirmasi Password Baru</label>
                          <input type="password" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition shadow-md shadow-emerald-500/10 cursor-pointer">
                          Simpan Password Baru
                        </button>
                      </form>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TABS 3: BSS-ABSENSI (PORTAL / LOGS) */}
            {activeTab === 'bss-absensi' && (
              <div className="animate-fade-in space-y-6">
                
                {/* 3.1 KARYAWAN VIEW: clocking portal */}
                {role !== 'ADMIN' && role !== 'KLIEN' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Webcam column */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                        <Camera className="w-4.5 h-4.5 text-emerald-500" /> Verifikasi Wajah (Face Photo)
                      </h3>

                      {cameraError && (
                        <div className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-xl">
                          ⚠️ {cameraError}
                        </div>
                      )}

                      <div className="w-full bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] relative shadow-inner border border-slate-150 dark:border-slate-800">
                        {!capturedImage ? (
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        ) : (
                          <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />

                        <div className="absolute top-3 left-3 bg-slate-950/75 text-emerald-400 text-[9px] font-black py-1 px-2.5 rounded-lg flex items-center gap-1.5 border border-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          CAMERA ONLINE
                        </div>
                      </div>

                      {attendanceSuccessMsg && (
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                          ✓ Absensi berhasil terekam pada pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB!
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        {!capturedImage ? (
                          <button onClick={capturePhoto} className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/15 transition cursor-pointer flex items-center justify-center gap-1.5">
                            <Camera className="w-4 h-4" /> Ambil Foto Wajah
                          </button>
                        ) : (
                          <>
                            <button onClick={() => setCapturedImage(null)} className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                              Ulangi Foto
                            </button>
                            {!myTodayLog?.checkIn ? (
                              <button onClick={() => handleClockSubmit('Clock-In')} disabled={!gpsLocation || isSubmittingAttendance} className="flex-[2] py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/15 transition cursor-pointer">
                                {isSubmittingAttendance ? 'Memproses...' : '👉 MASUK (Clock-In)'}
                              </button>
                            ) : (
                              <button onClick={() => handleClockSubmit('Clock-Out')} disabled={!gpsLocation || !!myTodayLog.checkOut || isSubmittingAttendance} className={`flex-[2] py-3 px-4 rounded-xl text-xs font-bold text-white transition cursor-pointer ${myTodayLog.checkOut ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 shadow-lg'}`}>
                                {myTodayLog.checkOut ? 'SUDAH PULANG' : (isSubmittingAttendance ? 'Memproses...' : '👈 PULANG (Clock-Out)')}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Geolocation & History column */}
                    <div className="space-y-6 flex flex-col justify-between">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                          <MapPin className="w-4.5 h-4.5 text-emerald-500" /> Geolocation GPS Satelit
                        </h3>

                        {gpsError && (
                          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl">
                            ℹ️ {gpsError}
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Titik Lokasi Kantor/Mitra</label>
                          <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer" value={assignedClientLocation} onChange={(e) => setAssignedClientLocation(e.target.value)}>
                            <option value="BSS Head Office Bekasi">BSS Head Office Bekasi</option>
                            <option value="PT. Pertamina Cikarang Depot">PT. Pertamina Cikarang Depot</option>
                            <option value="PT. Toyota Motor Karawang KIIC">PT. Toyota Motor Karawang KIIC</option>
                            <option value="PT. Astra Honda Motor Karawang">PT. Astra Honda Motor Karawang</option>
                            <option value="Remote / WFH (Rumah)">Remote / WFH (Rumah)</option>
                          </select>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85 text-xs space-y-2 font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Latitude:</span>
                            <strong className="text-slate-750 dark:text-slate-350">{gpsLocation?.latitude?.toFixed(6) || 'Mencari...'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Longitude:</span>
                            <strong className="text-slate-750 dark:text-slate-350">{gpsLocation?.longitude?.toFixed(6) || 'Mencari...'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Log table */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex-1 space-y-3">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2"><Calendar className="w-4.5 h-4.5 text-emerald-500" /> Riwayat Absen Saya</h3>
                        <div className="max-h-56 overflow-y-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px] pb-2">
                                <th className="pb-2">Tanggal</th>
                                <th className="pb-2">Masuk</th>
                                <th className="pb-2">Pulang</th>
                                <th className="pb-2">Mitra</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                              {myLogs.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="text-center py-6 text-slate-400">Belum ada log hadir.</td>
                                </tr>
                              ) : (
                                myLogs.map(log => (
                                  <tr key={log.id} className="text-slate-600 dark:text-slate-350 font-semibold">
                                    <td className="py-2.5 font-extrabold text-slate-850 dark:text-white">{log.date}</td>
                                    <td className="py-2.5 text-emerald-500">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                    <td className="py-2.5 text-amber-500">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                    <td className="py-2.5 text-slate-400 truncate max-w-[120px]">{log.locationName}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 3.2 ADMIN & KLIEN VIEW: attendance reporting */}
                {(role === 'ADMIN' || role === 'KLIEN') && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Laporan Absensi Karyawan</h2>
                        <p className="text-xs text-slate-400">Daftar clock-in/out harian staff lengkap dengan GPS koordinat dan validasi foto wajah.</p>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                      <div className="relative max-w-md">
                        <input 
                          type="text" 
                          placeholder="Cari nama karyawan..." 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-850 dark:text-slate-100"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* logs table */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3.5 px-6">Karyawan</th>
                              <th className="py-3.5 px-6">Tanggal</th>
                              <th className="py-3.5 px-6">Clock-In</th>
                              <th className="py-3.5 px-6">Clock-Out</th>
                              <th className="py-3.5 px-6">Lokasi Penugasan</th>
                              <th className="py-3.5 px-6">Status</th>
                              <th className="py-3.5 px-6 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredLogs.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="text-center py-12 text-slate-400">Tidak ada log absensi terdeteksi.</td>
                              </tr>
                            ) : (
                              filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 text-slate-700 dark:text-slate-350">
                                  <td className="py-3 px-6">
                                    <div className="font-extrabold text-slate-850 dark:text-white">{log.nama}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{log.role.replace('KARYAWAN_', '')}</div>
                                  </td>
                                  <td className="py-3 px-6 font-semibold">{log.date}</td>
                                  <td className="py-3 px-6 text-emerald-500 font-bold">
                                    {log.checkIn ? new Date(log.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                  </td>
                                  <td className="py-3 px-6 text-amber-500 font-bold">
                                    {log.checkOut ? new Date(log.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                  </td>
                                  <td className="py-3 px-6 font-semibold">{log.locationName}</td>
                                  <td className="py-3 px-6">
                                    <span className="px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">{log.status}</span>
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    <button onClick={() => setSelectedLog(log)} className="px-3.5 py-1.5 rounded-xl text-[10px] font-black text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 transition cursor-pointer flex items-center gap-1 mx-auto">
                                      <Eye className="w-3.5 h-3.5" /> Detail
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

          </main>
        </div>

      </div>

      {/* --- POPUP MODAL: ADMIN DETAILED PAYSUP & ATTENDANCE --- */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-left animate-scale-up">
            <button onClick={() => setSelectedLog(null)} className="absolute top-5 right-5 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Verifikasi Kehadiran</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">Validasi foto webcam selfie dan koordinat GPS karyawan.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="block text-[8px] font-bold text-slate-400 uppercase">Karyawan</span>
                <strong className="text-xs text-slate-700 dark:text-slate-350">{selectedLog.nama}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-bold text-slate-400 uppercase">Mitra / Lokasi</span>
                <strong className="text-xs text-slate-700 dark:text-slate-350">{selectedLog.locationName}</strong>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Foto Wajah (Webcam Capture)</span>
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 dark:border-slate-800">
                  <img src={selectedLog.photoUrl || 'https://i.pravatar.cc/300'} alt="Face validation" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Koordinat Satelit GPS</span>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-450">
                  <p><strong>Latitude:</strong> {selectedLog.latitude?.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {selectedLog.longitude?.toFixed(6)}</p>
                  <div className="text-[10px] font-bold text-emerald-500 mt-2.5 flex items-center gap-1.5"><Compass className="w-4 h-4 animate-spin-slow" /> Terverifikasi dalam radius operasional</div>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedLog(null)} className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md mt-6 cursor-pointer">Tutup Detail</button>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL: ADMIN KARYAWAN CRUD FORM --- */}
      {isCrudModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-3xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left animate-scale-up">
            <button onClick={() => setIsCrudModalOpen(false)} className="absolute top-5 right-5 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition cursor-pointer"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-1">{selectedEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</h2>
            <p className="text-xs text-slate-400 mb-6">{selectedEmployee ? `Mengubah profil ${formData.namaLengkap}` : 'Lengkapi data master formulir dibawah ini.'}</p>
            
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 flex-wrap">
              <button type="button" onClick={() => setActiveFormTab('pribadi')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFormTab === 'pribadi' ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10' : 'text-slate-500 hover:text-slate-700'}`}>👤 1. Data Pribadi</button>
              <button type="button" onClick={() => setActiveFormTab('kontrak')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFormTab === 'kontrak' ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10' : 'text-slate-500 hover:text-slate-700'}`}>💼 2. Kontrak & Mitra</button>
              <button type="button" onClick={() => setActiveFormTab('keuangan')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFormTab === 'keuangan' ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10' : 'text-slate-500 hover:text-slate-700'}`}>💳 3. Keuangan & Seragam</button>
            </div>

            <form onSubmit={handleCrudSubmit} className="space-y-6">
              
              {activeFormTab === 'pribadi' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.namaLengkap} onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Tipe Hubungan Kerja (Role)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}>
                      <option value="KARYAWAN_INTERNAL">Karyawan Internal</option>
                      <option value="KARYAWAN_OUTSOURCING">Karyawan Outsourcing</option>
                      <option value="KARYAWAN_MAGANG">Karyawan Magang</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">NIK KTP (16 Digit)</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.nikKtp} onChange={(e) => setFormData({ ...formData, nikKtp: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Email Utama</label>
                    <input type="email" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Tempat Lahir</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.tempatLahir} onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Tanggal Lahir</label>
                    <input type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}>
                      <option value="LAKI_LAKI">Laki-Laki</option><option value="PEREMPUAN">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Pendidikan Terakhir</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.pendidikan} onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">No. Telepon Aktif</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.noTlp} onChange={(e) => setFormData({ ...formData, noTlp: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Kontak Darurat</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.noDarurat} onChange={(e) => setFormData({ ...formData, noDarurat: e.target.value })} />
                  </div>
                </div>
              )}

              {activeFormTab === 'kontrak' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">NIK Karyawan PT. BSS</label>
                    <input type="text" placeholder="Auto-generate if empty" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.nikKaryawan} onChange={(e) => setFormData({ ...formData, nikKaryawan: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Jabatan / Posisi</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.jabatan} onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Mitra Penempatan</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer" value={formData.clientAssigned} onChange={(e) => setFormData({ ...formData, clientAssigned: e.target.value })}>
                      <option value="PT. Pertamina">PT. Pertamina</option>
                      <option value="PT. Toyota Motor Manufacturing">PT. Toyota Motor Manufacturing</option>
                      <option value="PT. Astra Honda Motor">PT. Astra Honda Motor</option>
                      <option value="PT. BSS Head Office">PT. BSS Head Office</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nomor PKWT / Kontrak</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.nomorPkwt} onChange={(e) => setFormData({ ...formData, nomorPkwt: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Mulai PKWT</label>
                    <input type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.periodePkwtAwal} onChange={(e) => setFormData({ ...formData, periodePkwtAwal: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Akhir PKWT</label>
                    <input type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.periodePkwtAkhir} onChange={(e) => setFormData({ ...formData, periodePkwtAkhir: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Upah Pokok (Rp)</label>
                    <input type="number" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.upah} onChange={(e) => setFormData({ ...formData, upah: Number(e.target.value) })} />
                  </div>
                </div>
              )}

              {activeFormTab === 'keuangan' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Rekening Mandiri Payroll</label>
                      <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.rekeningMandiri} onChange={(e) => setFormData({ ...formData, rekeningMandiri: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">NPWP</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.npwp} onChange={(e) => setFormData({ ...formData, npwp: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">BPJS Kesehatan</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.noBpjsKesehatan} onChange={(e) => setFormData({ ...formData, noBpjsKesehatan: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">BPJS Ketenagakerjaan</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.noBpjsKetenagakerjaan} onChange={(e) => setFormData({ ...formData, noBpjsKetenagakerjaan: e.target.value })} />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-500" /> Ukuran Seragam Kerja</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Baju</label>
                        <select className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2" value={formData.ukuranBaju} onChange={(e) => setFormData({ ...formData, ukuranBaju: e.target.value })}>
                          <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Celana</label>
                        <input type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2" value={formData.ukuranCelana} onChange={(e) => setFormData({ ...formData, ukuranCelana: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Sepatu</label>
                        <input type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2" value={formData.ukuranSepatu} onChange={(e) => setFormData({ ...formData, ukuranSepatu: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action tabs footer buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                {activeFormTab === 'pribadi' && (
                  <button type="button" onClick={() => setActiveFormTab('kontrak')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-1.5 cursor-pointer">
                    <span>Lanjut Ke Kontrak</span> <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {activeFormTab === 'kontrak' && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setActiveFormTab('pribadi')} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500">Kembali</button>
                    <button type="button" onClick={() => setActiveFormTab('keuangan')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-1.5 cursor-pointer">
                      <span>Lanjut Ke Keuangan</span> <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {activeFormTab === 'keuangan' && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setActiveFormTab('kontrak')} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500">Kembali</button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg cursor-pointer">
                      💾 Simpan Data Karyawan
                    </button>
                  </div>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
