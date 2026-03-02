import type { Language } from "./translations"

// ─── REPORTS MOCK DATA ───

interface ReportData {
    condition: string
    summary: string
    description: string
    recommendations: string[]
}

interface ReportsTranslations {
    categoryLabels: { posture: string; skin: string; eye: string; mental: string }
    severityLabels: { low: string; medium: string; high: string }
    reports: Record<string, ReportData>
}

const reportsEN: ReportsTranslations = {
    categoryLabels: { posture: "Posture Analysis", skin: "Dermatology Scan", eye: "Eye Health Check", mental: "Mental Health Screening" },
    severityLabels: { low: "LOW", medium: "MEDIUM", high: "HIGH" },
    reports: {
        "1": { condition: "Mild Forward Head Posture", summary: "Slight forward head positioning detected with potential for neck strain", description: "Analysis shows slight forward head positioning which may lead to neck strain and upper back tension.", recommendations: ["Perform neck stretches 3 times daily", "Adjust workstation ergonomics", "Consider physical therapy consultation", "Practice chin tuck exercises"] },
        "2": { condition: "Benign Mole - Monitor", summary: "Benign mole identified with regular monitoring recommended", description: "The analyzed area shows characteristics of a benign mole with regular borders and uniform coloration.", recommendations: ["Monitor for any changes in size or color", "Schedule annual dermatology checkup", "Use broad-spectrum sunscreen daily", "Perform monthly self-examinations"] },
        "3": { condition: "Mild Dry Eye Symptoms", summary: "Early signs of dry eye condition with manageable symptoms", description: "Analysis suggests mild dry eye condition based on visual indicators and screening responses.", recommendations: ["Use preservative-free artificial tears", "Take regular breaks from screen time", "Increase omega-3 fatty acid intake", "Consider humidifier for dry environments"] },
        "4": { condition: "Mild Stress Indicators", summary: "Elevated stress levels detected with anxiety markers present", description: "Voice analysis indicates elevated stress levels with some anxiety markers present.", recommendations: ["Practice daily mindfulness meditation", "Maintain regular sleep schedule", "Consider stress management counseling", "Engage in regular physical exercise"] },
        "5": { condition: "Normal Spinal Alignment", summary: "Excellent posture with proper spinal alignment maintained", description: "Analysis shows optimal spinal alignment with no significant postural deviations detected.", recommendations: ["Continue current exercise routine", "Maintain ergonomic workspace setup", "Regular posture checks throughout day", "Consider preventive strengthening exercises"] },
        "6": { condition: "Minor Sun Damage", summary: "Light sun damage detected with preventive care recommended", description: "Minor signs of UV exposure with early photoaging indicators in the analyzed area.", recommendations: ["Apply SPF 30+ sunscreen daily", "Use antioxidant skincare products", "Consider vitamin C serum", "Schedule dermatology consultation"] },
    },
}

const reportsHI: ReportsTranslations = {
    categoryLabels: { posture: "आसन विश्लेषण", skin: "त्वचा विज्ञान स्कैन", eye: "नेत्र स्वास्थ्य जांच", mental: "मानसिक स्वास्थ्य जांच" },
    severityLabels: { low: "कम", medium: "मध्यम", high: "उच्च" },
    reports: {
        "1": { condition: "हल्का आगे झुकी गर्दन", summary: "गर्दन में तनाव की संभावना के साथ हल्की आगे की स्थिति का पता चला", description: "विश्लेषण हल्की आगे की गर्दन की स्थिति दिखाता है जो गर्दन में तनाव और ऊपरी पीठ में खिंचाव पैदा कर सकता है।", recommendations: ["दिन में 3 बार गर्दन के स्ट्रेच करें", "कार्यस्थल एर्गोनॉमिक्स समायोजित करें", "फिजिकल थेरेपी परामर्श पर विचार करें", "चिन टक व्यायाम का अभ्यास करें"] },
        "2": { condition: "सौम्य तिल - निगरानी", summary: "नियमित निगरानी के साथ सौम्य तिल की पहचान की गई", description: "विश्लेषित क्षेत्र नियमित सीमाओं और समान रंग के साथ सौम्य तिल की विशेषताएं दिखाता है।", recommendations: ["आकार या रंग में किसी भी बदलाव की निगरानी करें", "वार्षिक त्वचा विज्ञान जांच अनुसूचित करें", "रोजाना ब्रॉड-स्पेक्ट्रम सनस्क्रीन का उपयोग करें", "मासिक स्वयं-परीक्षा करें"] },
        "3": { condition: "हल्के सूखी आंख के लक्षण", summary: "प्रबंधनीय लक्षणों के साथ सूखी आंख की स्थिति के शुरुआती संकेत", description: "विश्लेषण दृश्य संकेतकों और स्क्रीनिंग प्रतिक्रियाओं के आधार पर हल्की सूखी आंख की स्थिति का सुझाव देता है।", recommendations: ["प्रिजर्वेटिव-फ्री कृत्रिम आंसू का उपयोग करें", "स्क्रीन समय से नियमित ब्रेक लें", "ओमेगा-3 फैटी एसिड का सेवन बढ़ाएं", "सूखे वातावरण के लिए ह्यूमिडिफायर पर विचार करें"] },
        "4": { condition: "हल्के तनाव संकेतक", summary: "चिंता के संकेतकों के साथ उच्च तनाव स्तर का पता चला", description: "आवाज विश्लेषण कुछ चिंता संकेतकों के साथ उच्च तनाव स्तर इंगित करता है।", recommendations: ["दैनिक माइंडफुलनेस ध्यान का अभ्यास करें", "नियमित नींद कार्यक्रम बनाए रखें", "तनाव प्रबंधन परामर्श पर विचार करें", "नियमित शारीरिक व्यायाम करें"] },
        "5": { condition: "सामान्य रीढ़ की हड्डी का संरेखण", summary: "उचित रीढ़ की हड्डी के संरेखण के साथ उत्कृष्ट आसन", description: "विश्लेषण इष्टतम रीढ़ की हड्डी के संरेखण को दर्शाता है, कोई महत्वपूर्ण आसन विचलन नहीं पाया गया।", recommendations: ["वर्तमान व्यायाम दिनचर्या जारी रखें", "एर्गोनॉमिक कार्यस्थल सेटअप बनाए रखें", "दिन भर नियमित आसन जांच करें", "निवारक मजबूती व्यायामों पर विचार करें"] },
        "6": { condition: "मामूली धूप से नुकसान", summary: "निवारक देखभाल की सिफारिश के साथ हल्के धूप के नुकसान का पता चला", description: "विश्लेषित क्षेत्र में प्रारंभिक फोटोएजिंग संकेतकों के साथ UV एक्सपोज़र के मामूली संकेत।", recommendations: ["रोजाना SPF 30+ सनस्क्रीन लगाएं", "एंटीऑक्सीडेंट स्किनकेयर उत्पादों का उपयोग करें", "विटामिन C सीरम पर विचार करें", "त्वचा विज्ञान परामर्श अनुसूचित करें"] },
    },
}

const reportsES: ReportsTranslations = {
    categoryLabels: { posture: "Análisis Postural", skin: "Escaneo Dermatológico", eye: "Chequeo de Salud Ocular", mental: "Evaluación de Salud Mental" },
    severityLabels: { low: "BAJO", medium: "MEDIO", high: "ALTO" },
    reports: {
        "1": { condition: "Postura Adelantada Leve", summary: "Posicionamiento adelantado de cabeza detectado con potencial de tensión cervical", description: "El análisis muestra una ligera posición adelantada de la cabeza que puede provocar tensión cervical.", recommendations: ["Realizar estiramientos de cuello 3 veces al día", "Ajustar la ergonomía del puesto de trabajo", "Considerar consulta de fisioterapia", "Practicar ejercicios de retracción del mentón"] },
        "2": { condition: "Lunar Benigno - Monitorear", summary: "Lunar benigno identificado con monitoreo regular recomendado", description: "El área analizada muestra características de un lunar benigno con bordes regulares y coloración uniforme.", recommendations: ["Monitorear cambios en tamaño o color", "Programar chequeo dermatológico anual", "Usar protector solar de amplio espectro diariamente", "Realizar autoexámenes mensuales"] },
        "3": { condition: "Síntomas Leves de Ojo Seco", summary: "Signos tempranos de ojo seco con síntomas manejables", description: "El análisis sugiere sequedad ocular leve basada en indicadores visuales.", recommendations: ["Usar lágrimas artificiales sin conservantes", "Tomar descansos regulares de la pantalla", "Aumentar la ingesta de ácidos grasos omega-3", "Considerar humidificador para ambientes secos"] },
        "4": { condition: "Indicadores Leves de Estrés", summary: "Niveles elevados de estrés detectados con marcadores de ansiedad", description: "El análisis de voz indica niveles elevados de estrés con algunos marcadores de ansiedad.", recommendations: ["Practicar meditación mindfulness diaria", "Mantener horario regular de sueño", "Considerar asesoramiento de manejo de estrés", "Realizar ejercicio físico regular"] },
        "5": { condition: "Alineación Espinal Normal", summary: "Excelente postura con alineación espinal adecuada", description: "El análisis muestra alineación espinal óptima sin desviaciones posturales significativas.", recommendations: ["Continuar la rutina de ejercicio actual", "Mantener configuración ergonómica", "Verificaciones posturales regulares durante el día", "Considerar ejercicios de fortalecimiento preventivo"] },
        "6": { condition: "Daño Solar Menor", summary: "Daño solar leve detectado con cuidado preventivo recomendado", description: "Signos menores de exposición UV con indicadores tempranos de fotoenvejecimiento.", recommendations: ["Aplicar protector solar SPF 30+ diariamente", "Usar productos antioxidantes para la piel", "Considerar sérum de vitamina C", "Programar consulta dermatológica"] },
    },
}

const reportsFR: ReportsTranslations = {
    categoryLabels: { posture: "Analyse Posturale", skin: "Scan Dermatologique", eye: "Bilan Oculaire", mental: "Bilan Santé Mentale" },
    severityLabels: { low: "FAIBLE", medium: "MOYEN", high: "ÉLEVÉ" },
    reports: {
        "1": { condition: "Légère Posture de Tête Avancée", summary: "Positionnement de tête avancé détecté avec risque de tension cervicale", description: "L'analyse montre un léger positionnement avancé de la tête pouvant entraîner une tension cervicale.", recommendations: ["Effectuer des étirements du cou 3 fois par jour", "Ajuster l'ergonomie du poste de travail", "Consulter un kinésithérapeute", "Pratiquer les exercices de rétraction du menton"] },
        "2": { condition: "Grain de Beauté Bénin - Surveiller", summary: "Grain de beauté bénin identifié, surveillance régulière recommandée", description: "La zone analysée présente les caractéristiques d'un grain de beauté bénin avec des bords réguliers.", recommendations: ["Surveiller tout changement de taille ou couleur", "Programmer un bilan dermatologique annuel", "Utiliser un écran solaire large spectre quotidiennement", "Effectuer des auto-examens mensuels"] },
        "3": { condition: "Symptômes Légers de Sécheresse Oculaire", summary: "Signes précoces de sécheresse oculaire avec symptômes gérables", description: "L'analyse suggère une sécheresse oculaire légère basée sur les indicateurs visuels.", recommendations: ["Utiliser des larmes artificielles sans conservateur", "Faire des pauses régulières devant l'écran", "Augmenter l'apport en oméga-3", "Envisager un humidificateur pour les environnements secs"] },
        "4": { condition: "Indicateurs de Stress Léger", summary: "Niveaux de stress élevés détectés avec des marqueurs d'anxiété", description: "L'analyse vocale indique des niveaux de stress élevés avec certains marqueurs d'anxiété.", recommendations: ["Pratiquer la méditation de pleine conscience quotidienne", "Maintenir un horaire de sommeil régulier", "Envisager un accompagnement gestion du stress", "Faire de l'exercice physique régulier"] },
        "5": { condition: "Alignement Spinal Normal", summary: "Excellente posture avec alignement spinal correct maintenu", description: "L'analyse montre un alignement spinal optimal sans déviations posturales significatives.", recommendations: ["Continuer la routine d'exercice actuelle", "Maintenir un espace de travail ergonomique", "Vérifications posturales régulières", "Envisager des exercices de renforcement préventifs"] },
        "6": { condition: "Dommages Solaires Mineurs", summary: "Légers dommages solaires détectés, soins préventifs recommandés", description: "Signes mineurs d'exposition UV avec indicateurs précoces de photovieillissement.", recommendations: ["Appliquer un écran solaire SPF 30+ quotidiennement", "Utiliser des produits de soin antioxydants", "Envisager un sérum à la vitamine C", "Programmer une consultation dermatologique"] },
    },
}

// For other languages, use category + severity labels translated, report content falls back to English
const reportsTranslations: Record<Language, ReportsTranslations> = {
    en: reportsEN,
    hi: reportsHI,
    es: reportsES,
    fr: reportsFR,
    de: { categoryLabels: { posture: "Haltungsanalyse", skin: "Dermatologie-Scan", eye: "Augengesundheitscheck", mental: "Psychische Gesundheit" }, severityLabels: { low: "NIEDRIG", medium: "MITTEL", high: "HOCH" }, reports: reportsEN.reports },
    zh: { categoryLabels: { posture: "姿势分析", skin: "皮肤科扫描", eye: "眼睛健康检查", mental: "心理健康筛查" }, severityLabels: { low: "低", medium: "中", high: "高" }, reports: reportsEN.reports },
    ja: { categoryLabels: { posture: "姿勢分析", skin: "皮膚科スキャン", eye: "眼科チェック", mental: "メンタルヘルス" }, severityLabels: { low: "低", medium: "中", high: "高" }, reports: reportsEN.reports },
    ar: { categoryLabels: { posture: "تحليل الوضعية", skin: "فحص الجلد", eye: "فحص صحة العيون", mental: "فحص الصحة النفسية" }, severityLabels: { low: "منخفض", medium: "متوسط", high: "مرتفع" }, reports: reportsEN.reports },
    it: { categoryLabels: { posture: "Analisi Posturale", skin: "Scansione Dermatologica", eye: "Controllo Oculare", mental: "Screening Mentale" }, severityLabels: { low: "BASSO", medium: "MEDIO", high: "ALTO" }, reports: reportsEN.reports },
    pt: { categoryLabels: { posture: "Análise Postural", skin: "Exame Dermatológico", eye: "Exame Ocular", mental: "Triagem Mental" }, severityLabels: { low: "BAIXO", medium: "MÉDIO", high: "ALTO" }, reports: reportsEN.reports },
}

export function getReportsTranslations(lang: Language) {
    return reportsTranslations[lang] || reportsTranslations.en
}

// ─── PLANS MOCK DATA ───

interface PlanTranslation {
    title: string
    description: string
    exercises: { name: string; duration: string; frequency: string; instructions: string[]; benefits: string[] }[]
    tips: string[]
    goals: string[]
}

type PlansTranslations = Record<"posture" | "skin" | "eye" | "mental", PlanTranslation>

const plansEN: PlansTranslations = {
    posture: {
        title: "Posture Correction Program", description: "Comprehensive exercises and habits to improve spinal alignment and reduce postural strain",
        exercises: [
            { name: "Chin Tuck Exercise", duration: "2-3 minutes", frequency: "3 times daily", instructions: ["Sit or stand with your back straight", "Look straight ahead, keeping your shoulders relaxed", "Slowly pull your chin back, creating a double chin", "Hold for 5 seconds, then relax", "Repeat 10-15 times"], benefits: ["Strengthens deep neck flexors", "Reduces forward head posture", "Alleviates neck tension"] },
            { name: "Wall Angels", duration: "5 minutes", frequency: "2 times daily", instructions: ["Stand with your back against a wall", "Place your arms against the wall in a 'W' position", "Slowly slide your arms up and down the wall", "Keep your back and arms in contact with the wall", "Perform 15-20 repetitions"], benefits: ["Improves shoulder mobility", "Strengthens upper back muscles", "Corrects rounded shoulders"] },
            { name: "Cat-Cow Stretch", duration: "3-4 minutes", frequency: "Morning and evening", instructions: ["Start on hands and knees in tabletop position", "Arch your back and look up (Cow pose)", "Round your spine and tuck your chin (Cat pose)", "Move slowly between positions", "Repeat 10-15 times"], benefits: ["Increases spinal flexibility", "Relieves back tension", "Improves posture awareness"] },
        ],
        tips: ["Set up an ergonomic workstation with monitor at eye level", "Take breaks every 30 minutes to stand and stretch", "Use a lumbar support cushion when sitting", "Sleep with a supportive pillow that maintains neck alignment", "Practice mindful posture checks throughout the day"],
        goals: ["Reduce forward head posture by 50% in 4 weeks", "Eliminate daily neck and shoulder pain", "Improve spinal alignment and core strength", "Develop sustainable postural habits"],
    },
    skin: {
        title: "Dermatology Care Plan", description: "Evidence-based skincare routines and protective measures for optimal skin health",
        exercises: [
            { name: "Daily Skincare Routine", duration: "10-15 minutes", frequency: "Twice daily", instructions: ["Cleanse with gentle, pH-balanced cleanser", "Apply vitamin C serum in the morning", "Use retinol or retinoid in the evening", "Apply broad-spectrum SPF 30+ sunscreen daily", "Moisturize with ceramide-containing products"], benefits: ["Prevents premature aging", "Protects against UV damage", "Maintains skin barrier function"] },
            { name: "Weekly Exfoliation", duration: "5 minutes", frequency: "1-2 times weekly", instructions: ["Use chemical exfoliant (AHA/BHA) in the evening", "Start with lower concentrations", "Apply to clean, dry skin", "Follow with moisturizer", "Always use sunscreen the next day"], benefits: ["Removes dead skin cells", "Improves skin texture", "Enhances product absorption"] },
            { name: "Monthly Skin Assessment", duration: "15 minutes", frequency: "Monthly", instructions: ["Examine skin in good lighting using a mirror", "Check for new moles or changes in existing ones", "Look for asymmetry, irregular borders, color changes", "Document any concerns with photos", "Schedule dermatologist visit if needed"], benefits: ["Early detection of skin changes", "Monitors treatment progress", "Maintains skin health awareness"] },
        ],
        tips: ["Wear protective clothing and wide-brimmed hats outdoors", "Avoid peak sun hours (10 AM - 4 PM)", "Stay hydrated with 8+ glasses of water daily", "Eat antioxidant-rich foods (berries, leafy greens)", "Get adequate sleep (7-9 hours) for skin repair"],
        goals: ["Establish consistent daily skincare routine", "Achieve 100% daily sun protection compliance", "Reduce signs of photoaging and improve skin texture", "Maintain regular dermatological monitoring"],
    },
    eye: {
        title: "Eye Health Optimization", description: "Comprehensive eye care exercises and habits to maintain and improve vision health",
        exercises: [
            { name: "20-20-20 Rule", duration: "20 seconds", frequency: "Every 20 minutes", instructions: ["Set a timer for every 20 minutes during screen work", "Look at an object 20 feet away", "Focus on the distant object for 20 seconds", "Blink several times to refresh your eyes", "Return to work with refreshed vision"], benefits: ["Reduces digital eye strain", "Prevents dry eyes", "Maintains focusing flexibility"] },
            { name: "Eye Movement Exercises", duration: "5 minutes", frequency: "2-3 times daily", instructions: ["Sit comfortably and look straight ahead", "Slowly move eyes up and down 10 times", "Move eyes left and right 10 times", "Make clockwise circles 5 times", "Make counter-clockwise circles 5 times"], benefits: ["Strengthens eye muscles", "Improves eye coordination", "Reduces eye fatigue"] },
            { name: "Palming Relaxation", duration: "3-5 minutes", frequency: "As needed for eye strain", instructions: ["Rub your palms together to generate warmth", "Cup your palms over closed eyes without pressure", "Ensure complete darkness under your palms", "Breathe deeply and relax for 3-5 minutes", "Slowly remove hands and open eyes"], benefits: ["Deeply relaxes eye muscles", "Reduces eye strain and tension", "Improves blood circulation to eyes"] },
        ],
        tips: ["Maintain proper lighting when reading or working", "Position screens 20-26 inches from your eyes", "Use artificial tears if you experience dry eyes", "Eat foods rich in omega-3s, lutein, and zeaxanthin", "Get regular comprehensive eye exams"],
        goals: ["Eliminate digital eye strain symptoms", "Maintain optimal tear film and eye moisture", "Preserve and enhance visual acuity", "Prevent age-related eye conditions"],
    },
    mental: {
        title: "Mental Wellness Program", description: "Evidence-based practices for stress management, emotional regulation, and mental resilience",
        exercises: [
            { name: "Mindfulness Meditation", duration: "10-20 minutes", frequency: "Daily", instructions: ["Find a quiet, comfortable place to sit", "Close your eyes and focus on your breath", "Notice when your mind wanders and gently return focus", "Start with 5 minutes and gradually increase", "Use guided meditation apps if helpful"], benefits: ["Reduces stress and anxiety", "Improves emotional regulation", "Enhances focus and concentration"] },
            { name: "Progressive Muscle Relaxation", duration: "15-20 minutes", frequency: "3-4 times weekly", instructions: ["Lie down in a comfortable position", "Tense and relax each muscle group for 5 seconds", "Start with toes and work up to your head", "Focus on contrast between tension and relaxation", "End with deep breathing and full-body relaxation"], benefits: ["Reduces physical tension", "Promotes better sleep", "Increases body awareness"] },
            { name: "Gratitude Journaling", duration: "5-10 minutes", frequency: "Daily (evening)", instructions: ["Write down 3 things you're grateful for each day", "Be specific about why you're grateful", "Include both big and small positive experiences", "Reflect on how these things made you feel", "Review past entries weekly"], benefits: ["Improves mood and life satisfaction", "Reduces negative thinking patterns", "Enhances overall well-being"] },
        ],
        tips: ["Maintain a consistent sleep schedule (7-9 hours)", "Limit caffeine intake, especially in the afternoon", "Engage in regular physical exercise (30 min daily)", "Practice saying 'no' to prevent overcommitment", "Seek professional help when needed"],
        goals: ["Reduce stress and anxiety levels by 40%", "Establish daily mindfulness practice", "Improve sleep quality and emotional resilience", "Build strong support network and coping strategies"],
    },
}

const plansHI: PlansTranslations = {
    posture: {
        title: "आसन सुधार कार्यक्रम", description: "रीढ़ की हड्डी के संरेखण में सुधार और आसन तनाव को कम करने के लिए व्यापक व्यायाम और आदतें",
        exercises: [
            { name: "चिन टक व्यायाम", duration: "2-3 मिनट", frequency: "दिन में 3 बार", instructions: ["सीधे बैठें या खड़े हों", "आगे देखें, कंधों को आराम से रखें", "धीरे-धीरे ठोड़ी को पीछे खींचें", "5 सेकंड रोकें, फिर आराम करें", "10-15 बार दोहराएं"], benefits: ["गहरी गर्दन की मांसपेशियों को मजबूत करता है", "आगे झुकी गर्दन को कम करता है", "गर्दन के तनाव को कम करता है"] },
            { name: "वॉल एंजेल्स", duration: "5 मिनट", frequency: "दिन में 2 बार", instructions: ["दीवार से पीठ लगाकर खड़े हों", "हाथों को 'W' स्थिति में रखें", "धीरे-धीरे हाथों को ऊपर-नीचे सरकाएं", "पीठ और भुजाओं को दीवार से लगाए रखें", "15-20 बार दोहराएं"], benefits: ["कंधे की गतिशीलता में सुधार", "ऊपरी पीठ की मांसपेशियों को मजबूत करता है", "गोल कंधों को ठीक करता है"] },
            { name: "कैट-काउ स्ट्रेच", duration: "3-4 मिनट", frequency: "सुबह और शाम", instructions: ["हाथों और घुटनों पर शुरू करें", "पीठ को मोड़ें और ऊपर देखें", "रीढ़ को गोल करें और ठोड़ी टकें", "धीरे-धीरे स्थिति बदलें", "10-15 बार दोहराएं"], benefits: ["रीढ़ की लचीलापन बढ़ाता है", "पीठ के तनाव से राहत", "आसन जागरूकता में सुधार"] },
        ],
        tips: ["मॉनिटर को आंखों के स्तर पर रखें", "हर 30 मिनट में खड़े होकर स्ट्रेच करें", "बैठते समय लम्बर सपोर्ट कुशन का उपयोग करें", "गर्दन के संरेखण वाले तकिए पर सोएं", "दिन भर सचेत आसन जांच करें"],
        goals: ["4 सप्ताह में आगे झुकी गर्दन को 50% कम करें", "दैनिक गर्दन और कंधे के दर्द को समाप्त करें", "रीढ़ के संरेखण और कोर शक्ति में सुधार", "टिकाऊ आसन आदतें विकसित करें"],
    },
    skin: {
        title: "त्वचा देखभाल योजना", description: "इष्टतम त्वचा स्वास्थ्य के लिए साक्ष्य-आधारित त्वचा देखभाल दिनचर्या",
        exercises: [
            { name: "दैनिक स्किनकेयर रूटीन", duration: "10-15 मिनट", frequency: "दिन में दो बार", instructions: ["सौम्य क्लींजर से साफ करें", "सुबह विटामिन C सीरम लगाएं", "शाम को रेटिनॉल का उपयोग करें", "रोजाना SPF 30+ सनस्क्रीन लगाएं", "सेरामाइड मॉइस्चराइजर से नमी दें"], benefits: ["समय से पहले बुढ़ापा रोकता है", "UV क्षति से बचाता है", "त्वचा बैरियर बनाए रखता है"] },
            { name: "साप्ताहिक एक्सफोलिएशन", duration: "5 मिनट", frequency: "सप्ताह में 1-2 बार", instructions: ["शाम को केमिकल एक्सफोलिएंट का उपयोग करें", "कम सांद्रता से शुरू करें", "साफ, सूखी त्वचा पर लगाएं", "मॉइस्चराइजर से फॉलो करें", "अगले दिन सनस्क्रीन जरूर लगाएं"], benefits: ["मृत त्वचा कोशिकाओं को हटाता है", "त्वचा की बनावट में सुधार", "उत्पाद अवशोषण बढ़ाता है"] },
            { name: "मासिक त्वचा मूल्यांकन", duration: "15 मिनट", frequency: "मासिक", instructions: ["अच्छी रोशनी में त्वचा की जांच करें", "नए तिलों या बदलावों की जांच करें", "असमानता और रंग परिवर्तन देखें", "चिंताओं को फोटो से दस्तावेज करें", "जरूरत पड़ने पर त्वचा विशेषज्ञ से मिलें"], benefits: ["त्वचा परिवर्तनों का शीघ्र पता", "उपचार की प्रगति की निगरानी", "त्वचा स्वास्थ्य जागरूकता बनाए रखता है"] },
        ],
        tips: ["बाहर सुरक्षात्मक कपड़े और टोपी पहनें", "चरम धूप के घंटों से बचें (10 AM - 4 PM)", "रोजाना 8+ गिलास पानी पिएं", "एंटीऑक्सीडेंट-समृद्ध खाद्य पदार्थ खाएं", "त्वचा की मरम्मत के लिए पर्याप्त नींद लें"],
        goals: ["निरंतर दैनिक स्किनकेयर रूटीन स्थापित करें", "100% दैनिक सन प्रोटेक्शन अनुपालन", "फोटोएजिंग के संकेतों को कम करें", "नियमित त्वचाविज्ञान निगरानी बनाए रखें"],
    },
    eye: {
        title: "नेत्र स्वास्थ्य अनुकूलन", description: "दृष्टि स्वास्थ्य को बनाए रखने के लिए व्यापक नेत्र देखभाल व्यायाम और आदतें",
        exercises: [
            { name: "20-20-20 नियम", duration: "20 सेकंड", frequency: "हर 20 मिनट में", instructions: ["स्क्रीन कार्य के दौरान हर 20 मिनट का टाइमर सेट करें", "20 फीट दूर की वस्तु को देखें", "दूर की वस्तु पर 20 सेकंड फोकस करें", "आंखों को रिफ्रेश करने के लिए कई बार झपकें", "ताज़ा दृष्टि के साथ काम पर लौटें"], benefits: ["डिजिटल आंख तनाव कम करता है", "सूखी आंखों को रोकता है", "फोकसिंग लचीलापन बनाए रखता है"] },
            { name: "आंख की गति व्यायाम", duration: "5 मिनट", frequency: "दिन में 2-3 बार", instructions: ["आराम से बैठें और सीधे आगे देखें", "धीरे-धीरे आंखें ऊपर-नीचे 10 बार हिलाएं", "आंखें बाएं-दाएं 10 बार हिलाएं", "घड़ी की दिशा में 5 बार गोले बनाएं", "विपरीत दिशा में 5 बार गोले बनाएं"], benefits: ["आंख की मांसपेशियों को मजबूत करता है", "आंख समन्वय में सुधार", "आंख की थकान कम करता है"] },
            { name: "पामिंग विश्राम", duration: "3-5 मिनट", frequency: "आवश्यकतानुसार", instructions: ["हथेलियों को रगड़कर गर्माहट पैदा करें", "बंद आंखों पर बिना दबाव के हथेलियां रखें", "हथेलियों के नीचे पूर्ण अंधेरा सुनिश्चित करें", "गहरी सांस लें और 3-5 मिनट आराम करें", "धीरे-धीरे हाथ हटाएं और आंखें खोलें"], benefits: ["आंख की मांसपेशियों को गहरा आराम", "आंख तनाव और खिंचाव कम करता है", "आंखों में रक्त परिसंचरण सुधारता है"] },
        ],
        tips: ["पढ़ते या काम करते समय उचित प्रकाश बनाए रखें", "स्क्रीन को आंखों से 20-26 इंच दूर रखें", "सूखी आंखों के लिए कृत्रिम आंसू का उपयोग करें", "ओमेगा-3 और ल्यूटिन-समृद्ध खाद्य पदार्थ खाएं", "नियमित व्यापक नेत्र परीक्षा कराएं"],
        goals: ["डिजिटल आंख तनाव के लक्षणों को समाप्त करें", "इष्टतम आंसू फिल्म और नमी बनाए रखें", "दृश्य तीक्ष्णता को संरक्षित और बढ़ाएं", "उम्र से संबंधित नेत्र स्थितियों को रोकें"],
    },
    mental: {
        title: "मानसिक कल्याण कार्यक्रम", description: "तनाव प्रबंधन और भावनात्मक लचीलेपन के लिए साक्ष्य-आधारित प्रथाएं",
        exercises: [
            { name: "माइंडफुलनेस ध्यान", duration: "10-20 मिनट", frequency: "दैनिक", instructions: ["एक शांत, आरामदायक जगह बैठें", "आंखें बंद करें और सांस पर ध्यान दें", "मन भटकने पर धीरे से वापस लाएं", "5 मिनट से शुरू करें और धीरे-धीरे बढ़ाएं", "जरूरत पड़ने पर गाइडेड मेडिटेशन ऐप्स का उपयोग करें"], benefits: ["तनाव और चिंता कम करता है", "भावनात्मक नियंत्रण में सुधार", "ध्यान और एकाग्रता बढ़ाता है"] },
            { name: "प्रगतिशील मांसपेशी विश्राम", duration: "15-20 मिनट", frequency: "सप्ताह में 3-4 बार", instructions: ["आरामदायक स्थिति में लेटें", "प्रत्येक मांसपेशी समूह को 5 सेकंड तनाव दें फिर आराम करें", "पैर की उंगलियों से सिर तक काम करें", "तनाव और विश्राम के बीच अंतर पर ध्यान दें", "गहरी सांस और पूर्ण शरीर विश्राम से समाप्त करें"], benefits: ["शारीरिक तनाव कम करता है", "बेहतर नींद को बढ़ावा देता है", "शरीर जागरूकता बढ़ाता है"] },
            { name: "कृतज्ञता जर्नलिंग", duration: "5-10 मिनट", frequency: "दैनिक (शाम)", instructions: ["रोजाना 3 चीजें लिखें जिनके लिए आप आभारी हैं", "विशिष्ट रूप से बताएं क्यों आभारी हैं", "बड़े और छोटे दोनों सकारात्मक अनुभव शामिल करें", "सोचें कि इन चीजों ने आपको कैसा महसूस कराया", "साप्ताहिक पिछली प्रविष्टियों की समीक्षा करें"], benefits: ["मनोदशा और जीवन संतुष्टि में सुधार", "नकारात्मक सोच पैटर्न कम करता है", "समग्र कल्याण बढ़ाता है"] },
        ],
        tips: ["लगातार नींद का समय बनाए रखें (7-9 घंटे)", "दोपहर के बाद कैफीन सीमित करें", "नियमित शारीरिक व्यायाम करें (दैनिक 30 मिनट)", "'नहीं' कहने का अभ्यास करें", "जरूरत पड़ने पर पेशेवर मदद लें"],
        goals: ["तनाव और चिंता स्तर 40% कम करें", "दैनिक माइंडफुलनेस अभ्यास स्थापित करें", "नींद की गुणवत्ता और भावनात्मक लचीलापन सुधारें", "मजबूत सहायता नेटवर्क और मुकाबला रणनीतियां बनाएं"],
    },
}

// For languages without full plan translations, use English content with translated titles
const plansTranslations: Record<Language, PlansTranslations> = {
    en: plansEN,
    hi: plansHI,
    es: plansEN, // Spanish can use English health content for now
    fr: plansEN,
    de: plansEN,
    zh: plansEN,
    ja: plansEN,
    ar: plansEN,
    it: plansEN,
    pt: plansEN,
}

export function getPlansTranslations(lang: Language) {
    return plansTranslations[lang] || plansTranslations.en
}
