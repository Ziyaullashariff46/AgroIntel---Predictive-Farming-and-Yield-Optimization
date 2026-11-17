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
    '24 PARAGANAS NORTH': { kn: '24 ಪರಗನಸ ಉತ್ತರ (24 Paraganas North)', hi: '24 परगनस उत्तर (24 Paraganas North)' },
    '24 PARAGANAS SOUTH': { kn: '24 ಪರಗನಸ ದಕ್ಷಿಣ (24 Paraganas South)', hi: '24 परगनस दक्षिण (24 Paraganas South)' },
    'ADILABAD': { kn: 'ಅದಿಲಬದ (Adilabad)', hi: 'अदिलबद (Adilabad)' },
    'AGAR MALWA': { kn: 'ಅಗರ ಮಲ್ವ (Agar Malwa)', hi: 'अगर मल्व (Agar Malwa)' },
    'AGRA': { kn: 'ಆಗ್ರಾ (Agra)', hi: 'आगरा (Agra)' },
    'AHMADABAD': { kn: 'ಅಹ್ಮದಬದ (Ahmadabad)', hi: 'अह्मदबद (Ahmadabad)' },
    'AHMEDNAGAR': { kn: 'ಅಹ್ಮೆದ್ನಗರ (Ahmednagar)', hi: 'अह्मेद्नगर (Ahmednagar)' },
    'AIZAWL': { kn: 'ಐಜವ್ಲ (Aizawl)', hi: 'ऐज़व्ल (Aizawl)' },
    'AJMER': { kn: 'ಅಜ್ಮೆರ (Ajmer)', hi: 'अज्मेर (Ajmer)' },
    'AKOLA': { kn: 'ಅಕೊಲ (Akola)', hi: 'अकोल (Akola)' },
    'ALAPPUZHA': { kn: 'ಅಲಪ್ಪುಜ್ಹ (Alappuzha)', hi: 'अलप्पुज़्ह (Alappuzha)' },
    'ALIGARH': { kn: 'ಅಲಿಗಢ (Aligarh)', hi: 'अलिगढ़ (Aligarh)' },
    'ALIRAJPUR': { kn: 'ಅಲಿರಜ್ಪುರ (Alirajpur)', hi: 'अलिरज्पुर (Alirajpur)' },
    'ALLAHABAD': { kn: 'ಅಲ್ಲಹಬದ (Allahabad)', hi: 'अल्लहबद (Allahabad)' },
    'ALMORA': { kn: 'ಅಲ್ಮೊರ (Almora)', hi: 'अल्मोर (Almora)' },
    'ALWAR': { kn: 'ಅಲ್ವರ (Alwar)', hi: 'अल्वर (Alwar)' },
    'AMBALA': { kn: 'ಅಮ್ಬಲ (Ambala)', hi: 'अम्बल (Ambala)' },
    'AMBEDKAR NAGAR': { kn: 'ಅಮ್ಬೆದ್ಕರ ನಗರ (Ambedkar Nagar)', hi: 'अम्बेद्कर नगर (Ambedkar Nagar)' },
    'AMETHI': { kn: 'ಅಮೆಥಿ (Amethi)', hi: 'अमेथि (Amethi)' },
    'AMRAVATI': { kn: 'ಅಮ್ರವತಿ (Amravati)', hi: 'अम्रवति (Amravati)' },
    'AMRELI': { kn: 'ಅಮ್ರೆಲಿ (Amreli)', hi: 'अम्रेलि (Amreli)' },
    'AMRITSAR': { kn: 'ಅಮೃತಸರ (Amritsar)', hi: 'अमृतसर (Amritsar)' },
    'AMROHA': { kn: 'ಅಮ್ರೊಹ (Amroha)', hi: 'अम्रोह (Amroha)' },
    'ANAND': { kn: 'ಅನನ್ದ (Anand)', hi: 'अनन्द (Anand)' },
    'ANANTAPUR': { kn: 'ಅನನ್ತಪುರ (Anantapur)', hi: 'अनन्तपुर (Anantapur)' },
    'ANANTNAG': { kn: 'ಅನನ್ತ್ನಗ (Anantnag)', hi: 'अनन्त्नग (Anantnag)' },
    'ANJAW': { kn: 'ಅನ್ಜವ (Anjaw)', hi: 'अन्जव (Anjaw)' },
    'ANUGUL': { kn: 'ಅನುಗುಲ (Anugul)', hi: 'अनुगुल (Anugul)' },
    'ANUPPUR': { kn: 'ಅನುಪ್ಪುರ (Anuppur)', hi: 'अनुप्पुर (Anuppur)' },
    'ARARIA': { kn: 'ಅರರಿ (Araria)', hi: 'अररि (Araria)' },
    'ARIYALUR': { kn: 'ಅರಿಯಲುರ (Ariyalur)', hi: 'अरियलुर (Ariyalur)' },
    'ARWAL': { kn: 'ಅರ್ವಲ (Arwal)', hi: 'अर्वल (Arwal)' },
    'ASHOKNAGAR': { kn: 'ಅಶೊಕ್ನಗರ (Ashoknagar)', hi: 'अशोक्नगर (Ashoknagar)' },
    'AURAIYA': { kn: 'ಔರೈಯ (Auraiya)', hi: 'औरैय (Auraiya)' },
    'AURANGABAD': { kn: 'ಔರಂಗಾಬಾದ್ (Aurangabad)', hi: 'औरंगाबाद (Aurangabad)' },
    'AZAMGARH': { kn: 'ಅಜಮ್ಗಢ (Azamgarh)', hi: 'अज़म्गढ़ (Azamgarh)' },
    'BADGAM': { kn: 'ಬದ್ಗಮ (Badgam)', hi: 'बद्गम (Badgam)' },
    'BAGALKOT': { kn: 'ಬಾಗಲಕೋಟೆ (Bagalkote)', hi: 'बागलकोट (Bagalkote)' },
    'BAGESHWAR': { kn: 'ಬಗೆಶ್ವರ (Bageshwar)', hi: 'बगेश्वर (Bageshwar)' },
    'BAGHPAT': { kn: 'ಬಘ್ಪತ (Baghpat)', hi: 'बघ्पत (Baghpat)' },
    'BAHRAICH': { kn: 'ಬಹ್ರೈಚ (Bahraich)', hi: 'बह्रैच (Bahraich)' },
    'BAKSA': { kn: 'ಬಕ್ಸ (Baksa)', hi: 'बक्स (Baksa)' },
    'BALAGHAT': { kn: 'ಬಲಘತ (Balaghat)', hi: 'बलघत (Balaghat)' },
    'BALANGIR': { kn: 'ಬಲಂಗಿರ (Balangir)', hi: 'बलंगिर (Balangir)' },
    'BALESHWAR': { kn: 'ಬಲೆಶ್ವರ (Baleshwar)', hi: 'बलेश्वर (Baleshwar)' },
    'BALLIA': { kn: 'ಬಲ್ಲಿ (Ballia)', hi: 'बल्लि (Ballia)' },
    'BALOD': { kn: 'ಬಲೊದ (Balod)', hi: 'बलोद (Balod)' },
    'BALODA BAZAR': { kn: 'ಬಲೊದ ಬಜರ (Baloda Bazar)', hi: 'बलोद बज़र (Baloda Bazar)' },
    'BALRAMPUR': { kn: 'ಬಲ್ರಮ್ಪುರ (Balrampur)', hi: 'बल्रम्पुर (Balrampur)' },
    'BANAS KANTHA': { kn: 'ಬನಸ ಕನ್ಥ (Banas Kantha)', hi: 'बनस कन्थ (Banas Kantha)' },
    'BANDA': { kn: 'ಬನ್ದ (Banda)', hi: 'बन्द (Banda)' },
    'BANDIPORA': { kn: 'ಬನ್ದಿಪೊರ (Bandipora)', hi: 'बन्दिपोर (Bandipora)' },
    'BANGALORE RURAL': { kn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ (Bengaluru Rural)', hi: 'बेंगलुरु ग्रामीण (Bengaluru Rural)' },
    'BANKA': { kn: 'ಬನ್ಕ (Banka)', hi: 'बन्क (Banka)' },
    'BANKURA': { kn: 'ಬನ್ಕುರ (Bankura)', hi: 'बन्कुर (Bankura)' },
    'BANSWARA': { kn: 'ಬನ್ಸ್ವರ (Banswara)', hi: 'बन्स्वर (Banswara)' },
    'BARABANKI': { kn: 'ಬರಬನ್ಕಿ (Barabanki)', hi: 'बरबन्कि (Barabanki)' },
    'BARAMULLA': { kn: 'ಬರಮುಲ್ಲ (Baramulla)', hi: 'बरमुल्ल (Baramulla)' },
    'BARAN': { kn: 'ಬರನ (Baran)', hi: 'बरन (Baran)' },
    'BARDHAMAN': { kn: 'ಬರ್ಧಮನ (Bardhaman)', hi: 'बर्धमन (Bardhaman)' },
    'BAREILLY': { kn: 'ಬರೆಿಲ್ಲ್ಯ (Bareilly)', hi: 'बरेिल्ल्य (Bareilly)' },
    'BARGARH': { kn: 'ಬರ್ಗಢ (Bargarh)', hi: 'बर्गढ़ (Bargarh)' },
    'BARMER': { kn: 'ಬರ್ಮೆರ (Barmer)', hi: 'बर्मेर (Barmer)' },
    'BARNALA': { kn: 'ಬರ್ನಲ (Barnala)', hi: 'बर्नल (Barnala)' },
    'BARPETA': { kn: 'ಬರ್ಪೆತ (Barpeta)', hi: 'बर्पेत (Barpeta)' },
    'BARWANI': { kn: 'ಬರ್ವನಿ (Barwani)', hi: 'बर्वनि (Barwani)' },
    'BASTAR': { kn: 'ಬಸ್ತರ (Bastar)', hi: 'बस्तर (Bastar)' },
    'BASTI': { kn: 'ಬಸ್ತಿ (Basti)', hi: 'बस्ति (Basti)' },
    'BATHINDA': { kn: 'ಬಥಿನ್ದ (Bathinda)', hi: 'बथिन्द (Bathinda)' },
    'BEED': { kn: 'ಬೀದ (Beed)', hi: 'बीद (Beed)' },
    'BEGUSARAI': { kn: 'ಬೆಗುಸರೈ (Begusarai)', hi: 'बेगुसरै (Begusarai)' },
    'BELGAUM': { kn: 'ಬೆಳಗಾವಿ (Belagavi)', hi: 'बेलगावी / बेलगाम (Belagavi)' },
    'BELLARY': { kn: 'ಬಳ್ಳಾರಿ (Ballari)', hi: 'ಬल्लारी / बेल्लारी (Ballari)' },
    'BEMETARA': { kn: 'ಬೆಮೆತರ (Bemetara)', hi: 'बेमेतर (Bemetara)' },
    'BENGALURU URBAN': { kn: 'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)', hi: 'बेंगलुरु शहरी (Bengaluru Urban)' },
    'BETUL': { kn: 'ಬೆತುಲ (Betul)', hi: 'बेतुल (Betul)' },
    'BHADRAK': { kn: 'ಭದ್ರಕ (Bhadrak)', hi: 'भद्रक (Bhadrak)' },
    'BHAGALPUR': { kn: 'ಭಗಲ್ಪುರ (Bhagalpur)', hi: 'भगल्पुर (Bhagalpur)' },
    'BHANDARA': { kn: 'ಭನ್ದರ (Bhandara)', hi: 'भन्दर (Bhandara)' },
    'BHARATPUR': { kn: 'ಭರತ್ಪುರ (Bharatpur)', hi: 'भरत्पुर (Bharatpur)' },
    'BHARUCH': { kn: 'ಭರುಚ (Bharuch)', hi: 'भरुच (Bharuch)' },
    'BHAVNAGAR': { kn: 'ಭವ್ನಗರ (Bhavnagar)', hi: 'भव्नगर (Bhavnagar)' },
    'BHILWARA': { kn: 'ಭಿಲ್ವರ (Bhilwara)', hi: 'भिल्वर (Bhilwara)' },
    'BHIND': { kn: 'ಭಿನ್ದ (Bhind)', hi: 'भिन्द (Bhind)' },
    'BHIWANI': { kn: 'ಭಿವನಿ (Bhiwani)', hi: 'भिवनि (Bhiwani)' },
    'BHOJPUR': { kn: 'ಭೊಜ್ಪುರ (Bhojpur)', hi: 'भोज्पुर (Bhojpur)' },
    'BHOPAL': { kn: 'ಭೋಪಾಲ್ (Bhopal)', hi: 'भोपाल (Bhopal)' },
    'BIDAR': { kn: 'ಬೀದರ್ (Bidar)', hi: 'बीदर (Bidar)' },
    'BIJAPUR': { kn: 'ವಿಜಯಪುರ (Vijayapura / Bijapur)', hi: 'विजयपुरा / बीजापुर (Vijayapura)' },
    'BIJNOR': { kn: 'ಬಿಜ್ನೊರ (Bijnor)', hi: 'बिज्नोर (Bijnor)' },
    'BIKANER': { kn: 'ಬಿಕನೆರ (Bikaner)', hi: 'बिकनेर (Bikaner)' },
    'BILASPUR': { kn: 'ಬಿಲಸ್ಪುರ (Bilaspur)', hi: 'बिलस्पुर (Bilaspur)' },
    'BIRBHUM': { kn: 'ಬಿರ್ಭುಮ (Birbhum)', hi: 'बिर्भुम (Birbhum)' },
    'BISHNUPUR': { kn: 'ಬಿಶ್ನುಪುರ (Bishnupur)', hi: 'बिश्नुपुर (Bishnupur)' },
    'BOKARO': { kn: 'ಬೊಕರೊ (Bokaro)', hi: 'बोकरो (Bokaro)' },
    'BONGAIGAON': { kn: 'ಬೊಂಗೈಗಒನ (Bongaigaon)', hi: 'बोंगैगओन (Bongaigaon)' },
    'BOUDH': { kn: 'ಬೊುಧ (Boudh)', hi: 'बोुध (Boudh)' },
    'BUDAUN': { kn: 'ಬುದೌನ (Budaun)', hi: 'बुदौन (Budaun)' },
    'BULANDSHAHR': { kn: 'ಬುಲನ್ದ್ಶಹ್ರ (Bulandshahr)', hi: 'बुलन्द्शह्र (Bulandshahr)' },
    'BULDHANA': { kn: 'ಬುಲ್ಧನ (Buldhana)', hi: 'बुल्धन (Buldhana)' },
    'BUNDI': { kn: 'ಬುನ್ದಿ (Bundi)', hi: 'बुन्दि (Bundi)' },
    'BURHANPUR': { kn: 'ಬುಢನ್ಪುರ (Burhanpur)', hi: 'बुढ़न्पुर (Burhanpur)' },
    'BUXAR': { kn: 'ಬುಕ್ಸ್ರ (Buxar)', hi: 'बुक्सर (Buxar)' },
    'CACHAR': { kn: 'ಕಚರ (Cachar)', hi: 'कचर (Cachar)' },
    'CHAMARAJANAGAR': { kn: 'ಚಾಮರಾಜನಗರ (Chamarajanagar)', hi: 'चामराजनगर (Chamarajanagar)' },
    'CHAMBA': { kn: 'ಚಮ್ಬ (Chamba)', hi: 'चम्ब (Chamba)' },
    'CHAMOLI': { kn: 'ಚಮೊಲಿ (Chamoli)', hi: 'चमोलि (Chamoli)' },
    'CHAMPAWAT': { kn: 'ಚಮ್ಪವತ (Champawat)', hi: 'चम्पवत (Champawat)' },
    'CHAMPHAI': { kn: 'ಚಮ್ಫೈ (Champhai)', hi: 'चम्फै (Champhai)' },
    'CHANDAULI': { kn: 'ಚನ್ದೌಲಿ (Chandauli)', hi: 'चन्दौलि (Chandauli)' },
    'CHANDEL': { kn: 'ಚನ್ದೆಲ (Chandel)', hi: 'चन्देल (Chandel)' },
    'CHANDIGARH': { kn: 'ಚನ್ದಿಗಢ (Chandigarh)', hi: 'चन्दिगढ़ (Chandigarh)' },
    'CHANDRAPUR': { kn: 'ಚನ್ದ್ರಪುರ (Chandrapur)', hi: 'चन्द्रपुर (Chandrapur)' },
    'CHANGLANG': { kn: 'ಚಂಗ್ಲಂಗ (Changlang)', hi: 'चङ्लंग (Changlang)' },
    'CHATRA': { kn: 'ಚತ್ರ (Chatra)', hi: 'चत्र (Chatra)' },
    'CHHATARPUR': { kn: 'ಚ್ಹತರ್ಪುರ (Chhatarpur)', hi: 'च्हतर्पुर (Chhatarpur)' },
    'CHHINDWARA': { kn: 'ಚ್ಹಿನ್ದ್ವರ (Chhindwara)', hi: 'च्हिन्द्वर (Chhindwara)' },
    'CHIKBALLAPUR': { kn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ (Chikkaballapura)', hi: 'चिक्काबल्लापुर (Chikkaballapura)' },
    'CHIKMAGALUR': { kn: 'ಚಿಕ್ಕಮಗಳೂರು (Chikkamagaluru)', hi: 'चिकमगलूर (Chikkamagaluru)' },
    'CHIRANG': { kn: 'ಚಿರಂಗ (Chirang)', hi: 'चिरंग (Chirang)' },
    'CHITRADURGA': { kn: 'ಚಿತ್ರದುರ್ಗ (Chitradurga)', hi: 'चित्रदुर्ग (Chitradurga)' },
    'CHITRAKOOT': { kn: 'ಚಿತ್ರಕೂತ (Chitrakoot)', hi: 'चित्रकूत (Chitrakoot)' },
    'CHITTOOR': { kn: 'ಚಿತ್ತೂರ (Chittoor)', hi: 'चित्तूर (Chittoor)' },
    'CHITTORGARH': { kn: 'ಚಿತ್ತೊರ್ಗಢ (Chittorgarh)', hi: 'चित्तोर्गढ़ (Chittorgarh)' },
    'CHURACHANDPUR': { kn: 'ಚುರಚನ್ದ್ಪುರ (Churachandpur)', hi: 'चुरचन्द्पुर (Churachandpur)' },
    'CHURU': { kn: 'ಚುರು (Churu)', hi: 'चुरु (Churu)' },
    'COIMBATORE': { kn: 'ಕೊಯಮತ್ತೂರು (Coimbatore)', hi: 'कोयंबटूर (Coimbatore)' },
    'COOCHBEHAR': { kn: 'ಕೂಚ್ಬೆಹರ (Coochbehar)', hi: 'कूच्बेहर (Coochbehar)' },
    'CUDDALORE': { kn: 'ಕುದ್ದಲೊರೆ (Cuddalore)', hi: 'कुद्दलोरे (Cuddalore)' },
    'CUTTACK': { kn: 'ಕಟಕ್ (Cuttack)', hi: 'कटक (Cuttack)' },
    'DADRA AND NAGAR HAVELI': { kn: 'ದದ್ರ ಅನ್ದ ನಗರ ಹವೆಲಿ (Dadra And Nagar Haveli)', hi: 'दद्र अन्द नगर हवेलि (Dadra And Nagar Haveli)' },
    'DAKSHIN KANNAD': { kn: 'ದಕ್ಷಿಣ ಕನ್ನಡ (Dakshina Kannada)', hi: 'दक्षिण कन्नड़ (Dakshina Kannada)' },
    'DAMOH': { kn: 'ದಮೊಹ (Damoh)', hi: 'दमोह (Damoh)' },
    'DANG': { kn: 'ದಂಗ (Dang)', hi: 'दंग (Dang)' },
    'DANTEWADA': { kn: 'ದನ್ತೆವದ (Dantewada)', hi: 'दन्तेवद (Dantewada)' },
    'DARBHANGA': { kn: 'ದರ್ಭಂಗ (Darbhanga)', hi: 'दर्भंग (Darbhanga)' },
    'DARJEELING': { kn: 'ದರ್ಜೀಲಿಂಗ (Darjeeling)', hi: 'दर्जीलिंग (Darjeeling)' },
    'DARRANG': { kn: 'ದರ್ರಂಗ (Darrang)', hi: 'दर्रंग (Darrang)' },
    'DATIA': { kn: 'ದತಿ (Datia)', hi: 'दति (Datia)' },
    'DAUSA': { kn: 'ದೌಸ (Dausa)', hi: 'दौस (Dausa)' },
    'DAVANGERE': { kn: 'ದಾವಣಗೆರೆ (Davanagere)', hi: 'दावणगेरे (Davanagere)' },
    'DEHRADUN': { kn: 'ದೆಹ್ರದುನ (Dehradun)', hi: 'देह्रदुन (Dehradun)' },
    'DEOGARH': { kn: 'ದೆೊಗಢ (Deogarh)', hi: 'देोगढ़ (Deogarh)' },
    'DEOGHAR': { kn: 'ದೆೊಘರ (Deoghar)', hi: 'देोघर (Deoghar)' },
    'DEORIA': { kn: 'ದೆೊರಿ (Deoria)', hi: 'देोरि (Deoria)' },
    'DEWAS': { kn: 'ದೆವಸ (Dewas)', hi: 'देवस (Dewas)' },
    'DHALAI': { kn: 'ಧಲೈ (Dhalai)', hi: 'धलै (Dhalai)' },
    'DHAMTARI': { kn: 'ಧಮ್ತರಿ (Dhamtari)', hi: 'धम्तरि (Dhamtari)' },
    'DHANBAD': { kn: 'ಧನ್ಬದ (Dhanbad)', hi: 'धन्बद (Dhanbad)' },
    'DHAR': { kn: 'ಧರ (Dhar)', hi: 'धर (Dhar)' },
    'DHARMAPURI': { kn: 'ಧರ್ಮಪುರಿ (Dharmapuri)', hi: 'धर्मपुरि (Dharmapuri)' },
    'DHARWAD': { kn: 'ಧಾರವಾಡ (Dharwad)', hi: 'धारवाड़ (Dharwad)' },
    'DHEMAJI': { kn: 'ಧೆಮಜಿ (Dhemaji)', hi: 'धेमजि (Dhemaji)' },
    'DHENKANAL': { kn: 'ಧೆನ್ಕನಲ (Dhenkanal)', hi: 'धेन्कनल (Dhenkanal)' },
    'DHOLPUR': { kn: 'ಧೊಲ್ಪುರ (Dholpur)', hi: 'धोल्पुर (Dholpur)' },
    'DHUBRI': { kn: 'ಧುಬ್ರಿ (Dhubri)', hi: 'धुब्रि (Dhubri)' },
    'DHULE': { kn: 'ಧುಲೆ (Dhule)', hi: 'धुले (Dhule)' },
    'DIBANG VALLEY': { kn: 'ದಿಬಂಗ ಕಣಿವೆ (Dibang Valley)', hi: 'दिबंग घाटी (Dibang Valley)' },
    'DIBRUGARH': { kn: 'ದಿಬ್ರುಗಢ (Dibrugarh)', hi: 'दिब्रुगढ़ (Dibrugarh)' },
    'DIMA HASAO': { kn: 'ದಿಮ ಹಸಒ (Dima Hasao)', hi: 'दिम हसओ (Dima Hasao)' },
    'DIMAPUR': { kn: 'ದಿಮಪುರ (Dimapur)', hi: 'दिमपुर (Dimapur)' },
    'DINAJPUR DAKSHIN': { kn: 'ದಿನಜ್ಪುರ ದಕ್ಶಿನ (Dinajpur Dakshin)', hi: 'दिनज्पुर दक्शिन (Dinajpur Dakshin)' },
    'DINAJPUR UTTAR': { kn: 'ದಿನಜ್ಪುರ ಉತ್ತರ (Dinajpur Uttar)', hi: 'दिनज्पुर उत्तर (Dinajpur Uttar)' },
    'DINDIGUL': { kn: 'ದಿನ್ದಿಗುಲ (Dindigul)', hi: 'दिन्दिगुल (Dindigul)' },
    'DINDORI': { kn: 'ದಿನ್ದೊರಿ (Dindori)', hi: 'दिन्दोरि (Dindori)' },
    'DODA': { kn: 'ದೊದ (Doda)', hi: 'दोद (Doda)' },
    'DOHAD': { kn: 'ದೊಹದ (Dohad)', hi: 'दोहद (Dohad)' },
    'DUMKA': { kn: 'ದುಮ್ಕ (Dumka)', hi: 'दुम्क (Dumka)' },
    'DUNGARPUR': { kn: 'ದುಂಗರ್ಪುರ (Dungarpur)', hi: 'दुंगर्पुर (Dungarpur)' },
    'DURG': { kn: 'ದುರ್ಗ (Durg)', hi: 'दुर्ग (Durg)' },
    'EAST DISTRICT': { kn: 'ಪೂರ್ವ ಜಿಲ್ಲೆ (East District)', hi: 'पूर्व जिला (East District)' },
    'EAST GARO HILLS': { kn: 'ಪೂರ್ವ ಗರೊ ಬೆಟ್ಟಗಳು (East Garo Hills)', hi: 'पूर्व गरो पहाड़ियां (East Garo Hills)' },
    'EAST GODAVARI': { kn: 'ಪೂರ್ವ ಗೊದವರಿ (East Godavari)', hi: 'पूर्व गोदवरि (East Godavari)' },
    'EAST JAINTIA HILLS': { kn: 'ಪೂರ್ವ ಜೈನ್ತಿ ಬೆಟ್ಟಗಳು (East Jaintia Hills)', hi: 'पूर्व जैन्ति पहाड़ियां (East Jaintia Hills)' },
    'EAST KAMENG': { kn: 'ಪೂರ್ವ ಕಮೆಂಗ (East Kameng)', hi: 'पूर्व कमेंग (East Kameng)' },
    'EAST KHASI HILLS': { kn: 'ಪೂರ್ವ ಖಸಿ ಬೆಟ್ಟಗಳು (East Khasi Hills)', hi: 'पूर्व खसि पहाड़ियां (East Khasi Hills)' },
    'EAST SIANG': { kn: 'ಪೂರ್ವ ಸಿಂಗ (East Siang)', hi: 'पूर्व सिंग (East Siang)' },
    'EAST SINGHBUM': { kn: 'ಪೂರ್ವ ಸಿಂಗ್ಹ್ಬುಮ (East Singhbum)', hi: 'पूर्व सिङ्ह्बुम (East Singhbum)' },
    'ERNAKULAM': { kn: 'ಎರ್ನಕುಲಮ (Ernakulam)', hi: 'एर्नकुलम (Ernakulam)' },
    'ERODE': { kn: 'ಎರೊದೆ (Erode)', hi: 'एरोदे (Erode)' },
    'ETAH': { kn: 'ಎತಹ (Etah)', hi: 'एतह (Etah)' },
    'ETAWAH': { kn: 'ಎತವಹ (Etawah)', hi: 'एतवह (Etawah)' },
    'FAIZABAD': { kn: 'ಫೈಜಬದ (Faizabad)', hi: 'फ़ैज़बद (Faizabad)' },
    'FARIDABAD': { kn: 'ಫರಿದಬದ (Faridabad)', hi: 'फ़रिदबद (Faridabad)' },
    'FARIDKOT': { kn: 'ಫರಿದ್ಕೊತ (Faridkot)', hi: 'फ़रिद्कोत (Faridkot)' },
    'FARRUKHABAD': { kn: 'ಫರ್ರುಖಬದ (Farrukhabad)', hi: 'फ़र्रुखबद (Farrukhabad)' },
    'FATEHABAD': { kn: 'ಫತೆಹಬದ (Fatehabad)', hi: 'फ़तेहबद (Fatehabad)' },
    'FATEHGARH SAHIB': { kn: 'ಫತೆಹ್ಗಢ ಸಹಿಬ (Fatehgarh Sahib)', hi: 'फ़तेह्गढ़ सहिब (Fatehgarh Sahib)' },
    'FATEHPUR': { kn: 'ಫತೆಹ್ಪುರ (Fatehpur)', hi: 'फ़तेह्पुर (Fatehpur)' },
    'FAZILKA': { kn: 'ಫಜಿಲ್ಕ (Fazilka)', hi: 'फ़ज़िल्क (Fazilka)' },
    'FIROZABAD': { kn: 'ಫಿರೊಜಬದ (Firozabad)', hi: 'फ़िरोज़बद (Firozabad)' },
    'FIROZEPUR': { kn: 'ಫಿರೊಜೆಪುರ (Firozepur)', hi: 'फ़िरोज़ेपुर (Firozepur)' },
    'GADAG': { kn: 'ಗದಗ (Gadag)', hi: 'गदग (Gadag)' },
    'GADCHIROLI': { kn: 'ಗದ್ಚಿರೊಲಿ (Gadchiroli)', hi: 'गद्चिरोलि (Gadchiroli)' },
    'GAJAPATI': { kn: 'ಗಜಪತಿ (Gajapati)', hi: 'गजपति (Gajapati)' },
    'GANDERBAL': { kn: 'ಗನ್ದೆರ್ಬಲ (Ganderbal)', hi: 'गन्देर्बल (Ganderbal)' },
    'GANDHINAGAR': { kn: 'ಗನ್ಧಿನಗರ (Gandhinagar)', hi: 'गन्धिनगर (Gandhinagar)' },
    'GANGANAGAR': { kn: 'ಗಂಗನಗರ (Ganganagar)', hi: 'गंगनगर (Ganganagar)' },
    'GANJAM': { kn: 'ಗನ್ಜಮ (Ganjam)', hi: 'गन्जम (Ganjam)' },
    'GARHWA': { kn: 'ಗರ್ವ (Garhwa)', hi: 'गढ़्व (Garhwa)' },
    'GARIYABAND': { kn: 'ಗರಿಯಬನ್ದ (Gariyaband)', hi: 'गरियबन्द (Gariyaband)' },
    'GAUTAM BUDDHA NAGAR': { kn: 'ಗೌತಮ ಬುದ್ಧ ನಗರ (Gautam Buddha Nagar)', hi: 'गौतम बुद्ध नगर (Gautam Buddha Nagar)' },
    'GAYA': { kn: 'ಗಯಾ (Gaya)', hi: 'गया (Gaya)' },
    'GHAZIABAD': { kn: 'ಘಜಿಬದ (Ghaziabad)', hi: 'घज़िबद (Ghaziabad)' },
    'GHAZIPUR': { kn: 'ಘಜಿಪುರ (Ghazipur)', hi: 'घज़िपुर (Ghazipur)' },
    'GIRIDIH': { kn: 'ಗಿರಿದಿಹ (Giridih)', hi: 'गिरिदिह (Giridih)' },
    'GOALPARA': { kn: 'ಗೊಲ್ಪರ (Goalpara)', hi: 'गोल्पर (Goalpara)' },
    'GODDA': { kn: 'ಗೊದ್ದ (Godda)', hi: 'गोद्द (Godda)' },
    'GOLAGHAT': { kn: 'ಗೊಲಘತ (Golaghat)', hi: 'गोलघत (Golaghat)' },
    'GOMATI': { kn: 'ಗೊಮತಿ (Gomati)', hi: 'गोमति (Gomati)' },
    'GONDA': { kn: 'ಗೊನ್ದ (Gonda)', hi: 'गोन्द (Gonda)' },
    'GONDIA': { kn: 'ಗೊನ್ದಿ (Gondia)', hi: 'गोन्दि (Gondia)' },
    'GOPALGANJ': { kn: 'ಗೊಪಲ್ಗನ್ಜ (Gopalganj)', hi: 'गोपल्गन्ज (Gopalganj)' },
    'GORAKHPUR': { kn: 'ಗೊರಖ್ಪುರ (Gorakhpur)', hi: 'गोरख्पुर (Gorakhpur)' },
    'GULBARGA': { kn: 'ಕಲಬುರಗಿ (Kalaburagi / Gulbarga)', hi: 'कलबुर्गी / गुलबर्गा (Kalaburagi)' },
    'GUMLA': { kn: 'ಗುಮ್ಲ (Gumla)', hi: 'गुम्ल (Gumla)' },
    'GUNA': { kn: 'ಗುನ (Guna)', hi: 'गुन (Guna)' },
    'GUNTUR': { kn: 'ಗುಂಟೂರು (Guntur)', hi: 'गुंटूर (Guntur)' },
    'GURDASPUR': { kn: 'ಗುರ್ದಸ್ಪುರ (Gurdaspur)', hi: 'गुर्दस्पुर (Gurdaspur)' },
    'GURGAON': { kn: 'ಗುರ್ಗಒನ (Gurgaon)', hi: 'गुर्गओन (Gurgaon)' },
    'GWALIOR': { kn: 'ಗ್ವಾಲಿಯರ್ (Gwalior)', hi: 'ग्वालियर (Gwalior)' },
    'HAILAKANDI': { kn: 'ಹೈಲಕನ್ದಿ (Hailakandi)', hi: 'हैलकन्दि (Hailakandi)' },
    'HAMIRPUR': { kn: 'ಹಮಿರ್ಪುರ (Hamirpur)', hi: 'हमिर्पुर (Hamirpur)' },
    'HANUMANGARH': { kn: 'ಹನುಮಂಗಢ (Hanumangarh)', hi: 'हनुमंगढ़ (Hanumangarh)' },
    'HAPUR': { kn: 'ಹಪುರ (Hapur)', hi: 'हपुर (Hapur)' },
    'HARDA': { kn: 'ಹರ್ದ (Harda)', hi: 'हर्द (Harda)' },
    'HARDOI': { kn: 'ಹರ್ದೊಿ (Hardoi)', hi: 'हर्दोि (Hardoi)' },
    'HARIDWAR': { kn: 'ಹರಿದ್ವರ (Haridwar)', hi: 'हरिद्वर (Haridwar)' },
    'HASSAN': { kn: 'ಹಾಸನ (Hassan)', hi: 'हासन (Hassan)' },
    'HATHRAS': { kn: 'ಹತ್ರಸ (Hathras)', hi: 'हथ्रस (Hathras)' },
    'HAVERI': { kn: 'ಹಾವೇರಿ (Haveri)', hi: 'हावेरी (Haveri)' },
    'HAZARIBAGH': { kn: 'ಹಜರಿಬಘ (Hazaribagh)', hi: 'हज़रिबघ (Hazaribagh)' },
    'HINGOLI': { kn: 'ಹಿಂಗೊಲಿ (Hingoli)', hi: 'हिंगोलि (Hingoli)' },
    'HISAR': { kn: 'ಹಿಸರ (Hisar)', hi: 'हिसर (Hisar)' },
    'HOOGHLY': { kn: 'ಹೂಘ್ಲ್ಯ (Hooghly)', hi: 'हूघ्ल्य (Hooghly)' },
    'HOSHANGABAD': { kn: 'ಹೊಶಂಗಬದ (Hoshangabad)', hi: 'होशंगबद (Hoshangabad)' },
    'HOSHIARPUR': { kn: 'ಹೊಶಿರ್ಪುರ (Hoshiarpur)', hi: 'होशिर्पुर (Hoshiarpur)' },
    'HOWRAH': { kn: 'ಹೌರಾ (Howrah)', hi: 'हावड़ा (Howrah)' },
    'HYDERABAD': { kn: 'ಹೈದರಾಬಾದ್ (Hyderabad)', hi: 'हैदराबाद (Hyderabad)' },
    'IDUKKI': { kn: 'ಇದುಕ್ಕಿ (Idukki)', hi: 'इदुक्कि (Idukki)' },
    'IMPHAL EAST': { kn: 'ಇಮ್ಫಲ ಪೂರ್ವ (Imphal East)', hi: 'इम्फल पूर्व (Imphal East)' },
    'IMPHAL WEST': { kn: 'ಇಮ್ಫಲ ಪಶ್ಚಿಮ (Imphal West)', hi: 'इम्फल पश्चिम (Imphal West)' },
    'INDORE': { kn: 'ಇಂದೋರ್ (Indore)', hi: 'इंदौर (Indore)' },
    'JABALPUR': { kn: 'ಜಬಲ್ಪುರ (Jabalpur)', hi: 'जबल्पुर (Jabalpur)' },
    'JAGATSINGHAPUR': { kn: 'ಜಗತ್ಸಿಂಗ್ಹಪುರ (Jagatsinghapur)', hi: 'जगत्सिङ्हपुर (Jagatsinghapur)' },
    'JAIPUR': { kn: 'ಜೈಪುರ (Jaipur)', hi: 'जयपुर (Jaipur)' },
    'JAISALMER': { kn: 'ಜೈಸಲ್ಮೆರ (Jaisalmer)', hi: 'जैसल्मेर (Jaisalmer)' },
    'JAJAPUR': { kn: 'ಜಜಪುರ (Jajapur)', hi: 'जजपुर (Jajapur)' },
    'JALANDHAR': { kn: 'ಜಲಂಧರ್ (Jalandhar)', hi: 'जालंधर (Jalandhar)' },
    'JALAUN': { kn: 'ಜಲೌನ (Jalaun)', hi: 'जलौन (Jalaun)' },
    'JALGAON': { kn: 'ಜಲ್ಗಒನ (Jalgaon)', hi: 'जल्गओन (Jalgaon)' },
    'JALNA': { kn: 'ಜಲ್ನ (Jalna)', hi: 'जल्न (Jalna)' },
    'JALORE': { kn: 'ಜಲೊರೆ (Jalore)', hi: 'जलोरे (Jalore)' },
    'JALPAIGURI': { kn: 'ಜಲ್ಪೈಗುರಿ (Jalpaiguri)', hi: 'जल्पैगुरि (Jalpaiguri)' },
    'JAMMU': { kn: 'ಜಮ್ಮು (Jammu)', hi: 'जम्मु (Jammu)' },
    'JAMNAGAR': { kn: 'ಜಮ್ನಗರ (Jamnagar)', hi: 'जम्नगर (Jamnagar)' },
    'JAMTARA': { kn: 'ಜಮ್ತರ (Jamtara)', hi: 'जम्तर (Jamtara)' },
    'JAMUI': { kn: 'ಜಮುಿ (Jamui)', hi: 'जमुि (Jamui)' },
    'JANJGIR-CHAMPA': { kn: 'ಜನ್ಜ್ಗಿರ-ಚಮ್ಪ (Janjgir-Champa)', hi: 'जन्ज्गिर-चम्प (Janjgir-Champa)' },
    'JASHPUR': { kn: 'ಜಶ್ಪುರ (Jashpur)', hi: 'जश्पुर (Jashpur)' },
    'JAUNPUR': { kn: 'ಜೌನ್ಪುರ (Jaunpur)', hi: 'जौन्पुर (Jaunpur)' },
    'JEHANABAD': { kn: 'ಜೆಹನಬದ (Jehanabad)', hi: 'जेहनबद (Jehanabad)' },
    'JHABUA': { kn: 'ಝಬು (Jhabua)', hi: 'झबु (Jhabua)' },
    'JHAJJAR': { kn: 'ಝಜ್ಜರ (Jhajjar)', hi: 'झज्जर (Jhajjar)' },
    'JHALAWAR': { kn: 'ಝಲವರ (Jhalawar)', hi: 'झलवर (Jhalawar)' },
    'JHANSI': { kn: 'ಝನ್ಸಿ (Jhansi)', hi: 'झन्सि (Jhansi)' },
    'JHARSUGUDA': { kn: 'ಝರ್ಸುಗುದ (Jharsuguda)', hi: 'झर्सुगुद (Jharsuguda)' },
    'JHUNJHUNU': { kn: 'ಝುನ್ಝುನು (Jhunjhunu)', hi: 'झुन्झुनु (Jhunjhunu)' },
    'JIND': { kn: 'ಜಿನ್ದ (Jind)', hi: 'जिन्द (Jind)' },
    'JODHPUR': { kn: 'ಜೋಧ್‌ಪುರ (Jodhpur)', hi: 'जोधपुर (Jodhpur)' },
    'JORHAT': { kn: 'ಜೊಢತ (Jorhat)', hi: 'जोढ़त (Jorhat)' },
    'JUNAGADH': { kn: 'ಜುನಗಧ (Junagadh)', hi: 'जुनगध (Junagadh)' },
    'KABIRDHAM': { kn: 'ಕಬಿರ್ಧಮ (Kabirdham)', hi: 'कबिर्धम (Kabirdham)' },
    'KACHCHH': { kn: 'ಕಚ್ಚ್ಹ (Kachchh)', hi: 'कच्च्ह (Kachchh)' },
    'KADAPA': { kn: 'ಕದಪ (Kadapa)', hi: 'कदप (Kadapa)' },
    'KAIMUR (BHABUA)': { kn: 'ಕೈಮುರ (ಭಬು) (Kaimur (Bhabua))', hi: 'कैमुर (भबु) (Kaimur (Bhabua))' },
    'KAITHAL': { kn: 'ಕೈಥಲ (Kaithal)', hi: 'कैथल (Kaithal)' },
    'KALAHANDI': { kn: 'ಕಲಹನ್ದಿ (Kalahandi)', hi: 'कलहन्दि (Kalahandi)' },
    'KAMRUP': { kn: 'ಕಮ್ರುಪ (Kamrup)', hi: 'कम्रुप (Kamrup)' },
    'KAMRUP METRO': { kn: 'ಕಮ್ರುಪ ಮೆತ್ರೊ (Kamrup Metro)', hi: 'कम्रुप मेत्रो (Kamrup Metro)' },
    'KANCHIPURAM': { kn: 'ಕನ್ಚಿಪುರಮ (Kanchipuram)', hi: 'कन्चिपुरम (Kanchipuram)' },
    'KANDHAMAL': { kn: 'ಕನ್ಧಮಲ (Kandhamal)', hi: 'कन्धमल (Kandhamal)' },
    'KANGRA': { kn: 'ಕಂಗ್ರ (Kangra)', hi: 'कङ्र (Kangra)' },
    'KANKER': { kn: 'ಕನ್ಕೆರ (Kanker)', hi: 'कन्केर (Kanker)' },
    'KANNAUJ': { kn: 'ಕನ್ನೌಜ (Kannauj)', hi: 'कन्नौज (Kannauj)' },
    'KANNIYAKUMARI': { kn: 'ಕನ್ನಿಯಕುಮರಿ (Kanniyakumari)', hi: 'कन्नियकुमरि (Kanniyakumari)' },
    'KANNUR': { kn: 'ಕನ್ನುರ (Kannur)', hi: 'कन्नुर (Kannur)' },
    'KANPUR DEHAT': { kn: 'ಕನ್ಪುರ ದೆಹತ (Kanpur Dehat)', hi: 'कन्पुर देहत (Kanpur Dehat)' },
    'KANPUR NAGAR': { kn: 'ಕನ್ಪುರ ನಗರ (Kanpur Nagar)', hi: 'कन्पुर नगर (Kanpur Nagar)' },
    'KAPURTHALA': { kn: 'ಕಪುರ್ಥಲ (Kapurthala)', hi: 'कपुर्थल (Kapurthala)' },
    'KARAIKAL': { kn: 'ಕರೈಕಲ (Karaikal)', hi: 'करैकल (Karaikal)' },
    'KARAULI': { kn: 'ಕರೌಲಿ (Karauli)', hi: 'करौलि (Karauli)' },
    'KARBI ANGLONG': { kn: 'ಕರ್ಬಿ ಅಂಗ್ಲೊಂಗ (Karbi Anglong)', hi: 'कर्बि अङ्लोंग (Karbi Anglong)' },
    'KARGIL': { kn: 'ಕರ್ಗಿಲ (Kargil)', hi: 'कर्गिल (Kargil)' },
    'KARIMGANJ': { kn: 'ಕರಿಮ್ಗನ್ಜ (Karimganj)', hi: 'करिम्गन्ज (Karimganj)' },
    'KARIMNAGAR': { kn: 'ಕರಿಮ್ನಗರ (Karimnagar)', hi: 'करिम्नगर (Karimnagar)' },
    'KARNAL': { kn: 'ಕರ್ನಲ (Karnal)', hi: 'कर्नल (Karnal)' },
    'KARUR': { kn: 'ಕರುರ (Karur)', hi: 'करुर (Karur)' },
    'KASARAGOD': { kn: 'ಕಸರಗೊದ (Kasaragod)', hi: 'कसरगोद (Kasaragod)' },
    'KASGANJ': { kn: 'ಕಸ್ಗನ್ಜ (Kasganj)', hi: 'कस्गन्ज (Kasganj)' },
    'KATHUA': { kn: 'ಕಥು (Kathua)', hi: 'कथु (Kathua)' },
    'KATIHAR': { kn: 'ಕತಿಹರ (Katihar)', hi: 'कतिहर (Katihar)' },
    'KATNI': { kn: 'ಕತ್ನಿ (Katni)', hi: 'कत्नि (Katni)' },
    'KAUSHAMBI': { kn: 'ಕೌಶಮ್ಬಿ (Kaushambi)', hi: 'कौशम्बि (Kaushambi)' },
    'KENDRAPARA': { kn: 'ಕೆನ್ದ್ರಪರ (Kendrapara)', hi: 'केन्द्रपर (Kendrapara)' },
    'KENDUJHAR': { kn: 'ಕೆನ್ದುಝರ (Kendujhar)', hi: 'केन्दुझर (Kendujhar)' },
    'KHAGARIA': { kn: 'ಖಗರಿ (Khagaria)', hi: 'खगरि (Khagaria)' },
    'KHAMMAM': { kn: 'ಖಮ್ಮಮ (Khammam)', hi: 'खम्मम (Khammam)' },
    'KHANDWA': { kn: 'ಖನ್ದ್ವ (Khandwa)', hi: 'खन्द्व (Khandwa)' },
    'KHARGONE': { kn: 'ಖರ್ಗೊನೆ (Khargone)', hi: 'खर्गोने (Khargone)' },
    'KHEDA': { kn: 'ಖೆದ (Kheda)', hi: 'खेद (Kheda)' },
    'KHERI': { kn: 'ಖೆರಿ (Kheri)', hi: 'खेरि (Kheri)' },
    'KHORDHA': { kn: 'ಖೊರ್ಧ (Khordha)', hi: 'खोर्ध (Khordha)' },
    'KHOWAI': { kn: 'ಖೊವೈ (Khowai)', hi: 'खोवै (Khowai)' },
    'KHUNTI': { kn: 'ಖುನ್ತಿ (Khunti)', hi: 'खुन्ति (Khunti)' },
    'KINNAUR': { kn: 'ಕಿನ್ನೌರ (Kinnaur)', hi: 'किन्नौर (Kinnaur)' },
    'KIPHIRE': { kn: 'ಕಿಫಿರೆ (Kiphire)', hi: 'किफिरे (Kiphire)' },
    'KISHANGANJ': { kn: 'ಕಿಶಂಗನ್ಜ (Kishanganj)', hi: 'किशंगन्ज (Kishanganj)' },
    'KISHTWAR': { kn: 'ಕಿಶ್ತ್ವರ (Kishtwar)', hi: 'किश्त्वर (Kishtwar)' },
    'KODAGU': { kn: 'ಕೊಡಗು (Kodagu / Coorg)', hi: 'कोडगु / कूर्ग (Kodagu)' },
    'KODERMA': { kn: 'ಕೊದೆರ್ಮ (Koderma)', hi: 'कोदेर्म (Koderma)' },
    'KOHIMA': { kn: 'ಕೊಹಿಮ (Kohima)', hi: 'कोहिम (Kohima)' },
    'KOKRAJHAR': { kn: 'ಕೊಕ್ರಝರ (Kokrajhar)', hi: 'कोक्रझर (Kokrajhar)' },
    'KOLAR': { kn: 'ಕೋಲಾರ (Kolar)', hi: 'कोलार (Kolar)' },
    'KOLASIB': { kn: 'ಕೊಲಸಿಬ (Kolasib)', hi: 'कोलसिब (Kolasib)' },
    'KOLHAPUR': { kn: 'ಕೊಲ್ಹಪುರ (Kolhapur)', hi: 'कोल्हपुर (Kolhapur)' },
    'KOLLAM': { kn: 'ಕೊಲ್ಲಮ (Kollam)', hi: 'कोल्लम (Kollam)' },
    'KONDAGAON': { kn: 'ಕೊನ್ದಗಒನ (Kondagaon)', hi: 'कोन्दगओन (Kondagaon)' },
    'KOPPAL': { kn: 'ಕೊಪ್ಪಳ (Koppal)', hi: 'कोप्पल (Koppal)' },
    'KORAPUT': { kn: 'ಕೊರಪುತ (Koraput)', hi: 'कोरपुत (Koraput)' },
    'KORBA': { kn: 'ಕೊರ್ಬ (Korba)', hi: 'कोर्ब (Korba)' },
    'KOREA': { kn: 'ಕೊರೆ (Korea)', hi: 'कोरे (Korea)' },
    'KOTA': { kn: 'ಕೋಟಾ (Kota)', hi: 'कोटा (Kota)' },
    'KOTTAYAM': { kn: 'ಕೊತ್ತಯಮ (Kottayam)', hi: 'कोत्तयम (Kottayam)' },
    'KOZHIKODE': { kn: 'ಕೋಝಿಕ್ಕೋಡ್ (Kozhikode)', hi: 'कोझिकोड (Kozhikode)' },
    'KRISHNA': { kn: 'ಕ್ರಿಶ್ನ (Krishna)', hi: 'क्रिश्न (Krishna)' },
    'KRISHNAGIRI': { kn: 'ಕ್ರಿಶ್ನಗಿರಿ (Krishnagiri)', hi: 'क्रिश्नगिरि (Krishnagiri)' },
    'KULGAM': { kn: 'ಕುಲ್ಗಮ (Kulgam)', hi: 'कुल्गम (Kulgam)' },
    'KULLU': { kn: 'ಕುಲ್ಲು (Kullu)', hi: 'कुल्लु (Kullu)' },
    'KUPWARA': { kn: 'ಕುಪ್ವರ (Kupwara)', hi: 'कुप्वर (Kupwara)' },
    'KURNOOL': { kn: 'ಕರ್ನೂಲ್ (Kurnool)', hi: 'कुरनूल (Kurnool)' },
    'KURUKSHETRA': { kn: 'ಕುರುಕ್ಶೆತ್ರ (Kurukshetra)', hi: 'कुरुक्शेत्र (Kurukshetra)' },
    'KURUNG KUMEY': { kn: 'ಕುರುಂಗ ಕುಮೆಯ (Kurung Kumey)', hi: 'कुरुंग कुमेय (Kurung Kumey)' },
    'KUSHI NAGAR': { kn: 'ಕುಶಿ ನಗರ (Kushi Nagar)', hi: 'कुशि नगर (Kushi Nagar)' },
    'LAHUL AND SPITI': { kn: 'ಲಹುಲ ಅನ್ದ ಸ್ಪಿತಿ (Lahul And Spiti)', hi: 'लहुल अन्द स्पिति (Lahul And Spiti)' },
    'LAKHIMPUR': { kn: 'ಲಖಿಮ್ಪುರ (Lakhimpur)', hi: 'लखिम्पुर (Lakhimpur)' },
    'LAKHISARAI': { kn: 'ಲಖಿಸರೈ (Lakhisarai)', hi: 'लखिसरै (Lakhisarai)' },
    'LALITPUR': { kn: 'ಲಲಿತ್ಪುರ (Lalitpur)', hi: 'ललित्पुर (Lalitpur)' },
    'LATEHAR': { kn: 'ಲತೆಹರ (Latehar)', hi: 'लतेहर (Latehar)' },
    'LATUR': { kn: 'ಲತುರ (Latur)', hi: 'लतुर (Latur)' },
    'LAWNGTLAI': { kn: 'ಲವ್ಂಗ್ತ್ಲೈ (Lawngtlai)', hi: 'लव्ङ्त्लै (Lawngtlai)' },
    'LEH LADAKH': { kn: 'ಲೆಹ ಲದಖ (Leh Ladakh)', hi: 'लेह लदख (Leh Ladakh)' },
    'LOHARDAGA': { kn: 'ಲೊಹರ್ದಗ (Lohardaga)', hi: 'लोहर्दग (Lohardaga)' },
    'LOHIT': { kn: 'ಲೊಹಿತ (Lohit)', hi: 'लोहित (Lohit)' },
    'LONGDING': { kn: 'ಲೊಂಗ್ದಿಂಗ (Longding)', hi: 'लोङ्दिंग (Longding)' },
    'LONGLENG': { kn: 'ಲೊಂಗ್ಲೆಂಗ (Longleng)', hi: 'लोङ्लेंग (Longleng)' },
    'LOWER DIBANG VALLEY': { kn: 'ಕೆಳಗಿನ ದಿಬಂಗ ಕಣಿವೆ (Lower Dibang Valley)', hi: 'निचला दिबंग घाटी (Lower Dibang Valley)' },
    'LOWER SUBANSIRI': { kn: 'ಕೆಳಗಿನ ಸುಬನ್ಸಿರಿ (Lower Subansiri)', hi: 'निचला सुबन्सिरि (Lower Subansiri)' },
    'LUCKNOW': { kn: 'ಲಕ್ನೋ (Lucknow)', hi: 'लखनऊ (Lucknow)' },
    'LUDHIANA': { kn: 'ಲೂಧಿಯಾನ (Ludhiana)', hi: 'लुधियाना (Ludhiana)' },
    'LUNGLEI': { kn: 'ಲುಂಗ್ಲೆಿ (Lunglei)', hi: 'लुङ्लेि (Lunglei)' },
    'MADHEPURA': { kn: 'ಮಧೆಪುರ (Madhepura)', hi: 'मधेपुर (Madhepura)' },
    'MADHUBANI': { kn: 'ಮಧುಬನಿ (Madhubani)', hi: 'मधुबनि (Madhubani)' },
    'MADURAI': { kn: 'ಮಧುರೈ (Madurai)', hi: 'मदुरै (Madurai)' },
    'MAHARAJGANJ': { kn: 'ಮಹರಜ್ಗನ್ಜ (Maharajganj)', hi: 'महरज्गन्ज (Maharajganj)' },
    'MAHASAMUND': { kn: 'ಮಹಸಮುನ್ದ (Mahasamund)', hi: 'महसमुन्द (Mahasamund)' },
    'MAHBUBNAGAR': { kn: 'ಮಹ್ಬುಬ್ನಗರ (Mahbubnagar)', hi: 'मह्बुब्नगर (Mahbubnagar)' },
    'MAHE': { kn: 'ಮಹೆ (Mahe)', hi: 'महे (Mahe)' },
    'MAHENDRAGARH': { kn: 'ಮಹೆನ್ದ್ರಗಢ (Mahendragarh)', hi: 'महेन्द्रगढ़ (Mahendragarh)' },
    'MAHESANA': { kn: 'ಮಹೆಸನ (Mahesana)', hi: 'महेसन (Mahesana)' },
    'MAHOBA': { kn: 'ಮಹೊಬ (Mahoba)', hi: 'महोब (Mahoba)' },
    'MAINPURI': { kn: 'ಮೈನ್ಪುರಿ (Mainpuri)', hi: 'मैन्पुरि (Mainpuri)' },
    'MALAPPURAM': { kn: 'ಮಲಪ್ಪುರಮ (Malappuram)', hi: 'मलप्पुरम (Malappuram)' },
    'MALDAH': { kn: 'ಮಲ್ದಹ (Maldah)', hi: 'मल्दह (Maldah)' },
    'MALKANGIRI': { kn: 'ಮಲ್ಕಂಗಿರಿ (Malkangiri)', hi: 'मल्कंगिरि (Malkangiri)' },
    'MAMIT': { kn: 'ಮಮಿತ (Mamit)', hi: 'ममित (Mamit)' },
    'MANDI': { kn: 'ಮನ್ದಿ (Mandi)', hi: 'मन्दि (Mandi)' },
    'MANDLA': { kn: 'ಮನ್ದ್ಲ (Mandla)', hi: 'मन्द्ल (Mandla)' },
    'MANDSAUR': { kn: 'ಮನ್ದ್ಸೌರ (Mandsaur)', hi: 'मन्द्सौर (Mandsaur)' },
    'MANDYA': { kn: 'ಮಂಡ್ಯ (Mandya)', hi: 'मांड्या (Mandya)' },
    'MANSA': { kn: 'ಮನ್ಸ (Mansa)', hi: 'मन्स (Mansa)' },
    'MARIGAON': { kn: 'ಮರಿಗಒನ (Marigaon)', hi: 'मरिगओन (Marigaon)' },
    'MATHURA': { kn: 'ಮಥುರ (Mathura)', hi: 'मथुर (Mathura)' },
    'MAU': { kn: 'ಮೌ (Mau)', hi: 'मौ (Mau)' },
    'MAYURBHANJ': { kn: 'ಮಯುರ್ಭನ್ಜ (Mayurbhanj)', hi: 'मयुर्भन्ज (Mayurbhanj)' },
    'MEDAK': { kn: 'ಮೆದಕ (Medak)', hi: 'मेदक (Medak)' },
    'MEDINIPUR EAST': { kn: 'ಮೆದಿನಿಪುರ ಪೂರ್ವ (Medinipur East)', hi: 'मेदिनिपुर पूर्व (Medinipur East)' },
    'MEDINIPUR WEST': { kn: 'ಮೆದಿನಿಪುರ ಪಶ್ಚಿಮ (Medinipur West)', hi: 'मेदिनिपुर पश्चिम (Medinipur West)' },
    'MEERUT': { kn: 'ಮೀರತ್ (Meerut)', hi: 'मेरठ (Meerut)' },
    'MEWAT': { kn: 'ಮೆವತ (Mewat)', hi: 'मेवत (Mewat)' },
    'MIRZAPUR': { kn: 'ಮಿರ್ಜಪುರ (Mirzapur)', hi: 'मिर्ज़पुर (Mirzapur)' },
    'MOGA': { kn: 'ಮೊಗ (Moga)', hi: 'मोग (Moga)' },
    'MOKOKCHUNG': { kn: 'ಮೊಕೊಕ್ಚುಂಗ (Mokokchung)', hi: 'मोकोक्चुंग (Mokokchung)' },
    'MON': { kn: 'ಮೊನ (Mon)', hi: 'मोन (Mon)' },
    'MORADABAD': { kn: 'ಮೊರದಬದ (Moradabad)', hi: 'मोरदबद (Moradabad)' },
    'MORENA': { kn: 'ಮೊರೆನ (Morena)', hi: 'मोरेन (Morena)' },
    'MUKTSAR': { kn: 'ಮುಕ್ತ್ಸರ (Muktsar)', hi: 'मुक्त्सर (Muktsar)' },
    'MUMBAI': { kn: 'ಮುಂಬೈ (Mumbai)', hi: 'मुंबई (Mumbai)' },
    'MUNGELI': { kn: 'ಮುಂಗೆಲಿ (Mungeli)', hi: 'मुंगेलि (Mungeli)' },
    'MUNGER': { kn: 'ಮುಂಗೆರ (Munger)', hi: 'मुंगेर (Munger)' },
    'MURSHIDABAD': { kn: 'ಮುರ್ಶಿದಬದ (Murshidabad)', hi: 'मुर्शिदबद (Murshidabad)' },
    'MUZAFFARNAGAR': { kn: 'ಮುಜಫ್ಫರ್ನಗರ (Muzaffarnagar)', hi: 'मुज़फ़್फ़र्नगर (Muzaffarnagar)' },
    'MUZAFFARPUR': { kn: 'ಮುಜಫ್ಫರ್ಪುರ (Muzaffarpur)', hi: 'मुज़फ़್फ़र्पुर (Muzaffarpur)' },
    'MYSORE': { kn: 'ಮೈಸೂರು (Mysuru / Mysore)', hi: 'मैसूर / मैसूरु (Mysuru)' },
    'NABARANGPUR': { kn: 'ನಬರಂಗ್ಪುರ (Nabarangpur)', hi: 'नबरङ्पुर (Nabarangpur)' },
    'NADIA': { kn: 'ನದಿ (Nadia)', hi: 'नदि (Nadia)' },
    'NAGAON': { kn: 'ನಗಒನ (Nagaon)', hi: 'नगओन (Nagaon)' },
    'NAGAPATTINAM': { kn: 'ನಗಪತ್ತಿನಮ (Nagapattinam)', hi: 'नगपत्तिनम (Nagapattinam)' },
    'NAGAUR': { kn: 'ನಗೌರ (Nagaur)', hi: 'नगौर (Nagaur)' },
    'NAGPUR': { kn: 'ನಾಗಪುರ (Nagpur)', hi: 'नागपुर (Nagpur)' },
    'NAINITAL': { kn: 'ನೈನಿತಲ (Nainital)', hi: 'नैनितल (Nainital)' },
    'NALANDA': { kn: 'ನಲನ್ದ (Nalanda)', hi: 'नलन्द (Nalanda)' },
    'NALBARI': { kn: 'ನಲ್ಬರಿ (Nalbari)', hi: 'नल्बरि (Nalbari)' },
    'NALGONDA': { kn: 'ನಲ್ಗೊನ್ದ (Nalgonda)', hi: 'नल्गोन्द (Nalgonda)' },
    'NAMAKKAL': { kn: 'ನಮಕ್ಕಲ (Namakkal)', hi: 'नमक्कल (Namakkal)' },
    'NAMSAI': { kn: 'ನಮ್ಸೈ (Namsai)', hi: 'नम्सै (Namsai)' },
    'NANDED': { kn: 'ನನ್ದೆದ (Nanded)', hi: 'नन्देद (Nanded)' },
    'NANDURBAR': { kn: 'ನನ್ದುರ್ಬರ (Nandurbar)', hi: 'नन्दुर्बर (Nandurbar)' },
    'NARAYANPUR': { kn: 'ನರಯನ್ಪುರ (Narayanpur)', hi: 'नरयन्पुर (Narayanpur)' },
    'NARMADA': { kn: 'ನರ್ಮದ (Narmada)', hi: 'नर्मद (Narmada)' },
    'NARSINGHPUR': { kn: 'ನರ್ಸಿಂಗ್ಹ್ಪುರ (Narsinghpur)', hi: 'नर्सिङ्ह्पुर (Narsinghpur)' },
    'NASHIK': { kn: 'ನಾಸಿಕ್ (Nashik)', hi: 'नासिक (Nashik)' },
    'NAVSARI': { kn: 'ನವ್ಸರಿ (Navsari)', hi: 'नव्सरि (Navsari)' },
    'NAWADA': { kn: 'ನವದ (Nawada)', hi: 'नवद (Nawada)' },
    'NAWANSHAHR': { kn: 'ನವನ್ಶಹ್ರ (Nawanshahr)', hi: 'नवन्शह्र (Nawanshahr)' },
    'NAYAGARH': { kn: 'ನಯಗಢ (Nayagarh)', hi: 'नयगढ़ (Nayagarh)' },
    'NEEMUCH': { kn: 'ನೀಮುಚ (Neemuch)', hi: 'नीमुच (Neemuch)' },
    'NICOBARS': { kn: 'ನಿಕೊಬರ್ಸ (Nicobars)', hi: 'निकोबर्स (Nicobars)' },
    'NIZAMABAD': { kn: 'ನಿಜಮಬದ (Nizamabad)', hi: 'निज़मबद (Nizamabad)' },
    'NORTH AND MIDDLE ANDAMAN': { kn: 'ಉತ್ತರ ಅನ್ದ ಮಿದ್ದ್ಲೆ ಅನ್ದಮನ (North And Middle Andaman)', hi: 'उत्तर अन्द मिद्द्ले अन्दमन (North And Middle Andaman)' },
    'NORTH DISTRICT': { kn: 'ಉತ್ತರ ಜಿಲ್ಲೆ (North District)', hi: 'उत्तर जिला (North District)' },
    'NORTH GARO HILLS': { kn: 'ಉತ್ತರ ಗರೊ ಬೆಟ್ಟಗಳು (North Garo Hills)', hi: 'उत्तर गरो पहाड़ियां (North Garo Hills)' },
    'NORTH GOA': { kn: 'ಉತ್ತರ ಗೊ (North Goa)', hi: 'उत्तर गो (North Goa)' },
    'NORTH TRIPURA': { kn: 'ಉತ್ತರ ತ್ರಿಪುರ (North Tripura)', hi: 'उत्तर त्रिपुर (North Tripura)' },
    'NUAPADA': { kn: 'ನುಪದ (Nuapada)', hi: 'नुपद (Nuapada)' },
    'OSMANABAD': { kn: 'ಒಸ್ಮನಬದ (Osmanabad)', hi: 'ओस्मनबद (Osmanabad)' },
    'PAKUR': { kn: 'ಪಕುರ (Pakur)', hi: 'पकुर (Pakur)' },
    'PALAKKAD': { kn: 'ಪಲಕ್ಕದ (Palakkad)', hi: 'पलक्कद (Palakkad)' },
    'PALAMU': { kn: 'ಪಲಮು (Palamu)', hi: 'पलमु (Palamu)' },
    'PALGHAR': { kn: 'ಪಲ್ಘರ (Palghar)', hi: 'पल्घर (Palghar)' },
    'PALI': { kn: 'ಪಲಿ (Pali)', hi: 'पलि (Pali)' },
    'PALWAL': { kn: 'ಪಲ್ವಲ (Palwal)', hi: 'पल्वल (Palwal)' },
    'PANCH MAHALS': { kn: 'ಪನ್ಚ ಮಹಲ್ಸ (Panch Mahals)', hi: 'पन्च महल्स (Panch Mahals)' },
    'PANCHKULA': { kn: 'ಪನ್ಚ್ಕುಲ (Panchkula)', hi: 'पन्च्कुल (Panchkula)' },
    'PANIPAT': { kn: 'ಪನಿಪತ (Panipat)', hi: 'पनिपत (Panipat)' },
    'PANNA': { kn: 'ಪನ್ನ (Panna)', hi: 'पन्न (Panna)' },
    'PAPUM PARE': { kn: 'ಪಪುಮ ಪರೆ (Papum Pare)', hi: 'पपुम परे (Papum Pare)' },
    'PARBHANI': { kn: 'ಪರ್ಭನಿ (Parbhani)', hi: 'पर्भनि (Parbhani)' },
    'PASHCHIM CHAMPARAN': { kn: 'ಪಶ್ಚಿಮ ಚಮ್ಪರನ (Pashchim Champaran)', hi: 'पश्चिम चम्परन (Pashchim Champaran)' },
    'PATAN': { kn: 'ಪತನ (Patan)', hi: 'पतन (Patan)' },
    'PATHANAMTHITTA': { kn: 'ಪಥನಮ್ಥಿತ್ತ (Pathanamthitta)', hi: 'पथनम्थित्त (Pathanamthitta)' },
    'PATHANKOT': { kn: 'ಪಥನ್ಕೊತ (Pathankot)', hi: 'पथन्कोत (Pathankot)' },
    'PATIALA': { kn: 'ಪತಿಲ (Patiala)', hi: 'पतिल (Patiala)' },
    'PATNA': { kn: 'ಪಾಟ್ನಾ (Patna)', hi: 'पटना (Patna)' },
    'PAURI GARHWAL': { kn: 'ಪೌರಿ ಗರ್ವಲ (Pauri Garhwal)', hi: 'पौरि गढ़्वल (Pauri Garhwal)' },
    'PERAMBALUR': { kn: 'ಪೆರಮ್ಬಲುರ (Perambalur)', hi: 'पेरम्बलुर (Perambalur)' },
    'PEREN': { kn: 'ಪೆರೆನ (Peren)', hi: 'पेरेन (Peren)' },
    'PHEK': { kn: 'ಫೆಕ (Phek)', hi: 'फेक (Phek)' },
    'PILIBHIT': { kn: 'ಪಿಲಿಭಿತ (Pilibhit)', hi: 'पिलिभित (Pilibhit)' },
    'PITHORAGARH': { kn: 'ಪಿಥೊರಗಢ (Pithoragarh)', hi: 'पिथोरगढ़ (Pithoragarh)' },
    'PONDICHERRY': { kn: 'ಪೊನ್ದಿಚೆರ್ರ್ಯ (Pondicherry)', hi: 'पोन्दिचेर्र्य (Pondicherry)' },
    'POONCH': { kn: 'ಪೂನ್ಚ (Poonch)', hi: 'पून्च (Poonch)' },
    'PORBANDAR': { kn: 'ಪೊರ್ಬನ್ದರ (Porbandar)', hi: 'पोर्बन्दर (Porbandar)' },
    'PRAKASAM': { kn: 'ಪ್ರಕಸಮ (Prakasam)', hi: 'प्रकसम (Prakasam)' },
    'PRATAPGARH': { kn: 'ಪ್ರತಪ್ಗಢ (Pratapgarh)', hi: 'प्रतप्गढ़ (Pratapgarh)' },
    'PUDUKKOTTAI': { kn: 'ಪುದುಕ್ಕೊತ್ತೈ (Pudukkottai)', hi: 'पुदुक्कोत्तै (Pudukkottai)' },
    'PULWAMA': { kn: 'ಪುಲ್ವಮ (Pulwama)', hi: 'पुल्वम (Pulwama)' },
    'PUNE': { kn: 'ಪುಣೆ (Pune)', hi: 'पुणे (Pune)' },
    'PURBI CHAMPARAN': { kn: 'ಪುರ್ಬಿ ಚಮ್ಪರನ (Purbi Champaran)', hi: 'पुर्बि चम्परन (Purbi Champaran)' },
    'PURI': { kn: 'ಪುರಿ (Puri)', hi: 'पुरि (Puri)' },
    'PURNIA': { kn: 'ಪುರ್ನಿ (Purnia)', hi: 'पुर्नि (Purnia)' },
    'PURULIA': { kn: 'ಪುರುಲಿ (Purulia)', hi: 'पुरुलि (Purulia)' },
    'RAE BARELI': { kn: 'ರಎ ಬರೆಲಿ (Rae Bareli)', hi: 'रए बरेलि (Rae Bareli)' },
    'RAICHUR': { kn: 'ರಾಯಚೂರು (Raichur)', hi: 'रायचूर (Raichur)' },
    'RAIGAD': { kn: 'ರೈಗದ (Raigad)', hi: 'रैगद (Raigad)' },
    'RAIGARH': { kn: 'ರೈಗಢ (Raigarh)', hi: 'रैगढ़ (Raigarh)' },
    'RAIPUR': { kn: 'ರಾಯ್‌ಪುರ (Raipur)', hi: 'रायपुर (Raipur)' },
    'RAISEN': { kn: 'ರೈಸೆನ (Raisen)', hi: 'रैसेन (Raisen)' },
    'RAJAURI': { kn: 'ರಜೌರಿ (Rajauri)', hi: 'रजौरि (Rajauri)' },
    'RAJGARH': { kn: 'ರಜ್ಗಢ (Rajgarh)', hi: 'रज्गढ़ (Rajgarh)' },
    'RAJKOT': { kn: 'ರಾಜ್‌ಕೋಟ್ (Rajkot)', hi: 'राजकोट (Rajkot)' },
    'RAJNANDGAON': { kn: 'ರಜ್ನನ್ದ್ಗಒನ (Rajnandgaon)', hi: 'रज्नन्द्गओन (Rajnandgaon)' },
    'RAJSAMAND': { kn: 'ರಜ್ಸಮನ್ದ (Rajsamand)', hi: 'रज्समन्द (Rajsamand)' },
    'RAMANAGARA': { kn: 'ರಾಮನಗರ (Ramanagara)', hi: 'रामनगर (Ramanagara)' },
    'RAMANATHAPURAM': { kn: 'ರಮನಥಪುರಮ (Ramanathapuram)', hi: 'रमनथपुरम (Ramanathapuram)' },
    'RAMBAN': { kn: 'ರಮ್ಬನ (Ramban)', hi: 'रम्बन (Ramban)' },
    'RAMGARH': { kn: 'ರಮ್ಗಢ (Ramgarh)', hi: 'रम्गढ़ (Ramgarh)' },
    'RAMPUR': { kn: 'ರಮ್ಪುರ (Rampur)', hi: 'रम्पुर (Rampur)' },
    'RANCHI': { kn: 'ರಾಂಚಿ (Ranchi)', hi: 'रांची (Ranchi)' },
    'RANGAREDDI': { kn: 'ರಂಗರೆದ್ದಿ (Rangareddi)', hi: 'रंगरेद्दि (Rangareddi)' },
    'RATLAM': { kn: 'ರತ್ಲಮ (Ratlam)', hi: 'रत्लम (Ratlam)' },
    'RATNAGIRI': { kn: 'ರತ್ನಗಿರಿ (Ratnagiri)', hi: 'रत्नगिरि (Ratnagiri)' },
    'RAYAGADA': { kn: 'ರಯಗದ (Rayagada)', hi: 'रयगद (Rayagada)' },
    'REASI': { kn: 'ರೆಸಿ (Reasi)', hi: 'रेसि (Reasi)' },
    'REWA': { kn: 'ರೆವ (Rewa)', hi: 'रेव (Rewa)' },
    'REWARI': { kn: 'ರೆವರಿ (Rewari)', hi: 'रेवरि (Rewari)' },
    'RI BHOI': { kn: 'ರಿ ಭೊಿ (Ri Bhoi)', hi: 'रि भोि (Ri Bhoi)' },
    'ROHTAK': { kn: 'ರೊಹ್ತಕ (Rohtak)', hi: 'रोह्तक (Rohtak)' },
    'ROHTAS': { kn: 'ರೊಹ್ತಸ (Rohtas)', hi: 'रोह्तस (Rohtas)' },
    'RUDRA PRAYAG': { kn: 'ರುದ್ರ ಪ್ರಯಗ (Rudra Prayag)', hi: 'रुद्र प्रयग (Rudra Prayag)' },
    'RUPNAGAR': { kn: 'ರುಪ್ನಗರ (Rupnagar)', hi: 'रुप्नगर (Rupnagar)' },
    'S.A.S NAGAR': { kn: 'ಸ್..ಸ ನಗರ (S.A.S Nagar)', hi: 'स्..स नगर (S.A.S Nagar)' },
    'SABAR KANTHA': { kn: 'ಸಬರ ಕನ್ಥ (Sabar Kantha)', hi: 'सबर कन्थ (Sabar Kantha)' },
    'SAGAR': { kn: 'ಸಗರ (Sagar)', hi: 'सगर (Sagar)' },
    'SAHARANPUR': { kn: 'ಸಹರನ್ಪುರ (Saharanpur)', hi: 'सहरन्पुर (Saharanpur)' },
    'SAHARSA': { kn: 'ಸಹರ್ಸ (Saharsa)', hi: 'सहर्स (Saharsa)' },
    'SAHEBGANJ': { kn: 'ಸಹೆಬ್ಗನ್ಜ (Sahebganj)', hi: 'सहेब्गन्ज (Sahebganj)' },
    'SAIHA': { kn: 'ಸೈಹ (Saiha)', hi: 'सैह (Saiha)' },
    'SALEM': { kn: 'ಸೇಲಂ (Salem)', hi: 'सेलम (Salem)' },
    'SAMASTIPUR': { kn: 'ಸಮಸ್ತಿಪುರ (Samastipur)', hi: 'समस्तिपुर (Samastipur)' },
    'SAMBA': { kn: 'ಸಮ್ಬ (Samba)', hi: 'सम्ब (Samba)' },
    'SAMBALPUR': { kn: 'ಸಮ್ಬಲ್ಪುರ (Sambalpur)', hi: 'सम्बल्पुर (Sambalpur)' },
    'SAMBHAL': { kn: 'ಸಮ್ಭಲ (Sambhal)', hi: 'सम्भल (Sambhal)' },
    'SANGLI': { kn: 'ಸಂಗ್ಲಿ (Sangli)', hi: 'सङ्लि (Sangli)' },
    'SANGRUR': { kn: 'ಸಂಗ್ರುರ (Sangrur)', hi: 'सङ्रुर (Sangrur)' },
    'SANT KABEER NAGAR': { kn: 'ಸನ್ತ ಕಬೀರ ನಗರ (Sant Kabeer Nagar)', hi: 'सन्त कबीर नगर (Sant Kabeer Nagar)' },
    'SANT RAVIDAS NAGAR': { kn: 'ಸನ್ತ ರವಿದಸ ನಗರ (Sant Ravidas Nagar)', hi: 'सन्त रविदस नगर (Sant Ravidas Nagar)' },
    'SARAIKELA KHARSAWAN': { kn: 'ಸರೈಕೆಲ ಖರ್ಸವನ (Saraikela Kharsawan)', hi: 'सरैकेल खर्सवन (Saraikela Kharsawan)' },
    'SARAN': { kn: 'ಸರನ (Saran)', hi: 'सरन (Saran)' },
    'SATARA': { kn: 'ಸತರ (Satara)', hi: 'सतर (Satara)' },
    'SATNA': { kn: 'ಸತ್ನ (Satna)', hi: 'सत्न (Satna)' },
    'SAWAI MADHOPUR': { kn: 'ಸವೈ ಮಧೊಪುರ (Sawai Madhopur)', hi: 'सवै मधोपुर (Sawai Madhopur)' },
    'SEHORE': { kn: 'ಸೆಹೊರೆ (Sehore)', hi: 'सेहोरे (Sehore)' },
    'SENAPATI': { kn: 'ಸೆನಪತಿ (Senapati)', hi: 'सेनपति (Senapati)' },
    'SEONI': { kn: 'ಸೆೊನಿ (Seoni)', hi: 'सेोनि (Seoni)' },
    'SEPAHIJALA': { kn: 'ಸೆಪಹಿಜಲ (Sepahijala)', hi: 'सेपहिजल (Sepahijala)' },
    'SERCHHIP': { kn: 'ಸೆರ್ಚ್ಹಿಪ (Serchhip)', hi: 'सेर्च्हिप (Serchhip)' },
    'SHAHDOL': { kn: 'ಶಹ್ದೊಲ (Shahdol)', hi: 'शह्दोल (Shahdol)' },
    'SHAHJAHANPUR': { kn: 'ಶಹ್ಜಹನ್ಪುರ (Shahjahanpur)', hi: 'शह्जहन्पुर (Shahjahanpur)' },
    'SHAJAPUR': { kn: 'ಶಜಪುರ (Shajapur)', hi: 'शजपुर (Shajapur)' },
    'SHAMLI': { kn: 'ಶಮ್ಲಿ (Shamli)', hi: 'शम्लि (Shamli)' },
    'SHEIKHPURA': { kn: 'ಶೆಿಖ್ಪುರ (Sheikhpura)', hi: 'शेिख्पुर (Sheikhpura)' },
    'SHEOHAR': { kn: 'ಶೆೊಹರ (Sheohar)', hi: 'शेोहर (Sheohar)' },
    'SHEOPUR': { kn: 'ಶೆೊಪುರ (Sheopur)', hi: 'शेोपुर (Sheopur)' },
    'SHIMLA': { kn: 'ಶಿಮ್ಲ (Shimla)', hi: 'शिम्ल (Shimla)' },
    'SHIMOGA': { kn: 'ಶಿವಮೊಗ್ಗ (Shivamogga / Shimoga)', hi: 'शिमोगा / शिवमोग्गा (Shivamogga)' },
    'SHIVPURI': { kn: 'ಶಿವ್ಪುರಿ (Shivpuri)', hi: 'शिव्पुरि (Shivpuri)' },
    'SHOPIAN': { kn: 'ಶೊಪಿನ (Shopian)', hi: 'शोपिन (Shopian)' },
    'SHRAVASTI': { kn: 'ಶ್ರವಸ್ತಿ (Shravasti)', hi: 'श्रवस्ति (Shravasti)' },
    'SIDDHARTH NAGAR': { kn: 'ಸಿದ್ಧರ್ಥ ನಗರ (Siddharth Nagar)', hi: 'सिद्धर्थ नगर (Siddharth Nagar)' },
    'SIDHI': { kn: 'ಸಿಧಿ (Sidhi)', hi: 'सिधि (Sidhi)' },
    'SIKAR': { kn: 'ಸಿಕರ (Sikar)', hi: 'सिकर (Sikar)' },
    'SIMDEGA': { kn: 'ಸಿಮ್ದೆಗ (Simdega)', hi: 'सिम्देग (Simdega)' },
    'SINDHUDURG': { kn: 'ಸಿನ್ಧುದುರ್ಗ (Sindhudurg)', hi: 'सिन्धुदुर्ग (Sindhudurg)' },
    'SINGRAULI': { kn: 'ಸಿಂಗ್ರೌಲಿ (Singrauli)', hi: 'सिङ्रौलि (Singrauli)' },
    'SIRMAUR': { kn: 'ಸಿರ್ಮೌರ (Sirmaur)', hi: 'सिर्मौर (Sirmaur)' },
    'SIROHI': { kn: 'ಸಿರೊಹಿ (Sirohi)', hi: 'सिरोहि (Sirohi)' },
    'SIRSA': { kn: 'ಸಿರ್ಸ (Sirsa)', hi: 'सिर्स (Sirsa)' },
    'SITAMARHI': { kn: 'ಸಿತಮಢಿ (Sitamarhi)', hi: 'सितमढ़ि (Sitamarhi)' },
    'SITAPUR': { kn: 'ಸಿತಪುರ (Sitapur)', hi: 'सितपुर (Sitapur)' },
    'SIVAGANGA': { kn: 'ಸಿವಗಂಗ (Sivaganga)', hi: 'सिवगंग (Sivaganga)' },
    'SIVASAGAR': { kn: 'ಸಿವಸಗರ (Sivasagar)', hi: 'सिवसगर (Sivasagar)' },
    'SIWAN': { kn: 'ಸಿವನ (Siwan)', hi: 'सिवन (Siwan)' },
    'SOLAN': { kn: 'ಸೊಲನ (Solan)', hi: 'सोलन (Solan)' },
    'SOLAPUR': { kn: 'ಸೊಲಪುರ (Solapur)', hi: 'सोलपुर (Solapur)' },
    'SONBHADRA': { kn: 'ಸೊನ್ಭದ್ರ (Sonbhadra)', hi: 'सोन्भद्र (Sonbhadra)' },
    'SONEPUR': { kn: 'ಸೊನೆಪುರ (Sonepur)', hi: 'सोनेपुर (Sonepur)' },
    'SONIPAT': { kn: 'ಸೊನಿಪತ (Sonipat)', hi: 'सोनिपत (Sonipat)' },
    'SONITPUR': { kn: 'ಸೊನಿತ್ಪುರ (Sonitpur)', hi: 'सोनित्पुर (Sonitpur)' },
    'SOUTH ANDAMANS': { kn: 'ದಕ್ಷಿಣ ಅನ್ದಮನ್ಸ (South Andamans)', hi: 'दक्षिण अन्दमन्स (South Andamans)' },
    'SOUTH DISTRICT': { kn: 'ದಕ್ಷಿಣ ಜಿಲ್ಲೆ (South District)', hi: 'दक्षिण जिला (South District)' },
    'SOUTH GARO HILLS': { kn: 'ದಕ್ಷಿಣ ಗರೊ ಬೆಟ್ಟಗಳು (South Garo Hills)', hi: 'दक्षिण गरो पहाड़ियां (South Garo Hills)' },
    'SOUTH GOA': { kn: 'ದಕ್ಷಿಣ ಗೊ (South Goa)', hi: 'दक्षिण गो (South Goa)' },
    'SOUTH TRIPURA': { kn: 'ದಕ್ಷಿಣ ತ್ರಿಪುರ (South Tripura)', hi: 'दक्षिण त्रिपुर (South Tripura)' },
    'SOUTH WEST GARO HILLS': { kn: 'ದಕ್ಷಿಣ ಪಶ್ಚಿಮ ಗರೊ ಬೆಟ್ಟಗಳು (South West Garo Hills)', hi: 'दक्षिण पश्चिम गरो पहाड़ियां (South West Garo Hills)' },
    'SOUTH WEST KHASI HILLS': { kn: 'ದಕ್ಷಿಣ ಪಶ್ಚಿಮ ಖಸಿ ಬೆಟ್ಟಗಳು (South West Khasi Hills)', hi: 'दक्षिण पश्चिम खसि पहाड़ियां (South West Khasi Hills)' },
    'SPSR NELLORE': { kn: 'ಸ್ಪ್ಸ್ರ ನೆಲ್ಲೊರೆ (Spsr Nellore)', hi: 'स्प्स्र नेल्लोरे (Spsr Nellore)' },
    'SRIKAKULAM': { kn: 'ಸ್ರಿಕಕುಲಮ (Srikakulam)', hi: 'स्रिककुलम (Srikakulam)' },
    'SRINAGAR': { kn: 'ಸ್ರಿನಗರ (Srinagar)', hi: 'स्रिनगर (Srinagar)' },
    'SUKMA': { kn: 'ಸುಕ್ಮ (Sukma)', hi: 'सुक्म (Sukma)' },
    'SULTANPUR': { kn: 'ಸುಲ್ತನ್ಪುರ (Sultanpur)', hi: 'सुल्तन्पुर (Sultanpur)' },
    'SUNDARGARH': { kn: 'ಸುನ್ದರ್ಗಢ (Sundargarh)', hi: 'सुन्दर्गढ़ (Sundargarh)' },
    'SUPAUL': { kn: 'ಸುಪೌಲ (Supaul)', hi: 'सुपौल (Supaul)' },
    'SURAJPUR': { kn: 'ಸುರಜ್ಪುರ (Surajpur)', hi: 'सुरज्पुर (Surajpur)' },
    'SURAT': { kn: 'ಸೂರತ್ (Surat)', hi: 'सूरत (Surat)' },
    'SURENDRANAGAR': { kn: 'ಸುರೆನ್ದ್ರನಗರ (Surendranagar)', hi: 'सुरेन्द्रनगर (Surendranagar)' },
    'SURGUJA': { kn: 'ಸುರ್ಗುಜ (Surguja)', hi: 'सुर्गुज (Surguja)' },
    'TAMENGLONG': { kn: 'ತಮೆಂಗ್ಲೊಂಗ (Tamenglong)', hi: 'तमेङ्लोंग (Tamenglong)' },
    'TAPI': { kn: 'ತಪಿ (Tapi)', hi: 'तपि (Tapi)' },
    'TARN TARAN': { kn: 'ತರ್ನ ತರನ (Tarn Taran)', hi: 'तर्न तरन (Tarn Taran)' },
    'TAWANG': { kn: 'ತವಂಗ (Tawang)', hi: 'तवंग (Tawang)' },
    'TEHRI GARHWAL': { kn: 'ತೆಹ್ರಿ ಗರ್ವಲ (Tehri Garhwal)', hi: 'तेह्रि गढ़्वल (Tehri Garhwal)' },
    'THANE': { kn: 'ಥನೆ (Thane)', hi: 'थने (Thane)' },
    'THANJAVUR': { kn: 'ಥನ್ಜವುರ (Thanjavur)', hi: 'थन्जवुर (Thanjavur)' },
    'THE NILGIRIS': { kn: 'ಥೆ ನಿಲ್ಗಿರಿಸ (The Nilgiris)', hi: 'थे निल्गिरिस (The Nilgiris)' },
    'THENI': { kn: 'ಥೆನಿ (Theni)', hi: 'थेनि (Theni)' },
    'THIRUVALLUR': { kn: 'ಥಿರುವಲ್ಲುರ (Thiruvallur)', hi: 'थिरुवल्लुर (Thiruvallur)' },
    'THIRUVANANTHAPURAM': { kn: 'ತಿರುವನಂತಪುರಂ (Thiruvananthapuram)', hi: 'तिरुवनंतपुरम (Thiruvananthapuram)' },
    'THIRUVARUR': { kn: 'ಥಿರುವರುರ (Thiruvarur)', hi: 'थिरुवरुर (Thiruvarur)' },
    'THOUBAL': { kn: 'ಥೊುಬಲ (Thoubal)', hi: 'थोुबल (Thoubal)' },
    'THRISSUR': { kn: 'ತ್ರಿಸ್ಸುರ (Thrissur)', hi: 'थ्रिस्सुर (Thrissur)' },
    'TIKAMGARH': { kn: 'ತಿಕಮ್ಗಢ (Tikamgarh)', hi: 'तिकम्गढ़ (Tikamgarh)' },
    'TINSUKIA': { kn: 'ತಿನ್ಸುಕಿ (Tinsukia)', hi: 'तिन्सुकि (Tinsukia)' },
    'TIRAP': { kn: 'ತಿರಪ (Tirap)', hi: 'तिरप (Tirap)' },
    'TIRUCHIRAPPALLI': { kn: 'ತಿರುಚಿರಪ್ಪಲ್ಲಿ (Tiruchirappalli)', hi: 'तिरुचिरप्पल्लि (Tiruchirappalli)' },
    'TIRUNELVELI': { kn: 'ತಿರುನೆಲ್ವೆಲಿ (Tirunelveli)', hi: 'तिरुनेल्वेलि (Tirunelveli)' },
    'TIRUPPUR': { kn: 'ತಿರುಪ್ಪುರ (Tiruppur)', hi: 'तिरुप्पुर (Tiruppur)' },
    'TIRUVANNAMALAI': { kn: 'ತಿರುವನ್ನಮಲೈ (Tiruvannamalai)', hi: 'तिरुवन्नमलै (Tiruvannamalai)' },
    'TONK': { kn: 'ತೊನ್ಕ (Tonk)', hi: 'तोन्क (Tonk)' },
    'TUENSANG': { kn: 'ತುೆನ್ಸಂಗ (Tuensang)', hi: 'तुेन्संग (Tuensang)' },
    'TUMKUR': { kn: 'ತುಮಕೂರು (Tumakuru / Tumkur)', hi: 'तुमकुंरु (Tumakuru)' },
    'TUTICORIN': { kn: 'ತುತಿಕೊರಿನ (Tuticorin)', hi: 'तुतिकोरिन (Tuticorin)' },
    'UDAIPUR': { kn: 'ಉದೈಪುರ (Udaipur)', hi: 'उदैपुर (Udaipur)' },
    'UDALGURI': { kn: 'ಉದಲ್ಗುರಿ (Udalguri)', hi: 'उदल्गुरि (Udalguri)' },
    'UDAM SINGH NAGAR': { kn: 'ಉದಮ ಸಿಂಗ್ಹ ನಗರ (Udam Singh Nagar)', hi: 'उदम सिङ्ह नगर (Udam Singh Nagar)' },
    'UDHAMPUR': { kn: 'ಉಧಮ್ಪುರ (Udhampur)', hi: 'उधम्पुर (Udhampur)' },
    'UDUPI': { kn: 'ಉಡುಪಿ (Udupi)', hi: 'उडुपी (Udupi)' },
    'UJJAIN': { kn: 'ಉಜ್ಜೈನ (Ujjain)', hi: 'उज्जैन (Ujjain)' },
    'UKHRUL': { kn: 'ಉಖ್ರುಲ (Ukhrul)', hi: 'उख्रुल (Ukhrul)' },
    'UMARIA': { kn: 'ಉಮರಿ (Umaria)', hi: 'उमरि (Umaria)' },
    'UNA': { kn: 'ಉನ (Una)', hi: 'उन (Una)' },
    'UNAKOTI': { kn: 'ಉನಕೊತಿ (Unakoti)', hi: 'उनकोति (Unakoti)' },
    'UNNAO': { kn: 'ಉನ್ನಒ (Unnao)', hi: 'उन्नओ (Unnao)' },
    'UPPER SIANG': { kn: 'ಮೇಲಿನ ಸಿಂಗ (Upper Siang)', hi: 'ऊपरी सिंग (Upper Siang)' },
    'UPPER SUBANSIRI': { kn: 'ಮೇಲಿನ ಸುಬನ್ಸಿರಿ (Upper Subansiri)', hi: 'ऊपरी सुबन्सिरि (Upper Subansiri)' },
    'UTTAR KANNAD': { kn: 'ಉತ್ತರ ಕನ್ನಡ (Uttara Kannada)', hi: 'उत्तर कन्नड़ (Uttara Kannada)' },
    'UTTAR KASHI': { kn: 'ಉತ್ತರ ಕಶಿ (Uttar Kashi)', hi: 'उत्तर कशि (Uttar Kashi)' },
    'VADODARA': { kn: 'ವಡೋದರಾ (Vadodara)', hi: 'वडोदरा (Vadodara)' },
    'VAISHALI': { kn: 'ವೈಶಲಿ (Vaishali)', hi: 'वैशलि (Vaishali)' },
    'VALSAD': { kn: 'ವಲ್ಸದ (Valsad)', hi: 'वल्सद (Valsad)' },
    'VARANASI': { kn: 'ವಾರಣಾಸಿ (Varanasi)', hi: 'वाराणसी (Varanasi)' },
    'VELLORE': { kn: 'ವೆಲ್ಲೊರೆ (Vellore)', hi: 'वेल्लोरे (Vellore)' },
    'VIDISHA': { kn: 'ವಿದಿಶ (Vidisha)', hi: 'विदिश (Vidisha)' },
    'VILLUPURAM': { kn: 'ವಿಲ್ಲುಪುರಮ (Villupuram)', hi: 'विल्लुपुरम (Villupuram)' },
    'VIRUDHUNAGAR': { kn: 'ವಿರುಧುನಗರ (Virudhunagar)', hi: 'विरुधुनगर (Virudhunagar)' },
    'VISAKHAPATANAM': { kn: 'ವಿಸಖಪತನಮ (Visakhapatanam)', hi: 'विसखपतनम (Visakhapatanam)' },
    'VIZIANAGARAM': { kn: 'ವಿಜಿನಗರಮ (Vizianagaram)', hi: 'विज़िनगरम (Vizianagaram)' },
    'WARANGAL': { kn: 'ವಾರಂಗಲ್ (Warangal)', hi: 'वारंगल (Warangal)' },
    'WARDHA': { kn: 'ವರ್ಧ (Wardha)', hi: 'वर्ध (Wardha)' },
    'WASHIM': { kn: 'ವಶಿಮ (Washim)', hi: 'वशिम (Washim)' },
    'WAYANAD': { kn: 'ವಯನದ (Wayanad)', hi: 'वयनद (Wayanad)' },
    'WEST DISTRICT': { kn: 'ಪಶ್ಚಿಮ ಜಿಲ್ಲೆ (West District)', hi: 'पश्चिम जिला (West District)' },
    'WEST GARO HILLS': { kn: 'ಪಶ್ಚಿಮ ಗರೊ ಬೆಟ್ಟಗಳು (West Garo Hills)', hi: 'पश्चिम गरो पहाड़ियां (West Garo Hills)' },
    'WEST GODAVARI': { kn: 'ಪಶ್ಚಿಮ ಗೊದವರಿ (West Godavari)', hi: 'पश्चिम गोदवरि (West Godavari)' },
    'WEST JAINTIA HILLS': { kn: 'ಪಶ್ಚಿಮ ಜೈನ್ತಿ ಬೆಟ್ಟಗಳು (West Jaintia Hills)', hi: 'पश्चिम जैन्ति पहाड़ियां (West Jaintia Hills)' },
    'WEST KAMENG': { kn: 'ಪಶ್ಚಿಮ ಕಮೆಂಗ (West Kameng)', hi: 'पश्चिम कमेंग (West Kameng)' },
    'WEST KHASI HILLS': { kn: 'ಪಶ್ಚಿಮ ಖಸಿ ಬೆಟ್ಟಗಳು (West Khasi Hills)', hi: 'पश्चिम खसि पहाड़ियां (West Khasi Hills)' },
    'WEST SIANG': { kn: 'ಪಶ್ಚಿಮ ಸಿಂಗ (West Siang)', hi: 'पश्चिम सिंग (West Siang)' },
    'WEST SINGHBHUM': { kn: 'ಪಶ್ಚಿಮ ಸಿಂಗ್ಹ್ಭುಮ (West Singhbhum)', hi: 'पश्चिम सिङ्ह्भुम (West Singhbhum)' },
    'WEST TRIPURA': { kn: 'ಪಶ್ಚಿಮ ತ್ರಿಪುರ (West Tripura)', hi: 'पश्चिम त्रिपुर (West Tripura)' },
    'WOKHA': { kn: 'ವೊಖ (Wokha)', hi: 'वोख (Wokha)' },
    'YADGIR': { kn: 'ಯಾದಗಿರಿ (Yadgir)', hi: 'यादगीर (Yadgir)' },
    'YAMUNANAGAR': { kn: 'ಯಮುನನಗರ (Yamunanagar)', hi: 'यमुननगर (Yamunanagar)' },
    'YANAM': { kn: 'ಯನಮ (Yanam)', hi: 'यनम (Yanam)' },
    'YAVATMAL': { kn: 'ಯವತ್ಮಲ (Yavatmal)', hi: 'यवत्मल (Yavatmal)' },
    'ZUNHEBOTO': { kn: 'ಜುನ್ಹೆಬೊತೊ (Zunheboto)', hi: 'ज़ुन्हेबोतो (Zunheboto)' },
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
    'A farmer with this name, email, or mobile number is already registered.': { kn: 'ಈ ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಹೊಂದಿರುವ ರೈತರು ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿಕೊಂಡಿದ್ದಾರೆ.', hi: 'इस नाम, ईमेल या मोबाइल नंबर वाला किसान पहले से पंजीकृत है।' },
    'Account created successfully! You can now log in.': { kn: 'ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ನೀವು ಈಗ ಲಾಗ್ ಇನ್ ಮಾಡಬಹುದು.', hi: 'खाता सफलतापूर्वक बन गया! अब आप लॉगिन कर सकते हैं।' },
    'Action': { kn: 'ಕ್ರಮ (Action)', hi: 'कार्रवाई (Action)' },
    'Admin': { kn: 'ನಿರ್ವಾಹಕ (Admin)', hi: 'व्यवस्थापक (Admin)' },
    'Admin Portal': { kn: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್', hi: 'व्यवस्थापक पोर्टल' },
    'Admin Portal Sign In': { kn: 'ಆಡಳಿತ ಪೋರ್ಟಲ್ ಸೈನ್ ಇನ್ (Admin Sign In)', hi: 'प्रशासक पोर्टल साइन इन (Admin Sign In)' },
    'Admin login required.': { kn: 'ನಿರ್ವಾಹಕ ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ.', hi: 'व्यवस्थापक लॉगिन आवश्यक है।' },
    'AgroIntel Command Center': { kn: 'ಅಗ್ರೋಇಂಟೆಲ್ ಕಮಾಂಡ್ ಸೆಂಟರ್', hi: 'एग्रोइंटेल कमांड सेंटर' },
    'AgroIntel brings together machine-learning models and real agricultural data so Indian farmers can choose the right crop, predict yields, optimize yields, and make data-driven farming decisions.': { kn: 'ಭಾರತೀಯ ರೈತರು ಸರಿಯಾದ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲು, ಇಳುವರಿಯನ್ನು ಮುನ್ಸೂಚಿಸಲು ಮತ್ತು ದತ್ತಾಂಶ ಆಧಾರಿತ ಕೃಷಿ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಅಗ್ರೋಇಂಟೆಲ್ ಸಹಾಯ ಮಾಡುತ್ತದೆ.', hi: 'एग्रोइंटेल मशीन लर्निंग मॉडल और वास्तविक कृषि डेटा को एक साथ लाता है ताकि भारतीय किसान सही फसल चुन सकें और सटीक निर्णय ले सकें।' },
    'All 7 soil and climate parameters are required.': { kn: 'ಎಲ್ಲಾ 7 ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ನಿಯತಾಂಕಗಳು ಅಗತ್ಯವಿದೆ.', hi: 'सभी 7 मिट्टी और जलवायु पैरामीटर आवश्यक हैं।' },
    'Already have an account?': { kn: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?', hi: 'क्या पहले से एक खाता मौजूद है?' },
    'An account with this email already exists. Please log in.': { kn: 'ಈ ಇಮೇಲ್ ಹೊಂದಿರುವ ಖಾತೆ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.', hi: 'इस ईमेल वाला खाता पहले से मौजूद है। कृपया लॉगिन करें।' },
    'Best crop for your soil': { kn: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆ', hi: 'आपकी मिट्टी के लिए सर्वोत्तम फसल' },
    'City weather conditions': { kn: 'ನಗರ ಹವಾಮಾನ ಸ್ಥಿತಿ', hi: 'शहर का मौसम' },
    'Commodity': { kn: 'ಕೃಷಿ ಉತ್ಪನ್ನ', hi: 'कृषि जिंस / फसल' },
    'Compute Expected Yield Tonnage': { kn: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ಲೆಕ್ಕಹಾಕಿ', hi: 'अनुमानित पैदावार की गणना करें' },
    'Compute Recommended Fertilizer': { kn: 'ಸೂಕ್ತ ರಸಗೊಬ್ಬರ ಲೆಕ್ಕಹಾಕಿ', hi: 'उर्वरक की सिफारिश निकालें' },
    'Confirm Password': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ', hi: 'पासवर्ड की पुष्टि करें' },
    'Contact': { kn: 'ಸಂಪರ್ಕ', hi: 'संपर्क' },
    'Contact AgroIntel Team': { kn: 'ಅಗ್ರೋಇಂಟೆಲ್ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'एग्रोइंटेल टीम से संपर्क करें' },
    'Contact message deleted.': { kn: 'ಸಂಪರ್ಕ ಸಂದೇಶವನ್ನು ಅಳಿಸಲಾಗಿದೆ.', hi: 'संपर्क संदेश हटा दिया गया।' },
    'Create Farmer Account': { kn: 'ರೈತ ಖಾತೆಯನ್ನು ರಚಿಸಿ', hi: 'किसान खाता बनाएं' },
    'Create Password': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ', hi: 'पासवर्ड बनाएं' },
    'Create Your Farmer Account': { kn: 'ನಿಮ್ಮ ರೈತ ಖಾತೆಯನ್ನು ರಚಿಸಿ', hi: 'अपना किसान खाता बनाएं' },
    'Create your profile to start using ML-based prediction tools & farming insights': { kn: 'ಕೃಷಿ ಒಳನೋಟಗಳು ಮತ್ತು ಯಂತ್ರ ಕಲಿಕೆ ಪರಿಕರಗಳನ್ನು ಬಳಸಲು ಪ್ರೊಫೈಲ್ ರಚಿಸಿ', hi: 'एमएल-आधारित कृषि अंतर्दृष्टि और उपकरणों का उपयोग शुरू करने के लिए प्रोफ़ाइल बनाएं' },
    'Crop Recommendation': { kn: 'ಬೆಳೆ ಶಿಫಾರಸು (Crop Recommendation)', hi: 'फसल अनुशंसा (Crop Recommendation)' },
    'Crop Types': { kn: 'ಬೆಳೆ ಪ್ರಕಾರಗಳು', hi: 'फसल के प्रकार' },
    'Cultivation Season': { kn: 'ಬೆಳೆ ಹಂಗಾಮು', hi: 'खेती का मौसम (सीजन)' },
    'Data-Driven Farming': { kn: 'ದತ್ತಾಂಶ ಚಾಲಿತ ಕೃಷಿ', hi: 'डेटा-संचालित खेती' },
    'Date': { kn: 'ದಿನಾಂಕ', hi: 'तारीख' },
    'Demo Credentials (click to show)': { kn: 'ಡೆಮೊ ರುಜುವಾತುಗಳು (ತೋರಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ)', hi: 'डेमो क्रेडेंशियल (दिखाने के लिए क्लिक करें)' },
    'District': { kn: 'ಜಿಲ್ಲೆ (District)', hi: 'ज़िला (District)' },
    'District / City': { kn: 'ಜಿಲ್ಲೆ / ನಗರ', hi: 'ज़िला / शहर' },
    'Don't have an account yet?': { kn: 'ಇನ್ನೂ ಖಾತೆ ಹೊಂದಿಲ್ಲವೇ?', hi: 'अभी तक खाता नहीं है?' },
    'Email / Username': { kn: 'ಇಮೇಲ್ / ಬಳಕೆದಾರ ಹೆಸರು', hi: 'ईमेल / उपयोगकर्ता नाम' },
    'Email Address': { kn: 'ಇಮೇಲ್ ವಿಳಾಸ', hi: 'ईमेल पता' },
    'Enter your credentials to access your dashboard': { kn: 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ', hi: 'अपने डैशबोर्ड तक पहुँचने के लिए क्रेडेंशियल दर्ज करें' },
    'Estimate Rainfall': { kn: 'ಮಳೆಯನ್ನು ಅಂದಾಜಿಸಿ', hi: 'वर्षा का अनुमान लगाएं' },
    'Estimate output in tonnes': { kn: 'ಟನ್‌ಗಳಲ್ಲಿ ಇಳುವರಿ ಅಂದಾಜು', hi: 'टन में अनुमानित पैदावार' },
    'Estimated Benchmark': { kn: 'ಅಂದಾಜು ಮಾನದಂಡ', hi: 'अनुमानित बेंचमार्क' },
    'Estimation Basis': { kn: 'ಅಂದಾಜಿನ ಆಧಾರ', hi: 'अनुमान का आधार' },
    'Farmer': { kn: 'ರೈತ (Farmer)', hi: 'किसान (Farmer)' },
    'Farmer Account Registration': { kn: 'ರೈತ ಖಾತೆ ನೋಂದಣಿ', hi: 'किसान खाता पंजीकरण' },
    'Farmer Portal': { kn: 'ರೈತ ಪೋರ್ಟಲ್', hi: 'किसान पोर्टल' },
    'Farmer Portal Sign In': { kn: 'ರೈತ ಪೋರ್ಟಲ್ ಸೈನ್ ಇನ್ (Farmer Sign In)', hi: 'किसान पोर्टल साइन इन (Farmer Sign In)' },
    'Farmer user deleted.': { kn: 'ರೈತ ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಲಾಗಿದೆ.', hi: 'किसान उपयोगकर्ता को हटा दिया गया।' },
    'Farmers': { kn: 'ರೈತರು (Farmers)', hi: 'किसान (Farmers)' },
    'Fertilizer Advisory': { kn: 'ಗೊಬ್ಬರ ಸಲಹಾ ವ್ಯವಸ್ಥೆ (Fertilizer Advisory)', hi: 'उर्वरक सलाह (Fertilizer Advisory)' },
    'Fetching live market prices...': { kn: 'ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ತರಲಾಗುತ್ತಿದೆ...', hi: 'मंडी भाव लोड हो रहे हैं...' },
    'Forgot your password? Reset here →': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ? ಇಲ್ಲಿ ಮರುಹೊಂದಿಸಿ →', hi: 'पासवर्ड भूल गए? यहाँ रीसेट करें →' },
    'Full Name': { kn: 'ಪೂರ್ಣ ಹೆಸರು', hi: 'पूरा नाम' },
    'Get Your Results Instantly': { kn: 'ತಕ್ಷಣ ನಿಮ್ಮ ಫಲಿತಾಂಶಗಳನ್ನು ಪಡೆಯಿರಿ', hi: 'तुरंत अपने परिणाम प्राप्त करें' },
    'Getting started takes under a minute. Register your farmer account and access agricultural advisory tools right away.': { kn: 'ಪ್ರಾರಂಭಿಸಲು ಒಂದು ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ. ನಿಮ್ಮ ರೈತ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ.', hi: 'शुरू करने में एक मिनट से भी कम समय लगता है। अपना किसान खाता पंजीकृत करें।' },
    'Grow Smarter with': { kn: 'ಇದರೊಂದಿಗೆ ಚುರುಕಾಗಿ ಬೆಳೆಯಿರಿ', hi: 'इसके साथ समझदारी से फसल उगाएं' },
    'Have questions about crop models, buyer registration, or technical setup? Send us a message.': { kn: 'ಬೆಳೆ ಮಾದರಿಗಳು ಅಥವಾ ತಾಂತ್ರಿಕ ಸೆಟಪ್ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ಸಂದೇಶ ಕಳುಹಿಸಿ.', hi: 'क्या आपके पास फसल मॉडल या तकनीकी सेटअप के बारे में प्रश्न हैं? हमें संदेश भेजें।' },
    'Historical Average Rainfall': { kn: 'ಐತಿಹಾಸಿಕ ಸರಾಸರಿ ಮಳೆ', hi: 'ऐतिहासिक औसत वर्षा' },
    'Historical Rainfall (Climatology)': { kn: 'ಐತಿಹಾಸಿಕ ಸರಾಸರಿ ಮಳೆ (Rainfall Climatology)', hi: 'ऐतिहासिक औसत वर्षा (Rainfall Climatology)' },
    'Home': { kn: 'ಮುಖಪುಟ', hi: 'होम' },
    'How It Works': { kn: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ', hi: 'यह कैसे काम करता है' },
    'Humidity (%)': { kn: 'ಆರ್ದ್ರತೆ (%)', hi: 'आर्द्रता / नमी (%)' },
    'IMD Climatology': { kn: 'ಐಎಂಡಿ ಹವಾಮಾನ ದತ್ತಾಂಶ', hi: 'आईएमडी जलवायु विज्ञान' },
    'Input Your Farm Data': { kn: 'ನಿಮ್ಮ ಕೃಷಿ ದತ್ತಾಂಶವನ್ನು ನಮೂದಿಸಿ', hi: 'अपना कृषि डेटा दर्ज करें' },
    'Invalid credentials. Please check your email/username and password.': { kn: 'ಅಮಾನ್ಯ ರುಜುವಾತುಗಳು. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್/ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಪರಿಶೀಲಿಸಿ.', hi: 'अमान्य क्रेडेंशियल। कृपया अपना ईमेल/उपयोगकर्ता नाम और पासवर्ड जांचें।' },
    'Join AgroIntel Network': { kn: 'ಅಗ್ರೋಇಂಟೆಲ್ ಜಾಲಕ್ಕೆ ಸೇರಿ', hi: 'एग्रोइंटेल नेटवर्क से जुड़ें' },
    'LOGOUT': { kn: 'ನಿರ್ಗಮಿಸಿ', hi: 'लॉगआउट' },
    'Land Area (Acre)': { kn: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)', hi: 'जमीन का क्षेत्रफल (एकड़)' },
    'Live Mandi Prices': { kn: 'ಲೈವ್ ಮಂಡಿ ದರಗಳು', hi: 'लाइव मंडी भाव' },
    'Live feed temporarily unavailable — showing estimated rates': { kn: 'ಲೈವ್ ಫೀಡ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ — ಅಂದಾಜು ದರಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ', hi: 'लाइव फीड अस्थायी रूप से अनुपलब्ध है — अनुमानित दरें प्रदर्शित हैं' },
    'Location / Address': { kn: 'ಸ್ಥಳ / ವಿಳಾಸ', hi: 'स्थान / पता' },
    'Logout': { kn: 'ಲಾಗ್ ಔಟ್ (Logout)', hi: 'लॉग आउट (Logout)' },
    'ML Model Used': { kn: 'ಬಳಸಿದ ML ಮಾದರಿ', hi: 'उपयोग किया गया एमएल मॉडल' },
    'Mandi Market Intelligence': { kn: 'ಮಂಡಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು (Mandi Prices)', hi: 'मंडी बाज़ार भाव (Mandi Prices)' },
    'Mandi Rates': { kn: 'ಮಂಡಿ ದರಗಳು', hi: 'मंडी दरें' },
    'Market / APMC': { kn: 'ಮಾರುಕಟ್ಟೆ / ಎಪಿಎಂಸಿ', hi: 'मंडी / एपीएमसी' },
    'Market Intelligence': { kn: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ', hi: 'बाजार भाव व जानकारी' },
    'Max ₹/q': { kn: 'ಗರಿಷ್ಠ ₹/ಕ್ವಿಂಟಾಲ್', hi: 'अधिकतम ₹/क्विंटल' },
    'Max:': { kn: 'ಗರಿಷ್ಠ:', hi: 'अधिकतम:' },
    'Message': { kn: 'ಸಂದೇಶ', hi: 'संदेश' },
    'Messages': { kn: 'ಸಂದೇಶಗಳು (Messages)', hi: 'संदेश (Messages)' },
    'Meteorological Subdivision': { kn: 'ಹವಾಮಾನ ಉಪವಿಭಾಗ', hi: 'मौसम विज्ञान उप-मंडल' },
    'Min ₹/q': { kn: 'ಕನಿಷ್ಠ ₹/ಕ್ವಿಂಟಾಲ್', hi: 'न्यूनतम ₹/क्विंटल' },
    'Min:': { kn: 'ಕನಿಷ್ಠ:', hi: 'न्यूनतम:' },
    'Mobile Number': { kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', hi: 'मोबाइल नंबर' },
    'Modal ₹/q': { kn: 'ಮಾದರಿ ₹/ಕ್ವಿಂಟಾಲ್', hi: 'मॉडल ₹/क्विंटल' },
    'Model Intelligence': { kn: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವಿವರಗಳು (AI)', hi: 'मॉडल इंटेलिजेंस (AI विवरण)' },
    'Monthly rain forecast': { kn: 'ಮಾಸಿಕ ಮಳೆ ಮುನ್ಸೂಚನೆ', hi: 'मासिक वर्षा पूर्वानुमान' },
    'My Location': { kn: 'ನನ್ನ ಸ್ಥಳ', hi: 'मेरा स्थान' },
    'Nearby': { kn: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳು', hi: 'आस-पास' },
    'Next-Gen Smart Agriculture Platform': { kn: 'ಮುಂದಿನ ಪೀಳಿಗೆಯ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ', hi: 'अगली पीढ़ी का स्मार्ट कृषि मंच' },
    'Nitrogen (N)': { kn: 'ಸಾರಜನಕ (Nitrogen - N)', hi: 'नाइट्रोजन (Nitrogen - N)' },
    'No market data found for this location': { kn: 'ಈ ಸ್ಥಳಕ್ಕೆ ಯಾವುದೇ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ', hi: 'इस स्थान के लिए कोई मंडी डेटा उपलब्ध नहीं है' },
    'One intelligent platform covering everything a modern farmer needs — from soil analysis to market rates.': { kn: 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆಯಿಂದ ಹಿಡಿದು ಮಾರುಕಟ್ಟೆ ದರಗಳವರೆಗೆ ಆಧುನಿಕ ರೈತನಿಗೆ ಬೇಕಾದ ಎಲ್ಲವನ್ನೂ ಒಳಗೊಂಡಿರುವ ಒಂದು ಬುದ್ಧಿವಂತ ವೇದಿಕೆ.', hi: 'मिट्टी के विश्लेषण से लेकर बाज़ार दरों तक - एक आधुनिक किसान के लिए आवश्यक हर चीज़ को कवर करने वाला एक बुद्धिमान मंच।' },
    'Optimal Commercial Treatment': { kn: 'ಸೂಕ್ತ ವಾಣಿಜ್ಯ ಗೊಬ್ಬರ', hi: 'इष्टतम वाणिज्यिक उपचार' },
    'Optimal NPK formula': { kn: 'ಸೂಕ್ತ NPK ಸೂತ್ರ', hi: 'उचित एनपीके फॉर्मूला' },
    'Password': { kn: 'ಪಾಸ್‌ವರ್ಡ್ (Password)', hi: 'पासवर्ड (Password)' },
    'Password must be at least 8 characters long and not a common sequence.': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಷ್ಟಿರಬೇಕು ಮತ್ತು ಸುಲಭದ ಅನುಕ್ರಮವಾಗಿರಬಾರದು.', hi: 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए और सामान्य अनुक्रम नहीं होना चाहिए।' },
    'Password must be at least 8 characters long.': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಷ್ಟು ಉದ್ದವಾಗಿರಬೇಕು.', hi: 'पासवर्ड कम से कम 8 वर्ण लंबा होना चाहिए।' },
    'Passwords do not match. Please re-enter them.': { kn: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಅವುಗಳನ್ನು ಮರು-ನಮೂದಿಸಿ.', hi: 'पासवर्ड मेल नहीं खाते। कृपया उन्हें पुनः दर्ज करें।' },
    'Phone Number': { kn: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ', hi: 'फ़ोन नंबर' },
    'Phosphorus (P)': { kn: 'ರಂಜಕ (Phosphorus - P)', hi: 'फास्फोरस (Phosphorus - P)' },
    'Platform Capabilities': { kn: 'ವೇದಿಕೆಯ ಸಾಮರ್ಥ್ಯಗಳು', hi: 'प्लेटफ़ॉर्म क्षमताएं' },
    'Please enter a message.': { kn: 'ದಯವಿಟ್ಟು ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ.', hi: 'कृपया एक संदेश दर्ज करें।' },
    'Please enter a valid 10-digit phone number.': { kn: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.', hi: 'कृपया 10 अंकों का मान्य फ़ोन नंबर दर्ज करें।' },
    'Please enter a valid cultivation area greater than 0 acres.': { kn: 'ದಯವಿಟ್ಟು 0 ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಮಾನ್ಯವಾದ ಕೃಷಿ ಪ್ರದೇಶವನ್ನು ನಮೂದಿಸಿ.', hi: 'कृपया 0 एकड़ से अधिक का मान्य कृषि क्षेत्र दर्ज करें।' },
    'Please enter a valid email address.': { kn: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.', hi: 'कृपया एक मान्य ईमेल पता दर्ज करें।' },
    'Please enter a valid email.': { kn: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ನಮೂದಿಸಿ.', hi: 'कृपया एक मान्य ईमेल दर्ज करें।' },
    'Please enter a valid name.': { kn: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.', hi: 'कृपया एक मान्य नाम दर्ज करें।' },
    'Please log in to access the Farmer Portal.': { kn: 'ರೈತ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಲು ದಯವಿಟ್ಟು ಲಾಗ್ ಇನ್ ಮಾಡಿ.', hi: 'किसान पोर्टल तक पहुँचने के लिए कृपया लॉग इन करें।' },
    'Please select a valid state and district from the choices.': { kn: 'ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ಮಾನ್ಯವಾದ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.', hi: 'कृपया विकल्पों में से एक मान्य राज्य और ज़िला चुनें।' },
    'Potassium (K)': { kn: 'ಪೊಟ್ಯಾಶಿಯಂ (Potassium - K)', hi: 'पोटेशियम (Potassium - K)' },
    'Prediction Suite': { kn: 'ಮುನ್ಸೂಚನಾ ಪರಿಕರಗಳು', hi: 'पूर्वानुमान सुइट' },
    'Prediction Tools': { kn: 'ಮುನ್ಸೂಚನಾ ಪರಿಕರಗಳು', hi: 'पूर्वानुमान टूल्स' },
    'Public registration is restricted to Farmer accounts. Admin credentials are provisioned directly by system administrators.': { kn: 'ಸಾರ್ವಜನಿಕ ನೋಂದಣಿ ರೈತ ಖಾತೆಗಳಿಗೆ ಸೀಮಿತವಾಗಿದೆ. ನಿರ್ವಾಹಕ ರುಜುವಾತುಗಳನ್ನು ನೇರವಾಗಿ ವ್ಯವಸ್ಥಾಪಕರು ಒದಗಿಸುತ್ತಾರೆ.', hi: 'सार्वजनिक पंजीकरण केवल किसान खातों तक सीमित है। व्यवस्थापक क्रेडेंशियल सीधे सिस्टम प्रशासकों द्वारा प्रदान किए जाते हैं।' },
    'Quick Soil Presets': { kn: 'ತ್ವರಿತ ಮಣ್ಣಿನ ಆಯ್ಕೆಗಳು', hi: 'त्वरित मिट्टी विकल्प' },
    'Rainfall (mm)': { kn: 'ಮಳೆ ಪ್ರಮಾಣ (ಮಿ.ಮೀ)', hi: 'वर्षा (मिमी)' },
    'Rainfall Estimation': { kn: 'ಮಳೆ ಅಂದಾಜು', hi: 'वर्षा अनुमान' },
    'Real-time APMC commodity rates from Agmarknet — pick a state and district, or detect your location.': { kn: 'ಅಗ್ಮಾರ್ಕ್‌ನೆಟ್‌ನಿಂದ ನೈಜ ಸಮಯದ ಎಪಿಎಂಸಿ ದರಗಳು — ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಅಥವಾ ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿ.', hi: 'एगमार्कनेट से वास्तविक समय एपीएमसी कृषि दरें — राज्य और जिला चुनें, या स्थान खोजें।' },
    'Real-time commodity rates': { kn: 'ನೈಜ ಸಮಯದ ಮಾರುಕಟ್ಟೆ ದರಗಳು', hi: 'ताजा कृषि उपज दरें' },
    'Recommendation Basis': { kn: 'ಶಿಫಾರಸಿನ ಆಧಾರ', hi: 'सिफारिश का आधार' },
    'Recommendation Ready': { kn: 'ಶಿಫಾರಸು ಸಿದ್ಧವಾಗಿದೆ', hi: 'अनुशंसा तैयार है' },
    'Recommended Crop': { kn: 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ', hi: 'अनुशंसಿತ फसल' },
    'Register Farmer Account': { kn: 'ರೈತ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ', hi: 'किसान खाता पंजीकृत करें' },
    'Run Crop Recommendation': { kn: 'ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ', hi: 'फसल सिफारिश प्राप्त करें' },
    'Search': { kn: 'ಹುಡುಕಿ', hi: 'खोजें' },
    'Select a state first…': { kn: 'ಮೊದಲು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ…', hi: 'पहले राज्य चुनें…' },
    'Select a state…': { kn: 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ…', hi: 'राज्य चुनें…' },
    'Select your district…': { kn: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ…', hi: 'अपना जिला चुनें…' },
    'Sign In': { kn: 'ಸೈನ್ ಇನ್ (Sign In)', hi: 'साइन इन (Sign In)' },
    'Sign In Here': { kn: 'ಇಲ್ಲಿ ಸೈನ್ ಇನ್ ಮಾಡಿ', hi: 'यहाँ साइन इन करें' },
    'Sign In to Portal': { kn: 'ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ', hi: 'पोर्टल में साइन इन करें' },
    'Simple. Fast. Accurate.': { kn: 'ಸರಳ. ವೇಗ. ನಿಖರ.', hi: 'सरल। तेज। सटीक।' },
    'Soil Moisture': { kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ (Moisture)', hi: 'मिट्टी की नमी' },
    'Soil Type': { kn: 'ಮಣ್ಣಿನ ವಿಧ', hi: 'मिट्टी का प्रकार' },
    'Soil moisture cannot exceed 100%.': { kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶವು 100% ಮೀರಬಾರದು.', hi: 'मिट्टी की नमी 100% से अधिक नहीं हो सकती।' },
    'Soil pH Level': { kn: 'ಮಣ್ಣಿನ pH ಮಟ್ಟ', hi: 'मिट्टी का पीएच स्तर (pH)' },
    'State': { kn: 'ರಾಜ್ಯ (State)', hi: 'राज्य (State)' },
    'Submit Inquiry': { kn: 'ವಿಚಾರಣೆಯನ್ನು ಸಲ್ಲಿಸಿ', hi: 'पूछताछ सबमिट करें' },
    'System Administration': { kn: 'ವ್ಯವಸ್ಥೆಯ ಆಡಳಿತ', hi: 'सिस्टम प्रशासन' },
    'Target Crop': { kn: 'ಉದ್ದೇಶಿತ ಬೆಳೆ', hi: 'लक्षित फसल' },
    'Target Month': { kn: 'ಗುರಿ ತಿಂಗಳು', hi: 'महीना' },
    'Temperature (°C)': { kn: 'ತಾಪಮಾನ (°C)', hi: 'तापमान (°C)' },
    'The buyer marketplace has been retired. Redirecting to Farmer Portal.': { kn: 'ಖರೀದಿದಾರರ ಮಾರುಕಟ್ಟೆಯನ್ನು ನಿವೃತ್ತಿಗೊಳಿಸಲಾಗಿದೆ. ರೈತ ಪೋರ್ಟಲ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ.', hi: 'क्रेता बाज़ार को हटा दिया गया है। किसान पोर्टल पर पुनर्निर्देशित किया जा रहा है।' },
    'The password reset link is invalid or has already been used.': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಅಮಾನ್ಯವಾಗಿದೆ ಅಥವಾ ಈಗಾಗಲೇ ಬಳಸಲಾಗಿದೆ.', hi: 'पासवर्ड रीसेट लिंक अमान्य है या पहले ही उपयोग किया जा चुका है।' },
    'Top Commodities': { kn: 'ಪ್ರಮುಖ ಕೃಷಿ ಉತ್ಪನ್ನಗಳು', hi: 'प्रमुख कृषि उत्पाद' },
    'Total Forecasted Harvest': { kn: 'ಒಟ್ಟು ಮುನ್ಸೂಚಿತ ಕೊಯ್ಲು', hi: 'कुल अनुमानित उपज' },
    'Trained ML Models': { kn: 'ತರಬೇತಿ ಪಡೆದ ಯಂತ್ರ ಮಾದರಿಗಳು', hi: 'प्रशिक्षित एमएल मॉडल' },
    'Try a different state or district': { kn: 'ಬೇರೆ ರಾಜ್ಯ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ', hi: 'कृपया अन्य राज्य या जिला चुनें' },
    'Use 8+ characters with numbers & symbols for a stronger password': { kn: 'ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್‌ಗಾಗಿ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಚಿಹ್ನೆಗಳೊಂದಿಗೆ 8+ ಅಕ್ಷರಗಳನ್ನು ಬಳಸಿ', hi: 'मजबूत पासवर्ड के लिए 8+ वर्ण, संख्याएँ और प्रतीक उपयोग करें' },
    'Variety': { kn: 'ತಳಿ / ವಿಧ', hi: 'किस्म / वैरायटी' },
    'We're Here to Help': { kn: 'ನಾವು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ', hi: 'हम सहायता के लिए यहाँ हैं' },
    'Weather Forecast': { kn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ (Weather Forecast)', hi: 'मौसम पूर्वानुमान (Weather Forecast)' },
    'Welcome Admin!': { kn: 'ನಿರ್ವಾಹಕರಿಗೆ ಸುಸ್ವಾಗತ!', hi: 'व्यवस्थापक का स्वागत है!' },
    'What AgroIntel Can Do': { kn: 'ಅಗ್ರೋಇಂಟೆಲ್ ಏನು ಮಾಡಬಲ್ಲದು', hi: 'एग्रोइंटेल क्या कर सकता है' },
    'Yield Forecast': { kn: 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ (Yield Forecast)', hi: 'उपज पूर्वानुमान (Yield Forecast)' },
    'Yield Harvest Forecast': { kn: 'ಇಳುವರಿ ಬೆಳೆ ಮುನ್ಸೂಚನೆ', hi: 'उपज फसल पूर्वानुमान' },
    'You have logged out.': { kn: 'ನೀವು ಲಾಗ್ ಔಟ್ ಆಗಿದ್ದೀರಿ.', hi: 'आप लॉग आउट हो चुके हैं।' },
    'Your message has been submitted successfully!': { kn: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!', hi: 'आपका संदेश सफलतापूर्वक सबमिट कर दिया गया है!' },
    'Your password has been successfully reset. Please log in with your new password.': { kn: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ.', hi: 'आपका पासवर्ड सफलतापूर्वक रीसेट कर दिया गया है। कृपया अपने नए पासवर्ड के साथ लॉगिन करें।' },
    'Your session expired due to inactivity or a server restart. A fresh session has been loaded — please try again.': { kn: 'ನಿಷ್ಕ್ರಿಯತೆಯಿಂದಾಗಿ ನಿಮ್ಮ ಸೆಷನ್ ಮುಕ್ತಾಯಗೊಂಡಿದೆ. ತಾಜಾ ಸೆಷನ್ ಲೋಡ್ ಮಾಡಲಾಗಿದೆ — ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', hi: 'निष्क्रियता के कारण आपका सत्र समाप्त हो गया। एक नया सत्र लोड किया गया है - कृपया पुनः प्रयास करें।' },
    'commodities': { kn: 'ಕೃಷಿ ಉತ್ಪನ್ನಗಳು', hi: 'कृषि उत्पाद' },
    'per quintal': { kn: 'ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ', hi: 'प्रति क्विंटल' },
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
