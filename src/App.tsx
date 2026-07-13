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
  Target,
  FileSpreadsheet,
  MessageSquare
} from 'lucide-react';

import { TabType, MonthlyStat, Payslip } from './types';
import { INITIAL_MONTHLY_STATS } from './data';
import logo from './assets/logo.png';
import char1 from './assets/char1.png';
import char2 from './assets/char2.png';
import char3 from './assets/char3.png';
import char4 from './assets/char4.png';
import char5 from './assets/char5.png';
import char6 from './assets/char6.png';
import char7 from './assets/char7.png';
import char8 from './assets/char8.png';
import char9 from './assets/char9.png';
import char10 from './assets/char10.png';
import {
  Employee,
  Attendance,
  getEmployees,
  saveEmployee,
  deleteEmployee,
  getAttendances,
  saveAttendance,
  changePassword,
  getPayslips,
  savePayslip,
  deletePayslip,
  getPayrollSettings,
  savePayrollSettings,
  PayrollSettings,
  PayrollConfig
} from './utils/db';

import CircularProgress from './components/CircularProgress';
import WorkoutGauge from './components/WorkoutGauge';
import StatsChart from './components/StatsChart';

const HOLIDAYS_2026: { [key: string]: string } = {
  "2026-01-01": "Tahun Baru 2026 Masehi",
  "2026-01-16": "Isra Mikraj Nabi Muhammad S.A.W.",
  "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
  "2026-03-19": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
  "2026-04-03": "Wafat Yesus Kristus (Jumat Agung)",
  "2026-04-05": "Hari Paskah",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-13": "Hari Kenaikan Yesus Kristus",
  "2026-05-20": "Hari Raya Idul Fitri 1447 H",
  "2026-05-21": "Hari Raya Idul Fitri 1447 H",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-02": "Hari Raya Waisak 2570 BE",
  "2026-06-27": "Hari Raya Idul Adha 1447 H",
  "2026-07-17": "Tahun Baru Islam 1448 H",
  "2026-08-17": "Hari Kemerdekaan Republik Indonesia (HUT RI ke-81)",
  "2026-09-26": "Maulid Nabi Muhammad S.A.W.",
  "2026-12-25": "Hari Raya Natal"
};

const DEFAULT_BG_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80', // Mountain Sunset Lake
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80', // Forest Green Woods
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80', // Starry Night Galaxy
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80', // Ocean Beach
  'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=1920&q=80', // Soft red landscape
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80', // Misty Mountain Forest
  'https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=1920&q=80'  // Green hills landscape
];

const getUserBgImage = (user: Employee | null) => {
  if (!user) return DEFAULT_BG_IMAGES[0];
  
  // Role-specific defaults
  if (user.role === 'ADMIN') {
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'; // Modern Office
  }
  if (user.role === 'KLIEN') {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80'; // Skyline Meeting
  }
  
  // Assign a default landscape background based on a simple hash of the user ID
  // so it is consistent for that specific user, but different between different users!
  let hash = 0;
  const str = user.id || user.namaLengkap || 'default';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEFAULT_BG_IMAGES.length;
  return DEFAULT_BG_IMAGES[index];
};

export default function App() {
  // Theme & session states
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Custom header color & logo states
  const [headerColor, setHeaderColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bss_header_color') || '#ffffff';
    }
    return '#ffffff';
  });

  const [customLogo, setCustomLogo] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bss_custom_logo') || logo;
    }
    return logo;
  });

  const [contentBgImage, setContentBgImage] = useState<string>('');

  // Settings form fields
  const [settingsUsername, setSettingsUsername] = useState('');
  const [settingsOldPassword, setSettingsOldPassword] = useState('');
  const [settingsNewPassword, setSettingsNewPassword] = useState('');
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState('');
  const [settingsAvatar, setSettingsAvatar] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsCategory, setSettingsCategory] = useState<'visual' | 'profile'>('profile');
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  
  // PKWT Calendar states
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => new Date(2026, 6, 12));
  const [selectedCalendarEmployee, setSelectedCalendarEmployee] = useState<Employee | null>(null);
  const [pkwtViewMode, setPkwtViewMode] = useState<'table' | 'calendar'>('table');
  const [pkwtSearch, setPkwtSearch] = useState('');
  const [pkwtClientFilter, setPkwtClientFilter] = useState('');
  
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
  const [payslipsList, setPayslipsList] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [activePayrollTab, setActivePayrollTab] = useState<'proses' | 'riwayat' | 'settings'>('proses');
  const [selectedSlipIds, setSelectedSlipIds] = useState<string[]>([]);
  const [sendingStatus, setSendingStatus] = useState<{ type: 'email' | 'wa' | null, count: number, step: 'sending' | 'success' | null }>({ type: null, count: 0, step: null });

  // Payroll settings states
  const [payrollSettings, setPayrollSettings] = useState<PayrollSettings>(() => getPayrollSettings());
  const [editingSettings, setEditingSettings] = useState<PayrollSettings>(() => getPayrollSettings());

  // Payroll processing form state
  const [payrollEmployeeId, setPayrollEmployeeId] = useState('');
  const [payrollMonth, setPayrollMonth] = useState('07');
  const [payrollYear, setPayrollYear] = useState('2026');
  const [gajiPokokInput, setGajiPokokInput] = useState('0');
  const [tunjanganJabatanInput, setTunjanganJabatanInput] = useState('0');
  const [tunjanganMakanTransportInput, setTunjanganMakanTransportInput] = useState('25000'); // daily rate default
  const [tunjanganLainnyaInput, setTunjanganLainnyaInput] = useState('0');
  const [potonganPPh21Input, setPotonganPPh21Input] = useState('0');
  const [potonganLainnyaInput, setPotonganLainnyaInput] = useState('0');
  const [payrollNote, setPayrollNote] = useState('');

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
    setPayslipsList(getPayslips());

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

  // Sync settings inputs when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setSettingsUsername(currentUser.email);
      setSettingsAvatar(currentUser.avatar || '');
      if (typeof window !== 'undefined') {
        const customBg = localStorage.getItem(`bss_content_bg_image_${currentUser.id}`);
        setContentBgImage(customBg || '');
      }
    } else {
      setContentBgImage('');
    }
  }, [currentUser]);

  // Auto expand settings dropdown in sidebar when active
  useEffect(() => {
    if (activeTab === 'bss-settings') {
      setSettingsDropdownOpen(true);
    }
    if (activeTab === 'bss-pkwt') {
      setPkwtViewMode('table');
      setSelectedCalendarEmployee(null);
    }
  }, [activeTab]);

  useEffect(() => {
    setSelectedSlipIds([]);
  }, [activePayrollTab, activeTab]);

  const [selectedCharacter, setSelectedCharacter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bss_selected_character') || 'char1';
    }
    return 'char1';
  });

  const [transparentCartoon, setTransparentCartoon] = useState<string>('');

  // Chromakey white background out of the selected cartoon mascot image using flood fill
  useEffect(() => {
    const characterImages: { [key: string]: string } = {
      char1,
      char2,
      char3,
      char4,
      char5,
      char6,
      char7,
      char8,
      char9,
      char10
    };
    const activeSrc = characterImages[selectedCharacter] || char1;
    const img = new Image();
    img.src = activeSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;
        const visited = new Uint8Array(width * height);
        const queue: [number, number][] = [];
        
        const checkAndAdd = (x: number, y: number) => {
          const idx = y * width + x;
          const pixelIdx = idx * 4;
          const r = data[pixelIdx];
          const g = data[pixelIdx+1];
          const b = data[pixelIdx+2];
          if (r > 240 && g > 240 && b > 240 && !visited[idx]) {
            visited[idx] = 1;
            queue.push([x, y]);
          }
        };

        for (let x = 0; x < width; x++) {
          checkAndAdd(x, 0);
          checkAndAdd(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          checkAndAdd(0, y);
          checkAndAdd(width - 1, y);
        }

        while (queue.length > 0) {
          const [x, y] = queue.shift()!;
          const idx = y * width + x;
          const pixelIdx = idx * 4;
          data[pixelIdx + 3] = 0;

          const neighbors = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1]
          ];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nidx = ny * width + nx;
              const npixelIdx = nidx * 4;
              const nr = data[npixelIdx];
              const ng = data[npixelIdx+1];
              const nb = data[npixelIdx+2];
              if (nr > 240 && ng > 240 && nb > 240 && !visited[nidx]) {
                visited[nidx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setTransparentCartoon(canvas.toDataURL());
      }
    };
    img.onerror = () => {
      setTransparentCartoon(activeSrc);
    };
  }, [selectedCharacter]);

  // Clean up hardcoded default wages in database so they use settings config
  useEffect(() => {
    const list = getEmployees();
    let changed = false;
    const cleaned = list.map(emp => {
      const val = Number(emp.upah);
      if (val === 7500000 || val === 5200000 || val === 2500000 || val === 3500000) {
        const copy = { ...emp };
        delete copy.upah;
        changed = true;
        return copy;
      }
      return emp;
    });
    if (changed) {
      localStorage.setItem("bss_employees", JSON.stringify(cleaned));
      setEmployeesList(cleaned);
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

  // CRUD Hapus Payslip
  const handleDeletePayslip = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data slip gaji ini?')) {
      deletePayslip(id);
      setPayslipsList(getPayslips());
    }
  };

  // Select employee helper with default values loading
  const handleEmployeeSelect = (employeeId: string) => {
    setPayrollEmployeeId(employeeId);
  };

  // Auto-synchronize form parameters when active employee, payrollSettings, or tab changes
  useEffect(() => {
    if (!payrollEmployeeId) {
      setGajiPokokInput('0');
      setTunjanganJabatanInput('0');
      setTunjanganMakanTransportInput('25000');
      setPotonganPPh21Input('0');
      return;
    }
    const emp = employeesList.find(e => e.id === payrollEmployeeId);
    if (emp) {
      let configKey: 'KARYAWAN_INTERNAL' | 'KARYAWAN_OUTSOURCING' | 'KARYAWAN_MAGANG' = 'KARYAWAN_OUTSOURCING';
      if (emp.role === 'KARYAWAN_INTERNAL') configKey = 'KARYAWAN_INTERNAL';
      else if (emp.role === 'KARYAWAN_MAGANG') configKey = 'KARYAWAN_MAGANG';

      const config = payrollSettings[configKey];
      if (config) {
        const baseSalary = (!emp.upah || emp.upah === 7500000 || emp.upah === 5200000 || emp.upah === 2500000 || emp.upah === 3500000)
          ? config.gajiPokok
          : emp.upah;
        setGajiPokokInput(baseSalary.toString());
        setTunjanganJabatanInput(config.tunjanganJabatan.toString());
        setTunjanganMakanTransportInput(config.tunjanganMakanTransport.toString());
        
        // Default tax PPh21 based on percentage of employee's base salary
        const pphRp = Math.round(baseSalary * (config.potonganPPh21 / 100));
        setPotonganPPh21Input(pphRp.toString());
      }
    }
  }, [payrollEmployeeId, payrollSettings, activePayrollTab, employeesList]);

  // Save all payroll settings
  const handleSaveAllSettings = () => {
    const oldSettings = payrollSettings;
    
    savePayrollSettings(editingSettings);
    setPayrollSettings(editingSettings);
    
    const list = getEmployees();
    const updatedList = list.map(emp => {
      let configKey: 'KARYAWAN_INTERNAL' | 'KARYAWAN_OUTSOURCING' | 'KARYAWAN_MAGANG' = 'KARYAWAN_OUTSOURCING';
      if (emp.role === 'KARYAWAN_INTERNAL') configKey = 'KARYAWAN_INTERNAL';
      else if (emp.role === 'KARYAWAN_MAGANG') configKey = 'KARYAWAN_MAGANG';
      
      const oldDefault = oldSettings[configKey]?.gajiPokok;
      const newDefault = editingSettings[configKey]?.gajiPokok;
      
      if (!emp.upah || emp.upah === oldDefault) {
        return { ...emp, upah: newDefault };
      }
      return emp;
    });
    
    localStorage.setItem("bss_employees", JSON.stringify(updatedList));
    setEmployeesList(updatedList);
    
    alert('Konfigurasi default penggajian berhasil disimpan!');
  };

  // Export Attendance Report to CSV (Excel compatible)
  const exportAttendanceToExcel = () => {
    const headers = ["Nama Karyawan", "Tipe Pekerja/Role", "Tanggal", "Jam Clock-In", "Jam Clock-Out", "Lokasi Penugasan", "Status Absensi"];
    const rows = filteredLogs.map(log => [
      log.nama,
      roleDisplayNames[log.role as keyof typeof roleDisplayNames] || log.role,
      log.date,
      log.checkIn ? new Date(log.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      log.checkOut ? new Date(log.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      log.locationName || '-',
      log.status
    ]);
    const csvContent = "\uFEFF" + [
      headers.join(";"),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Absensi_BSS_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Payroll Report to CSV (Excel compatible)
  const exportPayrollToExcel = () => {
    const headers = [
      "Nama Staff", "NIK Karyawan", "Jabatan", "Penempatan Klien", "Nomor Rekening",
      "Periode Bulan", "Periode Tahun", "Gaji Pokok (Rp)", "Tunjangan Jabatan (Rp)",
      "Tunjangan Makan & Trans. (Rp)", "Tunjangan Lainnya (Rp)", "Total Penerimaan Bruto (Rp)",
      "Potongan BPJS Kesehatan (Rp)", "Potongan BPJS Ketenagakerjaan (Rp)", "Potongan PPh21 / Pajak (Rp)",
      "Potongan Absensi Alpa (Rp)", "Potongan Lain-lain (Rp)", "Total Potongan (Rp)",
      "Take Home Pay / Bersih (Rp)", "Tanggal Proses", "Catatan"
    ];
    const rows = payslipsList.map(slip => [
      slip.employeeName,
      slip.employeeNik,
      slip.jabatan,
      slip.penempatan,
      slip.rekening,
      new Date(2026, Number(slip.periodMonth)-1, 1).toLocaleString('id-ID', { month: 'long' }),
      slip.periodYear,
      slip.gajiPokok,
      slip.tunjanganJabatan,
      slip.tunjanganMakanTransport,
      slip.tunjanganLainnya,
      slip.totalPenerimaan,
      slip.potonganBpjsKesehatan,
      slip.potonganBpjsKetenagakerjaan,
      slip.potonganPPh21,
      slip.potonganAbsensi,
      slip.potonganLainnya,
      slip.totalPotongan,
      slip.takeHomePay,
      new Date(slip.createdAt).toLocaleString('id-ID'),
      slip.note || '-'
    ]);
    const csvContent = "\uFEFF" + [
      headers.join(";"),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Gaji_BSS_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Kirim Invoice / Slip Gaji by Email / WA
  const handleSendInvoices = (type: 'email' | 'wa') => {
    if (selectedSlipIds.length === 0) {
      alert('Silakan pilih minimal satu slip gaji terlebih dahulu!');
      return;
    }

    setSendingStatus({ type, count: selectedSlipIds.length, step: 'sending' });

    // Simulasi delay pengiriman
    setTimeout(() => {
      setSendingStatus({ type, count: selectedSlipIds.length, step: 'success' });
      setSelectedSlipIds([]);
      
      // Sembunyikan notifikasi setelah 3.5 detik
      setTimeout(() => {
        setSendingStatus({ type: null, count: 0, step: null });
      }, 3500);
    }, 2000);
  };

  // Submit Proses Slip Gaji
  const handleSavePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmployee) {
      alert('Pilih karyawan terlebih dahulu.');
      return;
    }

    const baseSalary = Number(gajiPokokInput) || 0;
    const hadir = attendanceStats.hadir;
    const alpa = attendanceStats.alpa;

    // Daily allowance (Meal/Transport) = Rp 25.000 * present days
    const dailyRate = Number(tunjanganMakanTransportInput) || 25000;
    const mealAllowance = dailyRate * hadir;

    const tunjJabatan = Number(tunjanganJabatanInput) || 0;
    const tunjLain = Number(tunjanganLainnyaInput) || 0;

    // BPJS Deductions (loaded from settings percentages)
    const bpjsKes = Math.round(baseSalary * (activeConfig.potonganBpjsKesehatan / 100));
    const bpjsKet = Math.round(baseSalary * (activeConfig.potonganBpjsKetenagakerjaan / 100));

    // Alpa Deduction (loaded from settings daily penalty rate)
    const alpaDeduction = alpa * activeConfig.potonganAlpa;
    const pph21 = Number(potonganPPh21Input) || 0;
    const potLain = Number(potonganLainnyaInput) || 0;

    const totalIncome = baseSalary + tunjJabatan + mealAllowance + tunjLain;
    const totalDeduct = bpjsKes + bpjsKet + pph21 + alpaDeduction + potLain;
    const takeHomePay = totalIncome - totalDeduct;

    const newPayslip: Payslip = {
      id: "slip-" + Date.now(),
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.namaLengkap,
      employeeNik: activeEmployee.nikKaryawan || '',
      jabatan: activeEmployee.jabatan || '',
      penempatan: activeEmployee.clientAssigned || '',
      rekening: activeEmployee.rekeningMandiri ? "Mandiri - " + activeEmployee.rekeningMandiri : 'Tunai',
      periodMonth: payrollMonth,
      periodYear: payrollYear,
      attendanceHadir: hadir,
      attendanceSakit: attendanceStats.sakit,
      attendanceIzin: attendanceStats.izin,
      attendanceAlpa: alpa,
      gajiPokok: baseSalary,
      tunjanganJabatan: tunjJabatan,
      tunjanganMakanTransport: mealAllowance,
      tunjanganLainnya: tunjLain,
      potonganBpjsKesehatan: bpjsKes,
      potonganBpjsKetenagakerjaan: bpjsKet,
      potonganPPh21: pph21,
      potonganAbsensi: alpaDeduction,
      potonganLainnya: potLain,
      totalPenerimaan: totalIncome,
      totalPotongan: totalDeduct,
      takeHomePay: takeHomePay,
      createdAt: new Date().toISOString(),
      note: payrollNote || `Gaji Periode ${payrollMonth}/${payrollYear}`
    };

    savePayslip(newPayslip);
    setPayslipsList(getPayslips());
    
    // Clear inputs
    setTunjanganJabatanInput('0');
    setTunjanganLainnyaInput('0');
    setPotonganPPh21Input('0');
    setPotonganLainnyaInput('0');
    setPayrollNote('');
    
    // Switch to history tab
    setActivePayrollTab('riwayat');
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

  // Handle Settings Save
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSettingsError('');
    setSettingsSuccess('');

    // Check email uniqueness if email has changed
    const list = getEmployees();
    if (settingsUsername.toLowerCase() !== currentUser.email.toLowerCase()) {
      const emailExists = list.some(emp => emp.id !== currentUser.id && emp.email.toLowerCase() === settingsUsername.toLowerCase());
      if (emailExists) {
        setSettingsError('Email/Username sudah digunakan oleh akun lain!');
        return;
      }
    }

    // Check password if old password or new password is filled
    let updatedPassword = currentUser.password;
    if (settingsOldPassword || settingsNewPassword || settingsConfirmPassword) {
      const currentPass = currentUser.password || 'password123';
      if (settingsOldPassword !== currentPass) {
        setSettingsError('Password lama tidak sesuai!');
        return;
      }
      if (settingsNewPassword.length < 6) {
        setSettingsError('Password baru minimal harus 6 karakter!');
        return;
      }
      if (settingsNewPassword !== settingsConfirmPassword) {
        setSettingsError('Konfirmasi password baru tidak cocok!');
        return;
      }
      updatedPassword = settingsNewPassword;
    }

    // Update settings in database
    const updatedUser = {
      ...currentUser,
      email: settingsUsername,
      password: updatedPassword,
      avatar: settingsAvatar
    };

    saveEmployee(updatedUser);
    setCurrentUser(updatedUser);
    setEmployeesList(getEmployees());

    // Save header color, content background image, character selection, and logo
    localStorage.setItem('bss_header_color', headerColor);
    if (currentUser) {
      if (contentBgImage) {
        localStorage.setItem(`bss_content_bg_image_${currentUser.id}`, contentBgImage);
      } else {
        localStorage.removeItem(`bss_content_bg_image_${currentUser.id}`);
      }
    }
    localStorage.setItem('bss_selected_character', selectedCharacter);
    localStorage.setItem('bss_custom_logo', customLogo);

    setSettingsSuccess('Pengaturan berhasil disimpan!');
    setSettingsOldPassword('');
    setSettingsNewPassword('');
    setSettingsConfirmPassword('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
        localStorage.setItem('bss_custom_logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContentBgImage(reader.result as string);
        if (currentUser) {
          localStorage.setItem(`bss_content_bg_image_${currentUser.id}`, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  // Helper to get active employee details for payroll processing
  const activeEmployee = useMemo(() => {
    return employeesList.find(e => e.id === payrollEmployeeId) || null;
  }, [employeesList, payrollEmployeeId]);

  // Helper to get active configuration settings based on employee role
  const activeConfig = useMemo((): PayrollConfig => {
    if (!activeEmployee) return payrollSettings.KARYAWAN_OUTSOURCING;
    if (activeEmployee.role === 'KARYAWAN_INTERNAL') return payrollSettings.KARYAWAN_INTERNAL;
    if (activeEmployee.role === 'KARYAWAN_MAGANG') return payrollSettings.KARYAWAN_MAGANG;
    return payrollSettings.KARYAWAN_OUTSOURCING;
  }, [activeEmployee, payrollSettings]);

  // Helper to calculate the active employee's base salary (personal rate or category default fallback)
  const baseSalaryPreview = useMemo(() => {
    return Number(gajiPokokInput) || 0;
  }, [gajiPokokInput]);

  // Helper to calculate attendance stats for the selected period
  const attendanceStats = useMemo(() => {
    if (!payrollEmployeeId) return { hadir: 0, sakit: 0, izin: 0, alpa: 0 };
    
    const monthStr = payrollMonth; // e.g. "07"
    const yearStr = payrollYear;   // e.g. "2026"
    
    const logs = attendancesList.filter(l => {
      if (l.userId !== payrollEmployeeId) return false;
      const logDate = new Date(l.date);
      const logMonth = (logDate.getMonth() + 1).toString().padStart(2, '0');
      const logYear = logDate.getFullYear().toString();
      return logMonth === monthStr && logYear === yearStr;
    });

    const hadir = logs.filter(l => l.status === 'HADIR').length;
    const sakit = logs.filter(l => l.status === 'SAKIT').length;
    const izin = logs.filter(l => l.status === 'IZIN').length;
    const alpa = logs.filter(l => l.status === 'ALPA').length;

    return { hadir, sakit, izin, alpa };
  }, [attendancesList, payrollEmployeeId, payrollMonth, payrollYear]);

  // Layout Side Navigation mapping
  const navItems = useMemo(() => {
    const items: any[] = [{ name: 'Dashboard', path: 'bss-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> }];
    if (role === 'ADMIN') {
      items.push({ name: 'Master Karyawan', path: 'bss-karyawan', icon: <Users className="w-5 h-5" /> });
      items.push({ name: 'Laporan Absensi', path: 'bss-absensi', icon: <Clock className="w-5 h-5" /> });
      items.push({ name: 'Sistem Penggajian', path: 'bss-payroll', icon: <CreditCard className="w-5 h-5" /> });
      items.push({ name: 'Kalender PKWT', path: 'bss-pkwt', icon: <Calendar className="w-5 h-5" /> });
      items.push({
        name: 'Pengaturan',
        path: 'bss-settings',
        icon: <Settings className="w-5 h-5" />,
        subItems: [
          { name: 'Visual & Tema', path: 'bss-settings', settingsCat: 'visual', icon: <Building className="w-4 h-4" /> }
        ]
      });
    } else if (role === 'KLIEN') {
      items.push({ name: 'Laporan Pekerja', path: 'bss-karyawan', icon: <Users className="w-5 h-5" /> });
      items.push({ name: 'Rekapan Absensi', path: 'bss-absensi', icon: <Clock className="w-5 h-5" /> });
      items.push({ name: 'Info Penggajian', path: 'bss-payroll', icon: <CreditCard className="w-5 h-5" /> });
      items.push({ name: 'Kalender PKWT', path: 'bss-pkwt', icon: <Calendar className="w-5 h-5" /> });
      items.push({
        name: 'Pengaturan',
        path: 'bss-settings',
        icon: <Settings className="w-5 h-5" />,
        subItems: [
          { name: 'Visual & Tema', path: 'bss-settings', settingsCat: 'visual', icon: <Building className="w-4 h-4" /> }
        ]
      });
    } else {
      items.push({ name: 'Absen Harian', path: 'bss-absensi', icon: <Clock className="w-5 h-5" /> });
      items.push({ name: 'Slip Gaji Saya', path: 'bss-payroll', icon: <CreditCard className="w-5 h-5" /> });
      items.push({ name: 'Kalender PKWT', path: 'bss-pkwt', icon: <Calendar className="w-5 h-5" /> });
      items.push({
        name: 'Pengaturan',
        path: 'bss-settings',
        icon: <Settings className="w-5 h-5" />,
        subItems: [
          { name: 'Profil & Password', path: 'bss-settings', settingsCat: 'profile', icon: <UserIcon className="w-4 h-4" /> },
          { name: 'Visual & Tema', path: 'bss-settings', settingsCat: 'visual', icon: <Building className="w-4 h-4" /> }
        ]
      });
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
    if (user.avatar) return user.avatar;
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
            <img src={customLogo} alt="PT. BSS Logo" className="h-10 w-auto bg-white p-1 rounded-xl shadow-md shrink-0 object-contain" />
            <span className="text-xl font-black">PT. BSS APP</span>
          </div>

          <div className="relative z-10 max-w-lg space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">HRIS (Human Resource Information System)</h1>
            <p className="text-emerald-100 leading-relaxed text-sm">
              Kelola data master personal, penugasan kontrak kerja mitra, laporan absensi digital selfie-GPS, dan parameter penggajian secara digital terintegrasi.
            </p>
          </div>

          <p className="relative z-10 text-xs text-emerald-200">
            Copyright © PT. BSS Outsourcing Indonesia 2026
          </p>
        </div>

        {/* Right Form Card */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          {/* Logo outside card */}
          <div className="mb-8 flex justify-center">
            <img src={customLogo} alt="PT. BSS Logo" className="h-32 w-auto animate-float object-contain" />
          </div>
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
              <div className="flex items-center gap-3 pb-6 border-b border-slate-50 dark:border-slate-800/80 mb-6">
                <img src={customLogo} alt="PT. BSS Logo" className="h-10 w-auto bg-white p-1.5 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 shrink-0 object-contain" />
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
                  {navItems.map((item: any) => {
                    const isParentActive = activeTab === item.path;
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    
                    if (hasSubItems) {
                      return (
                        <li key={item.path} className="space-y-1">
                          <button
                            onClick={() => {
                              setSettingsDropdownOpen(!settingsDropdownOpen);
                            }}
                            className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                              isParentActive
                                ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="shrink-0">{item.icon}</span>
                              <span>{item.name}</span>
                            </div>
                            <span>
                              {settingsDropdownOpen ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </span>
                          </button>
                          
                          {settingsDropdownOpen && (
                            <ul className="pl-6 space-y-1 mt-1 border-l border-slate-100 dark:border-slate-800/80 ml-5">
                              {item.subItems.map((sub: any) => {
                                const isSubActive = activeTab === sub.path && settingsCategory === sub.settingsCat;
                                return (
                                  <li key={sub.name}>
                                    <button
                                      onClick={() => {
                                        setActiveTab(sub.path as TabType);
                                        setSettingsCategory(sub.settingsCat);
                                        if (window.innerWidth < 1024) {
                                          setSidebarOpen(false);
                                        }
                                      }}
                                      className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-[11px] font-semibold transition-all text-left cursor-pointer ${
                                        isSubActive
                                          ? 'text-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/5 font-bold'
                                          : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
                                      }`}
                                    >
                                      <span className="shrink-0">{sub.icon}</span>
                                      <span>{sub.name}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    }

                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => {
                            setActiveTab(item.path as TabType);
                            if (item.path === 'bss-pkwt') {
                              setPkwtViewMode('table');
                              setSelectedCalendarEmployee(null);
                            }
                            if (window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-left block cursor-pointer ${
                            isParentActive
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
          <header 
            className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 py-4 px-6 sticky top-0 z-30 flex items-center justify-between transition-colors duration-300 no-print"
            style={{ backgroundColor: headerColor }}
          >
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
                {activeTab === 'bss-payroll' && (role === 'ADMIN' ? 'Sistem Penggajian' : role === 'KLIEN' ? 'Info Penggajian' : 'Slip Gaji Saya')}
                {activeTab === 'bss-settings' && 'Pengaturan'}
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
                        if (role === 'ADMIN' || role === 'KLIEN') {
                          setActiveTab('bss-karyawan');
                        } else {
                          setActiveTab('bss-settings');
                          setSettingsCategory('profile');
                        }
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
          <main 
            className="p-6 flex-1 space-y-6 transition-all duration-300" 
            style={{ 
              backgroundImage: `url(${contentBgImage || getUserBgImage(currentUser)})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              backgroundAttachment: 'fixed' 
            }}
          >
            
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
                      <button
                        onClick={exportAttendanceToExcel}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 transition-all self-start sm:self-center"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export Excel (.csv)</span>
                      </button>
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

            {/* TABS 4: BSS-PAYROLL */}
            {activeTab === 'bss-payroll' && (
              <div className="animate-fade-in space-y-6 no-print">
                
                {/* ADMIN VIEW */}
                {role === 'ADMIN' && (
                  <>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setActivePayrollTab('proses')}
                          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                            activePayrollTab === 'proses'
                              ? 'text-emerald-500 border-b-2 border-emerald-500'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                          }`}
                        >
                          Proses Gaji Baru
                        </button>
                        <button
                          onClick={() => setActivePayrollTab('riwayat')}
                          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                            activePayrollTab === 'riwayat'
                              ? 'text-emerald-500 border-b-2 border-emerald-500'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                          }`}
                        >
                          Riwayat Slip Gaji
                        </button>
                        <button
                          onClick={() => setActivePayrollTab('settings')}
                          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                            activePayrollTab === 'settings'
                              ? 'text-emerald-500 border-b-2 border-emerald-500'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                          }`}
                        >
                          ⚙️ Pengaturan Default Gaji
                        </button>
                      </div>
                    </div>

                    {activePayrollTab === 'proses' && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* INPUT FORM COLUMN */}
                        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">
                            Parameter Input Gaji
                          </h3>
                          <form onSubmit={handleSavePayroll} className="space-y-3.5">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Pilih Karyawan</label>
                              <select
                                required
                                value={payrollEmployeeId}
                                onChange={(e) => handleEmployeeSelect(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100 cursor-pointer"
                              >
                                <option value="">-- Pilih Karyawan --</option>
                                {employeesList.filter(e => e.role !== 'ADMIN' && e.role !== 'KLIEN').map(emp => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.namaLengkap} ({emp.nikKaryawan})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Upah Pokok (Rp)</label>
                              <input
                                type="number"
                                value={gajiPokokInput}
                                onChange={(e) => setGajiPokokInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Bulan</label>
                                <select
                                  value={payrollMonth}
                                  onChange={(e) => setPayrollMonth(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                                >
                                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
                                    <option key={m} value={m}>{new Date(2026, Number(m)-1, 1).toLocaleString('id-ID', { month: 'long' })}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tahun</label>
                                <select
                                  value={payrollYear}
                                  onChange={(e) => setPayrollYear(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                                >
                                  {["2025","2026","2027"].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tunjangan Jabatan (Rp)</label>
                              <input
                                type="number"
                                value={tunjanganJabatanInput}
                                onChange={(e) => setTunjanganJabatanInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Uang Harian Makan/Transport per Hari (Rp)</label>
                              <input
                                type="number"
                                value={tunjanganMakanTransportInput}
                                onChange={(e) => setTunjanganMakanTransportInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tunjangan Lainnya (Rp)</label>
                              <input
                                type="number"
                                value={tunjanganLainnyaInput}
                                onChange={(e) => setTunjanganLainnyaInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Potongan PPh21 / Pajak (Rp)</label>
                              <input
                                type="number"
                                value={potonganPPh21Input}
                                onChange={(e) => setPotonganPPh21Input(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-855 dark:text-slate-100"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Potongan Lainnya (Rp)</label>
                              <input
                                type="number"
                                value={potonganLainnyaInput}
                                onChange={(e) => setPotonganLainnyaInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-855 dark:text-slate-100"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Catatan / Note</label>
                              <input
                                type="text"
                                value={payrollNote}
                                onChange={(e) => setPayrollNote(e.target.value)}
                                placeholder="e.g. Gaji Pokok + Lembur Cikarang"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-500/15 cursor-pointer mt-4"
                            >
                              💾 Simpan & Proses Slip Gaji
                            </button>
                          </form>
                        </div>

                        {/* LIVE PREVIEW COLUMN */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800/80 pb-3 flex justify-between items-center">
                            <span>Live Preview Perhitungan</span>
                            <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">Periode {payrollMonth}/{payrollYear}</span>
                          </h3>

                          {activeEmployee ? (
                            <div className="space-y-6">
                              {/* Summary Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                                <div>
                                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Nama Staff</span>
                                  <strong className="text-xs text-slate-800 dark:text-white">{activeEmployee.namaLengkap}</strong>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-bold text-slate-400 uppercase">NIK Karyawan</span>
                                  <strong className="text-xs text-slate-800 dark:text-white">{activeEmployee.nikKaryawan}</strong>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Jabatan</span>
                                  <strong className="text-xs text-emerald-500">{activeEmployee.jabatan || 'Staff'}</strong>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Penempatan Klien</span>
                                  <strong className="text-xs text-indigo-500 truncate block">{activeEmployee.clientAssigned || 'Kantor Pusat'}</strong>
                                </div>
                              </div>

                              {/* Attendance count preview */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-650 dark:text-slate-350">Rekapitulasi Kehadiran Absensi Bulan Ini</h4>
                                <div className="grid grid-cols-4 gap-3 text-center">
                                  <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-3 rounded-2xl border border-emerald-100/55">
                                    <div className="text-lg font-black text-emerald-500">{attendanceStats.hadir}</div>
                                    <div className="text-[9px] font-bold text-slate-450 uppercase mt-0.5">Hadir</div>
                                  </div>
                                  <div className="bg-blue-50/50 dark:bg-blue-950/10 p-3 rounded-2xl border border-blue-100/55">
                                    <div className="text-lg font-black text-blue-500">{attendanceStats.sakit}</div>
                                    <div className="text-[9px] font-bold text-slate-450 uppercase mt-0.5">Sakit</div>
                                  </div>
                                  <div className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-2xl border border-amber-100/55">
                                    <div className="text-lg font-black text-amber-500">{attendanceStats.izin}</div>
                                    <div className="text-[9px] font-bold text-slate-450 uppercase mt-0.5">Izin</div>
                                  </div>
                                  <div className="bg-rose-50/50 dark:bg-rose-950/10 p-3 rounded-2xl border border-rose-100/55">
                                    <div className="text-lg font-black text-rose-500">{attendanceStats.alpa}</div>
                                    <div className="text-[9px] font-bold text-slate-450 uppercase mt-0.5">Alpa</div>
                                  </div>
                                </div>
                                <p className="text-[9px] text-slate-400 italic mt-1">
                                  * Data absensi diambil otomatis dari modul log absensi GPS-selfie staff untuk periode bulan berjalan.
                                </p>
                              </div>

                              {/* Income & Deduction Table */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Income Section */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold text-emerald-500 uppercase border-b border-emerald-500/10 pb-1.5 flex justify-between">
                                    <span>Penerimaan (Income)</span>
                                    <span>Rp</span>
                                  </h4>
                                  <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                                    <li className="flex justify-between">
                                      <span>Upah Pokok</span>
                                      <span>{baseSalaryPreview.toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Tunjangan Jabatan</span>
                                      <span>{(Number(tunjanganJabatanInput) || 0).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Tunjangan Makan & Trans. ({attendanceStats.hadir} hari)</span>
                                      <span>{((Number(tunjanganMakanTransportInput) || 25000) * attendanceStats.hadir).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Tunjangan Lainnya</span>
                                      <span>{(Number(tunjanganLainnyaInput) || 0).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-extrabold text-slate-850 dark:text-white text-[13px]">
                                      <span>Subtotal Penerimaan</span>
                                      <span>{(baseSalaryPreview + (Number(tunjanganJabatanInput) || 0) + ((Number(tunjanganMakanTransportInput) || 25000) * attendanceStats.hadir) + (Number(tunjanganLainnyaInput) || 0)).toLocaleString('id-ID')}</span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Deductions Section */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold text-rose-500 uppercase border-b border-rose-500/10 pb-1.5 flex justify-between">
                                    <span>Potongan (Deductions)</span>
                                    <span>Rp</span>
                                  </h4>
                                  <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                                    <li className="flex justify-between">
                                      <span>BPJS Kesehatan ({activeConfig.potonganBpjsKesehatan}%)</span>
                                      <span>{Math.round(baseSalaryPreview * (activeConfig.potonganBpjsKesehatan / 100)).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>BPJS Ketenagakerjaan ({activeConfig.potonganBpjsKetenagakerjaan}%)</span>
                                      <span>{Math.round(baseSalaryPreview * (activeConfig.potonganBpjsKetenagakerjaan / 100)).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Potongan PPh21 / Pajak</span>
                                      <span>{(Number(potonganPPh21Input) || 0).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Potongan Absensi ({attendanceStats.alpa} hari Alpa)</span>
                                      <span>{(attendanceStats.alpa * activeConfig.potonganAlpa).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Potongan Lain-lain</span>
                                      <span>{(Number(potonganLainnyaInput) || 0).toLocaleString('id-ID')}</span>
                                    </li>
                                    <li className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-2 font-extrabold text-slate-850 dark:text-white text-[13px]">
                                      <span>Subtotal Potongan</span>
                                      <span>{(
                                        Math.round(baseSalaryPreview * (activeConfig.potonganBpjsKesehatan / 100)) +
                                        Math.round(baseSalaryPreview * (activeConfig.potonganBpjsKetenagakerjaan / 100)) +
                                        (Number(potonganPPh21Input) || 0) +
                                        (attendanceStats.alpa * activeConfig.potonganAlpa) +
                                        (Number(potonganLainnyaInput) || 0)
                                      ).toLocaleString('id-ID')}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              {/* Take Home Pay calculation */}
                              <div className="bg-emerald-500/10 dark:bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                  <strong className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-450 block font-bold">Total Take Home Pay (Net Salary)</strong>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Penerimaan Bersih yang ditransfer ke Staff.</p>
                                </div>
                                <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400">
                                  Rp {(
                                    (baseSalaryPreview + (Number(tunjanganJabatanInput) || 0) + ((Number(tunjanganMakanTransportInput) || 25000) * attendanceStats.hadir) + (Number(tunjanganLainnyaInput) || 0)) -
                                    (Math.round(baseSalaryPreview * (activeConfig.potonganBpjsKesehatan / 100)) + Math.round(baseSalaryPreview * (activeConfig.potonganBpjsKetenagakerjaan / 100)) + (Number(potonganPPh21Input) || 0) + (attendanceStats.alpa * activeConfig.potonganAlpa) + (Number(potonganLainnyaInput) || 0))
                                  ).toLocaleString('id-ID')}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-20 text-slate-450 italic">
                              💡 Silakan pilih salah satu karyawan di form sebelah kiri untuk memuat kalkulator penggajian.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activePayrollTab === 'riwayat' && (
                      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden space-y-4 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-855 dark:text-white uppercase tracking-wider">Riwayat Penggajian Terproses</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Daftar lengkap seluruh slip gaji karyawan yang telah diproses dan disimpan di database.</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleSendInvoices('email')}
                              disabled={selectedSlipIds.length === 0}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                selectedSlipIds.length > 0 
                                  ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10' 
                                  : 'text-slate-400 bg-slate-100 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed border border-slate-200/20 dark:border-slate-800'
                              }`}
                            >
                              <Mail className="w-4 h-4" />
                              <span>Kirim Email {selectedSlipIds.length > 0 && `(${selectedSlipIds.length})`}</span>
                            </button>

                            <button
                              onClick={() => handleSendInvoices('wa')}
                              disabled={selectedSlipIds.length === 0}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                selectedSlipIds.length > 0 
                                  ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/10' 
                                  : 'text-slate-400 bg-slate-100 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed border border-slate-200/20 dark:border-slate-800'
                              }`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Kirim WA {selectedSlipIds.length > 0 && `(${selectedSlipIds.length})`}</span>
                            </button>

                            <button
                              onClick={exportPayrollToExcel}
                              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-250 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-150 dark:border-slate-800 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                            >
                              <FileSpreadsheet className="w-4 h-4" />
                              <span>Export Excel (.csv)</span>
                            </button>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="py-3.5 px-4 text-center w-12">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-slate-350 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer h-4 w-4 bg-white dark:bg-slate-950"
                                    checked={payslipsList.length > 0 && selectedSlipIds.length === payslipsList.length}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedSlipIds(payslipsList.map(s => s.id));
                                      } else {
                                        setSelectedSlipIds([]);
                                      }
                                    }}
                                  />
                                </th>
                                <th className="py-3.5 px-6">Staff Karyawan</th>
                                <th className="py-3.5 px-6">Bulan Periode</th>
                                <th className="py-3.5 px-6">Gaji Pokok</th>
                                <th className="py-3.5 px-6">Total Penerimaan</th>
                                <th className="py-3.5 px-6">Total Potongan</th>
                                <th className="py-3.5 px-6">Take Home Pay</th>
                                <th className="py-3.5 px-6 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                              {payslipsList.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="text-center py-12 text-slate-400">Tidak ada riwayat slip gaji terproses.</td>
                                </tr>
                              ) : (
                                payslipsList.map(slip => (
                                  <tr key={slip.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 text-slate-700 dark:text-slate-350">
                                    <td className="py-3.5 px-4 text-center">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-slate-350 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer h-4 w-4 bg-white dark:bg-slate-950"
                                        checked={selectedSlipIds.includes(slip.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedSlipIds([...selectedSlipIds, slip.id]);
                                          } else {
                                            setSelectedSlipIds(selectedSlipIds.filter(id => id !== slip.id));
                                          }
                                        }}
                                      />
                                    </td>
                                    <td className="py-3.5 px-6">
                                      <div className="font-extrabold text-slate-855 dark:text-white">{slip.employeeName}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5">NIK: {slip.employeeNik} | {slip.jabatan}</div>
                                    </td>
                                    <td className="py-3.5 px-6 font-semibold">
                                      {new Date(2026, Number(slip.periodMonth)-1, 1).toLocaleString('id-ID', { month: 'long' })} {slip.periodYear}
                                    </td>
                                    <td className="py-3.5 px-6 font-semibold">Rp {slip.gajiPokok.toLocaleString('id-ID')}</td>
                                    <td className="py-3.5 px-6 font-semibold text-emerald-500">Rp {slip.totalPenerimaan.toLocaleString('id-ID')}</td>
                                    <td className="py-3.5 px-6 font-semibold text-rose-500">Rp {slip.totalPotongan.toLocaleString('id-ID')}</td>
                                    <td className="py-3.5 px-6 font-extrabold text-slate-800 dark:text-white bg-slate-50/40 dark:bg-slate-950/20">Rp {slip.takeHomePay.toLocaleString('id-ID')}</td>
                                    <td className="py-3.5 px-6 text-center">
                                      <div className="flex justify-center gap-2">
                                        <button
                                          onClick={() => setSelectedPayslip(slip)}
                                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/15 dark:hover:bg-emerald-950/30 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                          <Printer className="w-3 h-3" /> Cetak Slip
                                        </button>
                                        <button
                                          onClick={() => handleDeletePayslip(slip.id)}
                                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activePayrollTab === 'settings' && (
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">Pengaturan Nilai Default Gaji & Potongan</h3>
                            <p className="text-[11px] text-slate-400 mt-1 text-slate-450">Sesuaikan upah acuan, tunjangan harian, persentase BPJS, dan denda alpa untuk setiap status keanggotaan karyawan.</p>
                          </div>
                          <button
                            onClick={handleSaveAllSettings}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 transition-all self-start sm:self-center"
                          >
                            <span>Simpan Konfigurasi</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                          {/* INTERNAL */}
                          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Staff Internal</h4>
                            </div>
                            
                            <div className="space-y-3.5 text-xs">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Upah Pokok Acuan (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_INTERNAL.gajiPokok}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, gajiPokok: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tunjangan Jabatan Default (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_INTERNAL.tunjanganJabatan}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, tunjanganJabatan: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Uang Harian Makan/Trans per Hari (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_INTERNAL.tunjanganMakanTransport}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, tunjanganMakanTransport: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">BPJS Kes (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_INTERNAL.potonganBpjsKesehatan}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, potonganBpjsKesehatan: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">BPJS TK (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_INTERNAL.potonganBpjsKetenagakerjaan}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, potonganBpjsKetenagakerjaan: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">PPh21 Pajak (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_INTERNAL.potonganPPh21}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, potonganPPh21: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Denda Alpa/Hari (Rp)</label>
                                  <input
                                    type="number"
                                    value={editingSettings.KARYAWAN_INTERNAL.potonganAlpa}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_INTERNAL: { ...prev.KARYAWAN_INTERNAL, potonganAlpa: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* OUTSOURCING */}
                          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Staff Outsourcing</h4>
                            </div>
                            
                            <div className="space-y-3.5 text-xs">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Upah Pokok Acuan (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_OUTSOURCING.gajiPokok}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, gajiPokok: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tunjangan Jabatan Default (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_OUTSOURCING.tunjanganJabatan}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, tunjanganJabatan: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Uang Harian Makan/Trans per Hari (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_OUTSOURCING.tunjanganMakanTransport}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, tunjanganMakanTransport: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">BPJS Kes (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_OUTSOURCING.potonganBpjsKesehatan}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, potonganBpjsKesehatan: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">BPJS TK (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_OUTSOURCING.potonganBpjsKetenagakerjaan}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, potonganBpjsKetenagakerjaan: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">PPh21 Pajak (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_OUTSOURCING.potonganPPh21}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, potonganPPh21: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Denda Alpa/Hari (Rp)</label>
                                  <input
                                    type="number"
                                    value={editingSettings.KARYAWAN_OUTSOURCING.potonganAlpa}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_OUTSOURCING: { ...prev.KARYAWAN_OUTSOURCING, potonganAlpa: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* MAGANG */}
                          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Magang / Intern</h4>
                            </div>
                            
                            <div className="space-y-3.5 text-xs">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Upah Pokok Acuan (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_MAGANG.gajiPokok}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, gajiPokok: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tunjangan Jabatan Default (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_MAGANG.tunjanganJabatan}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, tunjanganJabatan: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Uang Harian Makan/Trans per Hari (Rp)</label>
                                <input
                                  type="number"
                                  value={editingSettings.KARYAWAN_MAGANG.tunjanganMakanTransport}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, tunjanganMakanTransport: Number(e.target.value) || 0 }
                                  }))}
                                  className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">BPJS Kes (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_MAGANG.potonganBpjsKesehatan}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, potonganBpjsKesehatan: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">BPJS TK (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_MAGANG.potonganBpjsKetenagakerjaan}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, potonganBpjsKetenagakerjaan: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">PPh21 Pajak (%)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editingSettings.KARYAWAN_MAGANG.potonganPPh21}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, potonganPPh21: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Denda Alpa/Hari (Rp)</label>
                                  <input
                                    type="number"
                                    value={editingSettings.KARYAWAN_MAGANG.potonganAlpa}
                                    onChange={(e) => setEditingSettings(prev => ({
                                      ...prev,
                                      KARYAWAN_MAGANG: { ...prev.KARYAWAN_MAGANG, potonganAlpa: Number(e.target.value) || 0 }
                                    }))}
                                    className="w-full bg-white dark:bg-slate-955 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-205 focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* CLIENT VIEW (MITRA HR) */}
                {role === 'KLIEN' && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-850 dark:text-white">Rekapitulasi Penggajian Staff Mitra</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Daftar slip gaji staff PT. BSS yang ditempatkan di <strong>{currentUser?.clientAssigned}</strong>.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3.5 px-6">Nama Staff</th>
                            <th className="py-3.5 px-6">Jabatan</th>
                            <th className="py-3.5 px-6">Periode Bulan</th>
                            <th className="py-3.5 px-6">Total Tagihan (THP)</th>
                            <th className="py-3.5 px-6 text-center">Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                          {payslipsList.filter(s => s.penempatan === currentUser?.clientAssigned).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-12 text-slate-400">Belum ada slip gaji yang dirilis untuk staff penempatan Anda.</td>
                            </tr>
                          ) : (
                            payslipsList.filter(s => s.penempatan === currentUser?.clientAssigned).map(slip => (
                              <tr key={slip.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 text-slate-700 dark:text-slate-350">
                                <td className="py-3.5 px-6 font-extrabold">{slip.employeeName}</td>
                                <td className="py-3.5 px-6 font-medium">{slip.jabatan}</td>
                                <td className="py-3.5 px-6 font-semibold">
                                  {new Date(2026, Number(slip.periodMonth)-1, 1).toLocaleString('id-ID', { month: 'long' })} {slip.periodYear}
                                </td>
                                <td className="py-3.5 px-6 font-extrabold text-slate-800 dark:text-white">Rp {slip.takeHomePay.toLocaleString('id-ID')}</td>
                                <td className="py-3.5 px-6 text-center">
                                  <button
                                    onClick={() => setSelectedPayslip(slip)}
                                    className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold flex items-center gap-1 mx-auto cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Detail Slip
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* EMPLOYEES VIEW (SLIP GAJI SAYA) */}
                {role !== 'ADMIN' && role !== 'KLIEN' && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-850 dark:text-white">Daftar Slip Gaji Bulanan</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Unduh atau cetak slip gaji bulanan resmi Anda dari PT. BSS Outsourcing.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3.5 px-6">Periode Gaji</th>
                            <th className="py-3.5 px-6">Tipe Hubungan</th>
                            <th className="py-3.5 px-6">Nomor Rekening Mandiri</th>
                            <th className="py-3.5 px-6">Total Penerimaan Bersih (THP)</th>
                            <th className="py-3.5 px-6 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                          {payslipsList.filter(s => s.employeeId === currentUser?.id).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-12 text-slate-400">Belum ada slip gaji yang diproses untuk akun Anda.</td>
                            </tr>
                          ) : (
                            payslipsList.filter(s => s.employeeId === currentUser?.id).map(slip => (
                              <tr key={slip.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 text-slate-700 dark:text-slate-350">
                                <td className="py-3.5 px-6 font-extrabold text-slate-850 dark:text-white">
                                  {new Date(2026, Number(slip.periodMonth)-1, 1).toLocaleString('id-ID', { month: 'long' })} {slip.periodYear}
                                </td>
                                <td className="py-3.5 px-6 font-semibold">
                                  <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                                    {roleDisplayNames[role]?.replace('Karyawan ', '')}
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 font-medium text-slate-500">{slip.rekening}</td>
                                <td className="py-3.5 px-6 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">Rp {slip.takeHomePay.toLocaleString('id-ID')}</td>
                                <td className="py-3.5 px-6 text-center">
                                  <button
                                    onClick={() => setSelectedPayslip(slip)}
                                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/15 dark:hover:bg-emerald-950/30 rounded-xl text-[10px] font-black flex items-center gap-1 mx-auto cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5" /> Cetak Slip Gaji
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {activeTab === 'bss-settings' && (
              <div className="animate-fade-in space-y-6">
                {/* Top header */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                  <h2 className="text-base font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                    {settingsCategory === 'profile' ? '👤 Pengaturan Profil & Keamanan' : '🎨 Kustomisasi Tema & Visual'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {settingsCategory === 'profile' 
                      ? 'Kelola data profil pribadi, nomor kontak, ukuran seragam kerja, serta kredensial keamanan akun Anda.' 
                      : 'Sesuaikan kustomisasi warna header topbar, unggah logo perusahaan baru, serta pasang foto profil kustom Anda.'}
                  </p>
                </div>

                {settingsError && (
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/50">
                    ⚠️ {settingsError}
                  </div>
                )}
                {settingsSuccess && (
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                    ✓ {settingsSuccess}
                  </div>
                )}

                {/* CATEGORY 1: PROFILE & CREDENTIALS */}
                {settingsCategory === 'profile' && currentUser && (
                  <div className="space-y-6">
                    {/* Header edit button for profile */}
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Data Profil Pribadi</span>
                      {!isEditingSelf ? (
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData({ ...currentUser });
                            setIsEditingSelf(true);
                          }} 
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition shadow-md shadow-emerald-500/15 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Informasi Kontak & Seragam</span>
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => setIsEditingSelf(false)} 
                          className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                        >
                          Batal Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      {/* Form for Profile info */}
                      <form onSubmit={handleSelfProfileSubmit} className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box 1: Data Pribadi */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                          <h3 className="text-sm font-bold text-slate-805 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                            <UserIcon className="w-4.5 h-4.5 text-emerald-500" /> Data Pribadi
                          </h3>
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

                        {/* Column 2 has Kontrak and Bank & Seragam */}
                        <div className="space-y-6">
                          {/* Box 2: Kontrak & Penempatan */}
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                              <FileText className="w-4.5 h-4.5 text-emerald-500" /> Kontrak & Penempatan
                            </h3>
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

                          {/* Box 3: Bank & Seragam */}
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                              <CreditCard className="w-4.5 h-4.5 text-emerald-500" /> Bank & Seragam
                            </h3>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400">Rekening Mandiri Payroll</label>
                              <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.rekeningMandiri || ''} />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400">Nomor NPWP</label>
                              <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 text-slate-400" value={currentUser.npwp || ''} />
                            </div>
                            <div className="pt-3">
                              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Ukuran Seragam Kerja</h4>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-bold text-slate-400">Baju</label>
                                  <select disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-2.5 py-2 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.ukuranBaju} onChange={(e) => setFormData({ ...formData, ukuranBaju: e.target.value })}>
                                    <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-bold text-slate-400">Celana</label>
                                  <input type="text" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-2.5 py-2 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.ukuranCelana || ''} onChange={(e) => setFormData({ ...formData, ukuranCelana: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-bold text-slate-400">Sepatu</label>
                                  <input type="text" disabled={!isEditingSelf} className={`w-full border text-xs font-semibold rounded-xl px-2.5 py-2 ${!isEditingSelf ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100'}`} value={formData.ukuranSepatu || ''} onChange={(e) => setFormData({ ...formData, ukuranSepatu: e.target.value })} />
                                </div>
                              </div>
                            </div>
                            {isEditingSelf && (
                              <button type="submit" className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md transition cursor-pointer mt-4">
                                Simpan Perubahan Profil
                              </button>
                            )}
                          </div>
                        </div>
                      </form>

                      {/* Right column: Username & Password */}
                      <form onSubmit={handleSettingsSave} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 self-start">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-500" /> Kredensial Keamanan
                        </h3>
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email / Username</label>
                          <input 
                            type="email" 
                            required 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" 
                            value={settingsUsername} 
                            onChange={(e) => setSettingsUsername(e.target.value)} 
                          />
                        </div>

                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800/85 space-y-4">
                          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ubah Password Akun</span>
                          
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password Lama</label>
                            <input 
                              type="password" 
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" 
                              value={settingsOldPassword} 
                              onChange={(e) => setSettingsOldPassword(e.target.value)} 
                              placeholder="••••••••"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password Baru</label>
                            <input 
                              type="password" 
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" 
                              value={settingsNewPassword} 
                              onChange={(e) => setSettingsNewPassword(e.target.value)} 
                              placeholder="Min. 6 karakter"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Konfirmasi Password Baru</label>
                            <input 
                              type="password" 
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none text-slate-850 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" 
                              value={settingsConfirmPassword} 
                              onChange={(e) => setSettingsConfirmPassword(e.target.value)} 
                              placeholder="Sama seperti password baru"
                            />
                          </div>
                        </div>

                        <div className="pt-3">
                          <button 
                            type="submit" 
                            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black tracking-wider uppercase transition shadow-md shadow-emerald-500/10 cursor-pointer"
                          >
                            Simpan Password & Email
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* CATEGORY 2: TEMA & LOGO & AVATAR */}
                {settingsCategory === 'visual' && (
                  <form onSubmit={handleSettingsSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Warna Header & Logo */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                        <Building className="w-4.5 h-4.5 text-emerald-500" /> Branding & Tema Dashboard
                      </h3>

                      {/* Warna Header */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Warna Header Topbar</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent" 
                            value={headerColor} 
                            onChange={(e) => setHeaderColor(e.target.value)} 
                          />
                          <div className="flex-1">
                            <input 
                              type="text" 
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 uppercase focus:ring-2 focus:ring-emerald-500" 
                              value={headerColor} 
                              onChange={(e) => setHeaderColor(e.target.value)} 
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => setHeaderColor('#ffffff')}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-400 rounded-xl transition cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      {/* Gambar Background Konten Utama */}
                      <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800/80">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gambar Background Konten Utama</label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-28 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-1.5 border border-slate-100 dark:border-slate-800 shrink-0 overflow-hidden">
                            {contentBgImage ? (
                              <img src={contentBgImage} alt="Background Preview" className="h-full w-full object-cover rounded-xl" />
                            ) : (
                              <div className="text-[9px] text-slate-450 italic text-center">Bawaan Sistem</div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="bg-image-upload" 
                              className="hidden" 
                              onChange={handleBgImageUpload} 
                            />
                            <label 
                              htmlFor="bg-image-upload" 
                              className="inline-block text-center text-[10.5px] font-black text-white bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 rounded-xl cursor-pointer transition shadow-md shadow-emerald-500/10"
                            >
                              Pilih Gambar Background
                            </label>
                            {contentBgImage && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  if (currentUser) {
                                    localStorage.removeItem(`bss_content_bg_image_${currentUser.id}`);
                                    setContentBgImage(getUserBgImage(currentUser));
                                  }
                                }}
                                className="block text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-transparent cursor-pointer"
                              >
                                Reset ke Background Bawaan
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Logo Upload */}
                      <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800/80">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Logo Perusahaan</label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800 shrink-0">
                            <img src={customLogo} alt="Logo Preview" className="h-full w-full object-contain" />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="logo-upload" 
                              className="hidden" 
                              onChange={handleLogoUpload} 
                            />
                            <label 
                              htmlFor="logo-upload" 
                              className="inline-block text-center text-[10px] font-black text-white bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 rounded-xl cursor-pointer transition"
                            >
                              Pilih Logo Baru
                            </label>
                            <button 
                              type="button" 
                              onClick={() => {
                                setCustomLogo(logo);
                                localStorage.setItem('bss_custom_logo', logo);
                              }}
                              className="block text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-transparent cursor-pointer"
                            >
                              Reset ke Logo BSS
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Ganti Karakter Maskot */}
                      <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800/80">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Karakter Maskot Kalender</label>
                        <p className="text-[10px] text-slate-455 dark:text-slate-500 mt-0.5">Pilih salah satu karakter maskot yang akan ditampilkan di Kalender PKWT.</p>
                        <div className="grid grid-cols-5 gap-2 pt-1">
                          {[
                            { id: 'char1', img: char1, label: 'Polo Putih-Biru' },
                            { id: 'char2', img: char2, label: 'Polo Biru Tua' },
                            { id: 'char3', img: char3, label: 'Jas Formal L' },
                            { id: 'char4', img: char4, label: 'Kaos Hijau' },
                            { id: 'char5', img: char5, label: 'Kaos Putih-H' },
                            { id: 'char6', img: char6, label: 'Jaket Denim P' },
                            { id: 'char7', img: char7, label: 'Jas Biru P' },
                            { id: 'char8', img: char8, label: 'Hijab Putih' },
                            { id: 'char9', img: char9, label: 'Hijab Pink Jas' },
                            { id: 'char10', img: char10, label: 'Hijab Putih Jas' }
                          ].map((item) => {
                            const isSelected = selectedCharacter === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCharacter(item.id);
                                  localStorage.setItem('bss_selected_character', item.id);
                                }}
                                className={`group p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-1 bg-slate-50/50 dark:bg-slate-950/20 ${
                                  isSelected 
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                                    : 'border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700'
                                }`}
                              >
                                <div className="h-14 w-full rounded-xl overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center p-0.5">
                                  <img src={item.img} alt={item.label} className="h-full object-contain transform group-hover:scale-105 transition" />
                                </div>
                                <span className={`text-[8px] font-bold text-center tracking-tighter truncate w-full ${
                                  isSelected ? 'text-emerald-600 dark:text-emerald-450 font-black' : 'text-slate-400'
                                }`}>
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Foto Profil Upload */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                        <UserIcon className="w-4.5 h-4.5 text-emerald-500" /> Foto Profil Saya
                      </h3>

                      <div className="flex flex-col items-center justify-center py-4 space-y-4">
                        <div className="relative group">
                          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-emerald-500/20 bg-slate-50 flex items-center justify-center shadow-lg">
                            <img 
                              src={settingsAvatar || getProfileImage(currentUser)} 
                              alt="Avatar Preview" 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="avatar-upload" 
                            className="hidden" 
                            onChange={handleAvatarUpload} 
                          />
                          <label 
                            htmlFor="avatar-upload" 
                            className="absolute bottom-1 right-1 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full cursor-pointer shadow-md transition"
                          >
                            <Camera className="w-4.5 h-4.5" />
                          </label>
                        </div>

                        <div className="text-center">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Unggah Foto (JPG/PNG)</span>
                          <button 
                            type="button" 
                            onClick={() => setSettingsAvatar('')}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Hapus Foto Kustom
                          </button>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-50 dark:border-slate-800/80">
                        <button 
                          type="submit" 
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition shadow-md shadow-emerald-500/10 cursor-pointer"
                        >
                          💾 Simpan Tema & Avatar
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'bss-pkwt' && (
              <div className="animate-fade-in space-y-6">
                {((role === 'ADMIN' || role === 'KLIEN') && pkwtViewMode === 'table') ? (
                  // ==========================================
                  // 1. TABLE VIEW MODE (For Admin & Klien)
                  // ==========================================
                  <>
                    {/* Summary Cards */}
                    {(() => {
                      // Filter staff
                      const activeStaff = employeesList.filter(emp => emp.role !== 'ADMIN' && emp.role !== 'KLIEN');
                      const filteredStaff = activeStaff.filter(emp => {
                        // Filter by Client
                        if (role === 'KLIEN') {
                          if (emp.clientAssigned !== currentUser?.clientAssigned) return false;
                        } else if (pkwtClientFilter) {
                          if (emp.clientAssigned !== pkwtClientFilter) return false;
                        }
                        // Filter by Search
                        if (pkwtSearch) {
                          const query = pkwtSearch.toLowerCase();
                          return emp.namaLengkap.toLowerCase().includes(query) || 
                                 (emp.nikKaryawan && emp.nikKaryawan.toLowerCase().includes(query));
                        }
                        return true;
                      });

                      const totalPkwt = filteredStaff.length;
                      let activeCount = 0;
                      let soonExpiredCount = 0;
                      let expiredCount = 0;

                      filteredStaff.forEach(emp => {
                        if (!emp.periodePkwtAkhir) return;
                        const diffTime = new Date(emp.periodePkwtAkhir).getTime() - new Date().getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays <= 0) {
                          expiredCount++;
                        } else if (diffDays <= 30) {
                          soonExpiredCount++;
                        } else {
                          activeCount++;
                        }
                      });

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total PKWT</span>
                              <strong className="text-xl font-extrabold text-slate-800 dark:text-white leading-none mt-1 block">{totalPkwt} Org</strong>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kontrak Aktif</span>
                              <strong className="text-xl font-extrabold text-slate-800 dark:text-white leading-none mt-1 block">{activeCount} Org</strong>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-955/20 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 animate-pulse">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Segera Habis (&lt;30 H)</span>
                              <strong className="text-xl font-extrabold text-slate-800 dark:text-white leading-none mt-1 block">{soonExpiredCount} Org</strong>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                              <X className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kontrak Habis</span>
                              <strong className="text-xl font-extrabold text-slate-800 dark:text-white leading-none mt-1 block">{expiredCount} Org</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Filter & Table Area */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Daftar Kontrak PKWT Karyawan</h3>
                          <p className="text-xs text-slate-400 mt-1">Gunakan fitur pencarian dan filter untuk menavigasi tanggal berakhir kontrak kerja.</p>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Cari nama atau NIK..."
                              value={pkwtSearch}
                              onChange={(e) => setPkwtSearch(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700 dark:text-slate-200"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>

                          {role === 'ADMIN' && (
                            <select
                              value={pkwtClientFilter}
                              onChange={(e) => setPkwtClientFilter(e.target.value)}
                              className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 cursor-pointer"
                            >
                              <option value="">Semua Klien Penempatan</option>
                              {Array.from(new Set(employeesList.filter(e => e.clientAssigned).map(e => e.clientAssigned))).map(client => (
                                <option key={client} value={client}>{client}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left font-bold">
                              <th className="py-3 px-4">Karyawan</th>
                              <th className="py-3 px-4">Jabatan</th>
                              <th className="py-3 px-4">Penempatan</th>
                              <th className="py-3 px-4">Nomor PKWT</th>
                              <th className="py-3 px-4">Masa Kontrak</th>
                              <th className="py-3 px-4">Sisa Kontrak</th>
                              <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {(() => {
                              const activeStaff = employeesList.filter(emp => emp.role !== 'ADMIN' && emp.role !== 'KLIEN');
                              const filteredList = activeStaff.filter(emp => {
                                if (role === 'KLIEN') {
                                  if (emp.clientAssigned !== currentUser?.clientAssigned) return false;
                                } else if (pkwtClientFilter) {
                                  if (emp.clientAssigned !== pkwtClientFilter) return false;
                                }
                                if (pkwtSearch) {
                                  const query = pkwtSearch.toLowerCase();
                                  return emp.namaLengkap.toLowerCase().includes(query) || 
                                         (emp.nikKaryawan && emp.nikKaryawan.toLowerCase().includes(query));
                                }
                                return true;
                              });

                              if (filteredList.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={7} className="text-center py-10 text-xs text-slate-400 italic">
                                      Tidak ada data karyawan PKWT ditemukan.
                                    </td>
                                  </tr>
                                );
                              }

                              return filteredList.map(emp => {
                                let badgeClass = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400";
                                let sisaHariText = "-";
                                if (emp.periodePkwtAkhir) {
                                  const diffTime = new Date(emp.periodePkwtAkhir).getTime() - new Date().getTime();
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  if (diffDays <= 0) {
                                    badgeClass = "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450";
                                    sisaHariText = "Kontrak Habis";
                                  } else if (diffDays <= 30) {
                                    badgeClass = "bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-450 animate-pulse";
                                    sisaHariText = `${diffDays} Hari (Segera Habis)`;
                                  } else {
                                    sisaHariText = `${diffDays} Hari`;
                                  }
                                }

                                return (
                                  <tr key={emp.id} className="text-xs hover:bg-slate-50/55 dark:hover:bg-slate-800/10 transition-colors">
                                    <td className="py-3.5 px-4 flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-100 flex items-center justify-center">
                                        <img src={getProfileImage(emp)} alt="Avatar" className="h-full w-full object-cover" />
                                      </div>
                                      <div>
                                        <span className="font-extrabold text-slate-800 dark:text-slate-100 block">{emp.namaLengkap}</span>
                                        <span className="text-[9px] text-slate-400 block mt-0.5">NIK: {emp.nikKaryawan || '-'}</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-slate-650 dark:text-slate-300">{emp.jabatan || '-'}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-200">{emp.clientAssigned || '-'}</td>
                                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">{emp.nomorPkwt || '-'}</td>
                                    <td className="py-3.5 px-4 text-slate-500 font-semibold">
                                      {emp.periodePkwtAwal && emp.periodePkwtAkhir ? (
                                        <span>{emp.periodePkwtAwal} s/d {emp.periodePkwtAkhir}</span>
                                      ) : '-'}
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider inline-block ${badgeClass}`}>
                                        {sisaHariText}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedCalendarEmployee(emp);
                                          if (emp.periodePkwtAkhir) {
                                            const [year, month] = emp.periodePkwtAkhir.split('-');
                                            if (year && month) {
                                              setCurrentCalendarDate(new Date(parseInt(year), parseInt(month) - 1, 1));
                                            }
                                          }
                                          setPkwtViewMode('calendar');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors"
                                      >
                                        <Calendar className="w-3.5 h-3.5" /> Lihat Kalender
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  // ==========================================
                  // 2. CALENDAR VIEW MODE
                  // ==========================================
                  <>
                    {/* Header Area */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors text-left">
                      <div className="flex items-center gap-4">
                        {(role === 'ADMIN' || role === 'KLIEN') && (
                          <button
                            onClick={() => {
                              setPkwtViewMode('table');
                              setSelectedCalendarEmployee(null);
                            }}
                            className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md shadow-rose-500/35 hover:scale-105 active:scale-95 animate-bounce-left border-0"
                            title="Kembali ke Daftar Karyawan"
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                          </button>
                        )}
                        <div>
                          <h2 className="text-base font-extrabold text-slate-855 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span>📅 Kalender PKWT</span>
                            {selectedCalendarEmployee && (
                              <span className="text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 px-2.5 py-1 rounded-xl tracking-normal normal-case font-bold border border-emerald-100 dark:border-emerald-900/30">
                                Karyawan: {selectedCalendarEmployee.namaLengkap}
                              </span>
                            )}
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            {role === 'ADMIN' || role === 'KLIEN' 
                              ? 'Memantau visualisasi kalender kontrak dan rentang masa aktif PKWT staff.' 
                              : 'Pantau status masa aktif kontrak kerja (PKWT) Anda langsung di kalender.'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Calendar Navigation */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        <span className="text-xs font-black text-slate-855 dark:text-white uppercase min-w-[120px] text-center">
                          {currentCalendarDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                          onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setCurrentCalendarDate(new Date(2026, 6, 12))}
                          className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-xl transition cursor-pointer hover:bg-emerald-100"
                        >
                          Juli 2026
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                      {/* Calendar Grid Container */}
                      <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 transition-colors">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-wider">
                          <div className="bg-rose-500 text-white py-1.5 rounded-full shadow-sm">Minggu</div>
                          <div className="bg-slate-200 dark:bg-slate-800 text-slate-655 dark:text-slate-350 py-1.5 rounded-full">Senin</div>
                          <div className="bg-slate-200 dark:bg-slate-800 text-slate-655 dark:text-slate-350 py-1.5 rounded-full">Selasa</div>
                          <div className="bg-slate-200 dark:bg-slate-800 text-slate-655 dark:text-slate-350 py-1.5 rounded-full">Rabu</div>
                          <div className="bg-slate-200 dark:bg-slate-800 text-slate-655 dark:text-slate-350 py-1.5 rounded-full">Kamis</div>
                          <div className="bg-slate-200 dark:bg-slate-800 text-slate-655 dark:text-slate-350 py-1.5 rounded-full">Jumat</div>
                          <div className="bg-emerald-500 text-white py-1.5 rounded-full shadow-sm">Sabtu</div>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                          {(() => {
                            const year = currentCalendarDate.getFullYear();
                            const month = currentCalendarDate.getMonth();
                            const firstDayIndex = new Date(year, month, 1).getDay();
                            const numberOfDays = new Date(year, month + 1, 0).getDate();
                            const prevMonthNumberOfDays = new Date(year, month, 0).getDate();
                            
                            const cells = [];
                            
                            // Previous Month Days (greyed out)
                            for (let i = firstDayIndex - 1; i >= 0; i--) {
                              const dayNum = prevMonthNumberOfDays - i;
                              cells.push(
                                <div key={`prev-${dayNum}`} className="min-h-[85px] bg-slate-50/30 dark:bg-slate-950/5 p-2 rounded-2xl border border-slate-50/50 dark:border-slate-850/20 text-slate-300 dark:text-slate-600 text-xs font-bold text-right cursor-not-allowed select-none opacity-40">
                                  {dayNum}
                                </div>
                              );
                            }

                            // Current Month Days
                            for (let day = 1; day <= numberOfDays; day++) {
                              const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                              const dayDate = new Date(year, month, day);
                              const dayOfWeek = dayDate.getDay();
                              const isHoliday = !!HOLIDAYS_2026[dateStr];
                              
                              // Check for events
                              const expiredEmployees = employeesList.filter(emp => emp.periodePkwtAkhir === dateStr && emp.role !== 'ADMIN' && emp.role !== 'KLIEN');
                              
                              // Check if active user contract
                              const targetEmpForHighlight = (role === 'ADMIN' || role === 'KLIEN') && selectedCalendarEmployee 
                                ? selectedCalendarEmployee 
                                : (role !== 'ADMIN' && role !== 'KLIEN' ? currentUser : null);

                              const isContractStart = targetEmpForHighlight?.periodePkwtAwal === dateStr;
                              const isContractEnd = targetEmpForHighlight?.periodePkwtAkhir === dateStr;
                              const isContractRange = targetEmpForHighlight?.periodePkwtAwal && targetEmpForHighlight?.periodePkwtAkhir && 
                                dateStr >= targetEmpForHighlight.periodePkwtAwal && dateStr <= targetEmpForHighlight.periodePkwtAkhir;
                              
                              let cellBg = "bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/80";
                              let borderStyle = "border-slate-100 dark:border-slate-850/80";
                              
                              if (targetEmpForHighlight) {
                                if (isContractEnd) {
                                  cellBg = "bg-rose-50/85 dark:bg-rose-955/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 animate-pulse-red-glow";
                                  borderStyle = "border-2 border-rose-500 shadow-md shadow-rose-500/20";
                                } else if (isContractStart) {
                                  cellBg = "bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30";
                                  borderStyle = "border-emerald-200 dark:border-emerald-900/60";
                                } else if (isContractRange) {
                                  cellBg = "bg-emerald-50/30 dark:bg-emerald-950/5 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/10";
                                  borderStyle = "border-emerald-100/50 dark:border-emerald-950/30";
                                }
                              } else {
                                // For admin: highlight if contracts expire on this day
                                if (expiredEmployees.length > 0) {
                                  cellBg = "bg-rose-50/40 dark:bg-rose-950/10 hover:bg-rose-50/80 dark:hover:bg-rose-950/20";
                                  borderStyle = "border-rose-200/60 dark:border-rose-900/40";
                                }
                              }

                              let dayNumberColor = "text-slate-800 dark:text-slate-100 font-extrabold text-xs md:text-sm";
                              if (dayOfWeek === 0 || isHoliday) {
                                dayNumberColor = "text-rose-600 font-black text-sm md:text-base";
                              } else if (dayOfWeek === 6) {
                                dayNumberColor = "text-emerald-500 font-black text-sm md:text-base";
                              }
                              
                              cells.push(
                                <div 
                                  key={`current-${day}`} 
                                  className={`min-h-[90px] p-2 rounded-2xl border ${borderStyle} ${cellBg} transition flex flex-col justify-between text-left`}
                                >
                                  <div className="flex justify-between items-start w-full">
                                    <div className="max-w-[70%]">
                                      {isHoliday && (
                                        <span className="inline-block text-[7.5px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-1 py-0.5 rounded leading-none truncate max-w-full" title={HOLIDAYS_2026[dateStr]}>
                                          🇮🇩 {HOLIDAYS_2026[dateStr].split(' ')[0]}
                                        </span>
                                      )}
                                    </div>
                                    <span className={dayNumberColor}>{day}</span>
                                  </div>
                                  
                                  <div className="space-y-1 mt-1 flex-1 flex flex-col justify-end">
                                    {role === 'ADMIN' || role === 'KLIEN' ? (
                                      selectedCalendarEmployee ? (
                                        <>
                                          {isContractStart && (
                                            <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 py-0.5 px-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/45 text-center font-bold">
                                              🟢 AWAL PKWT
                                            </span>
                                          )}
                                          {isContractEnd && (
                                            <span className="text-[8.5px] font-black text-white bg-rose-500 py-1 px-2 rounded-xl text-center font-extrabold shadow-sm animate-pulse select-none flex items-center justify-center gap-1 border-0">
                                              🛑 AKHIR PKWT
                                            </span>
                                          )}
                                          {isContractRange && !isContractStart && !isContractEnd && (
                                            <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center py-0.5 font-bold">
                                              Masa PKWT
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        expiredEmployees.map(emp => (
                                          <button
                                            key={emp.id}
                                            type="button"
                                            onClick={() => {
                                              setSelectedCalendarEmployee(emp);
                                              if (emp.periodePkwtAkhir) {
                                                const [year, month] = emp.periodePkwtAkhir.split('-');
                                                if (year && month) {
                                                  setCurrentCalendarDate(new Date(parseInt(year), parseInt(month) - 1, 1));
                                                }
                                              }
                                            }}
                                            className="w-full text-[8.5px] font-black text-rose-600 bg-rose-55/60 dark:bg-rose-950/30 dark:text-rose-400 py-0.5 px-1.5 rounded-lg border border-rose-100 dark:border-rose-900/45 text-left truncate cursor-pointer hover:scale-[1.02] transition-transform"
                                          >
                                            🛑 Kontrak: {emp.namaLengkap.split(' ')[0]}
                                          </button>
                                        ))
                                      )
                                    ) : (
                                      <>
                                        {isContractStart && (
                                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 py-0.5 px-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/45 text-center font-bold">
                                            🟢 AWAL PKWT
                                          </span>
                                        )}
                                         {isContractEnd && (
                                           <span className="text-[8.5px] font-black text-white bg-rose-500 py-1 px-2 rounded-xl text-center font-extrabold shadow-sm animate-pulse select-none flex items-center justify-center gap-1 border-0">
                                             🛑 AKHIR PKWT
                                           </span>
                                         )}
                                        {isContractRange && !isContractStart && !isContractEnd && (
                                          <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center py-0.5 font-bold">
                                            Masa PKWT
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            // Next Month Days (greyed out)
                            const totalDaysRendered = firstDayIndex + numberOfDays;
                            const suffixDays = 42 - totalDaysRendered;
                            for (let dayNum = 1; dayNum <= suffixDays; dayNum++) {
                              cells.push(
                                <div key={`next-${dayNum}`} className="min-h-[85px] bg-slate-50/30 dark:bg-slate-950/5 p-2 rounded-2xl border border-slate-50/50 dark:border-slate-850/20 text-slate-300 dark:text-slate-600 text-xs font-bold text-right cursor-not-allowed select-none opacity-40">
                                  {dayNum}
                                </div>
                              );
                            }

                            return cells;
                          })()}
                        </div>

                        {/* List of holidays for the current month */}
                        {(() => {
                          const currentMonthHolidays = Object.entries(HOLIDAYS_2026).filter(([date]) => {
                            const holidayDate = new Date(date);
                            return holidayDate.getMonth() === currentCalendarDate.getMonth() && 
                                   holidayDate.getFullYear() === currentCalendarDate.getFullYear();
                          });
                          
                          if (currentMonthHolidays.length === 0) return null;
                          
                          return (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-left">
                              <h4 className="text-[10px] font-black uppercase text-rose-500 dark:text-rose-400 tracking-wider mb-2">🇮🇩 Daftar Hari Libur Nasional Bulan Ini</h4>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {currentMonthHolidays.map(([date, name]) => (
                                  <li key={date} className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 bg-rose-50/55 dark:bg-rose-955/10 p-2 rounded-2xl border border-rose-100/40 dark:border-rose-900/30">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-sm shadow-rose-500/20"></span>
                                    <span><strong>Tgl {new Date(date).getDate()}:</strong> {name}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Sidebar Info/Checklist Column */}
                      <div className="space-y-6 flex flex-col h-full">
                        {/* Information Panel */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 transition-colors text-left">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                            <Sparkles className="w-4.5 h-4.5 text-emerald-500" /> Detail Informasi PKWT
                          </h3>
                          
                          {role === 'ADMIN' || role === 'KLIEN' ? (
                            selectedCalendarEmployee ? (
                              <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
                                <div className="p-3.5 bg-slate-50/50 dark:bg-slate-955/30 border border-slate-105 dark:border-slate-850 rounded-2xl flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-emerald-500/20 shrink-0 bg-slate-100 flex items-center justify-center">
                                    <img src={getProfileImage(selectedCalendarEmployee)} alt="Avatar" className="h-full w-full object-cover" />
                                  </div>
                                  <div className="truncate">
                                    <h4 className="font-extrabold text-slate-850 dark:text-white">{selectedCalendarEmployee.namaLengkap}</h4>
                                    <span className="block text-[9px] text-slate-400 mt-0.5">NIK: {selectedCalendarEmployee.nikKaryawan}</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Jabatan:</span>
                                    <strong className="text-slate-800 dark:text-slate-200">{selectedCalendarEmployee.jabatan || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Klien Penempatan:</span>
                                    <strong className="text-indigo-500">{selectedCalendarEmployee.clientAssigned || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Awal PKWT:</span>
                                    <strong className="text-slate-800 dark:text-slate-200">{selectedCalendarEmployee.periodePkwtAwal || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Akhir PKWT:</span>
                                    <strong className="text-rose-500">{selectedCalendarEmployee.periodePkwtAkhir || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Sisa Kontrak:</span>
                                    {(() => {
                                      if (!selectedCalendarEmployee.periodePkwtAkhir) return <span>-</span>;
                                      const diffTime = new Date(selectedCalendarEmployee.periodePkwtAkhir).getTime() - new Date().getTime();
                                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                      return (
                                        <strong className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                                          diffDays <= 30 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                        }`}>
                                          {diffDays > 0 ? `${diffDays} Hari` : 'Kontrak Habis'}
                                        </strong>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-slate-455 dark:text-slate-500 italic text-[11px]">
                                💡 Klik salah satu penanda kontrak berakhir (badge berwarna merah) di kalender untuk menampilkan detail karyawan di sini.
                              </div>
                            )
                          ) : (
                            currentUser && (
                              <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
                                <div className="space-y-2">
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Nomor PKWT:</span>
                                    <strong className="text-slate-800 dark:text-slate-200">{currentUser.nomorPkwt || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Klien Penempatan:</span>
                                    <strong className="text-indigo-500">{currentUser.clientAssigned || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Awal PKWT:</span>
                                    <strong className="text-slate-800 dark:text-slate-200">{currentUser.periodePkwtAwal || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-1.5">
                                    <span className="text-slate-400">Akhir PKWT:</span>
                                    <strong className="text-rose-500">{currentUser.periodePkwtAkhir || '-'}</strong>
                                  </div>
                                  <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Sisa Kontrak Kerja:</span>
                                    {(() => {
                                      if (!currentUser.periodePkwtAkhir) return <span>-</span>;
                                      const diffTime = new Date(currentUser.periodePkwtAkhir).getTime() - new Date().getTime();
                                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                      return (
                                        <strong className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                                          diffDays <= 30 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                        }`}>
                                          {diffDays > 0 ? `${diffDays} Hari` : 'Kontrak Habis'}
                                        </strong>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        {/* Quick alert list for admin / clients */}
                        {(role === 'ADMIN' || role === 'KLIEN') && (
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 transition-colors text-left">
                            <h3 className="text-sm font-bold text-slate-855 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
                              <Clock className="w-4.5 h-4.5 text-rose-500" /> Kontrak Segera Habis (30 Hari)
                            </h3>
                            <div className="space-y-3.5 max-h-60 overflow-y-auto">
                              {(() => {
                                const activeStaff = employeesList.filter(emp => emp.role !== 'ADMIN' && emp.role !== 'KLIEN' && emp.periodePkwtAkhir);
                                let soonExpired = activeStaff.filter(emp => {
                                  if (!emp.periodePkwtAkhir) return false;
                                  const diffTime = new Date(emp.periodePkwtAkhir).getTime() - new Date().getTime();
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  return diffDays > 0 && diffDays <= 30;
                                });
                                
                                if (role === 'KLIEN') {
                                  soonExpired = soonExpired.filter(emp => emp.clientAssigned === currentUser?.clientAssigned);
                                }
                                
                                if (soonExpired.length === 0) {
                                  return (
                                    <div className="text-center py-6 text-slate-455 dark:text-slate-500 italic text-[11px]">
                                      Tidak ada kontrak karyawan yang berakhir dalam 30 hari ke depan.
                                    </div>
                                  );
                                }
                                
                                return soonExpired.map(emp => {
                                  const diffDays = Math.ceil((new Date(emp.periodePkwtAkhir!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                  return (
                                    <div 
                                      key={emp.id}
                                      onClick={() => {
                                        setSelectedCalendarEmployee(emp);
                                        if (emp.periodePkwtAkhir) {
                                          const [year, month] = emp.periodePkwtAkhir.split('-');
                                          if (year && month) {
                                            setCurrentCalendarDate(new Date(parseInt(year), parseInt(month) - 1, 1));
                                          }
                                        }
                                        setPkwtViewMode('calendar');
                                      }}
                                      className="p-3 bg-rose-50/50 dark:bg-rose-955/10 border border-rose-100/50 dark:border-rose-900/30 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-rose-100/40 dark:hover:bg-rose-950/20 transition"
                                    >
                                      <div className="truncate pr-2 text-left">
                                        <strong className="block text-xs text-slate-800 dark:text-slate-200 truncate">{emp.namaLengkap}</strong>
                                        <span className="block text-[9px] text-slate-400 mt-0.5">{emp.jabatan}</span>
                                      </div>
                                      <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl shrink-0 dark:bg-rose-900/30 dark:text-rose-400 uppercase">
                                        {diffDays} HARI
                                      </span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Cartoon Mascot */}
                        <div className="flex-1 flex items-end justify-center pt-4 select-none pointer-events-none w-full">
                          {(() => {
                            const characterImages: { [key: string]: string } = { char1, char2, char3, char4, char5, char6, char7, char8, char9, char10 };
                            const fallbackSrc = characterImages[selectedCharacter] || char1;
                            return (
                              <img 
                                src={transparentCartoon || fallbackSrc} 
                                alt="BSS Mascot" 
                                className="w-full max-w-[350px] h-auto object-contain transform hover:scale-[1.05] transition-all duration-300 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
                                style={{ maxHeight: '420px' }}
                              />
                            );
                          })()}
                        </div>
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
                    <input type="number" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 outline-none" value={formData.upah || ''} onChange={(e) => setFormData({ ...formData, upah: Number(e.target.value) || 0 })} />
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

      {/* --- POPUP MODAL: CETAK / DETAIIL SLIP GAJI (PRINT READY) --- */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print-container">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative text-left animate-scale-up print-raw">
            
            {/* Close & Print Buttons */}
            <div className="absolute top-5 right-5 flex items-center gap-2 no-print">
              <button 
                onClick={() => window.print()} 
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Cetak Slip Gaji
              </button>
              <button 
                onClick={() => setSelectedPayslip(null)} 
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Paper Sheet */}
            <div className="space-y-6">
              {/* Slip Header */}
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-5">
                <div className="flex items-center gap-3">
                  <img src={customLogo} alt="BSS Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-sm md:text-base font-extrabold text-slate-850 dark:text-white leading-none">PT. BSS OUTSOURCING INDONESIA</h2>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Staffing & Outsourcing Services</span>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white">SLIP GAJI RESMI</h3>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mt-1">
                    PERIODE: {new Date(2026, Number(selectedPayslip.periodMonth)-1, 1).toLocaleString('id-ID', { month: 'long' })} {selectedPayslip.periodYear}
                  </span>
                </div>
              </div>

              {/* Employee & Bank Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 text-slate-700 dark:text-slate-350">
                  <p><strong>Nama Karyawan:</strong> {selectedPayslip.employeeName}</p>
                  <p><strong>NIK Staff:</strong> {selectedPayslip.employeeNik}</p>
                  <p><strong>Jabatan / Role:</strong> {selectedPayslip.jabatan}</p>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-350 text-right">
                  <p><strong>Penempatan Mitra:</strong> {selectedPayslip.penempatan || 'Kantor Pusat'}</p>
                  <p><strong>Metode Pembayaran:</strong> {selectedPayslip.rekening}</p>
                  <p><strong>Tanggal Rilis:</strong> {new Date(selectedPayslip.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Attendance count details */}
              <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ringkasan Absensi Bulan Ini:</span>
                <div className="flex gap-4 font-semibold text-slate-755 dark:text-slate-300 text-[11px]">
                  <span>Hadir: <strong className="text-emerald-500">{selectedPayslip.attendanceHadir}</strong> Hari</span>
                  <span>Sakit: <strong className="text-blue-500">{selectedPayslip.attendanceSakit}</strong> Hari</span>
                  <span>Izin: <strong className="text-amber-500">{selectedPayslip.attendanceIzin}</strong> Hari</span>
                  <span>Alpa: <strong className="text-rose-500">{selectedPayslip.attendanceAlpa}</strong> Hari</span>
                </div>
              </div>

              {/* Detailed Calculations Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Penerimaan */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-1 flex justify-between uppercase text-[10px] tracking-wider">
                    <span>Penerimaan (Earnings)</span>
                    <span>Jumlah (Rp)</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-750 dark:text-slate-355">
                    <li className="flex justify-between">
                      <span>Upah Pokok</span>
                      <span>{selectedPayslip.gajiPokok.toLocaleString('id-ID')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tunjangan Jabatan</span>
                      <span>{selectedPayslip.tunjanganJabatan.toLocaleString('id-ID')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tunjangan Makan & Trans.</span>
                      <span>{selectedPayslip.tunjanganMakanTransport.toLocaleString('id-ID')}</span>
                    </li>
                    {selectedPayslip.tunjanganLainnya > 0 && (
                      <li className="flex justify-between">
                        <span>Tunjangan Lainnya</span>
                        <span>{selectedPayslip.tunjanganLainnya.toLocaleString('id-ID')}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Potongan */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-1 flex justify-between uppercase text-[10px] tracking-wider">
                    <span>Potongan (Deductions)</span>
                    <span>Jumlah (Rp)</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-755 dark:text-slate-355">
                    <li className="flex justify-between">
                      <span>Potongan BPJS Kesehatan (1%)</span>
                      <span>{selectedPayslip.potonganBpjsKesehatan.toLocaleString('id-ID')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Potongan BPJS Ketenagakerjaan (2%)</span>
                      <span>{selectedPayslip.potonganBpjsKetenagakerjaan.toLocaleString('id-ID')}</span>
                    </li>
                    {selectedPayslip.potonganPPh21 > 0 && (
                      <li className="flex justify-between">
                        <span>Pajak Penghasilan (PPh21)</span>
                        <span>{selectedPayslip.potonganPPh21.toLocaleString('id-ID')}</span>
                      </li>
                    )}
                    {selectedPayslip.potonganAbsensi > 0 && (
                      <li className="flex justify-between text-rose-500 font-semibold">
                        <span>Potongan Alpa ({selectedPayslip.attendanceAlpa} hari)</span>
                        <span>{selectedPayslip.potonganAbsensi.toLocaleString('id-ID')}</span>
                      </li>
                    )}
                    {selectedPayslip.potonganLainnya > 0 && (
                      <li className="flex justify-between">
                        <span>Potongan Lain-lain</span>
                        <span>{selectedPayslip.potonganLainnya.toLocaleString('id-ID')}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Total calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="space-y-1 py-2 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between font-semibold">
                    <span>Total Penerimaan Kotor:</span>
                    <span>Rp {selectedPayslip.totalPenerimaan.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Potongan:</span>
                    <span>Rp {selectedPayslip.totalPotongan.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-extrabold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">TAKE HOME PAY:</span>
                  <strong className="text-lg font-black text-emerald-500 dark:text-emerald-400">Rp {selectedPayslip.takeHomePay.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              {/* Notes */}
              {selectedPayslip.note && (
                <div className="text-[10px] text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <strong>Catatan:</strong> {selectedPayslip.note}
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-10 text-center text-xs">
                <div>
                  <p className="font-semibold text-slate-500">Penerima Staff Karyawan,</p>
                  <div className="h-14"></div>
                  <p className="font-extrabold text-slate-800 dark:text-white underline">{selectedPayslip.employeeName}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-500">Mengetahui, HRD PT. BSS,</p>
                  <div className="h-14"></div>
                  <p className="font-extrabold text-slate-800 dark:text-white underline">Administrator Utama</p>
                </div>
              </div>

              {/* Print Footer */}
              <div className="text-center text-[9px] text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-850 italic">
                * Slip gaji ini adalah dokumen digital yang dihasilkan secara sah oleh PT. BSS Outsourcing Indonesia.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification for Invoice Sending */}
      {sendingStatus.step && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 border border-slate-800 animate-fade-in min-w-[320px]">
          {sendingStatus.step === 'sending' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent shrink-0"></div>
              <div className="text-xs text-left">
                <p className="font-extrabold text-white">Mengirim Slip Gaji...</p>
                <p className="text-slate-400 mt-0.5">Sedang mengirim {sendingStatus.count} slip via {sendingStatus.type === 'email' ? 'Email' : 'WhatsApp'}...</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0">✓</div>
              <div className="text-xs text-left">
                <p className="font-extrabold text-emerald-400">Pengiriman Sukses!</p>
                <p className="text-slate-300 mt-0.5">{sendingStatus.count} slip gaji berhasil terkirim via {sendingStatus.type === 'email' ? 'Email Staff' : 'WhatsApp Staff'}!</p>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
