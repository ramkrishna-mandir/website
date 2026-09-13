# 🛕 श्री रामकृष्ण मंदिर, अबगांव खुर्द — वेबसाइट

अबगांव खुर्द, हरदा (म.प्र.) स्थित श्री रामकृष्ण मंदिर की आधिकारिक वेबसाइट। यह एक स्टैटिक (static) साइट है — HTML, CSS और JavaScript से बनी, बिना किसी बैकएंड सर्वर के।

**Live structure:** एक ही पेज (single-page site) — Home, About, Darshan (आरती समय), Events, Gallery, Donation, Contact — सभी सेक्शन एक ही `index.html` में, अलग-अलग `#id` से लिंक किए गए।

---

## 📁 Folder Structure

```
ramkrishna-mandir/
├── index.html                  ← पूरी साइट की HTML
├── assets/
│   ├── css/style.css           ← सारा CSS (पहले index.html के अंदर था)
│   ├── js/script.js            ← सारा JavaScript
│   └── images/                 ← सभी इमेजेस़ (optimized)
├── .github/workflows/deploy.yml ← GitHub Pages पर auto-deploy
├── robots.txt                  ← search engines के लिए
├── sitemap.xml                 ← SEO के लिए
├── .gitignore
└── README.md                   ← यही फाइल
```

---

## 🔍 सीनियर डेवलपर रिव्यू — क्या-क्या समस्याएँ मिलीं और क्या ठीक किया गया

### 🔴 सबसे बड़ी समस्या: इमेज साइज़ (Critical — Performance)
अपलोड किए गए प्रोजेक्ट में **images फ़ोल्डर की साइज़ लगभग 62 MB** थी — जबकि ज़्यादातर तस्वीरें (`gallery*.png`, event images) असल में सिर्फ़ 250–280px चौड़ी जगह पर दिखनी थीं, पर हर फ़ोटो 3000×4000px की PNG थी (मोबाइल कैमरा की सीधी फ़ोटो, बिना compress किए)।

**इसका नुकसान:** ग्रामीण/छोटे शहर के भक्त ज़्यादातर मोबाइल डेटा पर साइट खोलेंगे — 62MB की साइट लोड होने में मिनटों लग सकते हैं या डेटा खर्च होने से लोग बीच में ही छोड़ देंगे।

**क्या किया:**
- सभी फ़ोटो को उनके असली डिस्प्ले साइज़ के हिसाब से resize किया
- PNG को JPEG (quality 80-85, progressive) में बदला — QR कोड को छोड़कर, जो scan होने के लिए sharp PNG ही रहना चाहिए
- नतीजा: **62 MB → 4.7 MB (~92% कम)**, बिना किसी visual quality के फ़र्क़ के

| फाइल | पहले | बाद में |
|---|---|---|
| सभी images कुल | ~61.8 MB | ~4.7 MB |
| सबसे बड़ी फोटो (janmashtami.png) | 5.5 MB | 284 KB |

### 🔴 Contact Form काम नहीं कर रहा था (Critical — Functionality)
पुराना फॉर्म सिर्फ़ यह करता था:
```js
onsubmit="event.preventDefault(); alert('धन्यवाद...'); this.reset();"
```
यानी भक्त का संदेश **कहीं भेजा ही नहीं जा रहा था** — सिर्फ़ एक अलर्ट दिखाकर फॉर्म खाली हो जाता था। संदेश हमेशा के लिए खो जाता।

**क्या किया:** फॉर्म को [FormSubmit.co](https://formsubmit.co) से जोड़ा — यह एक मुफ़्त सेवा है जो बिना किसी बैकएंड कोड के फॉर्म की entries सीधे आपकी ईमेल (`ramkrishnamandir.abgaon@gmail.com`, जो साइट पर पहले से दी गई थी) पर भेज देती है। साथ में:
- Honeypot फ़ील्ड जोड़ी (spam bots रोकने के लिए)
- मोबाइल नंबर की validation (10 अंक, सही शुरुआत)
- Loading state + success/error मैसेज (blocking `alert()` की जगह)

**⚠️ आपको एक काम करना होगा:** पहली बार फॉर्म सबमिट होने पर FormSubmit आपकी ईमेल पर एक **confirmation link** भेजेगा। उसे एक बार क्लिक करके activate करें — उसके बाद हर संदेश सीधे ईमेल पर आता रहेगा। (नीचे "Contact Form Activate करें" सेक्शन देखें)

### 🟠 कोड संरचना (Code Organization)
- पूरा CSS (~500 लाइनें) और JS एक ही `index.html` के अंदर `<style>`/`<script>` में था — अब अलग `assets/css/style.css` और `assets/js/script.js` फाइलों में, जिससे कोड पढ़ना, maintain करना और browser caching दोनों बेहतर होंगे।
- जगह-जगह inline `style="..."` attributes थे — ज़्यादातर हटाकर CSS classes में शिफ्ट किए।

### 🟠 SEO
पहले सिर्फ़ basic `<title>`/`<meta description>` था। जोड़ा गया:
- **Open Graph + Twitter Card टैग** — जब कोई भक्त साइट का लिंक WhatsApp/Facebook पर शेयर करेगा, तो अब मंदिर की फ़ोटो और टाइटल के साथ एक सुंदर preview कार्ड दिखेगा (पहले कुछ नहीं दिखता था)
- **JSON-LD structured data** (`HinduTemple` schema) — इससे Google को पता चलता है कि यह एक मंदिर है, पता क्या है, टाइमिंग क्या है — मैप/लोकल सर्च में दिखने के चांस बढ़ते हैं
- `robots.txt` और `sitemap.xml`
- `rel="canonical"` (⚠️ अभी placeholder domain है, असली डोमेन से बदलें)

### 🟠 Accessibility (सुगम्यता)
- Contact form के इनपुट्स में सिर्फ़ placeholder था, कोई `<label>` नहीं — screen reader users के लिए भ्रमित करने वाला था। अब हर फ़ील्ड का proper (visually-hidden) label है
- Menu वाले बटन में `aria-label`, `aria-expanded`, `aria-controls` जोड़े
- हर decorative icon/emoji पर `aria-hidden="true"` (screen reader इन्हें बार-बार न पढ़े)
- "Skip to main content" लिंक जोड़ी (keyboard users के लिए)
- `target="_blank"` वाले सभी लिंक्स पर `rel="noopener noreferrer"` जोड़ा (security + performance)
- `prefers-reduced-motion` वाले users के लिए animations कम करने का CSS rule जोड़ा

### 🟠 Performance (इमेज के अलावा)
- सभी नीचे-की-तरफ़ (below-the-fold) images पर `loading="lazy"` + `decoding="async"` जोड़ा — यानी गैलरी/इवेंट्स की तस्वीरें सिर्फ़ तब लोड होंगी जब यूज़र वहाँ तक स्क्रॉल करे
- सभी images पर सही `width`/`height` attributes जोड़े ताकि page load होते समय layout अचानक "उछले" नहीं (CLS/Cumulative Layout Shift कम होता है)
- Google Fonts/CDN डोमेन्स के लिए `<link rel="preconnect">` जोड़ा
- AOS स्क्रिप्ट पर `defer` लगाया

### 🟡 डेटा सुरक्षा से जुड़ा ज़रूरी सुझाव (दान/बैंक विवरण)
Donation सेक्शन में जो बैंक अकाउंट नंबर (`12345678901`), IFSC (`SBIN0012345`) और UPI ID (`ramkrishnamandir@upi`) दिए गए हैं, वे **placeholder जैसे लग रहे हैं** (यानी शायद असली नहीं हैं)। साइट लाइव करने से पहले:
1. यह ज़रूर पक्का करें कि ये मंदिर के सही और चालू खाते के विवरण हैं
2. QR कोड इमेज को दोबारा स्कैन करके टेस्ट कर लें कि वह सही UPI ID खोलता है
3. भविष्य में कभी भी GitHub पर पुराना/गलत बैंक विवरण commit न रहे — history में रह जाता है, इसलिए हमेशा सही जानकारी अपडेट करने के बाद ध्यान से commit करें

यह finance से जुड़ी जानकारी है, इसलिए एक गलती सीधे भक्तों के पैसे को गलत जगह भेज सकती है — इसे सबसे पहले verify करें।

---

## ✅ Live करने से पहले आपको जो करना है (TODO)

- [ ] **बैंक/UPI विवरण verify करें** (ऊपर देखें) — सबसे ज़रूरी
- [ ] Contact form activate करें — पहला संदेश खुद भेजकर टेस्ट करें, ईमेल में आया confirmation link क्लिक करें
- [ ] `index.html` में `canonical`/`og:url` और `robots.txt`, `sitemap.xml` में placeholder domain (`ramkrishnamandir-abgaon.example.com`) को अपनी असली डोमेन (या `https://<username>.github.io/<repo-name>/`) से बदलें
- [ ] Footer के Facebook/Instagram/YouTube लिंक अभी `#` (placeholder) हैं — असली प्रोफ़ाइल लिंक डालें, या जो सोशल अकाउंट नहीं हैं उन्हें हटा दें
- [ ] एक बार पूरी साइट को मोबाइल पर खोलकर देख लें (सारे बटन, फॉर्म, WhatsApp लिंक टेस्ट करें)

---

## 💻 Local में चलाना (Run Locally)

कोई भी build step नहीं चाहिए — सीधे `index.html` को ब्राउज़र में खोल सकते हैं, या एक लोकल सर्वर चलाएँ (recommended, ताकि relative paths सही तरह काम करें):

```bash
cd ramkrishna-mandir
python3 -m http.server 8000
# फिर ब्राउज़र में खोलें: http://localhost:8000
```

---

## 🚀 GitHub पर अपलोड करना

```bash
cd ramkrishna-mandir
git init -b main
git add .
git commit -m "Initial commit: Shri Ramkrishna Mandir website"
git remote add origin https://github.com/<आपका-username>/<repo-name>.git
git push -u origin main
```

## 🌐 GitHub Pages पर फ्री होस्टिंग (2 तरीके)

**तरीका 1 — सबसे आसान (Settings से):**
1. GitHub पर repo खोलें → **Settings → Pages**
2. "Branch" में `main` चुनें, folder `/ (root)` रखें → **Save**
3. कुछ मिनट में साइट `https://<username>.github.io/<repo-name>/` पर लाइव हो जाएगी

**तरीका 2 — यह repo पहले से तैयार Action इस्तेमाल करके (`.github/workflows/deploy.yml`):**
1. Repo **Settings → Pages → Build and deployment → Source** में **"GitHub Actions"** चुनें
2. `main` branch पर हर push के साथ साइट अपने-आप deploy हो जाएगी

---

## 💡 आगे के लिए सुझाव (Future Improvements)

1. **WebP images** — JPEG की जगह WebP फॉर्मेट इस्तेमाल करने से साइज़ और भी ~25-30% कम हो सकता है (`<picture>` टैग से fallback के साथ)
2. **Lightbox गैलरी** — अभी गैलरी की फोटो पर क्लिक करने से कुछ नहीं होता; एक हल्की JS lightbox (जैसे [GLightbox](https://biati-digital.github.io/glightbox/)) जोड़ने से फोटो बड़ी होकर खुलेगी
3. **Real Google Reviews / Testimonials सेक्शन** — भक्तों के अनुभव दिखाने से भरोसा बढ़ता है
4. **Multi-language toggle** — अभी पूरी साइट हिंदी में है; अगर बाहर के शहर से भक्त आते हैं तो English toggle उपयोगी हो सकता है
5. **Events को dynamic बनाना** — अभी सारे events hardcoded हैं; भविष्य में अगर events बार-बार बदलते हैं तो एक छोटी JSON फाइल से events लोड करना आसान रहेगा (कोड बदले बिना)
6. **Analytics** — Google Analytics या [Plausible](https://plausible.io) जोड़कर देख सकते हैं कितने लोग साइट देख रहे हैं, कहाँ से आ रहे हैं
7. **Custom domain** — GitHub Pages पर अपनी खुद की डोमेन (जैसे `ramkrishnamandirabgaon.in`) जोड़ी जा सकती है
8. **Third-party scripts पर SRI (Subresource Integrity)** — Font Awesome / AOS को CDN से लोड करते समय `integrity` hash जोड़ना supply-chain सुरक्षा के लिए अच्छा रहता है (सही hash value CDN की डॉक्यूमेंटेशन/वेबसाइट से लेकर जोड़ें)

---

## 🙏 Credits

- **पुजारी:** ओम प्रकाश जी वैष्णव
- **संचालक:** रिषभ वैष्णव
- **Developer:** Vikram Singh Rajput
