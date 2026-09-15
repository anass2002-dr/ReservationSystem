import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SupportedLanguage = 'en' | 'tr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<SupportedLanguage>(this.getInitialLanguage());
  public currentLang$: Observable<SupportedLanguage> = this.currentLangSubject.asObservable();

  public readonly languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ];

  private translations: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      // Navigation & Sidebar
      'Dashboard': 'Dashboard',
      'Operational Dashboard': 'Operational Dashboard',
      'Core': 'Core',
      'Reservations': 'Reservations',
      'Customers': 'Customers',
      'Agencies': 'Agencies',
      'Payments': 'Payments',
      'Exchange Rates': 'Exchange Rates',
      'Setup': 'Setup',
      'Configuration': 'Configuration',
      'Pilots': 'Pilots',
      'Flight Packages': 'Flight Packages',
      'Extra Services': 'Extra Services',
      'Transport Groups': 'Transport Groups',
      'Flight Times': 'Flight Times',
      'System User Manual': 'System User Manual',
      'User Manual': 'User Manual',
      'Admin': 'Admin',
      'Help': 'Help',
      'My Profile': 'My Profile',
      'Manage Users': 'Manage Users',
      'Sign Out': 'Sign Out',
      'Update Rate': 'Update Rate',
      'Amount': 'Amount',

      // Dashboard
      'Total Reservations': 'Total Reservations',
      'Today\'s Flights': 'Today\'s Flights',
      'Total Revenue': 'Total Revenue',
      'Active Customers': 'Active Customers',
      'Today\'s Flight Schedule': 'Today\'s Flight Schedule',
      'Quick Actions': 'Quick Actions',
      'New Reservation': 'New Reservation',
      'Process Payment': 'Process Payment',
      'Check Exchange Rates': 'Check Exchange Rates',
      'System Overview': 'System Overview',
      'View All': 'View All',
      'Passengers': 'Passengers',
      'Passenger': 'Passenger',
      'Reservation': 'Reservation',
      'No flights scheduled for today.': 'No flights scheduled for today.',
      'Get started by adding a new reservation!': 'Get started by adding a new reservation!',

      // Common Actions & Breadcrumbs
      'Home': 'Home',
      'Entities': 'Entities',
      'Logistics & Packages': 'Logistics & Packages',
      'Settings': 'Settings',
      'Add': 'Add',
      'Create': 'Create',
      'Edit': 'Edit',
      'Delete': 'Delete',
      'Save': 'Save',
      'Save Changes': 'Save Changes',
      'Cancel': 'Cancel',
      'Close': 'Close',
      'Search': 'Search',
      'Filter': 'Filter',
      'Clear': 'Clear',
      'Actions': 'Actions',
      'Status': 'Status',
      'Active': 'Active',
      'Inactive': 'Inactive',
      'Pending': 'Pending',
      'Confirmed': 'Confirmed',
      'Cancelled': 'Cancelled',
      'Total': 'Total',
      'Price': 'Price',
      'Date': 'Date',
      'Time': 'Time',
      'Slot': 'Slot',
      'Notes': 'Notes',
      'Note': 'Note',
      'Export Excel': 'Export Excel',
      'Print': 'Print',
      'Welcome Back': 'Welcome Back',
      'Sign In': 'Sign In',
      'Username': 'Username',
      'Password': 'Password',

      // Customers
      'Customers Management': 'Customers Management',
      'Total Customers': 'Total Customers',
      'Nationalities': 'Nationalities',
      'With Contact Info': 'With Contact Info',
      'Customer': 'Customer',
      'Full Name': 'Full Name',
      'Date of Birth': 'Date of Birth',
      'Date of Birth & Age': 'Date of Birth & Age',
      'Phone Number': 'Phone Number',
      'Email Address': 'Email Address',
      'Email': 'Email',
      'Country': 'Country',
      'Country / Nationality': 'Country / Nationality',
      'Add Customer': 'Add Customer',
      'Add New Customer': 'Add New Customer',
      'Edit Customer': 'Edit Customer',
      'No customers found': 'No customers found',
      'Add Your First Customer': 'Add Your First Customer',

      // Pilots
      'Pilots Management': 'Pilots Management',
      'Total Pilots': 'Total Pilots',
      'Pilot Groups': 'Pilot Groups',
      'Total Flights Flown': 'Total Flights Flown',
      'Pilots Directory': 'Pilots Directory',
      'Flight Roster': 'Flight Roster',
      'Manage Groups': 'Manage Groups',
      'Add Pilot': 'Add Pilot',
      'Edit Pilot': 'Edit Pilot',
      'License Number': 'License Number',
      'Pilot Group': 'Pilot Group',
      'Flights Assigned': 'Flights Assigned',
      'Flights Flown': 'Flights Flown',
      'Did Not Come': 'Did Not Come',
      'No-Show': 'No-Show',

      // Agencies
      'Agencies Management': 'Agencies Management',
      'Add New Agency': 'Add New Agency',
      'Agency Name': 'Agency Name',
      'Contact Person': 'Contact Person',
      'Office Address': 'Office Address',
      'No agencies found': 'No agencies found',

      // Extra Services
      'Extra Services Management': 'Extra Services Management',
      'Total Services': 'Total Services',
      'Average Price': 'Average Price',
      'Photo & Video Add-ons': 'Photo & Video Add-ons',
      'Add Extra Service': 'Add Extra Service',
      'Add New Extra Service': 'Add New Extra Service',
      'Edit Extra Service': 'Edit Extra Service',
      'Service Name': 'Service Name',
      'Retail Price': 'Retail Price',
      'No extra services found': 'No extra services found',

      // Transport Groups
      'Transport Groups Management': 'Transport Groups Management',
      'Total Shuttles': 'Total Shuttles',
      'Active Fleet Vehicles': 'Active Fleet Vehicles',
      'Designated Drivers': 'Designated Drivers',
      'Add Transport Group': 'Add Transport Group',
      'New Transport Group': 'New Transport Group',
      'Edit Transport Group': 'Edit Transport Group',
      'Departure Date & Time': 'Departure Date & Time',
      'Departure Time': 'Departure Time',
      'Vehicle Plate Number': 'Vehicle Plate Number',
      'Vehicle Plate': 'Vehicle Plate',
      'Driver Full Name': 'Driver Full Name',
      'Driver Name': 'Driver Name',
      'Assigned Driver': 'Assigned Driver',
      'Mountain Transfer': 'Mountain Transfer',
      'Shuttle Departure': 'Shuttle Departure',
      'No transport groups found': 'No transport groups found',
      'Schedule First Mountain Shuttle': 'Schedule First Mountain Shuttle',

      // Flight Packages & Times
      'Add New Package': 'Add New Package',
      'Package Title': 'Package Title',
      'Package Description': 'Package Description',
      'Flight Time Slots': 'Flight Time Slots',
      'Add Time Slot': 'Add Time Slot',

      // Payments
      'Payment Hub': 'Payment Hub',
      'Collect Payments': 'Collect Payments',
      'Payment Records': 'Payment Records',
      'Daily Revenue Ledger': 'Daily Revenue Ledger',
      'Paid in Full': 'Paid in Full',
      'Pending Balance': 'Pending Balance',
      'Rest to Pay': 'Rest to Pay',
      'Cash': 'Cash',
      'Credit Card': 'Credit Card',
      'Bank Transfer': 'Bank Transfer',
      'Refund': 'Refund',
      'Receipt': 'Receipt',

      // Reservations
      'Schedule Matrix': 'Schedule Matrix',
      'List View': 'List View',
      'Add Passenger': 'Add Passenger',
      'Pickup Hotel': 'Pickup Hotel',
      'Room Number': 'Room Number',
      'Passenger Weight': 'Passenger Weight',
      'Assigned Pilot': 'Assigned Pilot',
      'Takeoff Time': 'Takeoff Time',
      'Booking Source': 'Booking Source',
      'Direct Booking': 'Direct Booking'
    },
    tr: {
      // Navigation & Sidebar
      'Dashboard': 'Kontrol Paneli',
      'Operational Dashboard': 'Operasyonel Kontrol Paneli',
      'Core': 'Temel İşlemler',
      'Reservations': 'Rezervasyonlar',
      'Customers': 'Müşteriler',
      'Agencies': 'Acenteler',
      'Payments': 'Ödemeler',
      'Exchange Rates': 'Döviz Kurları',
      'Setup': 'Kurulum',
      'Configuration': 'Yapılandırma',
      'Pilots': 'Pilotlar',
      'Flight Packages': 'Uçuş Paketleri',
      'Extra Services': 'Ek Hizmetler',
      'Transport Groups': 'Transfer Grupları',
      'Flight Times': 'Uçuş Saatleri',
      'System User Manual': 'Kullanım Kılavuzu',
      'User Manual': 'Kullanım Kılavuzu',
      'Admin': 'Yönetici',
      'Help': 'Yardım',
      'My Profile': 'Profilim',
      'Manage Users': 'Kullanıcıları Yönet',
      'Sign Out': 'Çıkış Yap',
      'Update Rate': 'Kurları Güncelle',
      'Amount': 'Tutar',

      // Dashboard
      'Total Reservations': 'Toplam Rezervasyon',
      'Today\'s Flights': 'Günün Uçuşları',
      'Total Revenue': 'Toplam Gelir',
      'Active Customers': 'Aktif Müşteriler',
      'Today\'s Flight Schedule': 'Günün Uçuş Programı',
      'Quick Actions': 'Hızlı İşlemler',
      'New Reservation': 'Yeni Rezervasyon',
      'Process Payment': 'Ödeme Al / İşle',
      'Check Exchange Rates': 'Döviz Kurlarını İncele',
      'System Overview': 'Sistem Özeti',
      'View All': 'Tümünü Gör',
      'Passengers': 'Yolcular',
      'Passenger': 'Yolcu',
      'Reservation': 'Rezervasyon',
      'No flights scheduled for today.': 'Bugün için planlanmış uçuş bulunmuyor.',
      'Get started by adding a new reservation!': 'Yeni bir rezervasyon ekleyerek başlayın!',

      // Common Actions & Breadcrumbs
      'Home': 'Ana Sayfa',
      'Entities': 'Kayıtlar',
      'Logistics & Packages': 'Lojistik ve Paketler',
      'Settings': 'Ayarlar',
      'Add': 'Ekle',
      'Create': 'Oluştur',
      'Edit': 'Düzenle',
      'Delete': 'Sil',
      'Save': 'Kaydet',
      'Save Changes': 'Değişiklikleri Kaydet',
      'Cancel': 'İptal',
      'Close': 'Kapat',
      'Search': 'Ara',
      'Filter': 'Filtrele',
      'Clear': 'Temizle',
      'Actions': 'İşlemler',
      'Status': 'Durum',
      'Active': 'Aktif',
      'Inactive': 'Pasif',
      'Pending': 'Beklemede',
      'Confirmed': 'Onaylandı',
      'Cancelled': 'İptal Edildi',
      'Total': 'Toplam',
      'Price': 'Fiyat',
      'Date': 'Tarih',
      'Time': 'Saat',
      'Slot': 'Saat Dilimi',
      'Notes': 'Notlar',
      'Note': 'Not',
      'Export Excel': 'Excel\'e Aktar',
      'Print': 'Yazdır',
      'Welcome Back': 'Tekrar Hoş Geldiniz',
      'Sign In': 'Giriş Yap',
      'Username': 'Kullanıcı Adı',
      'Password': 'Şifre',

      // Customers
      'Customers Management': 'Müşteri Yönetimi',
      'Total Customers': 'Toplam Müşteri',
      'Nationalities': 'Uyruk Sayısı',
      'With Contact Info': 'İletişim Bilgili',
      'Customer': 'Müşteri',
      'Full Name': 'Ad Soyad',
      'Date of Birth': 'Doğum Tarihi',
      'Date of Birth & Age': 'Doğum Tarihi ve Yaş',
      'Phone Number': 'Telefon Numarası',
      'Email Address': 'E-posta Adresi',
      'Email': 'E-posta',
      'Country': 'Ülke',
      'Country / Nationality': 'Ülke / Uyruk',
      'Add Customer': 'Müşteri Ekle',
      'Add New Customer': 'Yeni Müşteri Ekle',
      'Edit Customer': 'Müşteriyi Düzenle',
      'No customers found': 'Müşteri bulunamadı',
      'Add Your First Customer': 'İlk Müşteriyi Ekle',

      // Pilots
      'Pilots Management': 'Pilot Yönetimi',
      'Total Pilots': 'Toplam Pilot',
      'Pilot Groups': 'Pilot Grupları',
      'Total Flights Flown': 'Toplam Yapılan Uçuş',
      'Pilots Directory': 'Pilot Rehberi',
      'Flight Roster': 'Uçuş Nöbet Listesi',
      'Manage Groups': 'Grupları Yönet',
      'Add Pilot': 'Pilot Ekle',
      'Edit Pilot': 'Pilotu Düzenle',
      'License Number': 'Lisans Numarası',
      'Pilot Group': 'Pilot Grubu',
      'Flights Assigned': 'Atanan Uçuşlar',
      'Flights Flown': 'Tamamlanan Uçuşlar',
      'Did Not Come': 'Gelmeyen (No-Show)',
      'No-Show': 'Gelmeyen',

      // Agencies
      'Agencies Management': 'Acente Yönetimi',
      'Add New Agency': 'Yeni Acente Ekle',
      'Agency Name': 'Acente Adı',
      'Contact Person': 'Yetkili Kişi',
      'Office Address': 'Ofis Adresi',
      'No agencies found': 'Acente bulunamadı',

      // Extra Services
      'Extra Services Management': 'Ek Hizmet Yönetimi',
      'Total Services': 'Toplam Hizmet',
      'Average Price': 'Ortalama Fiyat',
      'Photo & Video Add-ons': 'Fotoğraf ve Video Paketleri',
      'Add Extra Service': 'Ek Hizmet Ekle',
      'Add New Extra Service': 'Yeni Ek Hizmet Ekle',
      'Edit Extra Service': 'Ek Hizmeti Düzenle',
      'Service Name': 'Hizmet Adı',
      'Retail Price': 'Satış Fiyatı',
      'No extra services found': 'Ek hizmet bulunamadı',

      // Transport Groups
      'Transport Groups Management': 'Transfer Grupları Yönetimi',
      'Total Shuttles': 'Toplam Servis',
      'Active Fleet Vehicles': 'Aktif Araç Filosu',
      'Designated Drivers': 'Görevli Sürücüler',
      'Add Transport Group': 'Transfer Grubu Ekle',
      'New Transport Group': 'Yeni Transfer Grubu',
      'Edit Transport Group': 'Transfer Grubunu Düzenle',
      'Departure Date & Time': 'Kalkış Tarihi ve Saati',
      'Departure Time': 'Kalkış Saati',
      'Vehicle Plate Number': 'Araç Plaka Numarası',
      'Vehicle Plate': 'Araç Plakası',
      'Driver Full Name': 'Sürücü Adı Soyadı',
      'Driver Name': 'Sürücü Adı',
      'Assigned Driver': 'Atanan Sürücü',
      'Mountain Transfer': 'Dağ Transferi',
      'Shuttle Departure': 'Servis Kalkışı',
      'No transport groups found': 'Transfer grubu bulunamadı',
      'Schedule First Mountain Shuttle': 'İlk Dağ Servisini Planla',

      // Flight Packages & Times
      'Add New Package': 'Yeni Paket Ekle',
      'Package Title': 'Paket Başlığı',
      'Package Description': 'Paket Açıklaması',
      'Flight Time Slots': 'Uçuş Saatleri',
      'Add Time Slot': 'Saat Dilimi Ekle',

      // Payments
      'Payment Hub': 'Ödeme Merkezi',
      'Collect Payments': 'Ödeme Al',
      'Payment Records': 'Ödeme Kayıtları',
      'Daily Revenue Ledger': 'Günlük Gelir Defteri',
      'Paid in Full': 'Tamamı Ödendi',
      'Pending Balance': 'Kalan Bakiye',
      'Rest to Pay': 'Kalan Tutar',
      'Cash': 'Nakit',
      'Credit Card': 'Kredi Kartı',
      'Bank Transfer': 'Banka Havalesi',
      'Refund': 'İade',
      'Receipt': 'Makbuz / Fiş',

      // Reservations
      'Schedule Matrix': 'Uçuş Takvimi (Kanban)',
      'List View': 'Liste Görünümü',
      'Add Passenger': 'Yolcu Ekle',
      'Pickup Hotel': 'Alınış Oteli',
      'Room Number': 'Oda Numarası',
      'Passenger Weight': 'Yolcu Kilosu',
      'Assigned Pilot': 'Atanan Pilot',
      'Takeoff Time': 'Kalkış Saati',
      'Booking Source': 'Rezervasyon Kaynağı',
      'Direct Booking': 'Doğrudan Rezervasyon'
    }
  };

  constructor() {}

  private getInitialLanguage(): SupportedLanguage {
    const saved = localStorage.getItem('lang')?.toLowerCase();
    if (saved === 'tr') return 'tr';
    return 'en'; // Default to English
  }

  public get currentLanguage(): SupportedLanguage {
    return this.currentLangSubject.value;
  }

  public setLanguage(lang: SupportedLanguage): void {
    if (lang !== 'en' && lang !== 'tr') {
      lang = 'en';
    }
    localStorage.setItem('lang', lang);
    this.currentLangSubject.next(lang);
  }

  public translate(key: string): string {
    if (!key) return '';
    const currentLang = this.currentLangSubject.value;
    const dict = this.translations[currentLang];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English if available
    const enDict = this.translations['en'];
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return key;
  }
}
