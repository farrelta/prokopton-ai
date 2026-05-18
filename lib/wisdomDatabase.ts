export interface WisdomQuote {
  title: string;
  philosophy: string;
  content: string;
  author: string;
  sourceUrl?: string;
}

export interface DailyTheme {
  title: string;
  description: string;
  quote: string;
  author: string;
  contemplations: string[];
}

export const wisdomDatabase: WisdomQuote[] = [
  {
    title: "On the Shortness of Life",
    philosophy: "Stoicism",
    content: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
    sourceUrl: "https://en.wikipedia.org/wiki/Seneca_the_Younger"
  },
  {
    title: "Meditations on Control",
    philosophy: "Stoicism",
    content: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    sourceUrl: "https://en.wikipedia.org/wiki/Marcus_Aurelius"
  },
  {
    title: "The Dichotomy of Control",
    philosophy: "Stoicism",
    content: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
    author: "Epictetus"
  },
  {
    title: "The Present Moment",
    philosophy: "Buddhism",
    content: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha"
  },
  {
    title: "The Tao that can be told",
    philosophy: "Taoism",
    content: "The Tao that can be told is not the eternal Tao; The name that can be named is not the eternal name.",
    author: "Laozi"
  },
  {
    title: "Existence Precedes Essence",
    philosophy: "Existentialism",
    content: "Man is nothing else but what he makes of himself.",
    author: "Jean-Paul Sartre",
    sourceUrl: "https://en.wikipedia.org/wiki/Jean-Paul_Sartre"
  },
  {
    title: "The Myth of Sisyphus",
    philosophy: "Absurdism",
    content: "One must imagine Sisyphus happy.",
    author: "Albert Camus"
  },
  {
    title: "Amor Fati",
    philosophy: "Existentialism",
    content: "My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity.",
    author: "Friedrich Nietzsche"
  },
  {
    title: "The Nature of Mind",
    philosophy: "Zen Buddhism",
    content: "In the beginner's mind there are many possibilities, but in the expert's there are few.",
    author: "Shunryu Suzuki"
  },
  {
    title: "No Man is an Island",
    philosophy: "Humanism",
    content: "No man is an island, entire of itself; every man is a piece of the continent, a part of the main.",
    author: "John Donne"
  },
  {
    title: "Nature does not hurry",
    philosophy: "Taoism",
    content: "Nature does not hurry, yet everything is accomplished.",
    author: "Laozi"
  },
  {
    title: "He who has a why",
    philosophy: "Existentialism",
    content: "He who has a why to live for can bear almost any how.",
    author: "Friedrich Nietzsche"
  },
  {
    title: "Peace comes from within",
    philosophy: "Buddhism",
    content: "Peace comes from within. Do not seek it without.",
    author: "Buddha"
  },
  {
    title: "The obstacle is the way",
    philosophy: "Stoicism",
    content: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius"
  },
  {
    title: "To be is to do",
    philosophy: "Existentialism",
    content: "To be is to do.",
    author: "Socrates / Jean-Paul Sartre"
  },
  {
    title: "Knowledge speaks",
    philosophy: "Wisdom",
    content: "Knowledge speaks, but wisdom listens.",
    author: "Jimi Hendrix"
  },
  {
    title: "Be the change",
    philosophy: "Humanism",
    content: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi"
  },
  {
    title: "What we achieve inwardly",
    philosophy: "Wisdom",
    content: "What we achieve inwardly will change outer reality.",
    author: "Plutarch"
  },
  {
    title: "The unexamined life",
    philosophy: "Classical Philosophy",
    content: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    title: "It does not matter how slowly",
    philosophy: "Confucianism",
    content: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    title: "Courage is not the absence",
    philosophy: "Wisdom",
    content: "I learned that courage was not the absence of fear, but the triumph over it.",
    author: "Nelson Mandela"
  },
  {
    title: "The Mind is Everything",
    philosophy: "Buddhism",
    content: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    title: "Do what you can",
    philosophy: "Stoicism",
    content: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt"
  },
  {
    title: "Happiness depends upon ourselves",
    philosophy: "Classical Philosophy",
    content: "Happiness depends upon ourselves.",
    author: "Aristotle"
  },
  {
    title: "The Journey of a Thousand Miles",
    philosophy: "Taoism",
    content: "The journey of a thousand miles begins with one step.",
    author: "Laozi"
  },
  {
    title: "Only passing through",
    philosophy: "Stoicism",
    content: "I am not an Athenian or a Greek, but a citizen of the world.",
    author: "Diogenes"
  },
  {
    title: "Freedom and Choice",
    philosophy: "Existentialism",
    content: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
    author: "Jean-Paul Sartre"
  },
  {
    title: "Let it go",
    philosophy: "Zen Buddhism",
    content: "To understand everything is to forgive everything.",
    author: "Osho"
  },
  {
    title: "Endurance",
    philosophy: "Stoicism",
    content: "To bear trials with a calm mind robs misfortune of its strength and burden.",
    author: "Seneca"
  },
  {
    title: "The True Measure",
    philosophy: "Humanism",
    content: "The true measure of a man is how he treats someone who can do him absolutely no good.",
    author: "Samuel Johnson"
  },
  {
    title: "Patience and Time",
    philosophy: "Wisdom",
    content: "The two most powerful warriors are patience and time.",
    author: "Leo Tolstoy"
  },
  {
    title: "Wisdom of Wonder",
    philosophy: "Classical Philosophy",
    content: "Wonder is the beginning of wisdom.",
    author: "Socrates"
  },
  {
    title: "Action and Purpose",
    philosophy: "Stoicism",
    content: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius"
  },
  {
    title: "Contentment",
    philosophy: "Taoism",
    content: "He who knows that enough is enough will always have enough.",
    author: "Laozi"
  },
  {
    title: "Perception",
    philosophy: "Stoicism",
    content: "It’s not what happens to you, but how you react to it that matters.",
    author: "Epictetus"
  },
  {
    title: "The present is all we have",
    philosophy: "Existentialism",
    content: "Realize deeply that the present moment is all you ever have.",
    author: "Eckhart Tolle"
  },
  {
    title: "The self is an illusion",
    philosophy: "Buddhism",
    content: "You only lose what you cling to.",
    author: "Buddha"
  },
  {
    title: "Simplicity",
    philosophy: "Minimalism",
    content: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  },
  {
    title: "The search for meaning",
    philosophy: "Existentialism",
    content: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.",
    author: "Viktor Frankl"
  },
  {
    title: "Balance",
    philosophy: "Taoism",
    content: "When you are content to be simply yourself and don't compare or compete, everybody will respect you.",
    author: "Laozi"
  }
];

export function getDailyTheme(): DailyTheme {
  // Use today's date to seed a pseudo-random index so it stays the same all day
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple LCG or just modulo
  const index = seed % wisdomDatabase.length;
  const quote = wisdomDatabase[index];

  return {
    title: "Daily Focus",
    description: "A stoic reflection for your day.",
    quote: quote.content,
    author: quote.author,
    contemplations: [
      `How does "${quote.content.split('.')[0] || "this wisdom"}" apply to your current challenge?`,
      "What is one small action you can take today based on this wisdom?",
      "If you truly believed this quote, what would you do differently?"
    ]
  };
}

export function getLibraryQuotes(): WisdomQuote[] {
  return wisdomDatabase;
}
