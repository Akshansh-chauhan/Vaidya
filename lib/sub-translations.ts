import type { Language } from "./translations"

type SubPageTranslations = {
    common: { backHome: string; backScan: string; newScan: string; startFirst: string }
    scan: {
        heading: string; subtitle: string; badge: string
        posture: string; postureDesc: string
        skin: string; skinDesc: string
        eye: string; eyeDesc: string
        mental: string; mentalDesc: string
        aiChat: string; voiceText: string; startChat: string
        quickAccess: string; quickAccessDesc: string; viewReports: string; getPlans: string
    }
    scanPages: {
        posture: { title: string; desc: string; chatDesc: string }
        skin: { title: string; desc: string; chatDesc: string }
        eye: { title: string; desc: string; chatDesc: string }
        mental: { title: string; desc: string; chatDesc: string }
    }
    reports: {
        heading: string; subtitle: string
        totalScans: string; highPriority: string; mediumPriority: string; lowPriority: string
        search: string; allCategories: string; allSeverities: string
        posture: string; dermatology: string; eyeHealth: string; mentalHealth: string
        viewDetails: string; download: string; noReports: string; noReportsHint: string; noReportsFilter: string
        analysisSummary: string; recommendations: string; confidence: string; priority: string
    }
    plans: {
        heading: string; subtitle: string; progress: string
        exercises: string; exerciseProgram: string; exerciseDesc: string
        goals: string; tips: string; instructions: string; benefits: string; frequency: string
        markComplete: string; markIncomplete: string
        beginner: string; intermediate: string; advanced: string
    }
}

const en: SubPageTranslations = {
    common: { backHome: "Back to Home", backScan: "Back to Scan", newScan: "New Scan", startFirst: "Start Your First Scan" },
    scan: {
        heading: "AI Health Assistant - 2026", subtitle: "Choose your health analysis category to start an interactive conversation with our specialized AI assistants. Each assistant provides personalized insights, real-time analysis, and evidence-based recommendations.",
        badge: "Interactive Chat Experience",
        posture: "Spine & Posture Analysis", postureDesc: "AI-powered posture assessment with personalized recommendations",
        skin: "Dermatology Scan", skinDesc: "Advanced skin analysis for early detection and skincare guidance",
        eye: "Ophthalmology Check", eyeDesc: "Comprehensive eye health assessment and vision screening",
        mental: "Mental Health Screening", mentalDesc: "Confidential mental wellness evaluation with AI insights",
        aiChat: "Interactive AI Chat", voiceText: "Voice & Text Support", startChat: "Start Chat Session",
        quickAccess: "Quick Access", quickAccessDesc: "Access your previous conversations and health reports",
        viewReports: "View All Reports", getPlans: "Get Exercise Plans",
    },
    scanPages: {
        posture: { title: "Spine & Posture Analysis", desc: "Get personalized posture analysis and corrective recommendations from our AI assistant. Upload photos or videos of your posture for detailed assessment.", chatDesc: "Upload images or videos of your posture for AI-powered analysis and personalized recommendations" },
        skin: { title: "Dermatology Scan", desc: "Advanced AI-powered skin analysis for early detection and personalized skincare recommendations. Upload clear images of skin areas for comprehensive assessment.", chatDesc: "Upload high-quality images of skin areas for AI-powered dermatological analysis and recommendations" },
        eye: { title: "Ophthalmology Check", desc: "Comprehensive eye health assessment using advanced AI technology. Upload eye photos and answer screening questions for detailed vision analysis.", chatDesc: "Upload eye images and discuss vision concerns for AI-powered ophthalmological assessment" },
        mental: { title: "Mental Health Screening", desc: "Confidential mental health assessment with AI-powered insights and personalized recommendations. Share your thoughts through voice or text for comprehensive mental wellness evaluation.", chatDesc: "Share your thoughts and feelings through voice or text for AI-powered mental health assessment" },
    },
    reports: {
        heading: "Health Reports", subtitle: "View and manage your health scan history and analysis results",
        totalScans: "Total Scans", highPriority: "High Priority", mediumPriority: "Medium Priority", lowPriority: "Low Priority",
        search: "Search reports by condition or summary...", allCategories: "All Categories", allSeverities: "All Severities",
        posture: "Posture Analysis", dermatology: "Dermatology", eyeHealth: "Eye Health", mentalHealth: "Mental Health",
        viewDetails: "View Details", download: "Download Full Report", noReports: "No Reports Found",
        noReportsHint: "You haven't completed any health scans yet", noReportsFilter: "Try adjusting your search or filter criteria",
        analysisSummary: "Analysis Summary", recommendations: "Recommendations", confidence: "Confidence", priority: "PRIORITY",
    },
    plans: {
        heading: "Health Improvement Plans", subtitle: "Personalized exercise routines and lifestyle recommendations to address your health concerns and optimize your well-being",
        progress: "Your Progress", exercises: "exercises",
        exerciseProgram: "Exercise Program", exerciseDesc: "Follow these exercises regularly for optimal results",
        goals: "Program Goals", tips: "Lifestyle Tips", instructions: "Instructions", benefits: "Benefits", frequency: "Frequency",
        markComplete: "Mark Complete", markIncomplete: "Mark Incomplete",
        beginner: "beginner", intermediate: "intermediate", advanced: "advanced",
    },
}

const hi: SubPageTranslations = {
    common: { backHome: "होम पर वापस", backScan: "स्कैन पर वापस", newScan: "नया स्कैन", startFirst: "अपना पहला स्कैन शुरू करें" },
    scan: {
        heading: "AI स्वास्थ्य सहायक - 2026", subtitle: "हमारे विशेष AI सहायकों के साथ इंटरैक्टिव बातचीत शुरू करने के लिए अपनी स्वास्थ्य विश्लेषण श्रेणी चुनें।",
        badge: "इंटरैक्टिव चैट अनुभव",
        posture: "रीढ़ और आसन विश्लेषण", postureDesc: "व्यक्तिगत सिफारिशों के साथ AI-संचालित आसन मूल्यांकन",
        skin: "त्वचा विज्ञान स्कैन", skinDesc: "शीघ्र पहचान और त्वचा देखभाल मार्गदर्शन के लिए उन्नत त्वचा विश्लेषण",
        eye: "नेत्र विज्ञान जांच", eyeDesc: "व्यापक नेत्र स्वास्थ्य मूल्यांकन और दृष्टि जांच",
        mental: "मानसिक स्वास्थ्य जांच", mentalDesc: "AI अंतर्दृष्टि के साथ गोपनीय मानसिक कल्याण मूल्यांकन",
        aiChat: "इंटरैक्टिव AI चैट", voiceText: "आवाज और टेक्स्ट सहायता", startChat: "चैट सत्र शुरू करें",
        quickAccess: "त्वरित पहुंच", quickAccessDesc: "अपनी पिछली बातचीत और स्वास्थ्य रिपोर्ट एक्सेस करें",
        viewReports: "सभी रिपोर्ट देखें", getPlans: "व्यायाम योजनाएं प्राप्त करें",
    },
    scanPages: {
        posture: { title: "रीढ़ और आसन विश्लेषण", desc: "हमारे AI सहायक से व्यक्तिगत आसन विश्लेषण और सुधारात्मक सिफारिशें प्राप्त करें।", chatDesc: "AI-संचालित विश्लेषण के लिए अपने आसन की छवियां या वीडियो अपलोड करें" },
        skin: { title: "त्वचा विज्ञान स्कैन", desc: "शीघ्र पहचान और व्यक्तिगत त्वचा देखभाल सिफारिशों के लिए उन्नत AI-संचालित त्वचा विश्लेषण।", chatDesc: "AI-संचालित त्वचा विश्लेषण के लिए त्वचा क्षेत्रों की उच्च गुणवत्ता वाली छवियां अपलोड करें" },
        eye: { title: "नेत्र विज्ञान जांच", desc: "उन्नत AI तकनीक का उपयोग करके व्यापक नेत्र स्वास्थ्य मूल्यांकन।", chatDesc: "AI-संचालित नेत्र मूल्यांकन के लिए आंखों की छवियां अपलोड करें" },
        mental: { title: "मानसिक स्वास्थ्य जांच", desc: "AI-संचालित अंतर्दृष्टि और व्यक्तिगत सिफारिशों के साथ गोपनीय मानसिक स्वास्थ्य मूल्यांकन।", chatDesc: "AI-संचालित मानसिक स्वास्थ्य मूल्यांकन के लिए आवाज या टेक्स्ट के माध्यम से साझा करें" },
    },
    reports: {
        heading: "स्वास्थ्य रिपोर्ट", subtitle: "अपने स्वास्थ्य स्कैन इतिहास और विश्लेषण परिणाम देखें और प्रबंधित करें",
        totalScans: "कुल स्कैन", highPriority: "उच्च प्राथमिकता", mediumPriority: "मध्यम प्राथमिकता", lowPriority: "कम प्राथमिकता",
        search: "स्थिति या सारांश द्वारा रिपोर्ट खोजें...", allCategories: "सभी श्रेणियां", allSeverities: "सभी गंभीरता",
        posture: "आसन विश्लेषण", dermatology: "त्वचा विज्ञान", eyeHealth: "नेत्र स्वास्थ्य", mentalHealth: "मानसिक स्वास्थ्य",
        viewDetails: "विवरण देखें", download: "पूरी रिपोर्ट डाउनलोड करें", noReports: "कोई रिपोर्ट नहीं मिली",
        noReportsHint: "आपने अभी तक कोई स्वास्थ्य स्कैन पूरा नहीं किया है", noReportsFilter: "अपनी खोज या फ़िल्टर मानदंड समायोजित करें",
        analysisSummary: "विश्लेषण सारांश", recommendations: "सिफारिशें", confidence: "विश्वसनीयता", priority: "प्राथमिकता",
    },
    plans: {
        heading: "स्वास्थ्य सुधार योजनाएं", subtitle: "आपकी स्वास्थ्य चिंताओं को दूर करने के लिए व्यक्तिगत व्यायाम दिनचर्या और जीवनशैली सिफारिशें",
        progress: "आपकी प्रगति", exercises: "व्यायाम",
        exerciseProgram: "व्यायाम कार्यक्रम", exerciseDesc: "इष्टतम परिणामों के लिए इन व्यायामों को नियमित रूप से करें",
        goals: "कार्यक्रम लक्ष्य", tips: "जीवनशैली सुझाव", instructions: "निर्देश", benefits: "लाभ", frequency: "आवृत्ति",
        markComplete: "पूर्ण चिह्नित करें", markIncomplete: "अपूर्ण चिह्नित करें",
        beginner: "शुरुआती", intermediate: "मध्यवर्ती", advanced: "उन्नत",
    },
}

const es: SubPageTranslations = {
    common: { backHome: "Volver al Inicio", backScan: "Volver al Escaneo", newScan: "Nuevo Escaneo", startFirst: "Iniciar su Primer Escaneo" },
    scan: {
        heading: "Asistente de Salud IA - 2026", subtitle: "Elija su categoría de análisis de salud para iniciar una conversación interactiva con nuestros asistentes especializados.",
        badge: "Experiencia de Chat Interactivo",
        posture: "Análisis de Columna y Postura", postureDesc: "Evaluación de postura con IA con recomendaciones personalizadas",
        skin: "Escaneo Dermatológico", skinDesc: "Análisis avanzado de piel para detección temprana",
        eye: "Chequeo Oftalmológico", eyeDesc: "Evaluación integral de salud ocular",
        mental: "Evaluación de Salud Mental", mentalDesc: "Evaluación confidencial de bienestar mental con IA",
        aiChat: "Chat IA Interactivo", voiceText: "Soporte de Voz y Texto", startChat: "Iniciar Sesión de Chat",
        quickAccess: "Acceso Rápido", quickAccessDesc: "Acceda a sus conversaciones y reportes anteriores",
        viewReports: "Ver Todos los Informes", getPlans: "Obtener Planes de Ejercicio",
    },
    scanPages: {
        posture: { title: "Análisis de Columna y Postura", desc: "Obtenga análisis personalizado de postura de nuestro asistente IA.", chatDesc: "Suba imágenes o videos de su postura para análisis con IA" },
        skin: { title: "Escaneo Dermatológico", desc: "Análisis avanzado de piel con IA para detección temprana.", chatDesc: "Suba imágenes de áreas de piel para análisis dermatológico" },
        eye: { title: "Chequeo Oftalmológico", desc: "Evaluación integral de salud ocular con tecnología IA avanzada.", chatDesc: "Suba imágenes de ojos para evaluación oftalmológica" },
        mental: { title: "Evaluación de Salud Mental", desc: "Evaluación confidencial de salud mental con IA.", chatDesc: "Comparta sus pensamientos para evaluación de salud mental" },
    },
    reports: {
        heading: "Informes de Salud", subtitle: "Vea y gestione su historial de escaneos y resultados",
        totalScans: "Total de Escaneos", highPriority: "Alta Prioridad", mediumPriority: "Prioridad Media", lowPriority: "Baja Prioridad",
        search: "Buscar informes...", allCategories: "Todas las Categorías", allSeverities: "Todas las Severidades",
        posture: "Análisis Postural", dermatology: "Dermatología", eyeHealth: "Salud Ocular", mentalHealth: "Salud Mental",
        viewDetails: "Ver Detalles", download: "Descargar Informe", noReports: "No se Encontraron Informes",
        noReportsHint: "No ha completado ningún escaneo", noReportsFilter: "Ajuste sus criterios de búsqueda",
        analysisSummary: "Resumen del Análisis", recommendations: "Recomendaciones", confidence: "Confianza", priority: "PRIORIDAD",
    },
    plans: {
        heading: "Planes de Mejora de Salud", subtitle: "Rutinas personalizadas de ejercicio y recomendaciones de estilo de vida",
        progress: "Su Progreso", exercises: "ejercicios",
        exerciseProgram: "Programa de Ejercicios", exerciseDesc: "Siga estos ejercicios regularmente para resultados óptimos",
        goals: "Objetivos del Programa", tips: "Consejos de Estilo de Vida", instructions: "Instrucciones", benefits: "Beneficios", frequency: "Frecuencia",
        markComplete: "Marcar Completo", markIncomplete: "Marcar Incompleto",
        beginner: "principiante", intermediate: "intermedio", advanced: "avanzado",
    },
}

// Full translations for all languages
const fr: SubPageTranslations = {
    common: { backHome: "Retour à l'Accueil", backScan: "Retour au Scan", newScan: "Nouveau Scan", startFirst: "Commencer Votre Premier Scan" },
    scan: {
        heading: "Assistant Santé IA - 2026", subtitle: "Choisissez votre catégorie d'analyse de santé pour démarrer une conversation interactive avec nos assistants IA spécialisés.",
        badge: "Expérience de Chat Interactif",
        posture: "Analyse Posture et Colonne", postureDesc: "Évaluation posturale par IA avec recommandations personnalisées",
        skin: "Scan Dermatologique", skinDesc: "Analyse avancée de la peau pour détection précoce et soins",
        eye: "Bilan Ophtalmologique", eyeDesc: "Évaluation complète de la santé oculaire et dépistage visuel",
        mental: "Dépistage Santé Mentale", mentalDesc: "Évaluation confidentielle du bien-être mental avec IA",
        aiChat: "Chat IA Interactif", voiceText: "Support Voix et Texte", startChat: "Démarrer le Chat",
        quickAccess: "Accès Rapide", quickAccessDesc: "Accédez à vos conversations et rapports précédents",
        viewReports: "Voir les Rapports", getPlans: "Plans d'Exercice",
    },
    scanPages: {
        posture: { title: "Analyse Posture et Colonne", desc: "Obtenez une analyse posturale personnalisée et des recommandations correctives de notre assistant IA.", chatDesc: "Téléchargez des images ou vidéos de votre posture pour une analyse IA" },
        skin: { title: "Scan Dermatologique", desc: "Analyse avancée de la peau par IA pour détection précoce et recommandations de soins personnalisées.", chatDesc: "Téléchargez des images de zones cutanées pour analyse dermatologique par IA" },
        eye: { title: "Bilan Ophtalmologique", desc: "Évaluation complète de la santé oculaire avec technologie IA avancée.", chatDesc: "Téléchargez des images de vos yeux pour évaluation ophtalmologique par IA" },
        mental: { title: "Dépistage Santé Mentale", desc: "Évaluation confidentielle de santé mentale avec IA et recommandations personnalisées.", chatDesc: "Partagez vos pensées par voix ou texte pour une évaluation IA de santé mentale" },
    },
    reports: {
        heading: "Rapports de Santé", subtitle: "Consultez et gérez votre historique de scans et résultats d'analyse",
        totalScans: "Total des Scans", highPriority: "Haute Priorité", mediumPriority: "Priorité Moyenne", lowPriority: "Basse Priorité",
        search: "Rechercher des rapports...", allCategories: "Toutes les Catégories", allSeverities: "Toutes les Sévérités",
        posture: "Analyse Posturale", dermatology: "Dermatologie", eyeHealth: "Santé Oculaire", mentalHealth: "Santé Mentale",
        viewDetails: "Voir les Détails", download: "Télécharger le Rapport", noReports: "Aucun Rapport Trouvé",
        noReportsHint: "Vous n'avez pas encore effectué de scan", noReportsFilter: "Essayez d'ajuster vos critères de recherche",
        analysisSummary: "Résumé de l'Analyse", recommendations: "Recommandations", confidence: "Confiance", priority: "PRIORITÉ",
    },
    plans: {
        heading: "Plans d'Amélioration Santé", subtitle: "Routines d'exercice personnalisées et recommandations de style de vie",
        progress: "Votre Progrès", exercises: "exercices",
        exerciseProgram: "Programme d'Exercices", exerciseDesc: "Suivez ces exercices régulièrement pour des résultats optimaux",
        goals: "Objectifs du Programme", tips: "Conseils de Vie", instructions: "Instructions", benefits: "Bénéfices", frequency: "Fréquence",
        markComplete: "Terminé", markIncomplete: "Non Terminé",
        beginner: "débutant", intermediate: "intermédiaire", advanced: "avancé",
    },
}

const de: SubPageTranslations = {
    common: { backHome: "Zurück zur Startseite", backScan: "Zurück zum Scan", newScan: "Neuer Scan", startFirst: "Ersten Scan Starten" },
    scan: {
        heading: "KI-Gesundheitsassistent - 2026", subtitle: "Wählen Sie Ihre Gesundheitsanalyse-Kategorie, um ein interaktives Gespräch mit unseren spezialisierten KI-Assistenten zu starten.",
        badge: "Interaktives Chat-Erlebnis",
        posture: "Wirbelsäulen- und Haltungsanalyse", postureDesc: "KI-gestützte Haltungsbewertung mit personalisierten Empfehlungen",
        skin: "Dermatologie-Scan", skinDesc: "Fortschrittliche Hautanalyse zur Früherkennung und Hautpflege",
        eye: "Augenuntersuchung", eyeDesc: "Umfassende Augengesundheitsbewertung und Sehscreening",
        mental: "Psychische Gesundheit", mentalDesc: "Vertrauliche Bewertung des mentalen Wohlbefindens mit KI",
        aiChat: "Interaktiver KI-Chat", voiceText: "Sprach- und Textunterstützung", startChat: "Chat Starten",
        quickAccess: "Schnellzugriff", quickAccessDesc: "Greifen Sie auf Ihre vorherigen Gespräche und Berichte zu",
        viewReports: "Alle Berichte Anzeigen", getPlans: "Übungspläne Erhalten",
    },
    scanPages: {
        posture: { title: "Wirbelsäulen- und Haltungsanalyse", desc: "Erhalten Sie personalisierte Haltungsanalysen und Korrekturempfehlungen von unserem KI-Assistenten.", chatDesc: "Laden Sie Bilder oder Videos Ihrer Haltung für KI-gestützte Analyse hoch" },
        skin: { title: "Dermatologie-Scan", desc: "Fortschrittliche KI-gestützte Hautanalyse zur Früherkennung und personalisierten Hautpflegeempfehlungen.", chatDesc: "Laden Sie hochwertige Bilder von Hautbereichen für dermatologische KI-Analyse hoch" },
        eye: { title: "Augenuntersuchung", desc: "Umfassende Augengesundheitsbewertung mit fortschrittlicher KI-Technologie.", chatDesc: "Laden Sie Augenbilder für KI-gestützte ophthalmologische Bewertung hoch" },
        mental: { title: "Psychische Gesundheit", desc: "Vertrauliche Bewertung der psychischen Gesundheit mit KI-gestützten Erkenntnissen.", chatDesc: "Teilen Sie Ihre Gedanken per Sprache oder Text für KI-gestützte psychische Gesundheitsbewertung" },
    },
    reports: {
        heading: "Gesundheitsberichte", subtitle: "Ihre Scan-Historie und Analyseergebnisse anzeigen und verwalten",
        totalScans: "Gesamte Scans", highPriority: "Hohe Priorität", mediumPriority: "Mittlere Priorität", lowPriority: "Niedrige Priorität",
        search: "Berichte durchsuchen...", allCategories: "Alle Kategorien", allSeverities: "Alle Schweregrade",
        posture: "Haltungsanalyse", dermatology: "Dermatologie", eyeHealth: "Augengesundheit", mentalHealth: "Psychische Gesundheit",
        viewDetails: "Details Anzeigen", download: "Bericht Herunterladen", noReports: "Keine Berichte Gefunden",
        noReportsHint: "Sie haben noch keine Gesundheitsscans durchgeführt", noReportsFilter: "Passen Sie Ihre Suchkriterien an",
        analysisSummary: "Analysezusammenfassung", recommendations: "Empfehlungen", confidence: "Vertrauen", priority: "PRIORITÄT",
    },
    plans: {
        heading: "Gesundheitsverbesserungspläne", subtitle: "Personalisierte Übungsroutinen und Lebensstilempfehlungen",
        progress: "Ihr Fortschritt", exercises: "Übungen",
        exerciseProgram: "Übungsprogramm", exerciseDesc: "Führen Sie diese Übungen regelmäßig für optimale Ergebnisse durch",
        goals: "Programmziele", tips: "Lifestyle-Tipps", instructions: "Anleitung", benefits: "Vorteile", frequency: "Häufigkeit",
        markComplete: "Abgeschlossen", markIncomplete: "Nicht Abgeschlossen",
        beginner: "Anfänger", intermediate: "Fortgeschritten", advanced: "Experte",
    },
}

const zh: SubPageTranslations = {
    common: { backHome: "返回首页", backScan: "返回扫描", newScan: "新扫描", startFirst: "开始您的第一次扫描" },
    scan: {
        heading: "AI健康助手 - 2026", subtitle: "选择您的健康分析类别，与我们专业的AI助手开始互动对话。",
        badge: "互动聊天体验",
        posture: "脊柱与姿势分析", postureDesc: "AI驱动的姿势评估与个性化建议",
        skin: "皮肤科扫描", skinDesc: "用于早期检测和护肤指导的高级皮肤分析",
        eye: "眼科检查", eyeDesc: "全面的眼睛健康评估和视力筛查",
        mental: "心理健康筛查", mentalDesc: "结合AI洞察的保密心理健康评估",
        aiChat: "互动AI聊天", voiceText: "语音和文字支持", startChat: "开始聊天",
        quickAccess: "快速访问", quickAccessDesc: "访问您之前的对话和健康报告",
        viewReports: "查看所有报告", getPlans: "获取运动计划",
    },
    scanPages: {
        posture: { title: "脊柱与姿势分析", desc: "从我们的AI助手获取个性化的姿势分析和纠正建议。", chatDesc: "上传您的姿势图片或视频进行AI分析" },
        skin: { title: "皮肤科扫描", desc: "先进的AI皮肤分析，用于早期检测和个性化护肤建议。", chatDesc: "上传皮肤区域的高质量图片进行AI皮肤分析" },
        eye: { title: "眼科检查", desc: "使用先进AI技术进行全面的眼睛健康评估。", chatDesc: "上传眼睛图片进行AI眼科评估" },
        mental: { title: "心理健康筛查", desc: "结合AI洞察和个性化建议的保密心理健康评估。", chatDesc: "通过语音或文字分享您的想法进行AI心理健康评估" },
    },
    reports: {
        heading: "健康报告", subtitle: "查看和管理您的健康扫描历史和分析结果",
        totalScans: "总扫描数", highPriority: "高优先级", mediumPriority: "中优先级", lowPriority: "低优先级",
        search: "搜索报告...", allCategories: "所有类别", allSeverities: "所有严重程度",
        posture: "姿势分析", dermatology: "皮肤科", eyeHealth: "眼睛健康", mentalHealth: "心理健康",
        viewDetails: "查看详情", download: "下载完整报告", noReports: "未找到报告",
        noReportsHint: "您尚未完成任何健康扫描", noReportsFilter: "请调整您的搜索或筛选条件",
        analysisSummary: "分析摘要", recommendations: "建议", confidence: "置信度", priority: "优先级",
    },
    plans: {
        heading: "健康改善计划", subtitle: "个性化的运动方案和生活方式建议，以解决您的健康问题",
        progress: "您的进度", exercises: "项运动",
        exerciseProgram: "运动项目", exerciseDesc: "定期进行这些运动以获得最佳效果",
        goals: "项目目标", tips: "生活建议", instructions: "说明", benefits: "益处", frequency: "频率",
        markComplete: "标记完成", markIncomplete: "标记未完成",
        beginner: "初级", intermediate: "中级", advanced: "高级",
    },
}

const ja: SubPageTranslations = {
    common: { backHome: "ホームに戻る", backScan: "スキャンに戻る", newScan: "新規スキャン", startFirst: "最初のスキャンを開始" },
    scan: {
        heading: "AIヘルスアシスタント - 2026", subtitle: "AIアシスタントとのインタラクティブな会話を始めるために、健康分析カテゴリーを選択してください。",
        badge: "インタラクティブチャット体験",
        posture: "脊椎・姿勢分析", postureDesc: "パーソナライズされた推奨を伴うAI姿勢評価",
        skin: "皮膚科スキャン", skinDesc: "早期発見とスキンケアのための高度な皮膚分析",
        eye: "眼科チェック", eyeDesc: "包括的な目の健康評価と視力スクリーニング",
        mental: "メンタルヘルススクリーニング", mentalDesc: "AIインサイトによる機密メンタルウェルネス評価",
        aiChat: "インタラクティブAIチャット", voiceText: "音声・テキストサポート", startChat: "チャット開始",
        quickAccess: "クイックアクセス", quickAccessDesc: "以前の会話と健康レポートにアクセス",
        viewReports: "レポート一覧", getPlans: "運動プランを取得",
    },
    scanPages: {
        posture: { title: "脊椎・姿勢分析", desc: "AIアシスタントからパーソナライズされた姿勢分析と矯正推奨を受けましょう。", chatDesc: "AI分析のために姿勢の画像や動画をアップロード" },
        skin: { title: "皮膚科スキャン", desc: "早期発見とパーソナライズされたスキンケア推奨のための高度なAI皮膚分析。", chatDesc: "AI皮膚分析のために皮膚の高品質画像をアップロード" },
        eye: { title: "眼科チェック", desc: "高度なAI技術を使用した包括的な目の健康評価。", chatDesc: "AI眼科評価のために目の画像をアップロード" },
        mental: { title: "メンタルヘルススクリーニング", desc: "AIインサイトとパーソナライズされた推奨による機密メンタルヘルス評価。", chatDesc: "AIメンタルヘルス評価のために音声またはテキストで共有" },
    },
    reports: {
        heading: "健康レポート", subtitle: "スキャン履歴と分析結果を確認・管理",
        totalScans: "合計スキャン", highPriority: "高優先度", mediumPriority: "中優先度", lowPriority: "低優先度",
        search: "レポートを検索...", allCategories: "すべてのカテゴリー", allSeverities: "すべての重要度",
        posture: "姿勢分析", dermatology: "皮膚科", eyeHealth: "目の健康", mentalHealth: "メンタルヘルス",
        viewDetails: "詳細を見る", download: "レポートをダウンロード", noReports: "レポートが見つかりません",
        noReportsHint: "まだ健康スキャンを完了していません", noReportsFilter: "検索条件を調整してください",
        analysisSummary: "分析概要", recommendations: "推奨事項", confidence: "信頼度", priority: "優先度",
    },
    plans: {
        heading: "健康改善プラン", subtitle: "パーソナライズされたエクササイズルーティンとライフスタイルのアドバイス",
        progress: "進捗状況", exercises: "エクササイズ",
        exerciseProgram: "エクササイズプログラム", exerciseDesc: "最適な結果のためにこれらのエクササイズを定期的に行いましょう",
        goals: "プログラム目標", tips: "ライフスタイルのヒント", instructions: "手順", benefits: "メリット", frequency: "頻度",
        markComplete: "完了にする", markIncomplete: "未完了にする",
        beginner: "初級", intermediate: "中級", advanced: "上級",
    },
}

const ar: SubPageTranslations = {
    common: { backHome: "العودة للرئيسية", backScan: "العودة للفحص", newScan: "فحص جديد", startFirst: "ابدأ فحصك الأول" },
    scan: {
        heading: "مساعد صحي ذكي - 2026", subtitle: "اختر فئة التحليل الصحي لبدء محادثة تفاعلية مع مساعدينا المتخصصين بالذكاء الاصطناعي.",
        badge: "تجربة دردشة تفاعلية",
        posture: "تحليل العمود الفقري والوضعية", postureDesc: "تقييم الوضعية بالذكاء الاصطناعي مع توصيات مخصصة",
        skin: "فحص الجلد", skinDesc: "تحليل متقدم للبشرة للكشف المبكر والعناية بالبشرة",
        eye: "فحص العيون", eyeDesc: "تقييم شامل لصحة العيون وفحص الرؤية",
        mental: "فحص الصحة النفسية", mentalDesc: "تقييم سري للصحة النفسية مع رؤى الذكاء الاصطناعي",
        aiChat: "دردشة ذكية تفاعلية", voiceText: "دعم صوتي ونصي", startChat: "بدء المحادثة",
        quickAccess: "وصول سريع", quickAccessDesc: "الوصول إلى محادثاتك وتقاريرك السابقة",
        viewReports: "عرض جميع التقارير", getPlans: "الحصول على خطط تمارين",
    },
    scanPages: {
        posture: { title: "تحليل العمود الفقري والوضعية", desc: "احصل على تحليل مخصص للوضعية وتوصيات تصحيحية من مساعدنا الذكي.", chatDesc: "ارفع صور أو فيديوهات لوضعيتك للتحليل بالذكاء الاصطناعي" },
        skin: { title: "فحص الجلد", desc: "تحليل متقدم للبشرة بالذكاء الاصطناعي للكشف المبكر وتوصيات العناية المخصصة.", chatDesc: "ارفع صور عالية الجودة لمناطق الجلد للتحليل الجلدي" },
        eye: { title: "فحص العيون", desc: "تقييم شامل لصحة العيون باستخدام تقنية الذكاء الاصطناعي المتقدمة.", chatDesc: "ارفع صور العيون للتقييم العيني بالذكاء الاصطناعي" },
        mental: { title: "فحص الصحة النفسية", desc: "تقييم سري للصحة النفسية مع رؤى وتوصيات مخصصة بالذكاء الاصطناعي.", chatDesc: "شارك أفكارك عبر الصوت أو النص لتقييم الصحة النفسية" },
    },
    reports: {
        heading: "التقارير الصحية", subtitle: "عرض وإدارة سجل الفحوصات ونتائج التحليل",
        totalScans: "إجمالي الفحوصات", highPriority: "أولوية عالية", mediumPriority: "أولوية متوسطة", lowPriority: "أولوية منخفضة",
        search: "البحث في التقارير...", allCategories: "جميع الفئات", allSeverities: "جميع مستويات الخطورة",
        posture: "تحليل الوضعية", dermatology: "الأمراض الجلدية", eyeHealth: "صحة العيون", mentalHealth: "الصحة النفسية",
        viewDetails: "عرض التفاصيل", download: "تحميل التقرير الكامل", noReports: "لا توجد تقارير",
        noReportsHint: "لم تُكمل أي فحوصات صحية بعد", noReportsFilter: "حاول تعديل معايير البحث",
        analysisSummary: "ملخص التحليل", recommendations: "التوصيات", confidence: "الثقة", priority: "الأولوية",
    },
    plans: {
        heading: "خطط تحسين الصحة", subtitle: "تمارين مخصصة وتوصيات لنمط الحياة لتحسين صحتك",
        progress: "تقدمك", exercises: "تمارين",
        exerciseProgram: "برنامج التمارين", exerciseDesc: "مارس هذه التمارين بانتظام للحصول على أفضل النتائج",
        goals: "أهداف البرنامج", tips: "نصائح حياتية", instructions: "التعليمات", benefits: "الفوائد", frequency: "التكرار",
        markComplete: "تم الإكمال", markIncomplete: "غير مكتمل",
        beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم",
    },
}

const it: SubPageTranslations = {
    common: { backHome: "Torna alla Home", backScan: "Torna allo Scan", newScan: "Nuovo Scan", startFirst: "Inizia il Primo Scan" },
    scan: {
        heading: "Assistente Salute IA - 2026", subtitle: "Scegli la tua categoria di analisi della salute per avviare una conversazione interattiva con i nostri assistenti IA specializzati.",
        badge: "Esperienza Chat Interattiva",
        posture: "Analisi Postura e Colonna", postureDesc: "Valutazione posturale con IA con raccomandazioni personalizzate",
        skin: "Scansione Dermatologica", skinDesc: "Analisi avanzata della pelle per rilevamento precoce e cura",
        eye: "Controllo Oftalmologico", eyeDesc: "Valutazione completa della salute oculare e screening visivo",
        mental: "Screening Salute Mentale", mentalDesc: "Valutazione confidenziale del benessere mentale con IA",
        aiChat: "Chat IA Interattiva", voiceText: "Supporto Voce e Testo", startChat: "Inizia Chat",
        quickAccess: "Accesso Rapido", quickAccessDesc: "Accedi alle tue conversazioni e referti precedenti",
        viewReports: "Vedi Tutti i Referti", getPlans: "Ottieni Piani di Esercizio",
    },
    scanPages: {
        posture: { title: "Analisi Postura e Colonna", desc: "Ottieni analisi posturale personalizzata e raccomandazioni correttive dal nostro assistente IA.", chatDesc: "Carica immagini o video della tua postura per analisi IA" },
        skin: { title: "Scansione Dermatologica", desc: "Analisi avanzata della pelle con IA per rilevamento precoce e raccomandazioni personalizzate.", chatDesc: "Carica immagini di alta qualità delle aree cutanee per analisi dermatologica IA" },
        eye: { title: "Controllo Oftalmologico", desc: "Valutazione completa della salute oculare con tecnologia IA avanzata.", chatDesc: "Carica immagini degli occhi per valutazione oftalmologica IA" },
        mental: { title: "Screening Salute Mentale", desc: "Valutazione confidenziale della salute mentale con insights IA e raccomandazioni personalizzate.", chatDesc: "Condividi i tuoi pensieri per voce o testo per valutazione IA della salute mentale" },
    },
    reports: {
        heading: "Referti Sanitari", subtitle: "Visualizza e gestisci la cronologia dei tuoi esami e risultati di analisi",
        totalScans: "Scansioni Totali", highPriority: "Alta Priorità", mediumPriority: "Priorità Media", lowPriority: "Bassa Priorità",
        search: "Cerca referti...", allCategories: "Tutte le Categorie", allSeverities: "Tutti i Livelli",
        posture: "Analisi Posturale", dermatology: "Dermatologia", eyeHealth: "Salute Oculare", mentalHealth: "Salute Mentale",
        viewDetails: "Vedi Dettagli", download: "Scarica Referto Completo", noReports: "Nessun Referto Trovato",
        noReportsHint: "Non hai ancora completato alcun esame", noReportsFilter: "Prova a modificare i criteri di ricerca",
        analysisSummary: "Riepilogo Analisi", recommendations: "Raccomandazioni", confidence: "Affidabilità", priority: "PRIORITÀ",
    },
    plans: {
        heading: "Piani di Miglioramento Salute", subtitle: "Routine di esercizi personalizzate e raccomandazioni sullo stile di vita",
        progress: "Il Tuo Progresso", exercises: "esercizi",
        exerciseProgram: "Programma di Esercizi", exerciseDesc: "Segui questi esercizi regolarmente per risultati ottimali",
        goals: "Obiettivi del Programma", tips: "Consigli di Vita", instructions: "Istruzioni", benefits: "Benefici", frequency: "Frequenza",
        markComplete: "Completato", markIncomplete: "Non Completato",
        beginner: "principiante", intermediate: "intermedio", advanced: "avanzato",
    },
}

const pt: SubPageTranslations = {
    common: { backHome: "Voltar ao Início", backScan: "Voltar ao Exame", newScan: "Novo Exame", startFirst: "Iniciar Primeiro Exame" },
    scan: {
        heading: "Assistente de Saúde IA - 2026", subtitle: "Escolha sua categoria de análise de saúde para iniciar uma conversa interativa com nossos assistentes de IA especializados.",
        badge: "Experiência de Chat Interativo",
        posture: "Análise de Postura e Coluna", postureDesc: "Avaliação postural com IA com recomendações personalizadas",
        skin: "Exame Dermatológico", skinDesc: "Análise avançada da pele para detecção precoce e cuidados",
        eye: "Exame Oftalmológico", eyeDesc: "Avaliação abrangente da saúde ocular e triagem visual",
        mental: "Triagem de Saúde Mental", mentalDesc: "Avaliação confidencial do bem-estar mental com IA",
        aiChat: "Chat IA Interativo", voiceText: "Suporte de Voz e Texto", startChat: "Iniciar Chat",
        quickAccess: "Acesso Rápido", quickAccessDesc: "Acesse suas conversas e relatórios anteriores",
        viewReports: "Ver Todos os Relatórios", getPlans: "Obter Planos de Exercício",
    },
    scanPages: {
        posture: { title: "Análise de Postura e Coluna", desc: "Obtenha análise postural personalizada e recomendações corretivas do nosso assistente de IA.", chatDesc: "Carregue imagens ou vídeos da sua postura para análise com IA" },
        skin: { title: "Exame Dermatológico", desc: "Análise avançada da pele com IA para detecção precoce e recomendações de cuidados personalizados.", chatDesc: "Carregue imagens de alta qualidade de áreas da pele para análise dermatológica com IA" },
        eye: { title: "Exame Oftalmológico", desc: "Avaliação abrangente da saúde ocular com tecnologia de IA avançada.", chatDesc: "Carregue imagens dos olhos para avaliação oftalmológica com IA" },
        mental: { title: "Triagem de Saúde Mental", desc: "Avaliação confidencial de saúde mental com insights de IA e recomendações personalizadas.", chatDesc: "Compartilhe seus pensamentos por voz ou texto para avaliação de saúde mental com IA" },
    },
    reports: {
        heading: "Relatórios de Saúde", subtitle: "Visualize e gerencie seu histórico de exames e resultados de análise",
        totalScans: "Total de Exames", highPriority: "Alta Prioridade", mediumPriority: "Prioridade Média", lowPriority: "Baixa Prioridade",
        search: "Pesquisar relatórios...", allCategories: "Todas as Categorias", allSeverities: "Todas as Severidades",
        posture: "Análise Postural", dermatology: "Dermatologia", eyeHealth: "Saúde Ocular", mentalHealth: "Saúde Mental",
        viewDetails: "Ver Detalhes", download: "Baixar Relatório Completo", noReports: "Nenhum Relatório Encontrado",
        noReportsHint: "Você ainda não completou nenhum exame de saúde", noReportsFilter: "Tente ajustar seus critérios de busca",
        analysisSummary: "Resumo da Análise", recommendations: "Recomendações", confidence: "Confiança", priority: "PRIORIDADE",
    },
    plans: {
        heading: "Planos de Melhoria da Saúde", subtitle: "Rotinas de exercícios personalizadas e recomendações de estilo de vida",
        progress: "Seu Progresso", exercises: "exercícios",
        exerciseProgram: "Programa de Exercícios", exerciseDesc: "Siga estes exercícios regularmente para resultados ideais",
        goals: "Objetivos do Programa", tips: "Dicas de Vida", instructions: "Instruções", benefits: "Benefícios", frequency: "Frequência",
        markComplete: "Concluído", markIncomplete: "Não Concluído",
        beginner: "iniciante", intermediate: "intermediário", advanced: "avançado",
    },
}

const subPageTranslations: Record<Language, SubPageTranslations> = {
    en, hi, es, fr, de, zh, ja, ar, it, pt,
}

export function getSubPageTranslations(lang: Language) {
    return subPageTranslations[lang] || subPageTranslations.en
}
