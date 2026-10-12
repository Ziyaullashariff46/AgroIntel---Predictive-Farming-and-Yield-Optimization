/**
 * AgroIntel Intelligent Voice Assistant & Speech Synthesis
 * Supports Kannada ('kn-IN'), Hindi ('hi-IN'), and English ('en-IN')
 * Enables persistent voice navigation, hands-free form dictation, and spoken crop results.
 */
(function() {
  'use strict';

  // Speech Recognition API availability
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = window.speechSynthesis || null;

  let recognition = null;
  let isListening = false;
  let shouldBeListening = false; // Persistent user intent flag
  let isSpeaking = false;
  let restartTimer = null;
  let availableVoices = [];
  let activeLang = 'en'; // 'en', 'kn', 'hi'

  // Pre-load and cache voices
  if (synth) {
    availableVoices = synth.getVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = function() {
        availableVoices = synth.getVoices();
      };
    }
  }

  // Speech Recognition language mapping
  const SPEECH_LOCALE = {
    'en': 'en-IN',
    'kn': 'kn-IN',
    'hi': 'hi-IN'
  };

  // Number words conversion
  const NUMBER_WORDS = {
    // English
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100,
    // Kannada
    'ಸೊನ್ನೆ': 0, 'ಒಂದು': 1, 'ಎರಡು': 2, 'ಮೂರು': 3, 'ನಾಲ್ಕು': 4, 'ಐದು': 5,
    'ಆರು': 6, 'ಏಳು': 7, 'ಎಂಟು': 8, 'ಒಂಬತ್ತು': 9, 'ಹತ್ತು': 10,
    'ಇಪ್ಪತ್ತು': 20, 'ಮೂವತ್ತು': 30, 'ನಲವತ್ತು': 40, 'ಐವತ್ತು': 50,
    'ಅರವತ್ತು': 60, 'ಎಪ್ಪತ್ತು': 70, 'ಎಂಬತ್ತು': 80, 'ತೊಂಬತ್ತು': 90, 'ನೂರು': 100,
    // Hindi
    'शून्य': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5,
    'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
    'बीस': 20, 'तीस': 30, 'चालीस': 40, 'पचास': 50,
    'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90, 'सौ': 100
  };

  /**
   * Extract number from transcript (handles digits 0-9, Indic digits, and words)
   */
  function extractNumber(text) {
    const directMatch = text.match(/(\d+(\.\d+)?)/);
    if (directMatch) {
      return parseFloat(directMatch[1]);
    }
    const indicDigits = {
      '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9',
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    };
    let converted = '';
    let foundIndic = false;
    for (let char of text) {
      if (indicDigits[char] !== undefined) {
        converted += indicDigits[char];
        foundIndic = true;
      } else if (char === '.' && foundIndic) {
        converted += '.';
      }
    }
    if (foundIndic && converted) {
      return parseFloat(converted);
    }
    const words = text.toLowerCase().split(/\s+/);
    for (let w of words) {
      if (NUMBER_WORDS[w] !== undefined) {
        return NUMBER_WORDS[w];
      }
    }
    return null;
  }

  /**
   * Initialize Web Speech Recognition with Persistent Continuous Listening
   */
  function initSpeechRecognition() {
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true; // KEEP MIC OPEN CONTINUOUSLY
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      updateRecognitionLanguage();

      recognition.onstart = function() {
        isListening = true;
        updateUIListening(true);
        updateStatusHint(getLocalizedText('Listening actively... Speak now', 'ಸಕ್ರಿಯವಾಗಿ ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ', 'सक्रिय रूप से सुन रहे हैं... अब बोलें'));
      };

      recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
          updateTranscriptBubble(currentText);
        }

        if (finalTranscript) {
          handleVoiceCommand(finalTranscript);
        }
      };

      recognition.onerror = function(event) {
        console.warn('Speech recognition notice:', event.error);

        // SILENCE / NO-SPEECH: NEVER SHUT DOWN THE VOICE ASSISTANT!
        if (event.error === 'no-speech') {
          // Simply keep waiting for user to speak
          updateStatusHint(getLocalizedText('Still listening... speak whenever ready', 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ', 'सुन रहे हैं... कृपया बोलें'));
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldBeListening = false;
          isListening = false;
          updateUIListening(false);
          updateStatusHint('Microphone permission denied. Please allow microphone in browser.');
          return;
        }

        // For other recoverable errors, auto-restart if user wants listening
        if (shouldBeListening) {
          clearTimeout(restartTimer);
          restartTimer = setTimeout(() => {
            if (shouldBeListening && !isListening) {
              try { recognition.start(); } catch(e) {}
            }
          }, 350);
        }
      };

      recognition.onend = function() {
        isListening = false;
        // AUTO-KEEPALIVE: If user intended listening, immediately keep recognition alive!
        if (shouldBeListening) {
          clearTimeout(restartTimer);
          restartTimer = setTimeout(() => {
            if (shouldBeListening) {
              try {
                recognition.start();
              } catch(e) {}
            }
          }, 200);
        } else {
          updateUIListening(false);
        }
      };
    } catch (e) {
      console.error('Failed to initialize speech recognition:', e);
    }
  }

  function updateRecognitionLanguage() {
    if (recognition) {
      activeLang = (window.AgroIntelI18N ? window.AgroIntelI18N.getLanguage() : localStorage.getItem('agrointel-lang')) || 'en';
      recognition.lang = SPEECH_LOCALE[activeLang] || 'en-IN';
      
      const badge = document.getElementById('voiceLangBadge');
      if (badge) {
        const langNames = { 'en': 'English', 'kn': 'ಕನ್ನಡ (Kannada)', 'hi': 'हिन्दी (Hindi)' };
        badge.textContent = langNames[activeLang] || 'English';
      }
    }
  }

  /**
   * Toggle Speech Listening
   */
  function toggleListening() {
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or a modern Android browser.');
      return;
    }

    if (shouldBeListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    shouldBeListening = true;
    if (!recognition) initSpeechRecognition();
    if (!recognition) return;

    // Stop TTS if currently speaking
    stopSpeaking();

    try {
      updateRecognitionLanguage();
      recognition.start();
    } catch (e) {
      // If already started, that's fine
    }
    updateUIListening(true);
  }

  function stopListening() {
    shouldBeListening = false;
    clearTimeout(restartTimer);
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    isListening = false;
    updateUIListening(false);
    updateStatusHint(getLocalizedText('Microphone paused. Tap to resume', 'ಮೈಕ್ರೊಫೋನ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ. ಮುಂದುವರಿಸಲು ಒತ್ತಿ', 'माइक रोका गया। पुनः शुरू करने के लिए दबाएं'));
  }

  /**
   * Process Spoken Voice Commands
   */
  function handleVoiceCommand(rawText) {
    const text = rawText.trim().toLowerCase();
    console.log('[AgroIntel Voice Command]:', text);

    let feedback = '';

    // ─────────────────────────────────────────────────────────────
    // 1. Navigation Commands
    // ─────────────────────────────────────────────────────────────
    // Weather
    if (text.includes('weather') || text.includes('ಹವಾಮಾನ') || text.includes('मौसम')) {
      feedback = getLocalizedText('Navigating to Weather Forecast...', 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗೆ ತೆರಳಲಾಗುತ್ತಿದೆ...', 'मौसम पूर्वानुमान पर ले जा रहे हैं...');
      showFeedbackAndAct(feedback, () => window.location.href = '/farmer/weather_forecast');
      return;
    }

    // Crop Recommendation
    if (text.includes('crop rec') || text.includes('ಬೆಳೆ ಶಿಫಾರಸು') || text.includes('ಫಸಲ್ ಸಿಫಾರಿಶ್') || text.includes('फसल सिफारिश') || (text.includes('crop') && text.includes('recommend'))) {
      feedback = getLocalizedText('Opening Crop Recommendation...', 'ಬೆಳೆ ಶಿಫಾರಸು ತೆರೆಯಲಾಗುತ್ತಿದೆ...', 'फसल सिफारिश खोली जा रही है...');
      showFeedbackAndAct(feedback, () => window.location.href = '/farmer/crop_recommendation');
      return;
    }

    // Fertilizer Advisory
    if (text.includes('fertilizer') || text.includes('ಗೊಬ್ಬರ') || text.includes('ರಸಗೊಬ್ಬರ') || text.includes('उर्वरक') || text.includes('खाद')) {
      feedback = getLocalizedText('Opening Fertilizer Advisory...', 'ರಸಗೊಬ್ಬರ ಸಲಹೆ ತೆರೆಯಲಾಗುತ್ತಿದೆ...', 'उर्वरक परामर्श खोला जा रहा है...');
      showFeedbackAndAct(feedback, () => window.location.href = '/farmer/fertilizer_recommendation');
      return;
    }

    // Yield Forecast
    if (text.includes('yield') || text.includes('ಇಳುವರಿ') || text.includes('पैदावार') || text.includes('उपज')) {
      feedback = getLocalizedText('Opening Yield Harvest Forecast...', 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ ತೆರೆಯಲಾಗುತ್ತಿದೆ...', 'उपज पूर्वानुमान खोला जा रहा है...');
      showFeedbackAndAct(feedback, () => window.location.href = '/farmer/yield_prediction');
      return;
    }

    // Rainfall Estimation
    if (text.includes('rainfall') || text.includes('rain') || text.includes('ಮಳೆ') || text.includes('बारिश') || text.includes('वर्षा')) {
      feedback = getLocalizedText('Opening Rainfall Estimation...', 'ಮಳೆ ಅಂದಾಜು ತೆರೆಯಲಾಗುತ್ತಿದೆ...', 'वर्षा अनुमान खोला जा रहा है...');
      showFeedbackAndAct(feedback, () => window.location.href = '/farmer/rainfall_prediction');
      return;
    }

    // Live Mandi / Market Prices (also handles "crop price" queries)
    if (text.includes('mandi') || text.includes('crop price') || text.includes('ಬೆಳೆ ಬೆಲೆ') || text.includes('ಮಂಡಿ') || text.includes('ಮಾರುಕಟ್ಟೆ') || text.includes('मंडी भाव') || text.includes('मंडी') || text.includes('फसल भाव')) {
      feedback = getLocalizedText('Opening Live Mandi Prices...', 'ಲೈವ್ ಮಂಡಿ ದರಗಳು ತೆರೆಯಲಾಗುತ್ತಿದೆ...', 'लाइव मंडी भाव खोला जा रहा है...');
      showFeedbackAndAct(feedback, () => window.location.href = '/farmer/market_prices');
      return;
    }

    // Home
    if (text.includes('home') || text.includes('ಮುಖಪುಟ') || text.includes('होम')) {
      feedback = getLocalizedText('Going to Home page...', 'ಮುಖಪುಟಕ್ಕೆ ತೆರಳಲಾಗುತ್ತಿದೆ...', 'होम पेज पर ले जा रहे हैं...');
      showFeedbackAndAct(feedback, () => window.location.href = '/');
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Read Results Aloud
    // ─────────────────────────────────────────────────────────────
    if (text.includes('read') || text.includes('speak') || text.includes('ಓದಿ') || text.includes('ಕೇಳಿ') || text.includes('ಹೇಳಿ') || text.includes('पढ़ो') || text.includes('सुनाओ') || text.includes('बोलिए')) {
      readActiveResultsAloud();
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Search Action (Weather / Mandi City Search)
    // ─────────────────────────────────────────────────────────────
    const searchInput = document.getElementById('citySearch') || document.getElementById('city');
    if (text.includes('search') || text.includes('ಹುಡುಕಿ') || text.includes('खोजें') || text.includes('सर्च')) {
      let query = text.replace(/search|ಹುಡುಕಿ|खोजें|सर्च/gi, '').trim();
      if (searchInput && query) {
        searchInput.value = query;
        if (typeof window.searchCity === 'function') {
          window.searchCity();
        } else if (searchInput.form) {
          searchInput.form.submit();
        }
        feedback = getLocalizedText(`Searching for: ${query}`, `${query} ಹುಡುಕಲಾಗುತ್ತಿದೆ...`, `${query} खोज रहे हैं...`);
        showFeedback(feedback);
        return;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Form Field Dictation (N, P, K, Temp, Humidity, pH, Rainfall, Area)
    // ─────────────────────────────────────────────────────────────
    const num = extractNumber(text);

    if (text.includes('nitrogen') || text.includes('ನೈಟ್ರೋಜನ್') || text.includes('ಸಾರಜನಕ') || text.includes('नाइट्रोजन') || text.match(/\bn\b/)) {
      if (num !== null) { setFieldValue('n', num, 'Nitrogen (N)'); return; }
    }
    if (text.includes('phosphorus') || text.includes('ಫಾಸ್ಫರಸ್') || text.includes('ರಂಜಕ') || text.includes('फास्फोरस') || text.match(/\bp\b/)) {
      if (num !== null) { setFieldValue('p', num, 'Phosphorus (P)'); return; }
    }
    if (text.includes('potassium') || text.includes('ಪೊಟ್ಯಾಶಿಯಂ') || text.includes('ಪೊಟ್ಯಾಶ್') || text.includes('पोटेशियम') || text.includes('पोटाश') || text.match(/\bk\b/)) {
      if (num !== null) { setFieldValue('k', num, 'Potassium (K)'); return; }
    }
    if (text.includes('temperature') || text.includes('temp') || text.includes('ತಾಪಮಾನ') || text.includes('तापमान')) {
      if (num !== null) { setFieldValue('temperature', num, 'Temperature (°C)'); return; }
    }
    if (text.includes('humidity') || text.includes('ಆರ್ದ್ರತೆ') || text.includes('आर्द्रता') || text.includes('नमी')) {
      if (num !== null) { setFieldValue('humidity', num, 'Humidity (%)'); return; }
    }
    if (text.includes('ph') || text.includes('ಪಿಎಚ್') || text.includes('ಪಿಹೆಚ್') || text.includes('पीएच')) {
      if (num !== null) { setFieldValue('ph', num, 'Soil pH'); return; }
    }
    if (text.includes('rain') || text.includes('ಮಳೆ') || text.includes('ಬಾರೀಶ್') || text.includes('वर्षा')) {
      if (num !== null) { setFieldValue('rainfall', num, 'Rainfall (mm)'); return; }
    }
    if (text.includes('moisture') || text.includes('ತೇವಾಂಶ') || text.includes('नमी')) {
      if (num !== null) { setFieldValue('moisture', num, 'Soil Moisture'); return; }
    }
    if (text.includes('acre') || text.includes('area') || text.includes('ಎಕರೆ') || text.includes('ಏಕರೆ') || text.includes('एकड़') || text.includes('जमीन')) {
      if (num !== null) { setFieldValue('land_area', num, 'Land Area (Acre)'); return; }
    }

    if (num !== null && document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'number') {
      document.activeElement.value = num;
      highlightField(document.activeElement);
      feedback = getLocalizedText(`Entered ${num} into field`, `ಫೀಲ್ಡ್‌ನಲ್ಲಿ ${num} ಭರ್ತಿ ಮಾಡಲಾಗಿದೆ`, `फ़ील्ड में ${num} दर्ज किया गया`);
      showFeedback(feedback);
      speakText(feedback);
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // 5. Form Submission
    // ─────────────────────────────────────────────────────────────
    if (text.includes('submit') || text.includes('predict') || text.includes('calculate') || text.includes('ಲೆಕ್ಕ') || text.includes('ಸಲ್ಲಿಸಿ') || text.includes('ಮುನ್ಸೂಚಿಸಿ') || text.includes('गणना') || text.includes('सबमिट')) {
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) {
        feedback = getLocalizedText('Computing prediction...', 'ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...', 'अनुमान निकाला जा रहा है...');
        showFeedbackAndAct(feedback, () => submitBtn.click());
        return;
      }
    }

    // Default: feedback acknowledgment
    feedback = getLocalizedText(
      `Understood: "${rawText}". Speak any command or numbers.`,
      `ಅರ್ಥವಾಯಿತು: "${rawText}". ಕಮಾಂಡ್ ಅಥವಾ ಸಂಖ್ಯೆಗಳನ್ನು ಹೇಳಿ.`,
      `समझा गया: "${rawText}". कोई निर्देश या संख्या बोलें।`
    );
    showFeedback(feedback);
  }

  function setFieldValue(fieldId, val, label) {
    const input = document.getElementById(fieldId) ||
                  document.getElementById(fieldId + 'Input') ||
                  document.getElementById(fieldId + '_input') ||
                  document.querySelector(`input[name="${fieldId}"]`) ||
                  document.querySelector(`select[name="${fieldId}"]`);
    if (input) {
      input.value = val;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const companion = document.getElementById(fieldId + 'Val') || document.getElementById(fieldId + 'Value');
      if (companion) {
        companion.innerText = val;
      }

      highlightField(input);
      const msg = getLocalizedText(
        `Set ${label} to ${val}`,
        `${label} ಅನ್ನು ${val} ಎಂದು ಹೊಂದಿಸಲಾಗಿದೆ`,
        `${label} को ${val} सेट किया गया`
      );
      showFeedback(msg);
      speakText(msg);
    } else {
      showFeedback(`Field ${label} not found on this page.`);
    }
  }

  function highlightField(el) {
    el.focus();
    el.style.transition = 'all 0.3s ease';
    el.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.6)';
    setTimeout(() => {
      el.style.boxShadow = '';
    }, 1800);
  }

  function showFeedback(msg) {
    const bubble = document.getElementById('voiceTranscriptBubble');
    if (bubble) {
      bubble.textContent = msg;
      bubble.classList.add('highlight');
      setTimeout(() => bubble.classList.remove('highlight'), 3000);
    }
  }

  function showFeedbackAndAct(msg, callback) {
    showFeedback(msg);
    speakText(msg, callback);
  }

  function getLocalizedText(en, kn, hi) {
    if (activeLang === 'kn') return kn;
    if (activeLang === 'hi') return hi;
    return en;
  }

  /**
   * Text-to-Speech (TTS) Voice Synthesis
   */
  function speakText(text, callback) {
    if (!synth) {
      if (callback) callback();
      return;
    }

    try {
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEECH_LOCALE[activeLang] || 'en-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const voices = availableVoices.length ? availableVoices : synth.getVoices();
      const targetVoice = voices.find(v => v.lang.startsWith(activeLang)) ||
                          voices.find(v => v.lang.includes('IN')) ||
                          voices[0];
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onstart = function() {
        isSpeaking = true;
        document.querySelectorAll('.btn-agro-speak').forEach(b => b.classList.add('speaking'));
      };

      utterance.onend = function() {
        isSpeaking = false;
        document.querySelectorAll('.btn-agro-speak').forEach(b => b.classList.remove('speaking'));
        if (callback) callback();
      };

      utterance.onerror = function() {
        isSpeaking = false;
        document.querySelectorAll('.btn-agro-speak').forEach(b => b.classList.remove('speaking'));
        if (callback) callback();
      };

      synth.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
      if (callback) callback();
    }
  }

  function stopSpeaking() {
    if (synth) {
      synth.cancel();
      isSpeaking = false;
      document.querySelectorAll('.btn-agro-speak').forEach(b => b.classList.remove('speaking'));
    }
  }

  /**
   * Read the active prediction result on the current page aloud with CROP LANGUAGE MODULE
   */
  function readActiveResultsAloud() {
    const resultCard = document.querySelector('.result-card-glow');
    if (!resultCard) {
      const noResult = getLocalizedText(
        'No prediction results found on this page. Please submit the form first.',
        'ಈ ಪುಟದಲ್ಲಿ ಯಾವುದೇ ಫಲಿತಾಂಶ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ಫಾರ್ಮ್ ಸಲ್ಲಿಸಿ.',
        'इस पृष्ठ पर कोई परिणाम नहीं मिला। कृपया पहले फॉर्म भरें।'
      );
      showFeedback(noResult);
      speakText(noResult);
      return;
    }

    const headlineEl = resultCard.querySelector('h1, h2');
    const headline = headlineEl ? headlineEl.textContent.trim() : '';
    const rawCrop = headlineEl ? (headlineEl.getAttribute('data-crop-en') || headline) : '';

    let textToSpeak = '';

    // Check if it's a Crop Recommendation result
    if (window.AgroIntelI18N && rawCrop) {
      const cropSpoken = window.AgroIntelI18N.getCropSpoken(rawCrop, activeLang);
      if (activeLang === 'kn') {
        textToSpeak = `ಅಗ್ರೋಇಂಟೆಲ್ ಬೆಳೆ ಶಿಫಾರಸು ಫಲಿತಾಂಶ: ${cropSpoken}. ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಈ ಬೆಳೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ಅಧಿಕ ಇಳುವರಿ ನೀಡುವ ಬೆಳೆಯಾಗಿದೆ.`;
      } else if (activeLang === 'hi') {
        textToSpeak = `एग्रोइंटेल फसल सिफारिश परिणाम: ${cropSpoken}. आपकी मिट्टी और मौसम के लिए यह फसल सर्वोत्तम उच्च उपज वाली फसल है।`;
      } else {
        textToSpeak = `AgroIntel Crop Recommendation Result: ${headline}. Evaluated across soil macro-nutrients and weather metrics.`;
      }
    } else {
      if (activeLang === 'kn') {
        textToSpeak = `ಅಗ್ರೋಇಂಟೆಲ್ ಫಲಿತಾಂಶ: ${headline}.`;
      } else if (activeLang === 'hi') {
        textToSpeak = `एग्रोइंटेल परिणाम: ${headline}.`;
      } else {
        textToSpeak = `AgroIntel Result: ${headline}.`;
      }
    }

    showFeedback(textToSpeak);
    speakText(textToSpeak);
  }

  /**
   * Auto-inject 🔊 "Read Aloud" button into result cards
   */
  function injectReadAloudButtons() {
    const resultCards = document.querySelectorAll('.result-card-glow');
    resultCards.forEach(card => {
      if (!card.querySelector('.btn-agro-speak')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-agro-speak';
        btn.setAttribute('aria-label', 'Read Result Aloud');
        
        const lang = window.AgroIntelI18N ? window.AgroIntelI18N.getLanguage() : 'en';
        const label = lang === 'kn' ? '🔊 ಫಲಿತಾಂಶ ಕೇಳಿ' : (lang === 'hi' ? '🔊 परिणाम सुनें' : '🔊 Read Aloud');
        btn.innerHTML = `<i class="fas fa-volume-high"></i> <span>${label}</span>`;
        
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          if (isSpeaking) {
            stopSpeaking();
          } else {
            readActiveResultsAloud();
          }
        });
        
        card.appendChild(btn);
      }
    });
  }

  /**
   * UI Updates
   */
  function updateUIListening(listening) {
    const fab = document.getElementById('agrointelVoiceFab');
    const mainBtn = document.getElementById('voiceMainMicBtn');
    const navBtn = document.getElementById('agrointelNavVoiceBtn');
    const waveBars = document.getElementById('voiceWaveBars');
    const statusText = document.getElementById('voiceStatusText');

    if (listening) {
      if (fab) fab.classList.add('listening');
      if (mainBtn) mainBtn.classList.add('active');
      if (navBtn) navBtn.classList.add('listening');
      if (waveBars) waveBars.classList.add('active');
      if (statusText) statusText.textContent = getLocalizedText('Listening... Speak anytime', 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ', 'सुन रहे हैं... कभी भी बोलें');
    } else {
      if (fab) fab.classList.remove('listening');
      if (mainBtn) mainBtn.classList.remove('active');
      if (navBtn) navBtn.classList.remove('listening');
      if (waveBars) waveBars.classList.remove('active');
      if (statusText) statusText.textContent = getLocalizedText('Tap mic to speak', 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ', 'बोलने के लिए माइक दबाएं');
    }
  }

  function updateTranscriptBubble(text) {
    const bubble = document.getElementById('voiceTranscriptBubble');
    if (bubble) {
      bubble.textContent = text;
    }
  }

  function updateStatusHint(text) {
    const hint = document.getElementById('voiceStatusHint');
    if (hint) {
      hint.textContent = text;
    }
  }

  /**
   * Build Voice Assistant DOM
   */
  function createVoiceAssistantDOM() {
    if (document.getElementById('agrointelVoiceFab')) return;

    // 1. Floating Action Button
    const fab = document.createElement('button');
    fab.id = 'agrointelVoiceFab';
    fab.className = 'agrointel-voice-fab';
    fab.setAttribute('aria-label', 'AgroIntel Voice Assistant');
    fab.innerHTML = `
      <div class="fab-mic-icon"><i class="fas fa-microphone"></i></div>
      <span class="fab-label" data-i18n="Voice Assistant">Voice Assistant</span>
    `;
    fab.addEventListener('click', toggleVoiceModal);
    document.body.appendChild(fab);

    // 2. Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'agrointelVoiceBackdrop';
    backdrop.className = 'agrointel-voice-modal-backdrop';
    backdrop.addEventListener('click', closeVoiceModal);
    document.body.appendChild(backdrop);

    // 3. Slide-up Panel
    const panel = document.createElement('div');
    panel.id = 'agrointelVoicePanel';
    panel.className = 'agrointel-voice-panel';
    panel.innerHTML = `
      <div class="voice-panel-header">
        <div class="voice-panel-title">
          <i class="fas fa-headset" style="color: var(--emerald-500);"></i>
          <span data-i18n="AgroIntel Voice Assistant">AgroIntel Voice Assistant</span>
        </div>
        <div class="d-flex align-items-center" style="gap: 0.5rem;">
          <span class="voice-panel-lang-badge" id="voiceLangBadge">English</span>
          <button class="voice-panel-close" id="voicePanelCloseBtn" aria-label="Close voice assistant">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="voice-panel-body">
        <div class="voice-visualizer-wrap">
          <button class="voice-main-mic-btn" id="voiceMainMicBtn" aria-label="Toggle voice input">
            <i class="fas fa-microphone"></i>
          </button>
          <div class="voice-wave-bars" id="voiceWaveBars">
            <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
          </div>
        </div>

        <div class="voice-status-text" id="voiceStatusText" data-i18n="Tap mic or say a command...">
          Tap mic or say a command...
        </div>
        <div class="voice-status-hint" id="voiceStatusHint">
          Continuous Listening Enabled
        </div>

        <div class="voice-transcript-bubble" id="voiceTranscriptBubble">
          Waiting for speech input...
        </div>

        <div class="voice-commands-section">
          <div class="voice-commands-title">
            <i class="fas fa-lightbulb" style="color: var(--amber-500);"></i>
            <span data-i18n="Try saying:">Try saying:</span>
          </div>
          <div class="voice-chips-grid" id="voiceChipsGrid">
            <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Weather')">🌤️ Weather</button>
            <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Crop Recommendation')">🌾 Crop Recommendation</button>
            <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Fertilizer')">🧪 Fertilizer</button>
            <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Mandi Prices')">💰 Mandi Prices</button>
            <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Read Result')">🔊 Read Result</button>
          </div>
        </div>

        <div class="d-flex w-100" style="gap: 0.5rem;">
          <button type="button" class="btn-agro-primary w-100 btn-sm" id="voiceReadAloudBtn" style="min-height: 40px;">
            <i class="fas fa-volume-high"></i> <span data-i18n="Read Result Aloud">Read Result Aloud</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('voicePanelCloseBtn').addEventListener('click', closeVoiceModal);
    document.getElementById('voiceMainMicBtn').addEventListener('click', toggleListening);
    document.getElementById('voiceReadAloudBtn').addEventListener('click', readActiveResultsAloud);

    updateChipsForLanguage();
  }

  function updateChipsForLanguage() {
    const grid = document.getElementById('voiceChipsGrid');
    if (!grid) return;

    if (activeLang === 'kn') {
      grid.innerHTML = `
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ಹವಾಮಾನ')">🌤️ ಹವಾಮಾನ</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ಬೆಳೆ ಶಿಫಾರಸು')">🌾 ಬೆಳೆ ಶಿಫಾರಸು</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ರಸಗೊಬ್ಬರ')">🧪 ರಸಗೊಬ್ಬರ</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ಮಂಡಿ ದರ')">💰 ಮಂಡಿ ದರ</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ಮಳೆ')">🌧️ ಮಳೆ</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ಇಳುವರಿ')">⚖️ ಇಳುವರಿ</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('ಫಲಿತಾಂಶ ಓದಿ')">🔊 ಫಲಿತಾಂಶ ಓದಿ</button>
      `;
    } else if (activeLang === 'hi') {
      grid.innerHTML = `
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('मौसम')">🌤️ मौसम</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('फसल सिफारिश')">🌾 फसल सिफारिश</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('उर्वरक')">🧪 उर्वरक</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('मंडी भाव')">💰 मंडी भाव</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('बारिश')">🌧️ बारिश</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('उपज')">⚖️ उपज</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('परिणाम सुनाओ')">🔊 परिणाम सुनाओ</button>
      `;
    } else {
      grid.innerHTML = `
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Weather')">🌤️ Weather</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Crop Recommendation')">🌾 Crop Recommendation</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Fertilizer')">🧪 Fertilizer</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Mandi Prices')">💰 Mandi Prices</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Rainfall')">🌧️ Rainfall</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Yield')">⚖️ Yield</button>
        <button class="voice-cmd-chip" onclick="window.AgroIntelVoice.speakCommand('Read Result')">🔊 Read Result</button>
      `;
    }
  }

  function toggleVoiceModal() {
    const panel = document.getElementById('agrointelVoicePanel');
    if (!panel) return;
    if (panel.classList.contains('active')) {
      closeVoiceModal();
    } else {
      openVoiceModal();
    }
  }

  function openVoiceModal() {
    const panel = document.getElementById('agrointelVoicePanel');
    const backdrop = document.getElementById('agrointelVoiceBackdrop');
    if (panel && backdrop) {
      panel.classList.add('active');
      backdrop.classList.add('active');
      updateRecognitionLanguage();
      updateChipsForLanguage();
      startListening();
    }
  }

  function closeVoiceModal() {
    const panel = document.getElementById('agrointelVoicePanel');
    const backdrop = document.getElementById('agrointelVoiceBackdrop');
    if (panel && backdrop) {
      panel.classList.remove('active');
      backdrop.classList.remove('active');
      stopListening();
      stopSpeaking();
    }
  }

  window.addEventListener('agrointel-language-changed', function(e) {
    activeLang = e.detail.lang;
    updateRecognitionLanguage();
    updateChipsForLanguage();
    injectReadAloudButtons();
  });

  document.addEventListener('DOMContentLoaded', function() {
    activeLang = (window.AgroIntelI18N ? window.AgroIntelI18N.getLanguage() : localStorage.getItem('agrointel-lang')) || 'en';
    createVoiceAssistantDOM();
    injectReadAloudButtons();
    initSpeechRecognition();
  });

  window.AgroIntelVoice = {
    toggle: toggleVoiceModal,
    open: openVoiceModal,
    close: closeVoiceModal,
    listen: toggleListening,
    start: startListening,
    stop: stopListening,
    speak: speakText,
    readResult: readActiveResultsAloud,
    speakCommand: function(cmd) {
      handleVoiceCommand(cmd);
    }
  };

})();
