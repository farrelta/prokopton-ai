
export type Language = 'en' | 'id';

export const translations = {
  en: {
    nav: {
      daily: 'Daily Reflections',
      library: 'Wisdom Library',
      learning: 'Philosophy',
      home: 'Home',
      journal: 'Journals',
    },
    hero: {
      clarity: 'Find clarity in the',
      unfolding: 'unfolding moment.',
      greetings: {
        morning: 'Good morning',
        afternoon: 'Good afternoon',
        evening: 'Good evening',
        night: 'Good night',
      },
      greetingSuffix: '. Tell me what is filling your mind right now. Prokopton helps you reinterpret stress through timeless wisdom.',
    },
    footer: {
      copyright: '© 2026 Prokopton Reflection Tool • JuaraVibeCoding Entry',
      privacy: 'Privacy',
      terms: 'Terms',
      cloud: 'Cloud Run Powered',
    },
    common: {
      aiActive: 'AI Active',
      logReflection: 'Log Reflection',
      shareWisdom: 'Share Wisdom',
      logged: 'Logged for Today',
      dailyContemplation: 'Daily Contemplation',
      viewAnotherLens: 'View Through Another Lens',
      reflectionQuestion: 'Reflection Question',
      reflectionAnswerPlaceholder: 'Write your thoughts here...',
      startNew: 'New Reflection',
      continue: 'Explore Further',
      dailyTheme: 'Daily Contemplation',
      todaysPractice: "Today's Practice",
      morningIntention: 'Morning Intention',
      middayPause: 'Midday Pause',
      eveningReview: 'Evening Review',
      journey: 'Reflection Journey',
      consistency: 'Consistency',
      saveToJournal: 'Save to Journal',
      journalSaved: 'Saved',
      journalEmpty: 'Your journals are empty. Begin documenting your path.',
      viewJournal: 'View Journals',
      loadContext: 'Load into Reflection',
      journalTitle: 'The Journals',
      journalSub: 'A record of your evolution and inner dialogue.',
      deleteEntry: 'Delete Entry',
      editEntry: 'Edit Entry',
      addEntry: 'New Entry',
      saveEntry: 'Save Entry',
      cancel: 'Cancel',
      backToReflection: 'Return to Reflection',
      entryTitle: 'Title',
      entryContent: 'Contemplation',
      emotionalPatterns: 'Emotional Patterns',
      growthSummary: 'Growth Summary',
      dominantTheme: 'Dominant Theme',
      revisitPerspective: 'Revisit Perspective',
      recurringThemes: 'Recurring Themes',
      insightSummary: 'Insight Summary',
      timeline: 'Reflection Timeline',
      analysisTitle: 'Pattern Recognition',
      analysisSub: 'Subtle observations of your internal dialogue.',
      confirmDelete: 'Are you sure you want to delete this entry?',
      analysisPending: 'Pattern recognition requires at least five AI-guided reflections to begin observing your internal dialogue. Reflect more to unlock insights.',
      perspectiveEvolution: 'Perspective Evolution',
      recurringInquiries: 'Recurring Inquiries',
      momentOfPerspective: 'A Moment of Perspective',
      enoughReflections: 'You have gathered enough reflections. Would you like to observe the patterns in your recent internal dialogue?',
      updatedReflections: 'Your journey has evolved with new reflections. Would you like to update your perspective patterns?',
      seekPatterns: 'Seek Reflection Patterns',
      updatePatterns: 'Update Patterns',
      analysisCondition: '5 new reflections required to update patterns.',
      reflectionsNeeded: 'more reflections needed',
      capturedOn: 'Captured on',
      encryptedPrivate: 'Encrypted & Private',
      privacyStatement: 'Your thoughts are yours. Reflections are encrypted locally.',
      lock: {
        title: 'Journal Protection',
        sub: 'Keep your reflections private with a secure boundary.',
        enable: 'Enable Protection',
        disable: 'Disable Protection',
        setupPin: 'Set Your PIN',
        enterPin: 'Enter PIN to Unlock',
        wrongPin: 'Incorrect PIN. Try again calmly.',
        locked: 'Reflections protected',
        unlocked: 'Boundaries opened',
        biometric: 'Use Device Security',
        autoLock: 'Automatic Lock',
        inactivity: 'Lock after inactivity',
        placeholder: 'Enter 4-digit PIN',
        setPinConfirm: 'Confirm your new PIN',
        pinsDonMatch: 'PINs do not match. Please try again.',
        pinSetSuccess: 'Privacy boundary established.',
        securityOff: 'Privacy boundary removed.',
      },
      voice: {
        holdToReflect: 'Hold to Reflect',
        speakThoughts: 'Speak your thoughts',
        voiceReflection: 'Voice Reflection',
        listening: 'Listening...',
        stop: 'Stop & Finish',
        notSupported: 'Voice input not supported in this browser.',
      },
    },
    library: {
      archive: 'Archive of Perspective',
      title: 'Wisdom Library',
      description: 'A curated collection of timeless insights, shuffled daily to offer new perspectives.',
      addToJournal: 'Add to Journal',
    },
    learning: {
      title: 'Philosophy Learning',
      sub: 'Explore timeless perspectives to find practical balance in daily life.',
      explore: 'Explore',
      practicalwisdom: 'Practical Wisdom',
      philosophies: {
        stoicism: {
          title: 'Stoicism',
          summary: 'Focus energy on what can actually be controlled.',
          description: 'A school of Hellenistic philosophy that teaches the development of self-control and fortitude as a means of overcoming destructive emotions.',
          focus: ['Emotional Resilience', 'Control', 'Internal Peace']
        },
        buddhism: {
          title: 'Buddhism',
          summary: 'Explore how attachment creates emotional suffering.',
          description: 'A spiritual path that emphasizes mindfulness, compassion, and the understanding of impermanence to reach a state of enlightenment.',
          focus: ['Mindful Detachment', 'Acceptance', 'Compassion']
        },
        taoism: {
          title: 'Taoism',
          summary: 'Encourage balance and acceptance rather than force.',
          description: 'A philosophical and religious tradition that emphasizes living in harmony with the Tao (the "Way"), the source of everything that exists.',
          focus: ['Natural Harmony', 'Balance', 'Going with the flow']
        },
        existentialism: {
          title: 'Existentialism',
          summary: 'The freedom to create meaning in uncertainty.',
          description: 'A philosophical inquiry into the nature of the human condition, emphasizing individual existence, freedom, and choice.',
          focus: ['Meaning', 'Freedom', 'Responsibility']
        },
        minimalism: {
          title: 'Minimalism',
          summary: 'Finding clarity through intentional focus.',
          description: 'A philosophy of living with only the things you need, focusing on what brings value and meaning to your life.',
          focus: ['Clarity', 'Intentionality', 'Simplicity']
        },
        humanistic_psychology: {
          title: 'Humanistic Psychology',
          summary: 'The path towards self-awareness and potential.',
          description: 'A perspective that emphasizes looking at the whole individual and stresses concepts such as free will, self-efficacy, and self-actualization.',
          focus: ['Self-awareness', 'Growth', 'Whole Person']
        },
        confucianism: {
          title: 'Confucianism',
          summary: 'Harmonious relationships and moral character.',
          description: 'A system of philosophical and ethical teachings emphasizing family loyalty, social harmony, and the importance of tradition.',
          focus: ['Harmony', 'Loyalty', 'Character']
        }
      }
    },
    reflection: {
      modeHeader: 'How shall we reflect today?',
      modeSubheader: 'Choose a lens that resonates with your current state of mind.',
      beginButton: 'Begin Reflection',
      inputHeader: 'What is weighing on your mind?',
      inputSubheader: 'Describe your struggle, your overthinking, or a situation that feels heavy.',
      inputPlaceholder: "I've been feeling overwhelmed by...",
      changeLens: 'Change Lens',
      getPerspective: 'Get Perspective',
      loadingTitle: 'Finding a different light...',
      loadingTitles: [
        'Finding a different light...',
        'Consulting timeless wisdom...',
        'Reframing the internal dialogue...',
        'Gathering perspective...',
        'Sifting for clarity...',
        'Stillness in the void...',
        'Tracing ancient lines...',
        'Harmonizing thoughts...'
      ],
      loadingSub: 'Gathering perspective from',
      characters: 'characters',
      modes: {
        automatic: "AI selects best lens",
        stoicism: "Focus on control",
        buddhism: "Mindful detachment",
        taoism: "Natural harmony",
        islamic_wisdom: "Faith & Patience",
        existentialism: "Creating meaning",
        minimalism: "Intentional focus",
        modern_psychology: "Reflective logic",
      }
    },
    themes: [
      {
        title: "The Space Between",
        quote: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.",
        author: "Viktor Frankl",
        contemplations: [
          "Identify one recurring 'stimulus' in your day that usually triggers an impulsive reaction.",
          "Practice pausing for just three breaths before responding to the next notification or request.",
          "Observe the physical sensation of that 'space'—does it feel like stillness or tension?"
        ]
      },
      {
        title: "Amorfati (Love of Fate)",
        quote: "My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity.",
        author: "Friedrich Nietzsche",
        contemplations: [
          "Accept one minor inconvenience today without complaining, even to yourself.",
          "Consider how a past failure actually paved the way for a current success.",
          "Say 'it is what it is' to a situation you cannot change, and mean it."
        ]
      },
      {
        title: "The Beginners Mind",
        quote: "In the beginner's mind there are many possibilities, but in the expert's there are few.",
        author: "Shunryu Suzuki",
        contemplations: [
          "Approach a routine task today as if you have never done it before.",
          "Listen to someone explain something you already 'know', and look for one new detail.",
          "Admit 'I don't know' in a conversation where you feel pressured to have an answer."
        ]
      }
    ]
  },
  id: {
    nav: {
      daily: 'Refleksi Harian',
      library: 'Perpustakaan Hikmah',
      learning: 'Filosofi',
      home: 'Beranda',
      journal: 'Jurnal',
    },
    hero: {
      clarity: 'Temukan kejernihan dalam',
      unfolding: 'setiap momen.',
      greetings: {
        morning: 'Selamat pagi',
        afternoon: 'Selamat siang',
        evening: 'Selamat sore',
        night: 'Selamat malam',
      },
      greetingSuffix: '. Ceritakan apa yang sedang memenuhi pikiranmu saat ini. Prokopton membantu Anda menafsirkan kembali stres melalui kebijaksanaan abadi.',
    },
    footer: {
      copyright: '© 2026 Prokopton Reflection Tool • JuaraVibeCoding Entry',
      privacy: 'Privasi',
      terms: 'Syarat',
      cloud: 'Didukung Cloud Run',
    },
    common: {
      aiActive: 'AI Aktif',
      logReflection: 'Catat Refleksi',
      shareWisdom: 'Bagikan Hikmah',
      logged: 'Sudah Dicatat Hari Ini',
      dailyContemplation: 'Kontemplasi Harian',
      viewAnotherLens: 'Lihat Dari Lensa Lain',
      reflectionQuestion: 'Pertanyaan Refleksi',
      reflectionAnswerPlaceholder: 'Tulis pemikiran Anda di sini...',
      startNew: 'Refleksi Baru',
      continue: 'Jelajahi Lebih Lanjut',
      dailyTheme: 'Kontemplasi Harian',
      todaysPractice: 'Latihan Hari Ini',
      morningIntention: 'Niat Pagi',
      middayPause: 'Jeda Siang',
      eveningReview: 'Tinjauan Malam',
      journey: 'Perjalanan Refleksi',
      consistency: 'Konsistensi',
      saveToJournal: 'Simpan ke Jurnal',
      journalSaved: 'Tersimpan',
      journalEmpty: 'Jurnal Anda kosong. Mulailah mencatat perjalanan Anda.',
      viewJournal: 'Lihat Jurnal',
      loadContext: 'Muat ke Refleksi',
      journalTitle: 'Jurnal Pribadi',
      journalSub: 'Catatan pertumbuhan dan dialog batin Anda.',
      deleteEntry: 'Hapus Catatan',
      editEntry: 'Ubah Catatan',
      addEntry: 'Catatan Baru',
      saveEntry: 'Simpan Catatan',
      cancel: 'Batal',
      backToReflection: 'Kembali ke Refleksi',
      entryTitle: 'Judul',
      entryContent: 'Kontemplasi',
      emotionalPatterns: 'Pola Emosional',
      growthSummary: 'Ringkasan Pertumbuhan',
      dominantTheme: 'Tema Dominan',
      revisitPerspective: 'Tinjau Perspektif',
      recurringThemes: 'Tema Berulang',
      insightSummary: 'Ringkasan Wawasan',
      timeline: 'Timeline Refleksi',
      analysisTitle: 'Pengenalan Pola',
      analysisSub: 'Pengamatan halus terhadap dialog batin Anda.',
      confirmDelete: 'Apakah Anda yakin ingin menghapus catatan ini?',
      analysisPending: 'Pengenalan pola memerlukan setidaknya lima refleksi terbimbing AI untuk mulai mengamati dialog batin Anda. Lakukan lebih banyak refleksi untuk membuka wawasan.',
      perspectiveEvolution: 'Evolusi Perspektif',
      recurringInquiries: 'Pertanyaan Berulang',
      momentOfPerspective: 'Momen Perspektif',
      enoughReflections: 'Anda telah mengumpulkan cukup banyak refleksi. Apakah Anda ingin mengamati pola dalam dialog batin terbaru Anda?',
      updatedReflections: 'Perjalanan Anda telah berkembang dengan refleksi baru. Apakah Anda ingin memperbarui pola perspektif Anda?',
      seekPatterns: 'Cari Pola Refleksi',
      updatePatterns: 'Perbarui Pola',
      analysisCondition: '5 refleksi baru diperlukan untuk memperbarui pola.',
      reflectionsNeeded: 'lagi refleksi diperlukan',
      capturedOn: 'Diambil pada',
      encryptedPrivate: 'Terenkripsi & Pribadi',
      privacyStatement: 'Pikiran Anda adalah milik Anda. Refleksi dienkripsi secara lokal.',
      lock: {
        title: 'Perlindungan Jurnal',
        sub: 'Jaga kerahasiaan refleksi Anda dengan batas yang aman.',
        enable: 'Aktifkan Perlindungan',
        disable: 'Matikan Perlindungan',
        setupPin: 'Atur PIN Anda',
        enterPin: 'Masukkan PIN untuk Membuka',
        wrongPin: 'PIN salah. Coba lagi dengan tenang.',
        locked: 'Refleksi terlindungi',
        unlocked: 'Batas dibuka',
        biometric: 'Gunakan Keamanan Perangkat',
        autoLock: 'Kunci Otomatis',
        inactivity: 'Kunci setelah tidak aktif',
        placeholder: 'Masukkan 4 digit PIN',
        setPinConfirm: 'Konfirmasi PIN baru Anda',
        pinsDonMatch: 'PIN tidak cocok. Silakan coba lagi.',
        pinSetSuccess: 'Batas privasi ditetapkan.',
        securityOff: 'Batas privasi dihapus.',
      },
      voice: {
        holdToReflect: 'Tahan untuk Berefleksi',
        speakThoughts: 'Bicarakan pemikiranmu',
        voiceReflection: 'Refleksi Suara',
        listening: 'Mendengarkan...',
        stop: 'Berhenti & Selesai',
        notSupported: 'Masukan suara tidak didukung di browser ini.',
      },
    },
    library: {
      archive: 'Arsip Perspektif',
      title: 'Perpustakaan Hikmah',
      description: 'Kumpulan wawasan abadi yang dikuratori, diacak setiap hari untuk menawarkan perspektif baru.',
      addToJournal: 'Simpan ke Jurnal',
    },
    learning: {
      title: 'Pembelajaran Filosofi',
      sub: 'Jelajahi perspektif abadi untuk menemukan keseimbangan praktis dalam kehidupan sehari-hari.',
      explore: 'Jelajahi',
      practicalwisdom: 'Kebijaksanaan Praktis',
      philosophies: {
        stoicism: {
          title: 'Stoikisme',
          summary: 'Fokuskan energi pada apa yang sebenarnya bisa dikendalikan.',
          description: 'Sekolah filsafat Helenistik yang mengajarkan pengembangan pengendalian diri dan ketabahan sebagai sarana untuk mengatasi emosi yang merusak.',
          focus: ['Ketahanan Emosional', 'Kendali', 'Kedamaian Internal']
        },
        buddhism: {
          title: 'Buddhisme',
          summary: 'Pahami bagaimana kemelekatan menciptakan penderitaan emosional.',
          description: 'Jalan spiritual yang menekankan kesadaran, kasih sayang, dan pemahaman tentang ketidakkekalan untuk mencapai pencerahan.',
          focus: ['Pelepasan Berkesadaran', 'Penerimaan', 'Belas Kasih']
        },
        taoism: {
          title: 'Taoisme',
          summary: 'Dorong keseimbangan dan penerimaan daripada paksaan.',
          description: 'Tradisi filosofis dan religius yang menekankan hidup selaras dengan Tao ("Jalan"), sumber dari segala sesuatu yang ada.',
          focus: ['Harmoni Alami', 'Keseimbangan', 'Mengalir']
        },
        existentialism: {
          title: 'Eksistensialisme',
          summary: 'Kebebasan untuk menciptakan makna dalam ketidakpastian.',
          description: 'Penyelidikan filosofis tentang hakikat kondisi manusia, yang menekankan keberadaan, kebebasan, dan pilihan individu.',
          focus: ['Makna', 'Kebebasan', 'Tanggung Jawab']
        },
        minimalism: {
          title: 'Minimalisme',
          summary: 'Menemukan kejernihan melalui fokus yang disengaja.',
          description: 'Filosofi hidup dengan hanya barang yang Anda butuhkan, berfokus pada apa yang memberi nilai dan makna bagi hidup Anda.',
          focus: ['Kejernihan', 'Intensionalitas', 'Kesederhanaan']
        },
        humanistic_psychology: {
          title: 'Psikologi Humanistik',
          summary: 'Jalan menuju kesadaran diri dan potensi.',
          description: 'Perspektif yang menekankan pada melihat individu secara utuh dan menekankan konsep seperti kehendak bebas, efikasi diri, dan aktualisasi diri.',
          focus: ['Kesadaran Diri', 'Pertumbuhan', 'Utuh']
        },
        confucianism: {
          title: 'Konfusianisme',
          summary: 'Hubungan harmonis dan karakter moral.',
          description: 'Sistem ajaran filosofis dan etis yang menekankan kesetiaan keluarga, harmoni sosial, dan pentingnya tradisi.',
          focus: ['Harmoni', 'Kesetiaan', 'Karakter']
        }
      }
    },
    reflection: {
      modeHeader: 'Bagaimana kita akan berefleksi hari ini?',
      modeSubheader: 'Pilih lensa yang selaras dengan keadaan pikiran Anda saat ini.',
      beginButton: 'Mulai Refleksi',
      inputHeader: 'Apa yang sedang membebani pikiran Anda?',
      inputSubheader: 'Jelaskan pergumulan Anda, pemikiran berlebih, atau situasi yang terasa berat.',
      inputPlaceholder: "Saya merasa kewalahan oleh...",
      changeLens: 'Ganti Lensa',
      getPerspective: 'Dapatkan Perspektif',
      loadingTitle: 'Mencari cahaya yang berbeda...',
      loadingTitles: [
        'Mencari cahaya yang berbeda...',
        'Berkonsultasi dengan hikmah abadi...',
        'Membingkai ulang dialog batin...',
        'Mengumpulkan perspektif...',
        'Menyaring kejernihan...',
        'Keheningan dalam kehampaan...',
        'Menelusuri jejak kuno...',
        'Menyelaraskan pikiran...'
      ],
      loadingSub: 'Mengumpulkan perspektif dari',
      characters: 'karakter',
      modes: {
        automatic: "AI memilih lensa terbaik",
        stoicism: "Fokus pada kendali",
        buddhism: "Pelepasan penuh kesadaran",
        taoism: "Harmoni alami",
        islamic_wisdom: "Iman & Kesabaran",
        existentialism: "Menciptakan makna",
        minimalism: "Fokus yang disengaja",
        modern_psychology: "Logika reflektif",
      }
    },
    themes: [
      {
        title: "Ruang di Antara",
        quote: "Antara stimulus dan respon ada sebuah ruang. Di ruang itu ada kekuatan kita untuk memilih respon kita. Dalam respon kita terletak pertumbuhan dan kebebasan kita.",
        author: "Viktor Frankl",
        contemplations: [
          "Identifikasi satu 'stimulus' yang berulang dalam hari Anda yang biasanya memicu reaksi impulsif.",
          "Berlatihlah berhenti sejenak selama tiga tarikan napas sebelum menanggapi notifikasi atau permintaan berikutnya.",
          "Amati sensasi fisik dari 'ruang' itu—apakah terasa seperti ketenangan atau ketegangan?"
        ]
      },
      {
        title: "Amor Fati (Cintai Takdir)",
        quote: "Formula saya untuk kebesaran manusia adalah amor fati: bahwa seseorang tidak menginginkan apa pun berbeda, tidak ke depan, tidak ke belakang, tidak dalam keabadian.",
        author: "Friedrich Nietzsche",
        contemplations: [
          "Terimalah satu ketidaknyamanan kecil hari ini tanpa mengeluh, bahkan kepada diri sendiri.",
          "Pertimbangkan bagaimana kegagalan di masa lalu sebenarnya membuka jalan bagi kesuksesan saat ini.",
          "Katakan 'memang begitu adanya' pada situasi yang tidak bisa Anda ubah, dan resapi maknanya."
        ]
      },
      {
        title: "Pikiran Pemula",
        quote: "Dalam pikiran pemula ada banyak kemungkinan, tetapi dalam pikiran ahli hanya ada sedikit.",
        author: "Shunryu Suzuki",
        contemplations: [
          "Dekati tugas rutin hari ini seolah-olah Anda belum pernah melakukannya sebelumnya.",
          "Dengarkan seseorang menjelaskan sesuatu yang sudah Anda 'ketahui', dan cari satu detail baru.",
          "Akui 'saya tidak tahu' dalam percakapan di mana Anda merasa tertekan untuk memiliki jawaban."
        ]
      }
    ]
  }
};
