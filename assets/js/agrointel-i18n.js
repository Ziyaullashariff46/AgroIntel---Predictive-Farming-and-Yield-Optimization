/**
 * AgroIntel Multilingual Translation Engine & Crop Language Module
 * Supported Languages: English ('en'), Kannada ('kn' - ಕನ್ನಡ), Hindi ('hi' - हिन्दी)
 */
(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 1. ALL-INDIA STATES & UNION TERRITORIES (33 States in Database)
  // ═══════════════════════════════════════════════════════════════
  const STATE_TRANSLATIONS = {
    'Andaman and Nicobar Islands': { kn: 'ಅಂಡಮಾನ್ ಮತ್ತು ನಿಕೋಬಾರ್ (Andaman & Nicobar)', hi: 'अंडमान और निकोबार (Andaman & Nicobar)' },
    'Andhra Pradesh': { kn: 'ಆಂಧ್ರಪ್ರದೇಶ (Andhra Pradesh)', hi: 'आंध्र प्रदेश (Andhra Pradesh)' },
    'Arunachal Pradesh': { kn: 'ಅರುಣಾಚಲ ಪ್ರದೇಶ (Arunachal Pradesh)', hi: 'अरुणाचल प्रदेश (Arunachal Pradesh)' },
    'Assam': { kn: 'ಅಸ್ಸಾಂ (Assam)', hi: 'असम (Assam)' },
    'Bihar': { kn: 'ಬಿಹಾರ (Bihar)', hi: 'बिहार (Bihar)' },
    'Chandigarh': { kn: 'ಚಂಡೀಗಢ (Chandigarh)', hi: 'चंडीगढ़ (Chandigarh)' },
    'Chhattisgarh': { kn: 'ಛತ್ತೀಸ್‌ಗಢ (Chhattisgarh)', hi: 'छत्तीसगढ़ (Chhattisgarh)' },
    'Dadra and Nagar Haveli': { kn: 'ದಾದ್ರಾ ಮತ್ತು ನಗರ ಹವೇಲಿ (Dadra & Nagar Haveli)', hi: 'दादरा और नगर हवेली (Dadra & Nagar Haveli)' },
    'Goa': { kn: 'ಗೋವಾ (Goa)', hi: 'गोवा (Goa)' },
    'Gujarat': { kn: 'ಗುಜರಾತ್ (Gujarat)', hi: 'गुजरात (Gujarat)' },
    'Haryana': { kn: 'ಹರಿಯಾಣ (Haryana)', hi: 'हरियाणा (Haryana)' },
    'Himachal Pradesh': { kn: 'ಹಿಮಾಚಲ ಪ್ರದೇಶ (Himachal Pradesh)', hi: 'हिमाचल प्रदेश (Himachal Pradesh)' },
    'Jammu and Kashmir': { kn: 'ಜಮ್ಮು ಮತ್ತು ಕಾಶ್ಮೀರ (Jammu & Kashmir)', hi: 'जम्मू और कश्मीर (Jammu & Kashmir)' },
    'Jharkhand': { kn: 'ಜಾರ್ಖಂಡ್ (Jharkhand)', hi: 'झारखंड (Jharkhand)' },
    'Karnataka': { kn: 'ಕರ್ನಾಟಕ (Karnataka)', hi: 'कर्नाटक (Karnataka)' },
    'Kerala': { kn: 'ಕೇರಳ (Kerala)', hi: 'केरल (Kerala)' },
    'Madhya Pradesh': { kn: 'ಮಧ್ಯಪ್ರದೇಶ (Madhya Pradesh)', hi: 'मध्य प्रदेश (Madhya Pradesh)' },
    'Maharashtra': { kn: 'ಮಹಾರಾಷ್ಟ್ರ (Maharashtra)', hi: 'महाराष्ट्र (Maharashtra)' },
    'Manipur': { kn: 'ಮಣಿಪುರ (Manipur)', hi: 'मणिपुर (Manipur)' },
    'Meghalaya': { kn: 'ಮೇಘಾಲಯ (Meghalaya)', hi: 'मेघालय (Meghalaya)' },
    'Mizoram': { kn: 'ಮಿಜೋರಾಂ (Mizoram)', hi: 'मिजोरम (Mizoram)' },
    'Nagaland': { kn: 'ನಾಗಾಲ್ಯಾಂಡ್ (Nagaland)', hi: 'नागालैंड (Nagaland)' },
    'Odisha': { kn: 'ಒಡಿಶಾ (Odisha)', hi: 'ओडिशा (Odisha)' },
    'Puducherry': { kn: 'ಪುದುಚೇರಿ (Puducherry)', hi: 'पुडुचेरी (Puducherry)' },
    'Punjab': { kn: 'ಪಂಜಾಬ್ (Punjab)', hi: 'पंजाब (Punjab)' },
    'Rajasthan': { kn: 'ರಾಜಸ್ಥಾನ (Rajasthan)', hi: 'राजस्थान (Rajasthan)' },
    'Sikkim': { kn: 'ಸಿಕ್ಕಿಂ (Sikkim)', hi: 'सिक्किम (Sikkim)' },
    'Tamil Nadu': { kn: 'ತಮಿಳುನಾಡು (Tamil Nadu)', hi: 'तमिलनाडु (Tamil Nadu)' },
    'Telangana': { kn: 'ತೆಲಂಗಾಣ (Telangana)', hi: 'तेलंगाना (Telangana)' },
    'Tripura': { kn: 'ತ್ರಿಪುರ (Tripura)', hi: 'त्रिपुरा (Tripura)' },
    'Uttar Pradesh': { kn: 'ಉತ್ತರ ಪ್ರದೇಶ (Uttar Pradesh)', hi: 'उत्तर प्रदेश (Uttar Pradesh)' },
    'Uttarakhand': { kn: 'ಉತ್ತರಾಖಂಡ (Uttarakhand)', hi: 'उत्तराखंड (Uttarakhand)' },
    'West Bengal': { kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ (West Bengal)', hi: 'पश्चिम बंगाल (West Bengal)' }
  };

  // ═══════════════════════════════════════════════════════════════
  // 2. DISTRICTS & MANDI HUBS (Karnataka + National Agricultural Hubs)
  // ═══════════════════════════════════════════════════════════════
  const DISTRICT_TRANSLATIONS = {
    // Karnataka — All 30 Districts and Common Spellings
    'BAGALKOT': { kn: 'ಬಾಗಲಕೋಟೆ (Bagalkote)', hi: 'बागलकोट (Bagalkote)' },
    'BAGALKOTE': { kn: 'ಬಾಗಲಕೋಟೆ (Bagalkote)', hi: 'बागलकोट (Bagalkote)' },
    'BANGALORE RURAL': { kn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ (Bengaluru Rural)', hi: 'बेंगलुरु ग्रामीण (Bengaluru Rural)' },
    'BENGALURU RURAL': { kn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ (Bengaluru Rural)', hi: 'बेंगलुरु ग्रामीण (Bengaluru Rural)' },
    'BELGAUM': { kn: 'ಬೆಳಗಾವಿ (Belagavi)', hi: 'बेलगावी / बेलगाम (Belagavi)' },
    'BELAGAVI': { kn: 'ಬೆಳಗಾವಿ (Belagavi)', hi: 'बेलगावी (Belagavi)' },
    'BELLARY': { kn: 'ಬಳ್ಳಾರಿ (Ballari)', hi: 'ಬल्लारी / बेल्लारी (Ballari)' },
    'BALLARI': { kn: 'ಬಳ್ಳಾರಿ (Ballari)', hi: 'ಬल्लारी (Ballari)' },
    'BENGALURU URBAN': { kn: 'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)', hi: 'बेंगलुरु शहरी (Bengaluru Urban)' },
    'BANGALORE': { kn: 'ಬೆಂಗಳೂರು (Bangalore)', hi: 'बेंगलुरु (Bangalore)' },
    'BENGALURU': { kn: 'ಬೆಂಗಳೂರು (Bengaluru)', hi: 'बेंगलुरु (Bengaluru)' },
    'BIDAR': { kn: 'ಬೀದರ್ (Bidar)', hi: 'बीदर (Bidar)' },
    'BIJAPUR': { kn: 'ವಿಜಯಪುರ (Vijayapura / Bijapur)', hi: 'विजयपुरा / बीजापुर (Vijayapura)' },
    'VIJAYAPURA': { kn: 'ವಿಜಯಪುರ (Vijayapura)', hi: 'विजयपुरा (Vijayapura)' },
    'CHAMARAJANAGAR': { kn: 'ಚಾಮರಾಜನಗರ (Chamarajanagar)', hi: 'चामराजनगर (Chamarajanagar)' },
    'CHIKBALLAPUR': { kn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ (Chikkaballapura)', hi: 'चिक्काबल्लापुर (Chikkaballapura)' },
    'CHIKKABALLAPURA': { kn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ (Chikkaballapura)', hi: 'चिक्काबल्लापुर (Chikkaballapura)' },
    'CHIKMAGALUR': { kn: 'ಚಿಕ್ಕಮಗಳೂರು (Chikkamagaluru)', hi: 'चिकमगलूर (Chikkamagaluru)' },
    'CHIKKAMAGALURU': { kn: 'ಚಿಕ್ಕಮಗಳೂರು (Chikkamagaluru)', hi: 'चिकमगलूर (Chikkamagaluru)' },
    'CHITRADURGA': { kn: 'ಚಿತ್ರದುರ್ಗ (Chitradurga)', hi: 'चित्रदुर्ग (Chitradurga)' },
    'DAKSHIN KANNAD': { kn: 'ದಕ್ಷಿಣ ಕನ್ನಡ (Dakshina Kannada)', hi: 'दक्षिण कन्नड़ (Dakshina Kannada)' },
    'DAKSHINA KANNADA': { kn: 'ದಕ್ಷಿಣ ಕನ್ನಡ (Dakshina Kannada)', hi: 'दक्षिण कन्नड़ (Dakshina Kannada)' },
    'DAVANGERE': { kn: 'ದಾವಣಗೆರೆ (Davanagere)', hi: 'दावणगेरे (Davanagere)' },
    'DAVANAGERE': { kn: 'ದಾವಣಗೆರೆ (Davanagere)', hi: 'दावणगेरे (Davanagere)' },
    'DHARWAD': { kn: 'ಧಾರವಾಡ (Dharwad)', hi: 'धारवाड़ (Dharwad)' },
    'GADAG': { kn: 'ಗದಗ (Gadag)', hi: 'गदग (Gadag)' },
    'GULBARGA': { kn: 'ಕಲಬುರಗಿ (Kalaburagi / Gulbarga)', hi: 'कलबुर्गी / गुलबर्गा (Kalaburagi)' },
    'KALABURAGI': { kn: 'ಕಲಬುರಗಿ (Kalaburagi)', hi: 'कलबुर्गी (Kalaburagi)' },
    'HASSAN': { kn: 'ಹಾಸನ (Hassan)', hi: 'हासन (Hassan)' },
    'HAVERI': { kn: 'ಹಾವೇರಿ (Haveri)', hi: 'हावेरी (Haveri)' },
    'KODAGU': { kn: 'ಕೊಡಗು (Kodagu / Coorg)', hi: 'कोडगु / कूर्ग (Kodagu)' },
    'KOLAR': { kn: 'ಕೋಲಾರ (Kolar)', hi: 'कोलार (Kolar)' },
    'KOPPAL': { kn: 'ಕೊಪ್ಪಳ (Koppal)', hi: 'कोप्पल (Koppal)' },
    'MANDYA': { kn: 'ಮಂಡ್ಯ (Mandya)', hi: 'मांड्या (Mandya)' },
    'MYSORE': { kn: 'ಮೈಸೂರು (Mysuru / Mysore)', hi: 'मैसूर / मैसूरु (Mysuru)' },
    'MYSURU': { kn: 'ಮೈಸೂರು (Mysuru)', hi: 'मैसूर / मैसूरु (Mysuru)' },
    'RAICHUR': { kn: 'ರಾಯಚೂರು (Raichur)', hi: 'रायचूर (Raichur)' },
    'RAMANAGARA': { kn: 'ರಾಮನಗರ (Ramanagara)', hi: 'रामनगर (Ramanagara)' },
    'SHIMOGA': { kn: 'ಶಿವಮೊಗ್ಗ (Shivamogga / Shimoga)', hi: 'शिमोगा / शिवमोग्गा (Shivamogga)' },
    'SHIVAMOGGA': { kn: 'ಶಿವಮೊಗ್ಗ (Shivamogga)', hi: 'शिवमोग्गा (Shivamogga)' },
    'TUMKUR': { kn: 'ತುಮಕೂರು (Tumakuru / Tumkur)', hi: 'तुमकुंरु (Tumakuru)' },
    'TUMAKURU': { kn: 'ತುಮಕೂರು (Tumakuru)', hi: 'तुमकुंरु (Tumakuru)' },
    'UDUPI': { kn: 'ಉಡುಪಿ (Udupi)', hi: 'उडुपी (Udupi)' },
    'UTTAR KANNAD': { kn: 'ಉತ್ತರ ಕನ್ನಡ (Uttara Kannada)', hi: 'उत्तर कन्नड़ (Uttara Kannada)' },
    'UTTARA KANNADA': { kn: 'ಉತ್ತರ ಕನ್ನಡ (Uttara Kannada)', hi: 'उत्तर कन्नड़ (Uttara Kannada)' },
    'YADGIR': { kn: 'ಯಾದಗಿರಿ (Yadgir)', hi: 'यादगीर (Yadgir)' },
    'VIJAYANAGARA': { kn: 'ವಿಜಯನಗರ (Vijayanagara)', hi: 'विजयनगर (Vijayanagara)' },

    // Major National Agricultural Hubs
    'MUMBAI': { kn: 'ಮುಂಬೈ (Mumbai)', hi: 'मुंबई (Mumbai)' },
    'PUNE': { kn: 'ಪುಣೆ (Pune)', hi: 'पुणे (Pune)' },
    'NASHIK': { kn: 'ನಾಸಿಕ್ (Nashik)', hi: 'नासिक (Nashik)' },
    'NAGPUR': { kn: 'ನಾಗಪುರ (Nagpur)', hi: 'नागपुर (Nagpur)' },
    'AURANGABAD': { kn: 'ಔರಂಗಾಬಾದ್ (Aurangabad)', hi: 'औरंगाबाद (Aurangabad)' },
    'HYDERABAD': { kn: 'ಹೈದರಾಬಾದ್ (Hyderabad)', hi: 'हैदराबाद (Hyderabad)' },
    'WARANGAL': { kn: 'ವಾರಂಗಲ್ (Warangal)', hi: 'वारंगल (Warangal)' },
    'LUDHIANA': { kn: 'ಲೂಧಿಯಾನ (Ludhiana)', hi: 'लुधियाना (Ludhiana)' },
    'AMRITSAR': { kn: 'ಅಮೃತಸರ (Amritsar)', hi: 'अमृतसर (Amritsar)' },
    'JALANDHAR': { kn: 'ಜಲಂಧರ್ (Jalandhar)', hi: 'जालंधर (Jalandhar)' },
    'DELHI': { kn: 'ದೆಹಲಿ (Delhi)', hi: 'दिल्ली (Delhi)' },
    'NEW DELHI': { kn: 'ಹೊಸ ದೆಹಲಿ (New Delhi)', hi: 'नई दिल्ली (New Delhi)' },
    'JAIPUR': { kn: 'ಜೈಪುರ (Jaipur)', hi: 'जयपुर (Jaipur)' },
    'JODHPUR': { kn: 'ಜೋಧ್‌ಪುರ (Jodhpur)', hi: 'जोधपुर (Jodhpur)' },
    'KOTA': { kn: 'ಕೋಟಾ (Kota)', hi: 'कोटा (Kota)' },
    'AHMEDABAD': { kn: 'ಅಹಮದಾಬಾದ್ (Ahmedabad)', hi: 'अहमदाबाद (Ahmedabad)' },
    'SURAT': { kn: 'ಸೂರತ್ (Surat)', hi: 'सूरत (Surat)' },
    'RAJKOT': { kn: 'ರಾಜ್‌ಕೋಟ್ (Rajkot)', hi: 'राजकोट (Rajkot)' },
    'VADODARA': { kn: 'ವಡೋದರಾ (Vadodara)', hi: 'वडोदरा (Vadodara)' },
    'CHENNAI': { kn: 'ಚೆನ್ನೈ (Chennai)', hi: 'चेन्नई (Chennai)' },
    'COIMBATORE': { kn: 'ಕೊಯಮತ್ತೂರು (Coimbatore)', hi: 'कोयंबटूर (Coimbatore)' },
    'MADURAI': { kn: 'ಮಧುರೈ (Madurai)', hi: 'मदुरै (Madurai)' },
    'SALEM': { kn: 'ಸೇಲಂ (Salem)', hi: 'सेलम (Salem)' },
    'THIRUVANANTHAPURAM': { kn: 'ತಿರುವನಂತಪುರಂ (Thiruvananthapuram)', hi: 'तिरुवनंतपुरम (Thiruvananthapuram)' },
    'KOCHI': { kn: 'ಕೊಚ್ಚಿ (Kochi)', hi: 'कोच्चि (Kochi)' },
    'KOZHIKODE': { kn: 'ಕೋಝಿಕ್ಕೋಡ್ (Kozhikode)', hi: 'कोझिकोड (Kozhikode)' },
    'GUNTUR': { kn: 'ಗುಂಟೂರು (Guntur)', hi: 'गुंटूर (Guntur)' },
    'VIJAYAWADA': { kn: 'ವಿಜಯವಾಡ (Vijayawada)', hi: 'विजयवाड़ा (Vijayawada)' },
    'VISAKHAPATNAM': { kn: 'ವಿಶಾಖಪಟ್ಟಣ (Visakhapatnam)', hi: 'विशाखापत्तनम (Visakhapatnam)' },
    'KURNOOL': { kn: 'ಕರ್ನೂಲ್ (Kurnool)', hi: 'कुरनूल (Kurnool)' },
    'LUCKNOW': { kn: 'ಲಕ್ನೋ (Lucknow)', hi: 'लखनऊ (Lucknow)' },
    'KANPUR': { kn: 'ಕಾನ್ಪುರ (Kanpur)', hi: 'कानपुर (Kanpur)' },
    'VARANASI': { kn: 'ವಾರಣಾಸಿ (Varanasi)', hi: 'वाराणसी (Varanasi)' },
    'AGRA': { kn: 'ಆಗ್ರಾ (Agra)', hi: 'आगरा (Agra)' },
    'MEERUT': { kn: 'ಮೀರತ್ (Meerut)', hi: 'मेरठ (Meerut)' },
    'PATNA': { kn: 'ಪಾಟ್ನಾ (Patna)', hi: 'पटना (Patna)' },
    'GAYA': { kn: 'ಗಯಾ (Gaya)', hi: 'गया (Gaya)' },
    'BHOPAL': { kn: 'ಭೋಪಾಲ್ (Bhopal)', hi: 'भोपाल (Bhopal)' },
    'INDORE': { kn: 'ಇಂದೋರ್ (Indore)', hi: 'इंदौर (Indore)' },
    'GWALIOR': { kn: 'ಗ್ವಾಲಿಯರ್ (Gwalior)', hi: 'ग्वालियर (Gwalior)' },
    'KOLKATA': { kn: 'ಕೋಲ್ಕತ್ತಾ (Kolkata)', hi: 'कोलकाता (Kolkata)' },
    'HOWRAH': { kn: 'ಹೌರಾ (Howrah)', hi: 'हावड़ा (Howrah)' },
    'BHUBANESWAR': { kn: 'ಭುವನೇಶ್ವರ (Bhubaneswar)', hi: 'भुवनेश्वर (Bhubaneswar)' },
    'CUTTACK': { kn: 'ಕಟಕ್ (Cuttack)', hi: 'कटक (Cuttack)' },
    'RAIPUR': { kn: 'ರಾಯ್‌ಪುರ (Raipur)', hi: 'रायपुर (Raipur)' },
    'RANCHI': { kn: 'ರಾಂಚಿ (Ranchi)', hi: 'रांची (Ranchi)' },
    'GUWAHATI': { kn: 'ಗುವಾಹಟಿ (Guwahati)', hi: 'गुवाहाटी (Guwahati)' }
  };

  // ═══════════════════════════════════════════════════════════════
  // 3. CROP & COMMODITY LANGUAGE MODULE (All Agmarknet Mandi Crops + ML Models)
  // ═══════════════════════════════════════════════════════════════
  const CROP_TRANSLATIONS = {
    // Cereals & Grains
    'rice': { kn: 'ಭತ್ತ (Rice)', hi: 'धान / चावल (Rice)', pureKn: 'ಭತ್ತ', pureHi: 'चावल' },
    'paddy': { kn: 'ಭತ್ತ (Paddy)', hi: 'धान (Paddy)', pureKn: 'ಭತ್ತ', pureHi: 'धान' },
    'paddy (dhan)': { kn: 'ಭತ್ತ (Paddy / Dhan)', hi: 'धान (Paddy)', pureKn: 'ಭತ್ತ', pureHi: 'धान' },
    'rice (basmati)': { kn: 'ಬಾಸುಮತಿ ಅಕ್ಕಿ (Basmati Rice)', hi: 'बासमती चावल (Basmati)', pureKn: 'ಬಾಸುಮತಿ ಅಕ್ಕಿ', pureHi: 'बासमती चावल' },
    'wheat': { kn: 'ಗೋಧಿ (Wheat)', hi: 'गेहूं (Wheat)', pureKn: 'ಗೋಧಿ', pureHi: 'गेहूं' },
    'wheat / paddy (regional)': { kn: 'ಗೋಧಿ / ಭತ್ತ (Wheat/Paddy)', hi: 'गेहूं / धान (Wheat/Paddy)', pureKn: 'ಗೋಧಿ', pureHi: 'गेहूं' },
    'maize': { kn: 'ಮೆಕ್ಕೆಜೋಳ (Maize)', hi: 'मक्का (Maize)', pureKn: 'ಮೆಕ್ಕೆಜೋಳ', pureHi: 'मक्का' },
    'maize (corn)': { kn: 'ಮೆಕ್ಕೆಜೋಳ (Maize / Corn)', hi: 'मक्का (Corn)', pureKn: 'ಮೆಕ್ಕೆಜೋಳ', pureHi: 'मक्का' },
    'barley': { kn: 'ಬಾರ್ಲಿ (Barley)', hi: 'जौ (Barley)', pureKn: 'ಬಾರ್ಲಿ', pureHi: 'जौ' },
    'bajra': { kn: 'ಸಜ್ಜೆ (Bajra)', hi: 'बाजरा (Bajra)', pureKn: 'ಸಜ್ಜೆ', pureHi: 'बाजरा' },
    'jowar': { kn: 'ಜೋಳ (Jowar)', hi: 'ज्वार (Jowar)', pureKn: 'ಜೋಳ', pureHi: 'ज्वार' },
    'ragi': { kn: 'ರಾಗಿ (Ragi)', hi: 'रागी / मडुआ (Ragi)', pureKn: 'ರಾಗಿ', pureHi: 'रागी' },
    'ragi (finger millet)': { kn: 'ರಾಗಿ (Ragi / Finger Millet)', hi: 'रागी (Finger Millet)', pureKn: 'ರಾಗಿ', pureHi: 'रागी' },
    'millets': { kn: 'ಸಿರಿಧಾನ್ಯಗಳು (Millets)', hi: 'मोटे अनाज (Millets)', pureKn: 'ಸಿರಿಧಾನ್ಯಗಳು', pureHi: 'मोटे अनाज' },
    'small millets': { kn: 'ಕಿರುಧಾನ್ಯಗಳು (Small Millets)', hi: 'लघु धान्य (Millets)', pureKn: 'ಕಿರುಧಾನ್ಯಗಳು', pureHi: 'लघु धान्य' },
    'samai': { kn: 'ಸಾಮೆ (Little Millet)', hi: 'कुटकी / सामा (Millets)', pureKn: 'ಸಾಮೆ', pureHi: 'सामा' },
    'varagu': { kn: 'ಹಾರಕ (Kodo Millet)', hi: 'कोदो (Kodo Millet)', pureKn: 'ಹಾರಕ', pureHi: 'कोदो' },
    'korra': { kn: 'ನವಣೆ (Foxtail Millet)', hi: 'कंगनी (Foxtail Millet)', pureKn: 'ನವಣೆ', pureHi: 'कंगनी' },
    'total foodgrain': { kn: 'ಒಟ್ಟು ಆಹಾರ ಧಾನ್ಯಗಳು (Foodgrains)', hi: 'कुल खाद्यान्न (Foodgrains)', pureKn: 'ಆಹಾರ ಧಾನ್ಯಗಳು', pureHi: 'खाद्यान्न' },

    // Pulses & Legumes
    'gram': { kn: 'ಕಡಲೆ (Bengal Gram / Chana)', hi: 'चना (Bengal Gram)', pureKn: 'ಕಡಲೆ', pureHi: 'चना' },
    'bengal gram': { kn: 'ಕಡಲೆ (Bengal Gram)', hi: 'चना (Bengal Gram)', pureKn: 'ಕಡಲೆ', pureHi: 'चना' },
    'chickpea': { kn: 'ಕಡಲೆ (Chickpea)', hi: 'चना (Chickpea)', pureKn: 'ಕಡಲೆ', pureHi: 'चना' },
    'arhar/tur': { kn: 'ತೊಗರಿ ಬೇಳೆ (Tur / Arhar)', hi: 'अरहर / तुअर दाल (Tur)', pureKn: 'ತೊಗರಿ ಬೇಳೆ', pureHi: 'अरहर' },
    'tur': { kn: 'ತೊಗರಿ (Tur)', hi: 'तुअर / अरहर (Tur)', pureKn: 'ತೊಗರಿ', pureHi: 'तुअर' },
    'tur (pigeon pea)': { kn: 'ತೊಗರಿ (Tur / Pigeon Pea)', hi: 'अरहर / तुअर (Tur)', pureKn: 'ತೊಗರಿ', pureHi: 'अरहर' },
    'pigeonpeas': { kn: 'ತೊಗರಿ (Pigeonpea)', hi: 'अरहर / तुअर (Arhar)', pureKn: 'ತೊಗರಿ', pureHi: 'अरहर' },
    'moong(green gram)': { kn: 'ಹೆಸರು ಕಾಳು (Green Gram / Moong)', hi: 'मूंग दाल (Green Gram)', pureKn: 'ಹೆಸರು ಕಾಳು', pureHi: 'मूंग' },
    'moong': { kn: 'ಹೆಸರು ಕಾಳು (Moong)', hi: 'मूंग दाल (Moong)', pureKn: 'ಹೆಸರು ಕಾಳು', pureHi: 'मूंग दाल' },
    'mungbean': { kn: 'ಹೆಸರು ಕಾಳು (Moong Bean)', hi: 'मूंग दाल (Moong)', pureKn: 'ಹೆಸರು ಕಾಳು', pureHi: 'मूंग दाल' },
    'urad': { kn: 'ಉದ್ದಿನ ಕಾಳು (Urad Dal)', hi: 'उड़द दाल (Urad)', pureKn: 'ಉದ್ದಿನ ಕಾಳು', pureHi: 'उड़द दाल' },
    'blackgram': { kn: 'ಉದ್ದಿನ ಕಾಳು (Black Gram / Urad)', hi: 'उड़द दाल (Black Gram)', pureKn: 'ಉದ್ದಿನ ಕಾಳು', pureHi: 'उड़द दाल' },
    'lentil': { kn: 'ಮಸೂರ ಬೇಳೆ (Masoor Dal)', hi: 'मसूर दाल (Lentil)', pureKn: 'ಮಸೂರ ಬೇಳೆ', pureHi: 'मसूर दाल' },
    'masoor': { kn: 'ಮಸೂರ ಬೇಳೆ (Masoor)', hi: 'मसूर दाल (Masoor)', pureKn: 'ಮಸೂರ ಬೇಳೆ', pureHi: 'मसूर दाल' },
    'peas': { kn: 'ಬಟಾಣಿ (Peas)', hi: 'मटर (Peas)', pureKn: 'ಬಟಾಣಿ', pureHi: 'मटर' },
    'peas  (vegetable)': { kn: 'ಹಸಿ ಬಟಾಣಿ (Green Peas)', hi: 'हरी मटर (Peas)', pureKn: 'ಬಟಾಣಿ', pureHi: 'मटर' },
    'peas & beans (pulses)': { kn: 'ಬಟಾಣಿ ಮತ್ತು ಅವರೆ (Peas & Beans)', hi: 'मटर और फलियां (Peas & Beans)', pureKn: 'ಬಟಾಣಿ', pureHi: 'मटर' },
    'cowpea(lobia)': { kn: 'ಅಲಸಂದೆ (Cowpea / Lobia)', hi: 'लोबिया (Cowpea)', pureKn: 'ಅಲಸಂದೆ', pureHi: 'लोबिया' },
    'cowpea': { kn: 'ಅಲಸಂದೆ (Cowpea)', hi: 'लोबिया (Cowpea)', pureKn: 'ಅಲಸಂದೆ', pureHi: 'लोबिया' },
    'horse-gram': { kn: 'ಹುರುಳಿ ಕಾಳು (Horse Gram)', hi: 'कुलथी (Horse Gram)', pureKn: 'ಹುರುಳಿ ಕಾಳು', pureHi: 'कुलथी' },
    'horse gram': { kn: 'ಹುರುಳಿ ಕಾಳು (Horse Gram)', hi: 'कुलथी (Horse Gram)', pureKn: 'ಹುರುಳಿ ಕಾಳು', pureHi: 'कुलथी' },
    'kidneybeans': { kn: 'ರಾಜ್ಮಾ (Rajma)', hi: 'राजमा (Kidney Beans)', pureKn: 'ರಾಜ್ಮಾ', pureHi: 'राजमा' },
    'rajma': { kn: 'ರಾಜ್ಮಾ (Rajma)', hi: 'राजमा (Rajma)', pureKn: 'ರಾಜ್ಮಾ', pureHi: 'राजमा' },
    'rajmash kholar': { kn: 'ರಾಜ್ಮಾ (Rajmash)', hi: 'राजमा (Rajmash)', pureKn: 'ರಾಜ್ಮಾ', pureHi: 'राजमा' },
    'mothbeans': { kn: 'ಮಡಿಕೆ ಕಾಳು (Moth Bean)', hi: 'मोठ दाल (Moth Bean)', pureKn: 'ಮಡಿಕೆ ಕಾಳು', pureHi: 'मोठ दाल' },
    'moth': { kn: 'ಮಡಿಕೆ ಕಾಳು (Moth)', hi: 'मोठ दाल (Moth)', pureKn: 'ಮಡಿಕೆ ಕಾಳು', pureHi: 'मोठ दाल' },
    'khesari': { kn: 'ಕೇಸರಿ ಕಾಳು (Khesari)', hi: 'खेसारी दाल (Khesari)', pureKn: 'ಕೇಸರಿ ಕಾಳು', pureHi: 'खेसारी' },
    'pulses': { kn: 'ಬೇಳೆಕಾಳುಗಳು (Pulses)', hi: 'दालें (Pulses)', pureKn: 'ಬೇಳೆಕಾಳುಗಳು', pureHi: 'दालें' },
    'pulses total': { kn: 'ಒಟ್ಟು ಬೇಳೆಕಾಳುಗಳು (Total Pulses)', hi: 'कुल दालें (Total Pulses)', pureKn: 'ಬೇಳೆಕಾಳುಗಳು', pureHi: 'दालें' },

    // Oilseeds
    'groundnut': { kn: 'ಕಡಲೆಕಾಯಿ / ಶೇಂಗಾ (Groundnut)', hi: 'मूंगफली (Groundnut)', pureKn: 'ಕಡಲೆಕಾಯಿ', pureHi: 'मूंगफली' },
    'ground nuts': { kn: 'ಕಡಲೆಕಾಯಿ / ಶೇಂಗಾ (Groundnuts)', hi: 'मूंगफली (Groundnuts)', pureKn: 'ಕಡಲೆಕಾಯಿ', pureHi: 'मूंगफली' },
    'soyabean': { kn: 'ಸೋಯಾಬೀನ್ (Soyabean)', hi: 'सोयाबीन (Soyabean)', pureKn: 'ಸೋಯಾಬೀನ್', pureHi: 'सोयाबीन' },
    'sunflower': { kn: 'ಸೂರ್ಯಕಾಂತಿ (Sunflower)', hi: 'सूरजमुखी (Sunflower)', pureKn: 'ಸೂರ್ಯಕಾಂತಿ', pureHi: 'सूरजमुखी' },
    'sesamum': { kn: 'ಎಳ್ಳು (Sesamum / Til)', hi: 'तिल (Sesamum)', pureKn: 'ಎಳ್ಳು', pureHi: 'तिल' },
    'sesame': { kn: 'ಎಳ್ಳು (Sesame)', hi: 'तिल (Sesame)', pureKn: 'ಎಳ್ಳು', pureHi: 'तिल' },
    'mustard': { kn: 'ಸಾಸಿವೆ (Mustard)', hi: 'सरसों (Mustard)', pureKn: 'ಸಾಸಿವೆ', pureHi: 'सरसों' },
    'rapeseed &mustard': { kn: 'ಸಾಸಿವೆ ಮತ್ತು ರೇಪ್‌ಸೀಡ್ (Mustard)', hi: 'सरसों और तोरिया (Mustard)', pureKn: 'ಸಾಸಿವೆ', pureHi: 'सरसों' },
    'castor seed': { kn: 'ಹರಳು / ಔಡಲ (Castor Seed)', hi: 'अरंडी (Castor Seed)', pureKn: 'ಹರಳು', pureHi: 'अरंडी' },
    'linseed': { kn: 'ಅಗಸೆ ಬೀಜ (Linseed / Flaxseed)', hi: 'अलसी (Linseed)', pureKn: 'ಅಗಸೆ ಬೀಜ', pureHi: 'अलसी' },
    'safflower': { kn: 'ಕುಸುಮೆ (Safflower / Kardi)', hi: 'कुसुम (Safflower)', pureKn: 'ಕುಸುಮೆ', pureHi: 'कुसुम' },
    'niger seed': { kn: 'ಗುರೆಳ್ಳು (Niger Seed)', hi: 'रामतिल (Niger Seed)', pureKn: 'ಗುರೆಳ್ಳು', pureHi: 'रामतिल' },
    'oil seeds': { kn: 'ಎಣ್ಣೆಕಾಳುಗಳು (Oilseeds)', hi: 'तिलहन (Oilseeds)', pureKn: 'ಎಣ್ಣೆಕಾಳುಗಳು', pureHi: 'तिलहन' },
    'oilseeds total': { kn: 'ಒಟ್ಟು ಎಣ್ಣೆಕಾಳುಗಳು (Total Oilseeds)', hi: 'कुल तिलहन (Oilseeds)', pureKn: 'ಎಣ್ಣೆಕಾಳುಗಳು', pureHi: 'तिलहन' },

    // Cash Crops & Fibres
    'cotton': { kn: 'ಹತ್ತಿ (Cotton)', hi: 'कपास (Cotton)', pureKn: 'ಹತ್ತಿ', pureHi: 'कपास' },
    'cotton(lint)': { kn: 'ಹತ್ತಿ (Cotton / Lint)', hi: 'कपास (Cotton Lint)', pureKn: 'ಹತ್ತಿ', pureHi: 'कपास' },
    'kapas': { kn: 'ಹತ್ತಿ (Kapas)', hi: 'कपास (Kapas)', pureKn: 'ಹತ್ತಿ', pureHi: 'कपास' },
    'sugarcane': { kn: 'ಕಬ್ಬು (Sugarcane)', hi: 'गन्ना (Sugarcane)', pureKn: 'ಕಬ್ಬು', pureHi: 'गन्ना' },
    'jute': { kn: 'ಸೆಣಬು (Jute)', hi: 'जूट / पटसन (Jute)', pureKn: 'ಸೆಣಬು', pureHi: 'जूट' },
    'jute & mesta': { kn: 'ಸೆಣಬು ಮತ್ತು ಮೆಸ್ತ (Jute & Mesta)', hi: 'जूट और मेस्टा (Jute)', pureKn: 'ಸೆಣಬು', pureHi: 'जूट' },
    'mesta': { kn: 'ಮೆಸ್ತ (Mesta)', hi: 'मेस्टा (Mesta)', pureKn: 'ಮೆಸ್ತ', pureHi: 'मेस्टा' },
    'tobacco': { kn: 'ತಂಬಾಕು (Tobacco)', hi: 'तंबाकू (Tobacco)', pureKn: 'ತಂಬಾಕು', pureHi: 'तंबाकू' },
    'rubber': { kn: 'ರಬ್ಬರ್ (Rubber)', hi: 'रबर (Rubber)', pureKn: 'ರಬ್ಬರ್', pureHi: 'रबर' },
    'tea': { kn: 'ಚಹಾ (Tea)', hi: 'चाय (Tea)', pureKn: 'ಚಹಾ', pureHi: 'चाय' },
    'coffee': { kn: 'ಕಾಫಿ (Coffee)', hi: 'कॉफ़ी (Coffee)', pureKn: 'ಕಾಫಿ', pureHi: 'कॉफ़ी' },

    // Plantation & Spices
    'arecanut': { kn: 'ಅಡಿಕೆ (Arecanut / Supari)', hi: 'सुपारी (Arecanut)', pureKn: 'ಅಡಿಕೆ', pureHi: 'सुपारी' },
    'arecanut (betelnut)': { kn: 'ಅಡಿಕೆ (Arecanut / Betelnut)', hi: 'सुपारी (Betelnut)', pureKn: 'ಅಡಿಕೆ', pureHi: 'सुपारी' },
    'arcanut (processed)': { kn: 'ಸಂಸ್ಕರಿಸಿದ ಅಡಿಕೆ (Processed Arecanut)', hi: 'प्रसंस्कृत सुपारी (Arecanut)', pureKn: 'ಅಡಿಕೆ', pureHi: 'सुपारी' },
    'atcanut (raw)': { kn: 'ಹಸಿ ಅಡಿಕೆ (Raw Arecanut)', hi: 'कच्ची सुपारी (Raw Arecanut)', pureKn: 'ಹಸಿ ಅಡಿಕೆ', pureHi: 'कच्ची सुपारी' },
    'coconut': { kn: 'ತೆಂಗಿನಕಾಯಿ (Coconut)', hi: 'नारियल (Coconut)', pureKn: 'ತೆಂಗಿನಕಾಯಿ', pureHi: 'नारियल' },
    'black pepper': { kn: 'ಕರಿಮೆಣಸು (Black Pepper)', hi: 'काली मिर्च (Black Pepper)', pureKn: 'ಕರಿಮೆಣಸು', pureHi: 'काली मिर्च' },
    'cardamom': { kn: 'ಏಲಕ್ಕಿ (Cardamom)', hi: 'इलायची (Cardamom)', pureKn: 'ಏಲಕ್ಕಿ', pureHi: 'इलायची' },
    'cashewnut': { kn: 'ಗೋಡಂಬಿ (Cashewnut)', hi: 'काजू (Cashewnut)', pureKn: 'ಗೋಡಂಬಿ', pureHi: 'काजू' },
    'cashewnut processed': { kn: 'ಸಂಸ್ಕರಿಸಿದ ಗೋಡಂಬಿ (Processed Cashew)', hi: 'काजू प्रसंस्कृत (Cashew)', pureKn: 'ಗೋಡಂಬಿ', pureHi: 'काजू' },
    'cashewnut raw': { kn: 'ಹಸಿ ಗೋಡಂಬಿ (Raw Cashew)', hi: 'कच्चा काजू (Raw Cashew)', pureKn: 'ಹಸಿ ಗೋಡಂಬಿ', pureHi: 'कच्चा काजू' },
    'dry chillies': { kn: 'ಒಣ ಮೆಣಸಿನಕಾಯಿ (Dry Chillies)', hi: 'सूखी लाल मिर्च (Dry Chillies)', pureKn: 'ಒಣ ಮೆಣಸಿನಕಾಯಿ', pureHi: 'लाल मिर्च' },
    'chilli': { kn: 'ಮೆಣಸಿನಕಾಯಿ (Chilli)', hi: 'मिर्च (Chilli)', pureKn: 'ಮೆಣಸಿನಕಾಯಿ', pureHi: 'मिर्च' },
    'ginger': { kn: 'ಹಸಿ ಶುಂಠಿ (Ginger)', hi: 'अदरक (Ginger)', pureKn: 'ಶುಂಠಿ', pureHi: 'अदरक' },
    'dry ginger': { kn: 'ಒಣ ಶುಂಠಿ / ಶುಂಠಿ ಪುಡಿ (Dry Ginger)', hi: 'सोंठ / सूखा अदरक (Dry Ginger)', pureKn: 'ಒಣ ಶುಂಠಿ', pureHi: 'सोंठ' },
    'garlic': { kn: 'ಬೆಳ್ಳುಳ್ಳಿ (Garlic)', hi: 'लहसुन (Garlic)', pureKn: 'ಬೆಳ್ಳುಳ್ಳಿ', pureHi: 'लहसुन' },
    'turmeric': { kn: 'ಅರಿಶಿನ (Turmeric)', hi: 'हल्दी (Turmeric)', pureKn: 'ಅರಿಶಿನ', pureHi: 'हल्दी' },
    'coriander': { kn: 'ಕೊತ್ತಂಬರಿ (Coriander / Dhaniya)', hi: 'धनिया (Coriander)', pureKn: 'ಕೊತ್ತಂಬರಿ', pureHi: 'धनिया' },

    // Vegetables
    'onion': { kn: 'ಈರುಳ್ಳಿ (Onion)', hi: 'प्याज (Onion)', pureKn: 'ಈರುಳ್ಳಿ', pureHi: 'प्याज' },
    'potato': { kn: 'ಆಲೂಗಡ್ಡೆ (Potato)', hi: 'आलू (Potato)', pureKn: 'ಆಲೂಗಡ್ಡೆ', pureHi: 'आलू' },
    'tomato': { kn: 'ಟೊಮೇಟೊ (Tomato)', hi: 'टमाटर (Tomato)', pureKn: 'ಟೊಮೇಟೊ', pureHi: 'टमाटर' },
    'brinjal': { kn: 'ಬದನೆಕಾಯಿ (Brinjal)', hi: 'बैंगन (Brinjal)', pureKn: 'ಬದನೆಕಾಯಿ', pureHi: 'बैंगन' },
    'cabbage': { kn: 'ಎಲೆಕೋಸು (Cabbage)', hi: 'पत्तागोभी (Cabbage)', pureKn: 'ಎಲೆಕೋಸು', pureHi: 'पत्तागोभी' },
    'cauliflower': { kn: 'ಹೂಕೋಸು (Cauliflower)', hi: 'फूलगोभी (Cauliflower)', pureKn: 'ಹೂಕೋಸು', pureHi: 'फूलगोभी' },
    'carrot': { kn: 'ಕ್ಯಾರೆಟ್ (Carrot)', hi: 'गाजर (Carrot)', pureKn: 'ಕ್ಯಾರೆಟ್', pureHi: 'गाजर' },
    'beet root': { kn: 'ಬೀಟ್‌ರೂಟ್ (Beetroot)', hi: 'चुकंदर (Beetroot)', pureKn: 'ಬೀಟ್‌ರೂಟ್', pureHi: 'चुकंदर' },
    'bhindi': { kn: 'ಬೆಂಡೆಕಾಯಿ (Ladies Finger / Bhindi)', hi: 'भिंडी (Bhindi / Okra)', pureKn: 'ಬೆಂಡೆಕಾಯಿ', pureHi: 'भिंडी' },
    'ladies finger': { kn: 'ಬೆಂಡೆಕಾಯಿ (Ladies Finger)', hi: 'भिंडी (Ladies Finger)', pureKn: 'ಬೆಂಡೆಕಾಯಿ', pureHi: 'भिंडी' },
    'bitter gourd': { kn: 'ಹಾಗಲಕಾಯಿ (Bitter Gourd)', hi: 'करेला (Bitter Gourd)', pureKn: 'ಹಾಗಲಕಾಯಿ', pureHi: 'करेला' },
    'bottle gourd': { kn: 'ಸೋರೆಕಾಯಿ (Bottle Gourd)', hi: 'लौकी / घिया (Bottle Gourd)', pureKn: 'ಸೋರೆಕಾಯಿ', pureHi: 'लौकी' },
    'ash gourd': { kn: 'ಬೂದುಗುಂಬಳ (Ash Gourd)', hi: 'पेठा / कुष्मांड (Ash Gourd)', pureKn: 'ಬೂದುಗುಂಬಳ', pureHi: 'पेठा' },
    'cucumber': { kn: 'ಸೌತೆಕಾಯಿ (Cucumber)', hi: 'खीरा / ककड़ी (Cucumber)', pureKn: 'ಸೌತೆಕಾಯಿ', pureHi: 'खीरा' },
    'drum stick': { kn: 'ನುಗ್ಗೆಕಾಯಿ (Drumstick)', hi: 'सहजन / ड्रमस्टिक (Drumstick)', pureKn: 'ನುಗ್ಗೆಕಾಯಿ', pureHi: 'सहजन' },
    'sweet potato': { kn: 'ಗೆಣಸು (Sweet Potato)', hi: 'शकरकंद (Sweet Potato)', pureKn: 'ಗೆಣಸು', pureHi: 'शकरकंद' },
    'tapioca': { kn: 'ಮರಗೆಣಸು (Tapioca / Cassava)', hi: 'कसावा / साबूदाना जड़ (Tapioca)', pureKn: 'ಮರಗೆಣಸು', pureHi: 'कसावा' },
    'yam': { kn: 'ಸುವರ್ಣಗೆಡ್ಡೆ (Yam)', hi: 'जिमीकंद / सूरन (Yam)', pureKn: 'ಸುವರ್ಣಗೆಡ್ಡೆ', pureHi: 'जिमीकंद' },
    'pump kin': { kn: 'ಸಿಹಿಗುಂಬಳ (Pumpkin)', hi: 'कद्दू (Pumpkin)', pureKn: 'ಸಿಹಿಗುಂಬಳ', pureHi: 'कद्दू' },
    'radish': { kn: 'ಮೂಲಂಗಿ (Radish)', hi: 'मूली (Radish)', pureKn: 'ಮೂಲಂಗಿ', pureHi: 'मूली' },
    'redish': { kn: 'ಮೂಲಂಗಿ (Radish)', hi: 'मूली (Radish)', pureKn: 'ಮೂಲಂಗಿ', pureHi: 'मूली' },

    // Fruits
    'pomegranate': { kn: 'ದಾಳಿಂಬೆ (Pomegranate)', hi: 'अनार (Pomegranate)', pureKn: 'ದಾಳಿಂಬೆ', pureHi: 'अनार' },
    'pome granet': { kn: 'ದಾಳಿಂಬೆ (Pomegranate)', hi: 'अनार (Pomegranate)', pureKn: 'ದಾಳಿಂಬೆ', pureHi: 'अनार' },
    'banana': { kn: 'ಬಾಳೆಹಣ್ಣು (Banana)', hi: 'केला (Banana)', pureKn: 'ಬಾಳೆಹಣ್ಣು', pureHi: 'केला' },
    'mango': { kn: 'ಮಾವಿನಹಣ್ಣು (Mango)', hi: 'आम (Mango)', pureKn: 'ಮಾವಿನಹಣ್ಣು', pureHi: 'आम' },
    'grapes': { kn: 'ದ್ರಾಕ್ಷಿ (Grapes)', hi: 'अंगूर (Grapes)', pureKn: 'ದ್ರಾಕ್ಷಿ', pureHi: 'अंगूर' },
    'apple': { kn: 'ಸೇಬು (Apple)', hi: 'सेब (Apple)', pureKn: 'ಸೇಬು', pureHi: 'सेब' },
    'orange': { kn: 'ಕಿತ್ತಳೆ (Orange)', hi: 'संतरा (Orange)', pureKn: 'ಕಿತ್ತಳೆ', pureHi: 'संतरा' },
    'papaya': { kn: 'ಪಪ್ಪಾಯಿ (Papaya)', hi: 'पपीता (Papaya)', pureKn: 'ಪಪ್ಪಾಯಿ', pureHi: 'पपीता' },
    'watermelon': { kn: 'ಕಲ್ಲಂಗಡಿ (Watermelon)', hi: 'तरबूज (Watermelon)', pureKn: 'ಕಲ್ಲಂಗಡಿ', pureHi: 'तरबूज' },
    'water melon': { kn: 'ಕಲ್ಲಂಗಡಿ (Watermelon)', hi: 'तरबूज (Watermelon)', pureKn: 'ಕಲ್ಲಂಗಡಿ', pureHi: 'तरबूಜ' },
    'muskmelon': { kn: 'ಕರಬೂಜ (Muskmelon)', hi: 'खरबूजा (Muskmelon)', pureKn: 'ಕರಬೂಜ', pureHi: 'खरबूजा' },
    'pineapple': { kn: 'ಅನಾನಸ್ (Pineapple)', hi: 'अनानास (Pineapple)', pureKn: 'ಅನಾನಸ್', pureHi: 'अनानास' },
    'sapota': { kn: 'ಸಪೋಟ / ಚಿಕ್ಕು (Chikoo)', hi: 'चीकू / सपोटा (Sapota)', pureKn: 'ಚಿಕ್ಕು', pureHi: 'चीकू' },
    'lemon': { kn: 'ನಿಂಬೆಹಣ್ಣು (Lemon / Nimbu)', hi: 'नींबू (Lemon)', pureKn: 'ನಿಂಬೆಹಣ್ಣು', pureHi: 'नींबू' },
    'guava': { kn: 'ಸೀಬೆಹಣ್ಣು (Guava)', hi: 'अमरूद (Guava)', pureKn: 'ಸೀಬೆಹಣ್ಣು', pureHi: 'अमरूद' },
    'jack fruit': { kn: 'ಹಲಸಿನಹಣ್ಣು (Jackfruit)', hi: 'कटहल (Jackfruit)', pureKn: 'ಹಲಸಿನಹಣ್ಣು', pureHi: 'कटहल' },
    'ber': { kn: 'ಬೋರೆಹಣ್ಣು (Ber / Jujube)', hi: 'बेर (Ber)', pureKn: 'ಬೋರೆಹಣ್ಣು', pureHi: 'बेर' },
    'litchi': { kn: 'ಲಿಚಿ (Litchi)', hi: 'लीची (Litchi)', pureKn: 'ಲಿಚಿ', pureHi: 'लीची' }
  };

  // ═══════════════════════════════════════════════════════════════
  // 4. GENERAL UI STRINGS & LABELS
  // ═══════════════════════════════════════════════════════════════
  const TRANSLATIONS = {
    // Navigation & Auth
    'Farmer Portal': { kn: 'ರೈತ ಪೋರ್ಟಲ್', hi: 'किसान पोर्टल' },
    'Admin Portal': { kn: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್', hi: 'व्यवस्थापक पोर्टल' },
    'Admin': { kn: 'ನಿರ್ವಾಹಕ', hi: 'एडमिन' },
    'LOGOUT': { kn: 'ನಿರ್ಗಮಿಸಿ', hi: 'लॉगआउट' },
    'Logout': { kn: 'ನಿರ್ಗಮಿಸಿ', hi: 'लॉगआउट' },
    'Home': { kn: 'ಮುಖಪುಟ', hi: 'होम' },
    'Contact': { kn: 'ಸಂಪರ್ಕ', hi: 'संपर्क' },
    'Prediction Suite': { kn: 'ಮುನ್ಸೂಚನಾ ಪರಿಕರಗಳು', hi: 'पूर्वानुमान सुइट' },
    'Market Intelligence': { kn: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ', hi: 'बाजार भाव व जानकारी' },
    'Prediction Tools': { kn: 'ಮುನ್ಸೂಚನಾ ಪರಿಕರಗಳು', hi: 'पूर्वानुमान टूल्स' },

    // Sidebar Items
    'Crop Recommendation': { kn: 'ಬೆಳೆ ಶಿಫಾರಸು', hi: 'फसल सिफारिश' },
    'Best crop for your soil': { kn: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆ', hi: 'आपकी मिट्टी के लिए सर्वोत्तम फसल' },
    'Fertilizer Advisory': { kn: 'ರಸಗೊಬ್ಬರ ಸಲಹೆ', hi: 'उर्वरक परामर्श' },
    'Optimal NPK formula': { kn: 'ಸೂಕ್ತ NPK ಸೂತ್ರ', hi: 'उचित एनपीके फॉर्मूला' },
    'Yield Harvest Forecast': { kn: 'ಇಳುವರಿ ಬೆಳೆ ಮುನ್ಸೂಚನೆ', hi: 'उपज फसल पूर्वानुमान' },
    'Estimate output in tonnes': { kn: 'ಟನ್‌ಗಳಲ್ಲಿ ಇಳುವರಿ ಅಂದಾಜು', hi: 'टन में अनुमानित पैदावार' },
    'Rainfall Estimation': { kn: 'ಮಳೆ ಅಂದಾಜು', hi: 'वर्षा अनुमान' },
    'Monthly rain forecast': { kn: 'ಮಾಸಿಕ ಮಳೆ ಮುನ್ಸೂಚನೆ', hi: 'मासिक वर्षा पूर्वानुमान' },
    'Weather Forecast': { kn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ', hi: 'मौसम पूर्वानुमान' },
    'City weather conditions': { kn: 'ನಗರ ಹವಾಮಾನ ಸ್ಥಿತಿ', hi: 'शहर का मौसम' },
    'Live Mandi Prices': { kn: 'ಲೈವ್ ಮಂಡಿ ದರಗಳು', hi: 'लाइव मंडी भाव' },
    'Real-time commodity rates': { kn: 'ನೈಜ ಸಮಯದ ಮಾರುಕಟ್ಟೆ ದರಗಳು', hi: 'ताजा कृषि उपज दरें' },

    // Live Mandi Specific Strings
    'State': { kn: 'ರಾಜ್ಯ', hi: 'राज्य' },
    'District': { kn: 'ಜಿಲ್ಲೆ', hi: 'जिला' },
    'Select a state…': { kn: 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ…', hi: 'राज्य चुनें…' },
    'Select your district…': { kn: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ…', hi: 'अपना जिला चुनें…' },
    'Select a state first…': { kn: 'ಮೊದಲು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ…', hi: 'पहले राज्य चुनें…' },
    'Real-time APMC commodity rates from Agmarknet — pick a state and district, or detect your location.': {
      kn: 'ಅಗ್ಮಾರ್ಕ್‌ನೆಟ್‌ನಿಂದ ನೈಜ ಸಮಯದ ಎಪಿಎಂಸಿ ದರಗಳು — ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಅಥವಾ ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿ.',
      hi: 'एगमार्कनेट से वास्तविक समय एपीएमसी कृषि दरें — राज्य और जिला चुनें, या स्थान खोजें।'
    },
    'Top Commodities': { kn: 'ಪ್ರಮುಖ ಕೃಷಿ ಉತ್ಪನ್ನಗಳು', hi: 'प्रमुख कृषि उत्पाद' },
    'Commodity': { kn: 'ಕೃಷಿ ಉತ್ಪನ್ನ', hi: 'कृषि जिंस / फसल' },
    'Variety': { kn: 'ತಳಿ / ವಿಧ', hi: 'किस्म / वैरायटी' },
    'Market / APMC': { kn: 'ಮಾರುಕಟ್ಟೆ / ಎಪಿಎಂಸಿ', hi: 'मंडी / एपीएमसी' },
    'Min ₹/q': { kn: 'ಕನಿಷ್ಠ ₹/ಕ್ವಿಂಟಾಲ್', hi: 'न्यूनतम ₹/क्विंटल' },
    'Max ₹/q': { kn: 'ಗರಿಷ್ಠ ₹/ಕ್ವಿಂಟಾಲ್', hi: 'अधिकतम ₹/क्विंटल' },
    'Modal ₹/q': { kn: 'ಮಾದರಿ ₹/ಕ್ವಿಂಟಾಲ್', hi: 'मॉडल ₹/क्विंटल' },
    'Date': { kn: 'ದಿನಾಂಕ', hi: 'तारीख' },
    'per quintal': { kn: 'ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ', hi: 'प्रति क्विंटल' },
    'Min:': { kn: 'ಕನಿಷ್ಠ:', hi: 'न्यूनतम:' },
    'Max:': { kn: 'ಗರಿಷ್ಠ:', hi: 'अधिकतम:' },
    'commodities': { kn: 'ಕೃಷಿ ಉತ್ಪನ್ನಗಳು', hi: 'कृषि उत्पाद' },
    'Fetching live market prices...': { kn: 'ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ತರಲಾಗುತ್ತಿದೆ...', hi: 'मंडी भाव लोड हो रहे हैं...' },
    'No market data found for this location': { kn: 'ಈ ಸ್ಥಳಕ್ಕೆ ಯಾವುದೇ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ', hi: 'इस स्थान के लिए कोई मंडी डेटा उपलब्ध नहीं है' },
    'Try a different state or district': { kn: 'ಬೇರೆ ರಾಜ್ಯ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ', hi: 'कृपया अन्य राज्य या जिला चुनें' },
    'Live feed temporarily unavailable — showing estimated rates': {
      kn: 'ಲೈವ್ ಫೀಡ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ — ಅಂದಾಜು ದರಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ',
      hi: 'लाइव फीड अस्थायी रूप से अनुपलब्ध है — अनुमानित दरें प्रदर्शित हैं'
    },
    'Nearby': { kn: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳು', hi: 'आस-पास' },
    'Search': { kn: 'ಹುಡುಕಿ', hi: 'खोजें' },
    'My Location': { kn: 'ನನ್ನ ಸ್ಥಳ', hi: 'मेरा स्थान' },

    // Common Soil & Form Labels
    'Nitrogen (N)': { kn: 'ಸಾರಜನಕ (Nitrogen - N)', hi: 'नाइट्रोजन (Nitrogen - N)' },
    'Phosphorus (P)': { kn: 'ರಂಜಕ (Phosphorus - P)', hi: 'फास्फोरस (Phosphorus - P)' },
    'Potassium (K)': { kn: 'ಪೊಟ್ಯಾಶಿಯಂ (Potassium - K)', hi: 'पोटेशियम (Potassium - K)' },
    'Temperature (°C)': { kn: 'ತಾಪಮಾನ (°C)', hi: 'तापमान (°C)' },
    'Humidity (%)': { kn: 'ಆರ್ದ್ರತೆ (%)', hi: 'आर्द्रता / नमी (%)' },
    'Soil pH Level': { kn: 'ಮಣ್ಣಿನ pH ಮಟ್ಟ', hi: 'मिट्टी का पीएच स्तर (pH)' },
    'Rainfall (mm)': { kn: 'ಮಳೆ ಪ್ರಮಾಣ (ಮಿ.ಮೀ)', hi: 'वर्षा (मिमी)' },
    'Soil Moisture': { kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ (Moisture)', hi: 'मिट्टी की नमी' },
    'Soil Type': { kn: 'ಮಣ್ಣಿನ ವಿಧ', hi: 'मिट्टी का प्रकार' },
    'Target Crop': { kn: 'ಉದ್ದೇಶಿತ ಬೆಳೆ', hi: 'लक्षित फसल' },
    'Cultivation Season': { kn: 'ಬೆಳೆ ಹಂಗಾಮು', hi: 'खेती का मौसम (सीजन)' },
    'Land Area (Acre)': { kn: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)', hi: 'जमीन का क्षेत्रफल (एकड़)' },
    'Meteorological Subdivision': { kn: 'ಹವಾಮಾನ ಉಪವಿಭಾಗ', hi: 'मौसम विज्ञान उप-मंडल' },
    'Target Month': { kn: 'ಗುರಿ ತಿಂಗಳು', hi: 'महीना' },

    // Buttons
    'Run Crop Recommendation': { kn: 'ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ', hi: 'फसल सिफारिश प्राप्त करें' },
    'Compute Recommended Fertilizer': { kn: 'ಸೂಕ್ತ ರಸಗೊಬ್ಬರ ಲೆಕ್ಕಹಾಕಿ', hi: 'उर्वरक की सिफारिश निकालें' },
    'Compute Expected Yield Tonnage': { kn: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ಲೆಕ್ಕಹಾಕಿ', hi: 'अनुमानित पैदावार की गणना करें' },
    'Estimate Rainfall': { kn: 'ಮಳೆಯನ್ನು ಅಂದಾಜಿಸಿ', hi: 'वर्षा का अनुमान लगाएं' },
    'Quick Soil Presets': { kn: 'ತ್ವರಿತ ಮಣ್ಣಿನ ಆಯ್ಕೆಗಳು', hi: 'त्वरित मिट्टी विकल्प' },
    'Model Intelligence': { kn: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವಿವರಗಳು (AI)', hi: 'मॉडल इंटेलिजेंस (AI विवरण)' },
    'ML Model Used': { kn: 'ಬಳಸಿದ ML ಮಾದರಿ', hi: 'उपयोग किया गया एमएल मॉडल' },
    'Recommendation Basis': { kn: 'ಶಿಫಾರಸಿನ ಆಧಾರ', hi: 'सिफारिश का आधार' },
    'Estimation Basis': { kn: 'ಅಂದಾಜಿನ ಆಧಾರ', hi: 'अनुमान का आधार' }
  };

  // State
  let currentLang = localStorage.getItem('agrointel-lang') || 'en';

  /**
   * Translate a given key to the current language
   */
  function t(key, lang) {
    const targetLang = lang || currentLang;
    if (targetLang === 'en' || !TRANSLATIONS[key]) {
      return key;
    }
    return TRANSLATIONS[key][targetLang] || key;
  }

  function normalizeCropKey(k) {
    if (!k) return '';
    let s = k.toString().trim().toLowerCase();
    s = s.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    return s;
  }

  /**
   * Localized crop name lookup
   */
  function getCropName(cropKey, lang) {
    if (!cropKey) return '';
    const targetLang = lang || currentLang;
    const rawKey = cropKey.toString().trim().toLowerCase();
    const cleanKey = normalizeCropKey(rawKey);

    const entry = CROP_TRANSLATIONS[rawKey] || CROP_TRANSLATIONS[cleanKey];
    if (!entry) {
      // Capitalize first letter of each word if not in dictionary
      return cropKey.toString().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
    if (targetLang === 'kn') return entry.kn || cropKey;
    if (targetLang === 'hi') return entry.hi || cropKey;
    return cropKey.charAt(0).toUpperCase() + cropKey.slice(1);
  }

  /**
   * Localized State name lookup
   */
  function getStateName(stateKey, lang) {
    if (!stateKey) return '';
    const targetLang = lang || currentLang;
    const cleanKey = stateKey.toString().trim();
    const entry = STATE_TRANSLATIONS[cleanKey];
    if (!entry) return cleanKey;
    if (targetLang === 'kn') return entry.kn || cleanKey;
    if (targetLang === 'hi') return entry.hi || cleanKey;
    return cleanKey;
  }

  /**
   * Localized District name lookup
   */
  function getDistrictName(districtKey, lang) {
    if (!districtKey) return '';
    const targetLang = lang || currentLang;
    const cleanKey = districtKey.toString().trim().toUpperCase();
    const entry = DISTRICT_TRANSLATIONS[cleanKey];
    if (entry) {
      if (targetLang === 'kn') return entry.kn || districtKey;
      if (targetLang === 'hi') return entry.hi || districtKey;
    }
    // Return clean title case for unmapped districts
    return districtKey.toString().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  /**
   * Set active language
   */
  function setLanguage(lang) {
    if (!['en', 'kn', 'hi'].includes(lang)) {
      lang = 'en';
    }
    currentLang = lang;
    localStorage.setItem('agrointel-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update active checkmarks in language dropdown
    document.querySelectorAll('.agrointel-lang-item').forEach(el => {
      if (el.getAttribute('data-lang') === lang) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update header dropdown label
    const labelMap = {
      'en': '🇬🇧 EN',
      'kn': '🇮🇳 ಕನ್ನಡ',
      'hi': '🇮🇳 हिन्दी'
    };
    document.querySelectorAll('.agrointel-lang-current-label').forEach(el => {
      el.textContent = labelMap[lang] || '🇬🇧 EN';
    });

    // Translate DOM elements
    applyTranslationsToDOM();

    // Broadcast event for custom components (like market prices table & dropdowns)
    window.dispatchEvent(new CustomEvent('agrointel-language-changed', {
      detail: { lang: lang }
    }));
  }

  /**
   * Apply translations across DOM while safeguarding server POST inputs
   */
  function applyTranslationsToDOM() {
    // 1. Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && TRANSLATIONS[key]) {
        el.textContent = t(key);
      }
    });

    // 2. Sidebar titles & subtitles
    document.querySelectorAll('.sidebar-nav-title').forEach(el => {
      const orig = el.getAttribute('data-original-text') || el.textContent.trim();
      if (!el.getAttribute('data-original-text')) el.setAttribute('data-original-text', orig);
      if (TRANSLATIONS[orig]) el.textContent = t(orig);
    });

    document.querySelectorAll('.sidebar-nav-sub').forEach(el => {
      const orig = el.getAttribute('data-original-text') || el.textContent.trim();
      if (!el.getAttribute('data-original-text')) el.setAttribute('data-original-text', orig);
      if (TRANSLATIONS[orig]) el.textContent = t(orig);
    });

    // 3. Form labels
    document.querySelectorAll('label').forEach(label => {
      Array.from(label.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const rawText = node.textContent.trim();
          if (rawText && TRANSLATIONS[rawText]) {
            if (!label.getAttribute('data-orig-label')) label.setAttribute('data-orig-label', rawText);
            node.textContent = ' ' + t(label.getAttribute('data-orig-label')) + ' ';
          }
        }
      });
    });

    // 4. Buttons (preserves Font Awesome icons)
    document.querySelectorAll('button[type="submit"], .btn-agro-primary, .btn-agro-secondary, .soil-preset-btn').forEach(btn => {
      Array.from(btn.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const rawText = node.textContent.trim();
          if (rawText && TRANSLATIONS[rawText]) {
            if (!btn.getAttribute('data-orig-btn')) btn.setAttribute('data-orig-btn', rawText);
            node.textContent = ' ' + t(btn.getAttribute('data-orig-btn')) + ' ';
          }
        }
      });
    });

    // 5. Select dropdowns (translates visible text, preserves value='Rice', value='Karnataka', etc.)
    document.querySelectorAll('select option').forEach(opt => {
      const origText = opt.getAttribute('data-orig-opt') || opt.textContent.trim();
      if (!opt.getAttribute('data-orig-opt')) {
        opt.setAttribute('data-orig-opt', origText);
      }
      const optVal = opt.value || origText;

      // State check
      if (STATE_TRANSLATIONS[optVal]) {
        opt.textContent = getStateName(optVal, currentLang);
        return;
      }

      // District check
      if (DISTRICT_TRANSLATIONS[optVal.toUpperCase()]) {
        opt.textContent = getDistrictName(optVal, currentLang);
        return;
      }

      // Crop check
      const cropKey = optVal.toLowerCase().trim();
      if (CROP_TRANSLATIONS[cropKey] || CROP_TRANSLATIONS[normalizeCropKey(cropKey)]) {
        opt.textContent = getCropName(cropKey, currentLang);
        return;
      }

      // Generic translations
      if (TRANSLATIONS[origText]) {
        opt.textContent = t(origText);
      }
    });

    // 6. Crop Recommendation Result Cards
    document.querySelectorAll('.result-card-glow').forEach(card => {
      const headline = card.querySelector('h1, h2');
      if (headline) {
        const rawCrop = headline.getAttribute('data-crop-en') || headline.textContent.trim();
        if (!headline.getAttribute('data-crop-en')) {
          headline.setAttribute('data-crop-en', rawCrop);
        }
        const cropKey = rawCrop.toLowerCase().trim();
        const normKey = normalizeCropKey(cropKey);
        if (CROP_TRANSLATIONS[cropKey] || CROP_TRANSLATIONS[normKey]) {
          const localName = getCropName(cropKey, currentLang);
          headline.textContent = localName;

          let subEl = card.querySelector('.crop-regional-desc');
          if (!subEl) {
            subEl = document.createElement('p');
            subEl.className = 'crop-regional-desc mt-2 mb-0';
            subEl.style.fontSize = '0.92rem';
            subEl.style.fontWeight = '600';
            subEl.style.color = 'var(--emerald-400)';
            headline.insertAdjacentElement('afterend', subEl);
          }
          const pureKn = (CROP_TRANSLATIONS[cropKey] || CROP_TRANSLATIONS[normKey]).pureKn;
          const pureHi = (CROP_TRANSLATIONS[cropKey] || CROP_TRANSLATIONS[normKey]).pureHi;
          if (currentLang === 'kn') {
            subEl.textContent = `🌾 ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಉತ್ತಮ ಇಳುವರಿ ನೀಡುವ ಬೆಳೆ: ${pureKn}`;
          } else if (currentLang === 'hi') {
            subEl.textContent = `🌾 आपकी भूमि के लिए अनुशंसित अधिक उपज वाली फसल: ${pureHi}`;
          } else {
            subEl.textContent = `🌾 Optimal high-yield crop calculated for your soil metrics.`;
          }
        }
      }
    });
  }

  // Setup dropdown clicks
  function setupLangDropdown() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.agrointel-lang-btn');
      const dropdown = e.target.closest('.agrointel-lang-dropdown');
      const allDropdowns = document.querySelectorAll('.agrointel-lang-dropdown');

      if (btn && dropdown) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        allDropdowns.forEach(d => d.classList.remove('open'));
        if (!isOpen) dropdown.classList.add('open');
        return;
      }

      if (e.target.closest('.agrointel-lang-item')) {
        const item = e.target.closest('.agrointel-lang-item');
        const lang = item.getAttribute('data-lang');
        setLanguage(lang);
        allDropdowns.forEach(d => d.classList.remove('open'));
        return;
      }

      if (!dropdown) {
        allDropdowns.forEach(d => d.classList.remove('open'));
      }
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    setupLangDropdown();
    setLanguage(currentLang);
  });

  // Global Export
  window.AgroIntelI18N = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; },
    getCropName: getCropName,
    getStateName: getStateName,
    getDistrictName: getDistrictName,
    t: t,
    refresh: applyTranslationsToDOM
  };

  window.agrointelT = t;
})();
