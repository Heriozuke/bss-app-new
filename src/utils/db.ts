export interface Employee {
  id: string;
  email: string;
  password?: string;
  nikKtp?: string;
  namaLengkap: string;
  nikKaryawan?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  pendidikan?: string;
  namaIbuKandung?: string;
  alamat?: string;
  gender?: 'LAKI_LAKI' | 'PEREMPUAN';
  jabatan?: string;
  role: 'ADMIN' | 'KARYAWAN_INTERNAL' | 'KARYAWAN_OUTSOURCING' | 'KARYAWAN_MAGANG' | 'KLIEN';
  
  // Kontrak / PKWT
  periodePkwtAwal?: string;
  periodePkwtAkhir?: string;
  pencatatanPkwt?: string;
  nomorPkwt?: string;
  upah?: number;
  
  // Bank & Asuransi
  rekeningMandiri?: string;
  noBpjsKesehatan?: string;
  noBpjsKetenagakerjaan?: string;
  npwp?: string;
  
  statusKaryawan?: string;
  note?: string;
  noTlp?: string;
  noDarurat?: string;
  
  // Uniform
  ukuranBaju?: string;
  ukuranCelana?: string;
  ukuranSepatu?: string;
  
  typeOust?: string;
  batch?: string;
  cuti?: string;
  clientAssigned?: string;
}

export interface Attendance {
  id: string;
  userId: string;
  nama: string;
  role: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // ISO Timestamp
  checkOut: string | null; // ISO Timestamp
  photoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA';
}

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    email: "sholeh@bss.co.id",
    password: "password123",
    nikKtp: "3275012345678901",
    namaLengkap: "Muhamad Sholeh",
    nikKaryawan: "KI250509001",
    tempatLahir: "Bekasi",
    tanggalLahir: "1995-05-12",
    pendidikan: "S1 Teknik Informatika",
    namaIbuKandung: "Siti Aminah",
    alamat: "Jl. Merdeka No. 12, Bekasi",
    gender: "LAKI_LAKI",
    jabatan: "IT Support Specialist",
    role: "KARYAWAN_INTERNAL",
    periodePkwtAwal: "2025-05-09",
    periodePkwtAkhir: "2027-05-09",
    pencatatanPkwt: "Disnaker Bekasi",
    nomorPkwt: "PKWT/INTERNAL/2025/001",
    upah: 7500000,
    rekeningMandiri: "1240009876543",
    noBpjsKesehatan: "0001234567890",
    noBpjsKetenagakerjaan: "19087654321",
    npwp: "71.234.567.8-023.000",
    statusKaryawan: "BELUM_KAWIN",
    note: "Karyawan teladan di tim IT",
    noTlp: "081234567890",
    noDarurat: "081298765432",
    ukuranBaju: "L",
    ukuranCelana: "32",
    ukuranSepatu: "42",
    typeOust: "Internal",
    batch: "Batch 5",
    cuti: "12",
    clientAssigned: "PT. BSS Head Office"
  },
  {
    id: "emp-2",
    email: "desi@bss.co.id",
    password: "password123",
    nikKtp: "3275023456789012",
    namaLengkap: "Desi Putri Sinaga",
    nikKaryawan: "KO250509002",
    tempatLahir: "Medan",
    tanggalLahir: "1997-09-20",
    pendidikan: "D3 Administrasi",
    namaIbuKandung: "Maria Ginting",
    alamat: "Ruko Sentra Niaga Blok B-5, Cikarang",
    gender: "PEREMPUAN",
    jabatan: "Admin Gudang",
    role: "KARYAWAN_OUTSOURCING",
    periodePkwtAwal: "2025-05-09",
    periodePkwtAkhir: "2026-05-09",
    pencatatanPkwt: "Disnaker Kabupaten Bekasi",
    nomorPkwt: "PKWT/OUTS/PERTAMINA/2025/112",
    upah: 5200000,
    rekeningMandiri: "1240007654321",
    noBpjsKesehatan: "0002345678901",
    noBpjsKetenagakerjaan: "19087654322",
    npwp: "71.345.678.9-024.000",
    statusKaryawan: "KAWIN",
    note: "Ditugaskan di Pertamina Cikarang Depot",
    noTlp: "082345678901",
    noDarurat: "082398765433",
    ukuranBaju: "M",
    ukuranCelana: "30",
    ukuranSepatu: "38",
    typeOust: "Outsourcing",
    batch: "Batch 3",
    cuti: "10",
    clientAssigned: "PT. Pertamina"
  },
  {
    id: "emp-3",
    email: "hilmy@bss.co.id",
    password: "password123",
    nikKtp: "3275034567890123",
    namaLengkap: "Hilmy Nur Fallah",
    nikKaryawan: "KM250509005",
    tempatLahir: "Bandung",
    tanggalLahir: "2003-02-15",
    pendidikan: "SMK Teknik Mesin",
    namaIbuKandung: "Euis Dahlia",
    alamat: "Kos Green Camp, Karawang",
    gender: "LAKI_LAKI",
    jabatan: "Operator Magang",
    role: "KARYAWAN_MAGANG",
    periodePkwtAwal: "2025-05-09",
    periodePkwtAkhir: "2025-11-09",
    pencatatanPkwt: "N/A",
    nomorPkwt: "INTERN/BSS/Astra/2025/09",
    upah: 3500000,
    rekeningMandiri: "1240008765432",
    noBpjsKesehatan: "0003456789012",
    noBpjsKetenagakerjaan: "19087654323",
    npwp: "N/A",
    statusKaryawan: "BELUM_KAWIN",
    note: "Magang di PT. Astra Honda Motor",
    noTlp: "083456789012",
    noDarurat: "083498765434",
    ukuranBaju: "XL",
    ukuranCelana: "34",
    ukuranSepatu: "43",
    typeOust: "Magang",
    batch: "Batch 8",
    cuti: "0",
    clientAssigned: "PT. Astra Honda Motor"
  },
  {
    id: "emp-4",
    email: "iwan@bss.co.id",
    password: "password123",
    nikKtp: "3275045678901234",
    namaLengkap: "Iwan Tri Septiyanto",
    nikKaryawan: "KO250509007",
    tempatLahir: "Solo",
    tanggalLahir: "1994-09-03",
    pendidikan: "SMA IPS",
    namaIbuKandung: "Tri Wahyuni",
    alamat: "Perum Graha Indah Blok A-1, Karawang",
    gender: "LAKI_LAKI",
    jabatan: "Security Guard",
    role: "KARYAWAN_OUTSOURCING",
    periodePkwtAwal: "2025-05-09",
    periodePkwtAkhir: "2026-05-09",
    pencatatanPkwt: "Disnaker Karawang",
    nomorPkwt: "PKWT/OUTS/TOYOTA/2025/089",
    upah: 5100000,
    rekeningMandiri: "1240006543210",
    noBpjsKesehatan: "0004567890123",
    noBpjsKetenagakerjaan: "19087654324",
    npwp: "71.456.789.0-025.000",
    statusKaryawan: "KAWIN",
    note: "Ditugaskan di PT. Toyota Motor Manufacturing",
    noTlp: "084567890123",
    noDarurat: "084598765435",
    ukuranBaju: "L",
    ukuranCelana: "33",
    ukuranSepatu: "41",
    typeOust: "Outsourcing",
    batch: "Batch 4",
    cuti: "8",
    clientAssigned: "PT. Toyota Motor Manufacturing"
  },
  {
    id: "admin-1",
    email: "admin@bss.co.id",
    password: "password123",
    namaLengkap: "Administrator Utama",
    nikKaryawan: "AD250509000",
    gender: "LAKI_LAKI",
    jabatan: "HR Director",
    role: "ADMIN",
    clientAssigned: "PT. BSS Head Office"
  },
  {
    id: "klien-pertamina",
    email: "hr.pertamina@pertamina.com",
    password: "password123",
    namaLengkap: "Budi Santoso (Pertamina HR)",
    nikKaryawan: "KL250509009",
    gender: "LAKI_LAKI",
    jabatan: "Representative Client",
    role: "KLIEN",
    clientAssigned: "PT. Pertamina"
  },
  {
    id: "klien-toyota",
    email: "hr.toyota@toyota.co.id",
    password: "password123",
    namaLengkap: "Takahiro Sato (Toyota HR)",
    nikKaryawan: "KL250509010",
    gender: "LAKI_LAKI",
    jabatan: "Representative Client",
    role: "KLIEN",
    clientAssigned: "PT. Toyota Motor Manufacturing"
  }
];

const DEFAULT_ATTENDANCES: Attendance[] = [
  {
    id: "att-1",
    userId: "emp-1",
    nama: "Muhamad Sholeh",
    role: "KARYAWAN_INTERNAL",
    date: "2026-07-07",
    checkIn: "2026-07-07T07:45:00.000Z",
    checkOut: "2026-07-07T17:05:00.000Z",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    latitude: -6.2297,
    longitude: 106.8296,
    locationName: "BSS Head Office Bekasi",
    status: "HADIR"
  },
  {
    id: "att-2",
    userId: "emp-2",
    nama: "Desi Putri Sinaga",
    role: "KARYAWAN_OUTSOURCING",
    date: "2026-07-07",
    checkIn: "2026-07-07T07:55:00.000Z",
    checkOut: "2026-07-07T17:00:00.000Z",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    latitude: -6.2982,
    longitude: 107.1384,
    locationName: "PT. Pertamina Cikarang Depot",
    status: "HADIR"
  },
  {
    id: "att-3",
    userId: "emp-3",
    nama: "Hilmy Nur Fallah",
    role: "KARYAWAN_MAGANG",
    date: "2026-07-07",
    checkIn: "2026-07-07T08:15:00.000Z",
    checkOut: "2026-07-07T17:02:00.000Z",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    latitude: -6.3792,
    longitude: 107.2891,
    locationName: "PT. Astra Honda Motor Karawang",
    status: "HADIR"
  },
  {
    id: "att-4",
    userId: "emp-4",
    nama: "Iwan Tri Septiyanto",
    role: "KARYAWAN_OUTSOURCING",
    date: "2026-07-07",
    checkIn: "2026-07-07T07:30:00.000Z",
    checkOut: "2026-07-07T16:45:00.000Z",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    latitude: -6.3683,
    longitude: 107.3129,
    locationName: "PT. Toyota Motor Karawang KIIC",
    status: "HADIR"
  }
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function initDb(): void {
  if (!isBrowser()) return;

  if (!localStorage.getItem("bss_employees")) {
    localStorage.setItem("bss_employees", JSON.stringify(DEFAULT_EMPLOYEES));
  }
  if (!localStorage.getItem("bss_attendances")) {
    localStorage.setItem("bss_attendances", JSON.stringify(DEFAULT_ATTENDANCES));
  }
}

// Auto-run init
if (isBrowser()) {
  initDb();
}

export function getEmployees(): Employee[] {
  if (!isBrowser()) return DEFAULT_EMPLOYEES;
  initDb();
  return JSON.parse(localStorage.getItem("bss_employees") || "[]");
}

export function saveEmployee(emp: Employee): Employee {
  if (!isBrowser()) return emp;
  const list = getEmployees();
  let updated: Employee[];
  
  if (emp.id) {
    updated = list.map(item => item.id === emp.id ? { ...item, ...emp } : item);
  } else {
    const newEmp: Employee = { 
      ...emp, 
      id: "emp-" + Date.now(), 
      nikKaryawan: emp.nikKaryawan || generateNik(emp.role) 
    };
    list.push(newEmp);
    updated = list;
  }
  
  localStorage.setItem("bss_employees", JSON.stringify(updated));
  return emp;
}

export function deleteEmployee(id: string): void {
  if (!isBrowser()) return;
  const list = getEmployees();
  const filtered = list.filter(item => item.id !== id);
  localStorage.setItem("bss_employees", JSON.stringify(filtered));
}

function generateNik(role: string): string {
  const prefixMap: { [key: string]: string } = {
    'ADMIN': 'AD',
    'KARYAWAN_INTERNAL': 'KI',
    'KARYAWAN_OUTSOURCING': 'KO',
    'KARYAWAN_MAGANG': 'KM',
    'KLIEN': 'KL'
  };
  const prefix = prefixMap[role] || 'KO';
  const year = new Date().getFullYear().toString().substring(2);
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${year}${randNum}`;
}

export function getAttendances(): Attendance[] {
  if (!isBrowser()) return DEFAULT_ATTENDANCES;
  initDb();
  return JSON.parse(localStorage.getItem("bss_attendances") || "[]");
}

export function saveAttendance(att: Attendance): Attendance {
  if (!isBrowser()) return att;
  const list = getAttendances();
  let existingIndex = list.findIndex(item => item.userId === att.userId && item.date === att.date);
  
  if (existingIndex !== -1) {
    list[existingIndex] = { ...list[existingIndex], ...att };
  } else {
    list.unshift({ ...att, id: "att-" + Date.now() });
  }
  
  localStorage.setItem("bss_attendances", JSON.stringify(list));
  return att;
}

export function changePassword(userId: string, newPassword: string): void {
  if (!isBrowser()) return;
  const list = getEmployees();
  const updated = list.map(item => item.id === userId ? { ...item, password: newPassword } : item);
  localStorage.setItem("bss_employees", JSON.stringify(updated));
}
