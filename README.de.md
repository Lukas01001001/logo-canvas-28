# 📘 Logo Canvas

## 🧭 Inhaltsverzeichnis

1. [Projektbeschreibung](#projektbeschreibung)
2. [Technologien und Bibliotheken](#technologien-und-bibliotheken)
3. [Systemanforderungen](#systemanforderungen)
4. [Installation und Einrichtung](#installation-und-einrichtung)
5. [Projektstruktur](#projektstruktur)
6. [Datenbank und Prisma](#datenbank-und-prisma)
7. [Daten seeden](#daten-seeden)
8. [Funktionen](#funktionen)
9. [Logo-Verarbeitung](#logo-verarbeitung)
10. [Responsives Interface und UX](#responsives-interface-und-ux)
11. [TODO / Roadmap](#todo--roadmap)

## 📝 Projektbeschreibung

**Logo Canvas** ist eine fortschrittliche Webanwendung zur umfassenden Verwaltung von Kunden und Branchen sowie zum Generieren individueller Logopakete. Benutzer können Kunden und Branchen erstellen, bearbeiten und filtern und anschließend die gewünschten Logos auswählen und interaktiv auf einer Leinwand (Canvas) anordnen.

**Wichtige Funktionen:**

- Umfassende Verwaltung von Kunden und Branchen: Volle CRUD-Funktionen für Kunden und Branchen.
- Erweiterte Filter- und Suchfunktionen: Kunden können nach Name oder Branche gefiltert werden; dank “Infinite Scroll” bleibt die Anwendung auch bei großen Datenmengen performant.
- Sammelaktionen: Auswahl mehrerer Kunden und Generieren eines Logo-Sets aus den gewählten Unternehmen.

**Leistungsstarker Canvas-Generator:**

- Freies Verschieben, Skalieren und Anordnen ausgewählter Logos.
- Gruppierung der Logos nach Branche oder zufällige Verteilung auf der Leinwand.
- Anpassung der Hintergrundfarbe des Canvas sowie einzelner Logos (weiß/schwarz).
- Export der fertigen Komposition als PNG-Datei mit nur einem Klick.
- Speichern und Wiederherstellen von Layout und Einstellungen zwischen den Sitzungen.

**Modernes Frontend:**

- Responsives UI mit Next.js 15, React 19 und TailwindCSS 4
- Kombination aus SSR und CSR für schnelle, flüssige Bedienung
- Saubere Komponenten-Architektur und effizientes globales State-Management (Zustand).

Dieses Projekt eignet sich sowohl als internes Tool für Grafik- oder Marketingagenturen als auch als Referenz für **Fullstack-/Frontend-Know-how** in der Praxis.

## ⚙️ Technologien und Bibliotheken

- **Next.js** 15+
- **React** 19
- **TypeScript**
- **TailwindCSS** 4
- **Prisma** (ORM + PostgreSQL)
- **ts-node** (zum Seeden)
- **html-to-image** (Bildgenerierung)
- **lodash.debounce** (Suchoptimierung)
- **react-rnd** (Größe und Position von Logos anpassen)
- **lucide-react** (Symbolbibliothek)
- **framer-motion** (Animationen)
- **zustand** (globaler Status für die Auswahl der Checkbox)

## 💻 Systemanforderungen

- Node.js `>=18.x` (empfohlen: 20+)
- PostgreSQL (lokal oder remote)
- pnpm / npm / yarn
- CLI-Unterstützung (bash, zsh etc.)

## 🚀 Installation und Einrichtung

```bash
git clone https://github.com/dein-benutzername/logo-generator.git
cd logo-generator
npm install
# oder stattdessen yarn / pnpm verwenden
```

Konfigurieren Sie Ihre `.env` Datei:  
Bevor Sie das Projekt starten, kopieren Sie die Datei `.env.example` in die Datei `.env` und geben Sie Ihre Datenbank-Anmeldedaten ein.

```bash
cp .env.example .env
```

Bearbeiten Sie dann die Datei `.env` und setzen Sie Ihre Datenbank-URL:

```env
DATABASE_URL=postgresql://dein_benutzer:ihr_passwort@localhost:5432/logo_generator
```

Erstellen Sie die Datenbank und führen Sie die erste Migration durch:

```bash
npx prisma migrate dev --name init
```

Starten Sie den Entwicklungsserver:

```bash
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser, um das Ergebnis zu sehen.

```
## 📚 Mehr erfahren

Weitere Informationen zu Next.js findest du hier:

- [Dokumentation Next.js](https://nextjs.org/docs) – Funktionen und API kennenlernen
- [Lernen Next.js](https://nextjs.org/learn) – Interaktives Tutorial

Siehe auch das [ Next.js GitHub](https://github.com/vercel/next.js) - Feedback und Beiträge sind willkommen!
```

## 📁 Projektstruktur

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
```

## 🗃️ Datenbank und Prisma

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
```

**Der Kunde gehört zu einer Branche.**

## 🌱 Daten seeden

```bash
npm run seed
```

Die Standard-Logo-Datei (`Tux_Default.png`) wird jedem neuen Client automatisch zugewiesen.

## 🔍 Funktionen

- Kunde CRUD
- Industrie CRUD
- Unendliches Blättern (IntersectionObserver)
- Filterung nach Name und Branche
- SSR und CSR logisch verknüpft (z.B. Liste der Branchen mit SSR)
- Auswahl mehrerer Kunden und Weiterleitung zur Generierung der ausgewählten Logos auf dem Canvas
- Hinzufügen und Löschen von einzelnen Logos auf der Leinwand über ein Modal
- Möglichkeit, die Logos auf der Leinwand in Gruppen von Branchen darzustellen oder zu mischen
- Speicherung von Logo-Layout und -Status auf der Leinwand
- Manipulation der Größe der einzelnen Logos, ihres Hintergrunds und des Leinwandhintergrunds

## 🖼️ Logo-Verarbeitung

Logos werden als `logoBlob` (`Bytes`) i `logoType`. in der Datenbank gespeichert.
Wenn kein Logo hochgeladen wird, wird automatisch ein Standardbild zugewiesen.
Im Frontend wird das Logo in `data:image/png;base64,...` dekodiert.

## 📱 Responsives Interface und UX

- Komponenten für Tailwind-Skalierung optimiert
- Debounced Inputs sorgen für flüssiges UX ohne Neuladen

## 📦 Installierte Pakete

Liste der wichtigsten Abhängigkeiten:

- `next`, `react`, `typescript`
- `prisma`, `@prisma/client`, `ts-node`
- `tailwindcss`, `postcss`
- `html-to-image`, `react-rnd`, `lodash.debounce`
- `lucide-react`, `framer-motion`
- `Zustand` - leichtgewichtiger globaler Zustand (wird verwendet, um die Auswahl des Kontrollkästchens beizubehalten)

(Siehe `package.json` für alle Details)

## 🧩 TODO / Roadmap

- [ ] Import aus CSV / Excel
- [ ] Export der Logos als ZIP
- [ ] Integration von Cloud-Storage (z. B. Supabase)
