export type Language = "en" | "es" | "fr" | "de" | "hi" | "zh" | "ja" | "ar" | "it" | "pt"

export const LANGUAGE_NAMES: Record<Language, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    hi: "हिन्दी",
    zh: "中文",
    ja: "日本語",
    ar: "العربية",
    it: "Italiano",
    pt: "Português",
}

type TranslationKeys = {
    nav: { healthScan: string; reports: string; plans: string }
    hero: { title: string; highlight: string; subtitle: string }
    cta: { startScan: string; viewReports: string }
    benefits: { b1: string; b2: string; b3: string }
    features: {
        heading: string
        subtitle: string
        posture: string; postureDesc: string
        skin: string; skinDesc: string
        eye: string; eyeDesc: string
        mental: string; mentalDesc: string
    }
    tech: {
        heading: string; subtitle: string
        secure: string; secureDesc: string
        instant: string; instantDesc: string
        precise: string; preciseDesc: string
    }
    ctaSection: { heading: string; subtitle: string; button: string }
    footer: { tagline: string; rights: string }
}

export const translations: Record<Language, TranslationKeys> = {
    en: {
        nav: { healthScan: "Health Scan", reports: "Reports", plans: "Plans" },
        hero: { title: "Your AI Health", highlight: "Companion", subtitle: "Advanced AI-powered health assistant providing comprehensive analysis for posture, skin conditions, eye health, and mental wellness. Get professional insights instantly." },
        cta: { startScan: "Start Health Scan", viewReports: "View Reports" },
        benefits: { b1: "Accessible Expertise", b2: "Early Detection", b3: "Actionable Guidance" },
        features: {
            heading: "Comprehensive Health Analysis", subtitle: "Our AI-powered platform offers specialized analysis across multiple health domains",
            posture: "Spine & Posture Analysis", postureDesc: "Advanced posture assessment using computer vision to detect spinal alignment issues and provide corrective recommendations.",
            skin: "Dermatology Scan", skinDesc: "AI-powered skin analysis to identify potential skin conditions, moles, and lesions with professional-grade accuracy.",
            eye: "Ophthalmology Check", eyeDesc: "Comprehensive eye health assessment including vision screening and detection of common eye conditions.",
            mental: "Mental Health Screening", mentalDesc: "Voice and behavioral analysis to assess mental wellness and provide personalized mental health insights.",
        },
        tech: {
            heading: "Powered by Advanced AI", subtitle: "Built with cutting-edge technology for accurate and reliable health assessments",
            secure: "Secure & Private", secureDesc: "Your health data is encrypted and processed with the highest security standards",
            instant: "Instant Results", instantDesc: "Get comprehensive health analysis in seconds with our optimized AI models",
            precise: "Precise Analysis", preciseDesc: "Medical-grade accuracy powered by AI and advanced computer vision",
        },
        ctaSection: { heading: "Ready to Start Your Health Journey?", subtitle: "Join thousands of users who trust Vaidya for their health monitoring needs", button: "Begin Health Assessment" },
        footer: { tagline: "Empowering healthcare through artificial intelligence", rights: "All rights reserved." },
    },
    hi: {
        nav: { healthScan: "स्वास्थ्य स्कैन", reports: "रिपोर्ट", plans: "योजनाएं" },
        hero: { title: "आपका AI स्वास्थ्य", highlight: "साथी", subtitle: "आसन, त्वचा, आंखों और मानसिक स्वास्थ्य के लिए व्यापक विश्लेषण प्रदान करने वाला उन्नत AI-संचालित स्वास्थ्य सहायक। तुरंत पेशेवर अंतर्दृष्टि प्राप्त करें।" },
        cta: { startScan: "स्वास्थ्य स्कैन शुरू करें", viewReports: "रिपोर्ट देखें" },
        benefits: { b1: "सुलभ विशेषज्ञता", b2: "शीघ्र पहचान", b3: "कार्रवाई योग्य मार्गदर्शन" },
        features: {
            heading: "व्यापक स्वास्थ्य विश्लेषण", subtitle: "हमारा AI-संचालित प्लेटफॉर्म कई स्वास्थ्य क्षेत्रों में विशेष विश्लेषण प्रदान करता है",
            posture: "रीढ़ और आसन विश्लेषण", postureDesc: "रीढ़ की हड्डी के संरेखण की समस्याओं का पता लगाने और सुधारात्मक सिफारिशें प्रदान करने के लिए उन्नत आसन मूल्यांकन।",
            skin: "त्वचा विज्ञान स्कैन", skinDesc: "पेशेवर-स्तरीय सटीकता के साथ त्वचा की स्थिति, तिलों और घावों की पहचान करने के लिए AI-संचालित त्वचा विश्लेषण।",
            eye: "नेत्र विज्ञान जांच", eyeDesc: "दृष्टि जांच और सामान्य नेत्र स्थितियों का पता लगाने सहित व्यापक नेत्र स्वास्थ्य मूल्यांकन।",
            mental: "मानसिक स्वास्थ्य जांच", mentalDesc: "मानसिक कल्याण का आकलन करने और व्यक्तिगत मानसिक स्वास्थ्य अंतर्दृष्टि प्रदान करने के लिए आवाज और व्यवहार विश्लेषण।",
        },
        tech: {
            heading: "उन्नत AI द्वारा संचालित", subtitle: "सटीक और विश्वसनीय स्वास्थ्य मूल्यांकन के लिए अत्याधुनिक तकनीक से निर्मित",
            secure: "सुरक्षित और निजी", secureDesc: "आपका स्वास्थ्य डेटा उच्चतम सुरक्षा मानकों के साथ एन्क्रिप्टेड और संसाधित है",
            instant: "तत्काल परिणाम", instantDesc: "हमारे अनुकूलित AI मॉडल के साथ सेकंडों में व्यापक स्वास्थ्य विश्लेषण प्राप्त करें",
            precise: "सटीक विश्लेषण", preciseDesc: "AI और उन्नत कंप्यूटर विज़न द्वारा संचालित चिकित्सा-स्तरीय सटीकता",
        },
        ctaSection: { heading: "अपनी स्वास्थ्य यात्रा शुरू करने के लिए तैयार?", subtitle: "हजारों उपयोगकर्ता अपनी स्वास्थ्य निगरानी आवश्यकताओं के लिए Vaidya पर भरोसा करते हैं", button: "स्वास्थ्य मूल्यांकन शुरू करें" },
        footer: { tagline: "कृत्रिम बुद्धिमत्ता के माध्यम से स्वास्थ्य सेवा को सशक्त बनाना", rights: "सर्वाधिकार सुरक्षित।" },
    },
    es: {
        nav: { healthScan: "Escaneo de Salud", reports: "Informes", plans: "Planes" },
        hero: { title: "Tu Compañero de Salud", highlight: "con IA", subtitle: "Asistente de salud avanzado con IA que proporciona análisis integral de postura, condiciones de la piel, salud ocular y bienestar mental." },
        cta: { startScan: "Iniciar Escaneo", viewReports: "Ver Informes" },
        benefits: { b1: "Experiencia Accesible", b2: "Detección Temprana", b3: "Orientación Práctica" },
        features: {
            heading: "Análisis de Salud Integral", subtitle: "Nuestra plataforma con IA ofrece análisis especializado en múltiples dominios de salud",
            posture: "Análisis de Columna y Postura", postureDesc: "Evaluación avanzada de postura mediante visión por computadora para detectar problemas de alineación espinal.",
            skin: "Escaneo Dermatológico", skinDesc: "Análisis de piel con IA para identificar condiciones cutáneas con precisión profesional.",
            eye: "Chequeo Oftalmológico", eyeDesc: "Evaluación integral de salud ocular incluyendo detección de condiciones oculares comunes.",
            mental: "Evaluación de Salud Mental", mentalDesc: "Análisis de voz y comportamiento para evaluar el bienestar mental con perspectivas personalizadas.",
        },
        tech: {
            heading: "Impulsado por IA Avanzada", subtitle: "Construido con tecnología de vanguardia para evaluaciones de salud precisas y confiables",
            secure: "Seguro y Privado", secureDesc: "Sus datos de salud están cifrados con los más altos estándares de seguridad",
            instant: "Resultados Instantáneos", instantDesc: "Obtenga análisis de salud integral en segundos con nuestros modelos de IA optimizados",
            precise: "Análisis Preciso", preciseDesc: "Precisión de grado médico impulsada por AI y visión por computadora avanzada",
        },
        ctaSection: { heading: "¿Listo para Iniciar tu Viaje de Salud?", subtitle: "Únete a miles de usuarios que confían en Vaidya para sus necesidades de monitoreo de salud", button: "Comenzar Evaluación" },
        footer: { tagline: "Empoderando la atención médica a través de la inteligencia artificial", rights: "Todos los derechos reservados." },
    },
    fr: {
        nav: { healthScan: "Bilan Santé", reports: "Rapports", plans: "Plans" },
        hero: { title: "Votre Compagnon Santé", highlight: "IA", subtitle: "Assistant santé avancé alimenté par l'IA fournissant une analyse complète de la posture, des conditions cutanées, de la santé oculaire et du bien-être mental." },
        cta: { startScan: "Lancer le Scan", viewReports: "Voir les Rapports" },
        benefits: { b1: "Expertise Accessible", b2: "Détection Précoce", b3: "Conseils Pratiques" },
        features: {
            heading: "Analyse Santé Complète", subtitle: "Notre plateforme IA offre une analyse spécialisée dans plusieurs domaines de santé",
            posture: "Analyse Posture et Colonne", postureDesc: "Évaluation avancée de la posture par vision par ordinateur pour détecter les problèmes d'alignement.",
            skin: "Scan Dermatologique", skinDesc: "Analyse cutanée par IA pour identifier les conditions avec une précision professionnelle.",
            eye: "Bilan Ophtalmologique", eyeDesc: "Évaluation complète de la santé oculaire incluant le dépistage de conditions courantes.",
            mental: "Dépistage Santé Mentale", mentalDesc: "Analyse vocale et comportementale pour évaluer le bien-être mental avec des perspectives personnalisées.",
        },
        tech: {
            heading: "Propulsé par l'IA Avancée", subtitle: "Construit avec une technologie de pointe pour des évaluations de santé précises",
            secure: "Sécurisé et Privé", secureDesc: "Vos données de santé sont chiffrées avec les normes de sécurité les plus élevées",
            instant: "Résultats Instantanés", instantDesc: "Obtenez une analyse de santé complète en quelques secondes avec nos modèles IA",
            precise: "Analyse Précise", preciseDesc: "Précision de grade médical alimentée par AI et la vision par ordinateur",
        },
        ctaSection: { heading: "Prêt à Commencer Votre Parcours Santé?", subtitle: "Rejoignez des milliers d'utilisateurs qui font confiance à Vaidya pour leur suivi santé", button: "Commencer l'Évaluation" },
        footer: { tagline: "Donner du pouvoir aux soins de santé grâce à l'intelligence artificielle", rights: "Tous droits réservés." },
    },
    de: {
        nav: { healthScan: "Gesundheits-Scan", reports: "Berichte", plans: "Pläne" },
        hero: { title: "Ihr KI-Gesundheits", highlight: "Begleiter", subtitle: "Fortschrittlicher KI-Gesundheitsassistent für umfassende Analyse von Haltung, Hauterkrankungen, Augengesundheit und psychischem Wohlbefinden." },
        cta: { startScan: "Scan Starten", viewReports: "Berichte Anzeigen" },
        benefits: { b1: "Zugängliche Expertise", b2: "Früherkennung", b3: "Umsetzbare Anleitung" },
        features: {
            heading: "Umfassende Gesundheitsanalyse", subtitle: "Unsere KI-Plattform bietet spezialisierte Analysen in mehreren Gesundheitsbereichen",
            posture: "Wirbelsäulen- und Haltungsanalyse", postureDesc: "Fortschrittliche Haltungsbewertung zur Erkennung von Wirbelsäulenausrichtungsproblemen.",
            skin: "Dermatologie-Scan", skinDesc: "KI-gestützte Hautanalyse zur Identifizierung von Hauterkrankungen mit professioneller Genauigkeit.",
            eye: "Augenuntersuchung", eyeDesc: "Umfassende Augengesundheitsbewertung einschließlich Erkennung häufiger Augenerkrankungen.",
            mental: "Psychische Gesundheitsuntersuchung", mentalDesc: "Sprach- und Verhaltensanalyse zur Bewertung des psychischen Wohlbefindens.",
        },
        tech: {
            heading: "Angetrieben von Fortschrittlicher KI", subtitle: "Entwickelt mit modernster Technologie für präzise Gesundheitsbewertungen",
            secure: "Sicher und Privat", secureDesc: "Ihre Gesundheitsdaten werden mit höchsten Sicherheitsstandards verschlüsselt",
            instant: "Sofortige Ergebnisse", instantDesc: "Erhalten Sie umfassende Gesundheitsanalysen in Sekunden mit unseren optimierten KI-Modellen",
            precise: "Präzise Analyse", preciseDesc: "Medizinische Genauigkeit durch AI und fortschrittliche Computer Vision",
        },
        ctaSection: { heading: "Bereit für Ihre Gesundheitsreise?", subtitle: "Schließen Sie sich Tausenden von Nutzern an, die Vaidya für ihre Gesundheitsüberwachung vertrauen", button: "Gesundheitsbewertung Starten" },
        footer: { tagline: "Gesundheitsversorgung durch künstliche Intelligenz stärken", rights: "Alle Rechte vorbehalten." },
    },
    zh: {
        nav: { healthScan: "健康扫描", reports: "报告", plans: "计划" },
        hero: { title: "您的AI健康", highlight: "伙伴", subtitle: "先进的AI健康助手，提供姿势、皮肤状况、眼睛健康和心理健康的全面分析。即时获得专业洞察。" },
        cta: { startScan: "开始健康扫描", viewReports: "查看报告" },
        benefits: { b1: "专业知识触手可及", b2: "早期发现", b3: "可行的指导" },
        features: {
            heading: "全面健康分析", subtitle: "我们的AI平台提供多个健康领域的专业分析",
            posture: "脊柱与姿势分析", postureDesc: "使用计算机视觉进行高级姿势评估，检测脊柱对齐问题并提供矫正建议。",
            skin: "皮肤科扫描", skinDesc: "AI驱动的皮肤分析，以专业级精度识别潜在的皮肤状况。",
            eye: "眼科检查", eyeDesc: "全面的眼睛健康评估，包括视力筛查和常见眼部疾病检测。",
            mental: "心理健康筛查", mentalDesc: "通过语音和行为分析评估心理健康，提供个性化的心理健康洞察。",
        },
        tech: {
            heading: "先进AI驱动", subtitle: "采用尖端技术构建，提供准确可靠的健康评估",
            secure: "安全与隐私", secureDesc: "您的健康数据以最高安全标准进行加密和处理",
            instant: "即时结果", instantDesc: "使用我们优化的AI模型，几秒钟内获得全面的健康分析",
            precise: "精确分析", preciseDesc: "由 AI和先进计算机视觉驱动的医疗级精度",
        },
        ctaSection: { heading: "准备开始您的健康之旅？", subtitle: "加入数千名信任Vaidya进行健康监测的用户", button: "开始健康评估" },
        footer: { tagline: "通过人工智能赋能医疗保健", rights: "版权所有。" },
    },
    ja: {
        nav: { healthScan: "健康スキャン", reports: "レポート", plans: "プラン" },
        hero: { title: "AIヘルス", highlight: "コンパニオン", subtitle: "姿勢、皮膚疾患、目の健康、メンタルヘルスの包括的な分析を提供する高度なAI健康アシスタント。" },
        cta: { startScan: "スキャン開始", viewReports: "レポートを見る" },
        benefits: { b1: "身近な専門知識", b2: "早期発見", b3: "実行可能なガイダンス" },
        features: {
            heading: "包括的な健康分析", subtitle: "AIプラットフォームが複数の健康分野で専門的な分析を提供",
            posture: "脊椎・姿勢分析", postureDesc: "コンピュータビジョンを使用した高度な姿勢評価で脊椎の配列の問題を検出。",
            skin: "皮膚科スキャン", skinDesc: "プロレベルの精度で皮膚の状態を特定するAI皮膚分析。",
            eye: "眼科チェック", eyeDesc: "視力スクリーニングを含む包括的な目の健康評価。",
            mental: "メンタルヘルススクリーニング", mentalDesc: "音声と行動分析でメンタルヘルスを評価し、パーソナライズされた洞察を提供。",
        },
        tech: {
            heading: "高度なAIで駆動", subtitle: "正確で信頼性の高い健康評価のための最先端技術",
            secure: "セキュアでプライベート", secureDesc: "健康データは最高のセキュリティ基準で暗号化・処理",
            instant: "即時結果", instantDesc: "最適化されたAIモデルで数秒で包括的な健康分析",
            precise: "精密分析", preciseDesc: "AIと高度なコンピュータビジョンによる医療グレードの精度",
        },
        ctaSection: { heading: "健康の旅を始める準備はできましたか？", subtitle: "Vaidyaを信頼する何千人ものユーザーに参加しましょう", button: "健康評価を開始" },
        footer: { tagline: "人工知能によるヘルスケアの力を", rights: "全著作権所有。" },
    },
    ar: {
        nav: { healthScan: "فحص صحي", reports: "تقارير", plans: "خطط" },
        hero: { title: "رفيقك الصحي", highlight: "بالذكاء الاصطناعي", subtitle: "مساعد صحي متقدم بالذكاء الاصطناعي يوفر تحليلاً شاملاً للوضعية والبشرة وصحة العين والصحة النفسية." },
        cta: { startScan: "بدء الفحص", viewReports: "عرض التقارير" },
        benefits: { b1: "خبرة متاحة", b2: "اكتشاف مبكر", b3: "إرشادات عملية" },
        features: {
            heading: "تحليل صحي شامل", subtitle: "منصتنا بالذكاء الاصطناعي تقدم تحليلاً متخصصاً في مجالات صحية متعددة",
            posture: "تحليل العمود الفقري والوضعية", postureDesc: "تقييم متقدم للوضعية باستخدام الرؤية الحاسوبية لاكتشاف مشاكل محاذاة العمود الفقري.",
            skin: "فحص الأمراض الجلدية", skinDesc: "تحليل الجلد بالذكاء الاصطناعي لتحديد الحالات الجلدية المحتملة بدقة احترافية.",
            eye: "فحص طب العيون", eyeDesc: "تقييم شامل لصحة العين يشمل فحص الرؤية واكتشاف حالات العين الشائعة.",
            mental: "فحص الصحة النفسية", mentalDesc: "تحليل الصوت والسلوك لتقييم الصحة النفسية وتقديم رؤى شخصية.",
        },
        tech: {
            heading: "مدعوم بذكاء اصطناعي متقدم", subtitle: "مبني بتكنولوجيا متطورة لتقييمات صحية دقيقة وموثوقة",
            secure: "آمن وخاص", secureDesc: "بياناتك الصحية مشفرة ومعالجة بأعلى معايير الأمان",
            instant: "نتائج فورية", instantDesc: "احصل على تحليل صحي شامل في ثوانٍ مع نماذج الذكاء الاصطناعي المحسنة",
            precise: "تحليل دقيق", preciseDesc: "دقة طبية مدعومة بـ AI والرؤية الحاسوبية المتقدمة",
        },
        ctaSection: { heading: "مستعد لبدء رحلتك الصحية؟", subtitle: "انضم إلى آلاف المستخدمين الذين يثقون بـ Vaidya لمراقبة صحتهم", button: "بدء التقييم الصحي" },
        footer: { tagline: "تمكين الرعاية الصحية من خلال الذكاء الاصطناعي", rights: "جميع الحقوق محفوظة." },
    },
    it: {
        nav: { healthScan: "Scansione Salute", reports: "Referti", plans: "Piani" },
        hero: { title: "Il Tuo Compagno di Salute", highlight: "IA", subtitle: "Assistente sanitario avanzato con IA che fornisce analisi complete di postura, condizioni della pelle, salute degli occhi e benessere mentale." },
        cta: { startScan: "Inizia Scansione", viewReports: "Vedi Referti" },
        benefits: { b1: "Competenza Accessibile", b2: "Rilevamento Precoce", b3: "Guida Pratica" },
        features: {
            heading: "Analisi Sanitaria Completa", subtitle: "La nostra piattaforma IA offre analisi specializzate in molteplici domini sanitari",
            posture: "Analisi Colonna e Postura", postureDesc: "Valutazione avanzata della postura per rilevare problemi di allineamento della colonna vertebrale.",
            skin: "Scansione Dermatologica", skinDesc: "Analisi cutanea con IA per identificare condizioni della pelle con precisione professionale.",
            eye: "Controllo Oftalmologico", eyeDesc: "Valutazione completa della salute oculare incluso lo screening e il rilevamento di condizioni comuni.",
            mental: "Screening Salute Mentale", mentalDesc: "Analisi vocale e comportamentale per valutare il benessere mentale con approfondimenti personalizzati.",
        },
        tech: {
            heading: "Alimentato da IA Avanzata", subtitle: "Costruito con tecnologia all'avanguardia per valutazioni sanitarie accurate e affidabili",
            secure: "Sicuro e Privato", secureDesc: "I tuoi dati sanitari sono crittografati con i più alti standard di sicurezza",
            instant: "Risultati Istantanei", instantDesc: "Ottieni analisi sanitarie complete in pochi secondi con i nostri modelli IA ottimizzati",
            precise: "Analisi Precisa", preciseDesc: "Precisione di livello medico alimentata da AI e visione artificiale avanzata",
        },
        ctaSection: { heading: "Pronto per Iniziare il Tuo Percorso Salute?", subtitle: "Unisciti a migliaia di utenti che si affidano a Vaidya per il monitoraggio della salute", button: "Inizia Valutazione" },
        footer: { tagline: "Potenziare l'assistenza sanitaria attraverso l'intelligenza artificiale", rights: "Tutti i diritti riservati." },
    },
    pt: {
        nav: { healthScan: "Exame de Saúde", reports: "Relatórios", plans: "Planos" },
        hero: { title: "Seu Companheiro de Saúde", highlight: "com IA", subtitle: "Assistente de saúde avançado com IA fornecendo análise abrangente de postura, condições de pele, saúde ocular e bem-estar mental." },
        cta: { startScan: "Iniciar Exame", viewReports: "Ver Relatórios" },
        benefits: { b1: "Expertise Acessível", b2: "Detecção Precoce", b3: "Orientação Prática" },
        features: {
            heading: "Análise de Saúde Abrangente", subtitle: "Nossa plataforma IA oferece análise especializada em múltiplos domínios de saúde",
            posture: "Análise de Coluna e Postura", postureDesc: "Avaliação avançada de postura usando visão computacional para detectar problemas de alinhamento da coluna.",
            skin: "Exame Dermatológico", skinDesc: "Análise de pele com IA para identificar condições cutâneas com precisão profissional.",
            eye: "Exame Oftalmológico", eyeDesc: "Avaliação abrangente de saúde ocular incluindo triagem visual e detecção de condições comuns.",
            mental: "Triagem de Saúde Mental", mentalDesc: "Análise de voz e comportamento para avaliar o bem-estar mental com insights personalizados.",
        },
        tech: {
            heading: "Impulsionado por IA Avançada", subtitle: "Construído com tecnologia de ponta para avaliações de saúde precisas e confiáveis",
            secure: "Seguro e Privado", secureDesc: "Seus dados de saúde são criptografados com os mais altos padrões de segurança",
            instant: "Resultados Instantâneos", instantDesc: "Obtenha análise de saúde abrangente em segundos com nossos modelos de IA otimizados",
            precise: "Análise Precisa", preciseDesc: "Precisão de grau médico impulsionada por AI e visão computacional avançada",
        },
        ctaSection: { heading: "Pronto para Iniciar Sua Jornada de Saúde?", subtitle: "Junte-se a milhares de usuários que confiam no Vaidya para monitoramento de saúde", button: "Iniciar Avaliação" },
        footer: { tagline: "Capacitando a saúde através da inteligência artificial", rights: "Todos os direitos reservados." },
    },
}
