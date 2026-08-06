# राजकीय वेबसाईट — पुणे, महाराष्ट्र

HTML5 + Tailwind CSS + Vanilla JavaScript. कोणताही build step नाही — फाईल थेट ब्राउझरमध्ये उघडा.

## पाने (Pages)

| फाईल | पान |
|---|---|
| `index.html` | मुख्यपृष्ठ — Hero, आकडेवारी, कार्यक्षेत्र, गॅलरी, बातम्या |
| `about.html` | परिचय — व्यक्तिपरिचय, वाटचाल (timeline), स्वप्न-ध्येय, मूल्ये |
| `services.html` | कार्य व सेवा — ८ सेवा, ४ पायऱ्यांची प्रक्रिया, FAQ |
| `contact.html` | संपर्क — फॉर्म (validation सह), माहिती, Google नकाशा |

## भाषा (Languages)

तीन भाषा: **मराठी (default) → हिंदी → English**.
हेडरमधील बटणाने बदलते; निवड `localStorage` मध्ये साठवली जाते, त्यामुळे सर्व पानांवर तीच भाषा राहते.

सर्व मजकूर `assets/js/i18n.js` मध्ये आहे — तिन्ही भाषांसाठी एकच key.
HTML मध्ये असे वापरले जाते:

```html
<h2 data-i18n="home.work.title"></h2>          <!-- साधा मजकूर -->
<p  data-i18n-html="home.hero.slogan"></p>     <!-- \n → <br> -->
<input data-i18n-ph="contact.form.name.ph">    <!-- placeholder -->
```

## पहिल्यांदा काय बदलायचे

### 1. `assets/js/config.js` — नाव, पक्ष, संपर्क

```js
name:        { mr: "...", hi: "...", en: "..." },   // पूर्ण नाव
shortName:   { mr: "...", hi: "...", en: "..." },   // हेडरमधील छोटे नाव
designation: { ... },                               // पद
party:       { ... },                               // पक्ष
phone, phone2, email, officeAddress, social, stats
```

`[नेत्याचे नाव]`, `[पक्षाचे नाव]`, `+91 98XXX XXXXX`, `contact@example.com` —
हे सर्व placeholder आहेत, इथेच बदला. संपूर्ण साईटवर आपोआप लागू होतील.

### 2. `assets/img/` — प्रतिमा

- `logo.png` — लोगो (चौरस, ~512x512). नसेल तर आपोआप ★ दिसते.
- `leader.jpg` — नेत्याचा फोटो (उभा, ~800x1000). नसेल तर placeholder दिसतो.

### 3. रंग — `assets/js/tw-config.js`

```
pink   #ec1c88     brown  #4e271d
green  #64640f     yellow #facc0a
```
वर्ग: `bg-brand-pink`, `text-brand-brown`, `bg-brand-yellowSoft` इत्यादी.
(`assets/css/style.css` मधील `:root` मध्येही तेच रंग आहेत.)

### 4. नकाशा

`config.js` मधील `mapLink` व `mapEmbed` — सध्या `18.500259, 73.934792` वर सेट आहे.

## संपर्क फॉर्म

सध्या फॉर्म फक्त **client-side validation** करतो आणि यशाचा संदेश दाखवतो —
कुठेही डेटा पाठवत नाही (बॅकएंड नाही).

खरा ई-मेल हवा असल्यास `assets/js/main.js` मधील `initForm()` मध्ये,
`/* डेमो: बॅकएंड नाही ... */` या कमेंटच्या जागी `fetch()` कॉल टाका —
उदा. Formspree, Google Apps Script किंवा तुमचा स्वतःचा API.

## फाईल रचना

```
index.html  about.html  services.html  contact.html
assets/
  css/style.css        कस्टम स्टाईल्स (Tailwind च्या वर)
  js/config.js         ← सर्व माहिती इथे
  js/i18n.js           ← सर्व मजकूर (mr/hi/en)
  js/tw-config.js      Tailwind थीम (रंग, फॉन्ट)
  js/main.js           भाषा, मेनू, अ‍ॅनिमेशन, फॉर्म
  img/                 logo.png, leader.jpg
```

## चालवण्यासाठी

`index.html` वर डबल-क्लिक करा, किंवा लोकल सर्व्हर:

```bash
npx serve .
# किंवा
python -m http.server 8080
```

Tailwind CDN वरून येते, त्यामुळे पहिल्यांदा इंटरनेट लागते.

> **प्रोडक्शनसाठी टीप:** Tailwind Play CDN development साठी आहे.
> लाईव्ह साईटसाठी Tailwind CLI ने एक बिल्ट CSS फाईल तयार करा — साईट अधिक वेगवान होईल.
