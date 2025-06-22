# 📘 Logo Canvas

## 🧭 Spis treści

1. [Opis projektu](#opis-projektu)
2. [Technologie i biblioteki](#technologie-i-biblioteki)
3. [Wymagania systemowe](#wymagania-systemowe)
4. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
5. [Struktura projektu](#struktura-projektu)
6. [Baza danych i Prisma](#baza-danych-i-prisma)
7. [Seedowanie danych](#seedowanie-danych)
8. [Funkcjonalności](#funkcjonalności)
9. [Obsługa logo (grafiki)](#obsługa-logo-grafiki)
10. [Responsywny interfejs i UX](#responsywny-interfejs-i-ux)
11. [TODO / Roadmap](#todo--roadmap)

## 📝 Opis projektu

**Logo Canvas** to rozbudowana aplikacja webowa, która pozwala na kompleksowe zarządzanie klientami i branżami oraz generowanie własnych zestawów logotypów. Użytkownik może tworzyć, edytować i filtrować klientów oraz branże, a następnie wybierać interesujące go logotypy i rozmieszczać je na interaktywnym canvasie (płótnie).

**Ważniejsze funkcjonalności aplikacji:**

- Obsługa klientów i branż: Pełen CRUD (dodawanie, edycja, usuwanie, przeglądanie) zarówno dla klientów, jak i branż przemysłowych.
- Wielokrotne filtrowanie i wyszukiwanie: Klientów można filtrować po nazwie i branży, a obsługa nieskończonego przewijania (infinite scroll) pozwala wygodnie pracować nawet z dużą liczbą rekordów.
- Zbiorcze działania na klientach: Możliwość zaznaczania wielu klientów i generowania zestawu logo z wybranych firm.

**Zaawansowany generator canvas:**

- Przeciąganie, zmiana rozmiaru i układanie wybranych logotypów.
- Grupowanie logo według branż lub losowe rozmieszczenie na płótnie.
- Zmiana tła płótna oraz tła pojedynczych logotypów (biały/czarny).
- Możliwość eksportu gotowej kompozycji do pliku PNG jednym kliknięciem.
- Zapamiętywanie układu i konfiguracji canvasu między sesjami.

**Nowoczesny frontend:**

- Responsywny interfejs oparty na Next.js 15, React 19 i TailwindCSS 4
- Szybkie działania bez przeładowań (CSR/SSR)
- Dobrze przemyślana architektura komponentów
- Wydajne zarządzanie stanem (Zustand)

Projekt sprawdzi się zarówno jako narzędzie wewnętrzne dla agencji graficznych, jak i demonstracja praktycznych umiejętności w zakresie **Fullstack/Frontend developmentu.**

## ⚙️ Technologie i biblioteki

- **Next.js** 15+
- **React** 19
- **TypeScript**
- **TailwindCSS** 4
- **Prisma** (ORM + PostgreSQL)
- **ts-node** (do seedowania)
- **html-to-image** (generacja grafik)
- **lodash.debounce** (optymalizacja wyszukiwania)
- **react-rnd** (manipulacja pozycją i rozmiarem logo)
- **lucide-react** (biblioteka ikon)
- **framer-motion** (animacje)
- **zustand** (globalny stan dla zaznaczenia pola wyboru)

## 💻 Wymagania systemowe

- Node.js `>=18.x` (zalecane 20+)
- PostgreSQL (lokalny lub zdalny)
- pnpm / npm / yarn
- system z obsługą CLI (bash, zsh, etc.)

## 🚀 Instalacja i uruchomienie

```bash
git clone https://github.com/your-username/logo-generator.git
cd logo-generator
npm install
# ub zamiast tego użyj yarn / pnpm
```

Skonfiguruj plik `.env`:  
Przed uruchomieniem projektu skopiuj plik `.env.example` do `.env` i wprowadź dane uwierzytelniające bazy danych.

```bash
cp .env.example .env
```

Następnie edytuj plik `.env` i ustaw adres URL bazy danych:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/logo_generator
```

Utwórz bazę danych i uruchom początkową migrację:

```bash
npx prisma migrate dev --name init
```

Uruchom serwer deweloperski:

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce, aby zobaczyć wynik.

## 📚 Dowiedz się więcej

Aby dowiedzieć się więcej o Next.js, zapoznaj się z następującymi zasobami:

- [Dokumentacja Next.js](https://nextjs.org/docs) - poznaj funkcje i interfejs API Next.js.
- [Learn Next.js](https://nextjs.org/learn) - interaktywny samouczek Next.js.

Możesz sprawdzić [repozytorium Next.js GitHub](https://github.com/vercel/next.js) - Twoja opinia i wkład są mile widziane!

```

## 📁 Struktura projektu

```

.
├── prisma/
│ ├── migrations/
│ ├── schema.prisma
│ └── seed.ts
├── public/
│ └── Tux_Default.png
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── auth/
│ │ │ ├── clients/
│ │ │ └── industries/
│ │ ├── clients/
│ │ │ ├── [id]/
│ │ │ │ ├── edit/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │ └── page.tsx
│ │ ├── generate/
│ │ ├── industries/
│ │ ├── AppProviders.tsx
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components/
│ │ ├── ui/
│ │ ├── ClientCard.tsx
│ │ ├── ClientList.tsx
│ │ └── ...
│ ├── context/
│ ├── hooks/
│ ├── store/
│ ├── utils/
│ ├── lib/
│ │ └── db.ts
│ └── middleware.ts
├── types/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── components.json

````

## 🗃️ Baza danych i Prisma

```prisma

model Industry {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  clients Client[]
}

model Client {
  id         Int      @id @default(autoincrement())
  name       String
  address    String?
  logoBlob   Bytes?
  logoType   String?
  createdAt  DateTime @default(now())
  industry   Industry? @relation(fields: [industryId], references: [id])
  industryId Int?
}

````

**Klient należy do jednej branży. **

## 🌱 Seedowanie danych

```bash
npm run seed
```

Domyślny plik logo (`Tux_Default.png`) jest automatycznie dodawany do każdego klienta.

## 🔍 Funkcjonalności

- CRUD Klientow
- CRUD Branz przemyslowych
- Infinite scroll (IntersectionObserver)
- Filtrowanie po nazwie i branży
- SSR i CSR połączone logicznie (np. lista branż z SSR)
- Zaznaczanie wielu klientów i przekierowanie do generowania wybranych logo na canvas
- Dodawanie oraz usuwanie kilejnych logo na canvas poprzez modal
- Opcja wyswietlania logo na canvas w grupach wedlug branz lub mieszanie
- Zapamietywanie ukaldu i stanu logo na canvas
- Manipulacja wielkoscia kazdego logo, jego tlem jak i tlem canvas

## 🖼️ Obsługa logo (grafiki)

Logo przechowywane jest jako `logoBlob` (`Bytes`) i `logoType`. W przypadku braku pliku logo, serwer dodaje domyślny plik PNG. W interfejsie frontendowym, logo jest dekodowane do `data:image/png;base64,...`.

## 📱 Responsywny interfejs i UX

- Komponenty zoptymalizowane pod Tailwind i skalowanie
- Płynne UX dzięki debounced input i bez przeładowań

## 📦 Zainstalowane pakiety

Lista kluczowych zależności:

- `next`, `react`, `typescript`
- `prisma`, `@prisma/client`, `ts-node`
- `tailwindcss`, `postcss`
- `html-to-image`, `react-rnd`, `lodash.debounce`
- `lucide-react`, `framer-motion`
- `zustand` – lekki stan globalny (używany do utrzymywania zaznaczenia pola wyboru)

(Zobacz `package.json` dla pełnych szczegółów)

## 🧩 TODO / Roadmap

- [ ] Import CSV / Excel
- [ ] Eksport logo jako ZIP
- [ ] Integracja z chmurą (np. Supabase storage)
