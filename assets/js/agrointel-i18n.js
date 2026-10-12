/**
 * AgroIntel Multilingual Translation Engine & Crop Language Module
 * Supported Languages: English ('en'), Kannada ('kn' - ಕನ್ನಡ), Hindi ('hi' - हिन्दी)
 */
(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CROP LANGUAGE MODULE DICTIONARY (Cereals, Pulses, Cash Crops, Fruits, Veg)
  // ═══════════════════════════════════════════════════════════════
  const CROP_TRANSLATIONS = {
    // Cereals & Grains
    'rice': { kn: 'ಭತ್ತ (Rice)', hi: 'धान / चावल (Rice)', pureKn: 'ಭತ್ತ', pureHi: 'चावल' },
    'paddy': { kn: 'ಭತ್ತ (Paddy)', hi: 'धान (Paddy)', pureKn: 'ಭತ್ತ', pureHi: 'धान' },
    'paddy / rice': { kn: 'ಭತ್ತ / ಅಕ್ಕಿ (Paddy)', hi: 'धान / चावल (Paddy)', pureKn: 'ಭತ್ತ', pureHi: 'धान' },
    'wheat': { kn: 'ಗೋಧಿ (Wheat)', hi: 'गेहूं (Wheat)', pureKn: 'ಗೋಧಿ', pureHi: 'गेहूं' },
    'maize': { kn: 'ಮೆಕ್ಕೆಜೋಳ (Maize)', hi: 'मक्का (Maize)', pureKn: 'ಮೆಕ್ಕೆಜೋಳ', pureHi: 'मक्का' },
    'barley': { kn: 'ಬಾರ್ಲಿ (Barley)', hi: 'जौ (Barley)', pureKn: 'ಬಾರ್ಲಿ', pureHi: 'जौ' },
    'bajra': { kn: 'ಸಜ್ಜೆ (Bajra)', hi: 'बाजरा (Bajra)', pureKn: 'ಸಜ್ಜೆ', pureHi: 'बाजरा' },
    'jowar': { kn: 'ಜೋಳ (Jowar)', hi: 'ज्वार (Jowar)', pureKn: 'ಜೋಳ', pureHi: 'ज्वार' },
    'ragi': { kn: 'ರಾಗಿ (Ragi)', hi: 'रागी / मडुआ (Ragi)', pureKn: 'ರಾಗಿ', pureHi: 'रागी' },
    'millets': { kn: 'ಸಿರಿಧಾನ್ಯಗಳು (Millets)', hi: 'मोटे अनाज (Millets)', pureKn: 'ಸಿರಿಧಾನ್ಯಗಳು', pureHi: 'मोटे अनाज' },
    'small millets': { kn: 'ಕಿರುಧಾನ್ಯಗಳು (Small Millets)', hi: 'लघु धान्य (Millets)', pureKn: 'ಕಿರುಧಾನ್ಯಗಳು', pureHi: 'लघु धान्य' },

    // Pulses & Legumes
    'chickpea': { kn: 'ಕಡಲೆ (Chickpea / Chana)', hi: 'चना (Chickpea)', pureKn: 'ಕಡಲೆ', pureHi: 'चना' },
    'gram': { kn: 'ಕಡಲೆ (Bengal Gram)', hi: 'चना (Gram)', pureKn: 'ಕಡಲೆ', pureHi: 'चना' },
    'kidneybeans': { kn: 'ರಾಜ್ಮಾ (Rajma)', hi: 'राजमा (Kidney Beans)', pureKn: 'ರಾಜ್ಮಾ', pureHi: 'राजमा' },
    'pigeonpeas': { kn: 'ತೊಗರಿ (Tur / Arhar)', hi: 'अरहर / तुअर (Arhar)', pureKn: 'ತೊಗರಿ', pureHi: 'अरहर' },
    'arhar/tur': { kn: 'ತೊಗರಿ ಬೇಳೆ (Arhar / Tur)', hi: 'अरहर / तुअर (Tur)', pureKn: 'ತೊಗರಿ ಬೇಳೆ', pureHi: 'अरहर' },
    'mothbeans': { kn: 'ಮಡಿಕೆ ಕಾಳು (Moth Bean)', hi: 'मोठ दाल (Moth Bean)', pureKn: 'ಮಡಿಕೆ ಕಾಳು', pureHi: 'मोठ दाल' },
    'mungbean': { kn: 'ಹೆಸರು ಕಾಳು (Moong Bean)', hi: 'मूंग दाल (Moong)', pureKn: 'ಹೆಸರು ಕಾಳು', pureHi: 'मूंग दाल' },
    'moong': { kn: 'ಹೆಸರು ಕಾಳು (Moong)', hi: 'मूंग दाल (Moong)', pureKn: 'ಹೆಸರು ಕಾಳು', pureHi: 'मूंग दाल' },
    'moong(green gram)': { kn: 'ಹೆಸರು ಕಾಳು (Green Gram)', hi: 'मूंग (Green Gram)', pureKn: 'ಹೆಸರು ಕಾಳು', pureHi: 'मूंग' },
    'blackgram': { kn: 'ಉದ್ದಿನ ಕಾಳು (Urad Dal)', hi: 'उड़द दाल (Black Gram)', pureKn: 'ಉದ್ದಿನ ಕಾಳು', pureHi: 'उड़द दाल' },
    'urad': { kn: 'ಉದ್ದಿನ ಕಾಳು (Urad)', hi: 'उड़द दाल (Urad)', pureKn: 'ಉದ್ದಿನ ಕಾಳು', pureHi: 'उड़द दाल' },
    'lentil': { kn: 'ಮಸೂರ ಬೇಳೆ (Masoor Dal)', hi: 'मसूर दाल (Lentil)', pureKn: 'ಮಸೂರ ಬೇಳೆ', pureHi: 'मसूर दाल' },
    'peas': { kn: 'ಬಟಾಣಿ (Peas)', hi: 'मटर (Peas)', pureKn: 'ಬಟಾಣಿ', pureHi: 'मटर' },
    'pulses': { kn: 'ಬೇಳೆಕಾಳುಗಳು (Pulses)', hi: 'दालें (Pulses)', pureKn: 'ಬೇಳೆಕಾಳುಗಳು', pureHi: 'दालें' },
    'horse gram': { kn: 'ಹುರುಳಿ ಕಾಳು (Horse Gram)', hi: 'कुलथी (Horse Gram)', pureKn: 'ಹುರುಳಿ ಕಾಳು', pureHi: 'कुलथी' },
    'horse-gram': { kn: 'ಹುರುಳಿ ಕಾಳು (Horse Gram)', hi: 'कुलथी (Horse Gram)', pureKn: 'ಹುರುಳಿ ಕಾಳು', pureHi: 'कुलथी' },
    'cowpea(lobia)': { kn: 'ಅಲಸಂದೆ (Cowpea / Lobia)', hi: 'लोबिया (Cowpea)', pureKn: 'ಅಲಸಂದೆ', pureHi: 'लोबिया' },

    // Cash Crops & Fibres
    'cotton': { kn: 'ಹತ್ತಿ (Cotton)', hi: 'कपास (Cotton)', pureKn: 'ಹತ್ತಿ', pureHi: 'कपास' },
    'sugarcane': { kn: 'ಕಬ್ಬು (Sugarcane)', hi: 'गन्ना (Sugarcane)', pureKn: 'ಕಬ್ಬು', pureHi: 'गन्ना' },
    'jute': { kn: 'ಸೆಣಬು (Jute)', hi: 'जूट / पटसन (Jute)', pureKn: 'ಸೆಣಬು', pureHi: 'जूट' },
    'tobacco': { kn: 'ತಂಬಾಕು (Tobacco)', hi: 'तंबाकू (Tobacco)', pureKn: 'ತಂಬಾಕು', pureHi: 'तंबाकू' },

    // Oilseeds
    'groundnut': { kn: 'ಕಡಲೆಕಾಯಿ / ಶೇಂಗಾ (Groundnut)', hi: 'मूंगफली (Groundnut)', pureKn: 'ಕಡಲೆಕಾಯಿ', pureHi: 'मूंगफली' },
    'ground nuts': { kn: 'ಕಡಲೆಕಾಯಿ / ಶೇಂಗಾ (Groundnuts)', hi: 'मूंगफली (Groundnuts)', pureKn: 'ಕಡಲೆಕಾಯಿ', pureHi: 'मूंगफली' },
    'soyabean': { kn: 'ಸೋಯಾಬೀನ್ (Soyabean)', hi: 'सोयाबीन (Soyabean)', pureKn: 'ಸೋಯಾಬೀನ್', pureHi: 'सोयाबीन' },
    'sesame': { kn: 'ಎಳ್ಳು (Sesame / Til)', hi: 'तिल (Sesame)', pureKn: 'ಎಳ್ಳು', pureHi: 'तिल' },
    'sesamum': { kn: 'ಎಳ್ಳು (Sesame)', hi: 'तिल (Sesame)', pureKn: 'ಎಳ್ಳು', pureHi: 'तिल' },
    'sunflower': { kn: 'ಸೂರ್ಯಕಾಂತಿ (Sunflower)', hi: 'सूरजमुखी (Sunflower)', pureKn: 'ಸೂರ್ಯಕಾಂತಿ', pureHi: 'सूरजमुखी' },
    'mustard': { kn: 'ಸಾಸಿವೆ (Mustard)', hi: 'सरसों (Mustard)', pureKn: 'ಸಾಸಿವೆ', pureHi: 'सरसों' },
    'rapeseed &mustard': { kn: 'ಸಾಸಿವೆ (Mustard)', hi: 'सरसों (Mustard)', pureKn: 'ಸಾಸಿವೆ', pureHi: 'सरसों' },
    'oil seeds': { kn: 'ಎಣ್ಣೆಕಾಳುಗಳು (Oil Seeds)', hi: 'तिलहन (Oil Seeds)', pureKn: 'ಎಣ್ಣೆಕಾಳುಗಳು', pureHi: 'तिलहन' },
    'castor seed': { kn: 'ಹರಳು / ಔಡಲ (Castor)', hi: 'अरंडी (Castor)', pureKn: 'ಹರಳು', pureHi: 'अरंडी' },

    // Plantation & Spices
    'coffee': { kn: 'ಕಾಫಿ (Coffee)', hi: 'कॉफ़ी (Coffee)', pureKn: 'ಕಾಫಿ', pureHi: 'कॉफ़ी' },
    'coconut': { kn: 'ತೆಂಗಿನಕಾಯಿ (Coconut)', hi: 'नारियल (Coconut)', pureKn: 'ತೆಂಗಿನಕಾಯಿ', pureHi: 'नारियल' },
    'arecanut': { kn: 'ಅಡಿಕೆ (Arecanut / Supari)', hi: 'सुपारी (Arecanut)', pureKn: 'ಅಡಿಕೆ', pureHi: 'सुपारी' },
    'black pepper': { kn: 'ಕರಿಮೆಣಸು (Black Pepper)', hi: 'काली मिर्च (Black Pepper)', pureKn: 'ಕರಿಮೆಣಸು', pureHi: 'काली मिर्च' },
    'cardamom': { kn: 'ಏಲಕ್ಕಿ (Cardamom)', hi: 'इलायची (Cardamom)', pureKn: 'ಏಲಕ್ಕಿ', pureHi: 'इलायची' },
    'cashewnut': { kn: 'ಗೋಡಂಬಿ (Cashewnut)', hi: 'काजू (Cashewnut)', pureKn: 'ಗೋಡಂಬಿ', pureHi: 'काजू' },
    'turmeric': { kn: 'ಅರಿಶಿನ (Turmeric)', hi: 'हल्दी (Turmeric)', pureKn: 'ಅರಿಶಿನ', pureHi: 'हल्दी' },
    'dry chillies': { kn: 'ಒಣ ಮೆಣಸಿನಕಾಯಿ (Dry Chillies)', hi: 'सूखी लाल मिर्च (Chillies)', pureKn: 'ಒಣ ಮೆಣಸಿನಕಾಯಿ', pureHi: 'लाल मिर्च' },
    'chilli': { kn: 'ಮೆಣಸಿನಕಾಯಿ (Chilli)', hi: 'मिर्च (Chilli)', pureKn: 'ಮೆಣಸಿನಕಾಯಿ', pureHi: 'मिर्च' },
    'ginger': { kn: 'ಶುಂಠಿ (Ginger)', hi: 'अदरक (Ginger)', pureKn: 'ಶುಂಠಿ', pureHi: 'अदरक' },
    'dry ginger': { kn: 'ಶುಂಠಿ (Dry Ginger)', hi: 'सोंठ / अदरक (Ginger)', pureKn: 'ಶುಂಠಿ', pureHi: 'सोंठ' },
    'garlic': { kn: 'ಬೆಳ್ಳುಳ್ಳಿ (Garlic)', hi: 'लहसुन (Garlic)', pureKn: 'ಬೆಳ್ಳುಳ್ಳಿ', pureHi: 'लहसुन' },
    'coriander': { kn: 'ಕೊತ್ತಂಬರಿ (Coriander)', hi: 'धनिया (Coriander)', pureKn: 'ಕೊತ್ತಂಬರಿ', pureHi: 'धनिया' },

    // Fruits & Vegetables
    'pomegranate': { kn: 'ದಾಳಿಂಬೆ (Pomegranate)', hi: 'अनार (Pomegranate)', pureKn: 'ದಾಳಿಂಬೆ', pureHi: 'अनार' },
    'banana': { kn: 'ಬಾಳೆಹಣ್ಣು (Banana)', hi: 'केला (Banana)', pureKn: 'ಬಾಳೆಹಣ್ಣು', pureHi: 'केला' },
    'mango': { kn: 'ಮಾವಿನಹಣ್ಣು (Mango)', hi: 'आम (Mango)', pureKn: 'ಮಾವಿನಹಣ್ಣು', pureHi: 'आम' },
    'grapes': { kn: 'ದ್ರಾಕ್ಷಿ (Grapes)', hi: 'अंगूर (Grapes)', pureKn: 'ದ್ರಾಕ್ಷಿ', pureHi: 'अंगूर' },
    'watermelon': { kn: 'ಕಲ್ಲಂಗಡಿ (Watermelon)', hi: 'तरबूज (Watermelon)', pureKn: 'ಕಲ್ಲಂಗಡಿ', pureHi: 'तरबूज' },
    'muskmelon': { kn: 'ಕರಬೂಜ (Muskmelon)', hi: 'खरबूजा (Muskmelon)', pureKn: 'ಕರಬೂಜ', pureHi: 'खरबूजा' },
    'apple': { kn: 'ಸೇಬು (Apple)', hi: 'सेब (Apple)', pureKn: 'ಸೇಬು', pureHi: 'सेब' },
    'orange': { kn: 'ಕಿತ್ತಳೆ (Orange)', hi: 'संतरा (Orange)', pureKn: 'ಕಿತ್ತಳೆ', pureHi: 'संतरा' },
    'papaya': { kn: 'ಪರಂಗಿ / ಪಪ್ಪಾಯಿ (Papaya)', hi: 'पपीता (Papaya)', pureKn: 'ಪಪ್ಪಾಯಿ', pureHi: 'पपीता' },
    'onion': { kn: 'ಈರುಳ್ಳಿ (Onion)', hi: 'प्याज (Onion)', pureKn: 'ಈರುಳ್ಳಿ', pureHi: 'प्याज' },
    'tomato': { kn: 'ಟೊಮೇಟೊ (Tomato)', hi: 'टमाटर (Tomato)', pureKn: 'ಟೊಮೇಟೊ', pureHi: 'टमाटर' },
    'potato': { kn: 'ಆಲೂಗಡ್ಡೆ (Potato)', hi: 'आलू (Potato)', pureKn: 'ಆಲೂಗಡ್ಡೆ', pureHi: 'आलू' },
    'brinjal': { kn: 'ಬದನೆಕಾಯಿ (Brinjal)', hi: 'बैंगन (Brinjal)', pureKn: 'ಬದನೆಕಾಯಿ', pureHi: 'बैंगन' },
    'cucumber': { kn: 'ಸೌತೆಕಾಯಿ (Cucumber)', hi: 'खीरा (Cucumber)', pureKn: 'ಸೌತೆಕಾಯಿ', pureHi: 'खीरा' }
  };

  const TRANSLATIONS = {
    // ═══════════════════════════════════════════════════════════════
    // 1. GLOBAL & NAVIGATION
    // ═══════════════════════════════════════════════════════════════
    'Farmer Portal': { kn: 'ರೈತ ಪೋರ್ಟಲ್', hi: 'किसान पोर्टल' },
    'Admin Portal': { kn: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್', hi: 'व्यवस्थापक पोर्टल' },
    'Admin': { kn: 'ನಿರ್ವಾಹಕ', hi: 'एडमिन' },
    'LOGOUT': { kn: 'ನಿರ್ಗಮಿಸಿ', hi: 'लॉगआउट' },
    'Logout': { kn: 'ನಿರ್ಗಮಿಸಿ', hi: 'लॉगआउट' },
    'Home': { kn: 'ಮುಖಪುಟ', hi: 'होम' },
    'Contact': { kn: 'ಸಂಪರ್ಕ', hi: 'संपर्क' },
    'Prediction Suite': { kn: 'ಮುನ್ಸೂಚನಾ ಪರಿಕರಗಳು', hi: 'पूर्वानुमान सुइट' },
    'Market Intelligence': { kn: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ', hi: 'बाजार भाव व जानकारी' },
    'Use sidebar for prediction tools': { kn: 'ಪರಿಕರಗಳಿಗಾಗಿ ಮೆನುವನ್ನು ಬಳಸಿ', hi: 'टूल्स के लिए साइडबार का उपयोग करें' },
    'Prediction Tools': { kn: 'ಮುನ್ಸೂಚನಾ ಪರಿಕರಗಳು', hi: 'पूर्वानुमान टूल्स' },
    'Portals': { kn: 'ಪೋರ್ಟಲ್‌ಗಳು', hi: 'पोर्टल' },
    'Tech Stack': { kn: 'ತಂತ್ರಜ್ಞಾನ', hi: 'तकनीकी स्टैक' },
    'Verified Platform': { kn: 'ದೃಢೀಕೃತ ವೇದಿಕೆ', hi: 'सत्यापित प्लेटफॉर्म' },

    // ═══════════════════════════════════════════════════════════════
    // 2. SIDEBAR TOOL TITLES & SUBTITLES
    // ═══════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════
    // 3. COMMON FORM LABELS
    // ═══════════════════════════════════════════════════════════════
    'Nitrogen (N)': { kn: 'ಸಾರಜನಕ (Nitrogen - N)', hi: 'नाइट्रोजन (Nitrogen - N)' },
    'Phosphorus (P)': { kn: 'ರಂಜಕ (Phosphorus - P)', hi: 'फास्फोरस (Phosphorus - P)' },
    'Potassium (K)': { kn: 'ಪೊಟ್ಯಾಶಿಯಂ (Potassium - K)', hi: 'पोटेशियम (Potassium - K)' },
    'Temperature (°C)': { kn: 'ತಾಪಮಾನ (°C)', hi: 'तापमान (°C)' },
    'Humidity (%)': { kn: 'ಆರ್ದ್ರತೆ (%)', hi: 'आर्द्रता / नमी (%)' },
    'Soil pH Level': { kn: 'ಮಣ್ಣಿನ pH ಮಟ್ಟ (ಆಮ್ಲೀಯತೆ/ಕ್ಷಾರೀಯತೆ)', hi: 'मिट्टी का पीएच स्तर (pH)' },
    'Rainfall (mm)': { kn: 'ಮಳೆ ಪ್ರಮಾಣ (ಮಿ.ಮೀ)', hi: 'वर्षा (मिमी)' },
    'Soil Moisture': { kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ (Moisture)', hi: 'मिट्टी की नमी' },
    'Soil Type': { kn: 'ಮಣ್ಣಿನ ವಿಧ', hi: 'मिट्टी का प्रकार' },
    'Target Crop': { kn: 'ಉದ್ದೇಶಿತ ಬೆಳೆ', hi: 'लक्षित फसल' },
    'Cultivation Season': { kn: 'ಬೆಳೆ ಹಂಗಾಮು', hi: 'खेती का मौसम (सीजन)' },
    'Season': { kn: 'ಹಂಗಾಮು', hi: 'मौसम (सीजन)' },
    'Land Area (Acre)': { kn: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)', hi: 'जमीन का क्षेत्रफल (एकड़)' },
    'State': { kn: 'ರಾಜ್ಯ', hi: 'राज्य' },
    'District': { kn: 'ಜಿಲ್ಲೆ', hi: 'जिला' },
    'Meteorological Subdivision': { kn: 'ಹವಾಮಾನ ಉಪವಿಭಾಗ', hi: 'मौसम विज्ञान उप-मंडल' },
    'Target Month': { kn: 'ಗುರಿ ತಿಂಗಳು', hi: 'महीना' },
    'Search City or District': { kn: 'ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಹುಡುಕಿ', hi: 'शहर या जिला खोजें' },

    // ═══════════════════════════════════════════════════════════════
    // 4. BUTTONS & ACTIONS
    // ═══════════════════════════════════════════════════════════════
    'Run Crop Recommendation': { kn: 'ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ', hi: 'फसल सिफारिश प्राप्त करें' },
    'Compute Recommended Fertilizer': { kn: 'ಸೂಕ್ತ ರಸಗೊಬ್ಬರ ಲೆಕ್ಕಹಾಕಿ', hi: 'उर्वरक की सिफारिश निकालें' },
    'Compute Expected Yield Tonnage': { kn: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ಲೆಕ್ಕಹಾಕಿ', hi: 'अनुमानित पैदावार की गणना करें' },
    'Estimate Rainfall': { kn: 'ಮಳೆಯನ್ನು ಅಂದಾಜಿಸಿ', hi: 'वर्षा का अनुमान लगाएं' },
    'Search': { kn: 'ಹುಡುಕಿ', hi: 'खोजें' },
    'My Location': { kn: 'ನನ್ನ ಸ್ಥಳ', hi: 'मेरा स्थान' },
    'Fetch Weather': { kn: 'ಹವಾಮಾನ ಪಡೆಯಿರಿ', hi: 'मौसम लोड करें' },
    'Detect': { kn: 'ಪತ್ತೆಹಚ್ಚಿ', hi: 'पहचानें' },
    'Auto-Detect Location': { kn: 'ಸ್ಥಳ ಸ್ವಯಂ-ಪತ್ತೆಹಚ್ಚಿ', hi: 'स्थान का स्वतः पता लगाएं' },
    'Retry': { kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', hi: 'पुनः प्रयास करें' },
    'Try Again': { kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', hi: 'पुनः प्रयास करें' },
    'Find My Subdivision': { kn: 'ನನ್ನ ಉಪವಿಭಾಗ ಹುಡುಕಿ', hi: 'मेरा उप-मंडल खोजें' },
    'Get District Weather': { kn: 'ಜಿಲ್ಲಾ ಹವಾಮಾನ ಪಡೆಯಿರಿ', hi: 'जिले का मौसम प्राप्त करें' },

    // ═══════════════════════════════════════════════════════════════
    // 5. PRESETS & HELPER LABELS
    // ═══════════════════════════════════════════════════════════════
    'Quick Soil Presets': { kn: 'ತ್ವರಿತ ಮಣ್ಣಿನ ಆಯ್ಕೆಗಳು', hi: 'त्वरित मिट्टी विकल्प' },
    'Quick Presets': { kn: 'ತ್ವರಿತ ಆಯ್ಕೆಗಳು', hi: 'त्वरित विकल्प' },
    'Model Intelligence': { kn: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವಿವರಗಳು (AI)', hi: 'मॉडल इंटेलिजेंस (AI विवरण)' },
    'ML Model Used': { kn: 'ಬಳಸಿದ ML ಮಾದರಿ', hi: 'उपयोग किया गया एमएल मॉडल' },
    'Recommendation Basis': { kn: 'ಶಿಫಾರಸಿನ ಆಧಾರ', hi: 'सिफारिश का आधार' },
    'Estimation Basis': { kn: 'ಅಂದಾಜಿನ ಆಧಾರ', hi: 'अनुमान का आधार' },
    'Extended Forecast': { kn: 'ಮುಂದಿನ ದಿನಗಳ ಹವಾಮಾನ', hi: 'विस्तृत पूर्वानुमान' },
    'Nearby Cities': { kn: 'ಹತ್ತಿರದ ನಗರಗಳು', hi: 'आस-पास के शहर' },
    'Top Commodities': { kn: 'ಪ್ರಮುಖ ಕೃಷಿ ಉತ್ಪನ್ನಗಳು', hi: 'प्रमुख कृषि उत्पाद' },

    // ═══════════════════════════════════════════════════════════════
    // 6. RESULT CARDS & HIGHLIGHTS
    // ═══════════════════════════════════════════════════════════════
    'Recommendation Ready': { kn: 'ಶಿಫಾರಸು ಸಿದ್ಧವಾಗಿದೆ', hi: 'सिफारिश तैयार है' },
    'Recommended Crop': { kn: 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ', hi: 'अनुशंसित फसल' },
    'Eco-Fertilizer Formula Ready': { kn: 'ಪರಿಸರ ಸ್ನೇಹಿ ರಸಗೊಬ್ಬರ ಸೂತ್ರ ಸಿದ್ಧವಾಗಿದೆ', hi: 'उर्वरक फॉर्मूला तैयार है' },
    'Optimal Treatment': { kn: 'ಉತ್ತಮ ಪೋಷಕಾಂಶ ಚಿಕಿತ್ಸೆ', hi: 'इष्टतम उपचार' },
    'Harvest Estimation': { kn: 'ಸುಗ್ಗಿಯ ಇಳುವರಿ ಅಂದಾಜು', hi: 'फसल कटाई अनुमान' },
    'Total Forecasted Harvest': { kn: 'ಒಟ್ಟು ಅಂದಾಜು ಇಳುವರಿ', hi: 'कुल अनुमानित पैदावार' },
    'Tonnes': { kn: 'ಟನ್‌ಗಳು', hi: 'टन' },
    'Historical Monthly Average (IMD 1901–2015)': { kn: 'ಐತಿಹಾಸಿಕ ಮಾಸಿಕ ಸರಾಸರಿ (IMD 1901–2015)', hi: 'ऐतिहासिक मासिक औसत (IMD 1901–2015)' },
    'per quintal': { kn: 'ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ', hi: 'प्रति क्विंटल' },

    // ═══════════════════════════════════════════════════════════════
    // 7. SEASONS & SOILS
    // ═══════════════════════════════════════════════════════════════
    'Kharif (Monsoon)': { kn: 'ಖಾರೀಫ್ (ಮುಂಗಾರು ಮಳೆ)', hi: 'खरीफ (मानसून)' },
    'Rabi (Winter)': { kn: 'ರಬಿ (ಹಿಂಗಾರು / ಚಳಿಗಾಲ)', hi: 'रबी (सर्दियां)' },
    'Whole Year': { kn: 'ವರ್ಷಪೂರ್ತಿ', hi: 'पूरे साल' },
    'Summer': { kn: 'ಬೇಸಿಗೆ', hi: 'गर्मी (जायद)' },
    'Sandy Soil': { kn: 'ಮರಳು ಮಣ್ಣು (Sandy)', hi: 'बलुई मिट्टी (Sandy)' },
    'Loamy Soil': { kn: 'ಗೋಡು ಮಣ್ಣು (Loamy)', hi: 'दोमट मिट्टी (Loamy)' },
    'Black Soil': { kn: 'ಕಪ್ಪು ಮಣ್ಣು (Black Soil)', hi: 'काली मिट्टी (Black Soil)' },
    'Red Soil': { kn: 'ಕೆಂಪು ಮಣ್ಣು (Red Soil)', hi: 'लाल मिट्टी (Red Soil)' },
    'Clayey Soil': { kn: 'ಜೇಡಿ ಮಣ್ಣು (Clayey)', hi: 'चिकनी मिट्टी (Clayey)' },

    // ═══════════════════════════════════════════════════════════════
    // 8. VOICE ASSISTANT UI
    // ═══════════════════════════════════════════════════════════════
    'Voice Assistant': { kn: 'ಧ್ವನಿ ಸಹಾಯಕ', hi: 'आवाज सहायक' },
    'AgroIntel Voice Assistant': { kn: 'ಅಗ್ರೋಇಂಟೆಲ್ ಧ್ವನಿ ಸಹಾಯಕ', hi: 'एग्रोइंटेल वॉयस असिस्टेंट' },
    'Tap mic or say a command...': { kn: 'ಮೈಕ್ ಒತ್ತಿ ಅಥವಾ ಮಾತನಾಡಿ...', hi: 'माइक दबाएं या बोलें...' },
    'Listening... Speak now': { kn: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ', hi: 'सुन रहे हैं... अब बोलें' },
    'Understood:': { kn: 'ಅರ್ಥವಾಯಿತು:', hi: 'समझा गया:' },
    'Try saying:': { kn: 'ಹೀಗೆ ಹೇಳಿ:', hi: 'ऐसे बोलें:' },
    'Read Aloud': { kn: 'ಓದಿ ಕೇಳಿಸಿ', hi: 'सुनें' },
    'Read Result Aloud': { kn: '🔊 ಫಲಿತಾಂಶ ಕೇಳಿ', hi: '🔊 परिणाम सुनें' },
    'Stop Speaking': { kn: 'ನಿಲ್ಲಿಸಿ', hi: 'रोकें' }
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
    s = s.replace(/\s*\(.*?\)\s*/g, '').trim();
    return s;
  }

  /**
   * Helper to retrieve localized crop display name
   */
  function getCropName(cropKey, lang) {
    if (!cropKey) return '';
    const targetLang = lang || currentLang;
    const cleanKey = cropKey.toString().trim().toLowerCase();
    const entry = CROP_TRANSLATIONS[cleanKey] || CROP_TRANSLATIONS[normalizeCropKey(cleanKey)];
    if (!entry) return cropKey;
    if (targetLang === 'kn') return entry.kn || cropKey;
    if (targetLang === 'hi') return entry.hi || cropKey;
    return cropKey.charAt(0).toUpperCase() + cropKey.slice(1);
  }

  /**
   * Helper to retrieve pure localized crop name for voice narration
   */
  function getCropSpoken(cropKey, lang) {
    if (!cropKey) return '';
    const targetLang = lang || currentLang;
    const cleanKey = cropKey.toString().trim().toLowerCase();
    const entry = CROP_TRANSLATIONS[cleanKey] || CROP_TRANSLATIONS[normalizeCropKey(cleanKey)];
    if (!entry) return cropKey;
    if (targetLang === 'kn') return entry.pureKn || entry.kn;
    if (targetLang === 'hi') return entry.pureHi || entry.hi;
    return cropKey;
  }

  /**
   * Set the active language across the portal
   */
  function setLanguage(lang) {
    if (!['en', 'kn', 'hi'].includes(lang)) {
      lang = 'en';
    }
    currentLang = lang;
    localStorage.setItem('agrointel-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update active state on language dropdown items
    document.querySelectorAll('.agrointel-lang-item').forEach(el => {
      if (el.getAttribute('data-lang') === lang) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update current language label on dropdown button
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

    // Dispatch custom event for dynamic components (voice assistant, charts)
    window.dispatchEvent(new CustomEvent('agrointel-language-changed', {
      detail: { lang: lang }
    }));
  }

  /**
   * Walk the DOM and apply translations while strictly preserving backend select values & input names!
   */
  function applyTranslationsToDOM() {
    // 1. Elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && TRANSLATIONS[key]) {
        el.textContent = t(key);
      }
    });

    // 2. Elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && TRANSLATIONS[key]) {
        el.setAttribute('placeholder', t(key));
      }
    });

    // 3. Elements with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key && TRANSLATIONS[key]) {
        el.setAttribute('title', t(key));
      }
    });

    // 4. Translate sidebar items by class/title matching
    document.querySelectorAll('.sidebar-nav-title').forEach(el => {
      const orig = el.getAttribute('data-original-text') || el.textContent.trim();
      if (!el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', orig);
      }
      if (TRANSLATIONS[orig]) {
        el.textContent = t(orig);
      }
    });

    document.querySelectorAll('.sidebar-nav-sub').forEach(el => {
      const orig = el.getAttribute('data-original-text') || el.textContent.trim();
      if (!el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', orig);
      }
      if (TRANSLATIONS[orig]) {
        el.textContent = t(orig);
      }
    });

    document.querySelectorAll('.sidebar-section-label').forEach(el => {
      const orig = el.getAttribute('data-original-text') || el.textContent.trim();
      if (!el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', orig);
      }
      if (TRANSLATIONS[orig]) {
        el.textContent = t(orig);
      }
    });

    // 5. Translate common form labels
    document.querySelectorAll('label').forEach(label => {
      Array.from(label.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const rawText = node.textContent.trim();
          if (rawText && TRANSLATIONS[rawText]) {
            if (!label.getAttribute('data-orig-label')) {
              label.setAttribute('data-orig-label', rawText);
            }
            node.textContent = ' ' + t(label.getAttribute('data-orig-label')) + ' ';
          }
        }
      });
    });

    // 6. Translate buttons (while keeping icons intact)
    document.querySelectorAll('button[type="submit"], .btn-agro-primary, .btn-agro-secondary, .soil-preset-btn').forEach(btn => {
      Array.from(btn.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const rawText = node.textContent.trim();
          if (rawText && TRANSLATIONS[rawText]) {
            if (!btn.getAttribute('data-orig-btn')) {
              btn.setAttribute('data-orig-btn', rawText);
            }
            node.textContent = ' ' + t(btn.getAttribute('data-orig-btn')) + ' ';
          }
        }
      });
    });

    // 7. CROP LANGUAGE MODULE: Translate select options for crops & soils
    // Server receives value='Rice', but user sees 'ಭತ್ತ (Rice)' or 'धान / चावल (Rice)'!
    document.querySelectorAll('select option').forEach(opt => {
      const origText = opt.getAttribute('data-orig-opt') || opt.textContent.trim();
      if (!opt.getAttribute('data-orig-opt')) {
        opt.setAttribute('data-orig-opt', origText);
      }

      // Check Crop Translations
      const cropKey = (opt.value || origText).trim().toLowerCase();
      if (CROP_TRANSLATIONS[cropKey]) {
        opt.textContent = getCropName(cropKey, currentLang);
        return;
      }

      // Generic translations (soils, seasons)
      if (TRANSLATIONS[origText]) {
        opt.textContent = t(origText);
      }
    });

    // 8. CROP RECOMMENDATION RESULT CARD LOCALIZATION
    // Displays the regional crop name clearly for farmers who cannot read English
    document.querySelectorAll('.result-card-glow').forEach(card => {
      const headline = card.querySelector('h1, h2');
      if (headline) {
        const rawCrop = headline.getAttribute('data-crop-en') || headline.textContent.trim();
        if (!headline.getAttribute('data-crop-en')) {
          headline.setAttribute('data-crop-en', rawCrop);
        }
        const cropKey = rawCrop.toLowerCase().trim();
        if (CROP_TRANSLATIONS[cropKey]) {
          const localName = getCropName(cropKey, currentLang);
          headline.textContent = localName;

          // Regional subtitle
          let subEl = card.querySelector('.crop-regional-desc');
          if (!subEl) {
            subEl = document.createElement('p');
            subEl.className = 'crop-regional-desc mt-2 mb-0';
            subEl.style.fontSize = '0.92rem';
            subEl.style.fontWeight = '600';
            subEl.style.color = 'var(--emerald-400)';
            headline.insertAdjacentElement('afterend', subEl);
          }
          if (currentLang === 'kn') {
            subEl.textContent = `🌾 ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಉತ್ತಮ ಇಳುವರಿ ನೀಡುವ ಬೆಳೆ: ${CROP_TRANSLATIONS[cropKey].pureKn}`;
          } else if (currentLang === 'hi') {
            subEl.textContent = `🌾 आपकी भूमि के लिए अनुशंसित अधिक उपज वाली फसल: ${CROP_TRANSLATIONS[cropKey].pureHi}`;
          } else {
            subEl.textContent = `🌾 Optimal high-yield crop calculated for your soil metrics.`;
          }
        }
      }
    });

    // 9. Mandi Commodity Names Localization
    document.querySelectorAll('#priceTableBody td:first-child strong, #highlightCards p').forEach(el => {
      const txt = el.textContent.trim();
      const k = txt.toLowerCase();
      if (CROP_TRANSLATIONS[k]) {
        el.textContent = getCropName(k, currentLang);
      }
    });
  }

  // Toggle Dropdown menu
  function setupLangDropdown() {
    document.addEventListener('click', function(e) {
      const dropdown = e.target.closest('.agrointel-lang-dropdown');
      const allDropdowns = document.querySelectorAll('.agrointel-lang-dropdown');

      if (e.target.closest('.agrointel-lang-btn')) {
        e.stopPropagation();
        const parent = e.target.closest('.agrointel-lang-dropdown');
        const isOpen = parent.classList.contains('open');
        allDropdowns.forEach(d => d.classList.remove('open'));
        if (!isOpen) {
          parent.classList.add('open');
        }
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

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    setupLangDropdown();
    setLanguage(currentLang);
  });

  // Export to global scope
  window.AgroIntelI18N = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; },
    getCropName: getCropName,
    getCropSpoken: getCropSpoken,
    t: t,
    refresh: applyTranslationsToDOM
  };

  // Convenient alias
  window.agrointelT = t;

})();
