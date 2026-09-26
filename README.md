En fullstack bokningsapp byggd med React, TypeScript, Express och PostgreSQL. Under utveckling.

## Struktur
- ts-project är frontenden (React, TS, Vite)
- ts-express är backenden (Express + TS, PostgreSQL)

## Implementerade funktioner
- Kontoskapande med lösenordshashning via bcrypt
- Inloggning med JWT-autentisering, samt middleware för att skydda routes
- Beräkning av veckotillgänglighet: slår ihop personalscheman, befintliga bokningar och raster till lediga tider per dag
- Endpoints för tjänster och bokningar (bokningsskapande fortfarande under arbete)
- Testat via Postman (integration mellan frontend och backend ej klar)

## Köra lokalt
Kräver Node.js och körande PostgreSQL db.

**Backend:**
cd ts-express
npm install
npm start
Skapa en `.env`-fil med dina databasuppgifter och `ACCESS_TOKEN_SECRET`.

**Frontend:**
cd ts-project
npm install
npm run dev
