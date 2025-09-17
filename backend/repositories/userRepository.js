import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Definišemo putanju do našeg "database" fajla za korisnike
// __dirname pokazuje na trenutni folder (repositories), '..' nas vraća korak unazad,
// a onda ulazimo u 'data' folder i biramo 'users.json'
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

//POMOĆNE FUNKCIJE 

// Pomoćna funkcija za čitanje svih korisnika iz fajla.
// da ne ponavljamo isti kod.
const readUsers = () => {
    try {
        // Čita fajl
        const data = fs.readFileSync(usersFilePath, 'utf8');
        // parsira ga iz teksta u JavaScript niz objekata
        return JSON.parse(data);
    } catch (error) {
        // Ako fajl ne postoji, vrati prazan niz
        console.error("Greška pri čitanju users.json:", error);
        return [];
    }
};

// Pomoćna funkcija za pisanje svih korisnika u fajl.
const writeUsers = (users) => {
    try {
        // Pretvara JavaScript niz objekata nazad u formatiran JSON tekst
        // (null, 2)  da JSON bude lepo formatiran sa razmacima
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error("Greška pri pisanju u users.json:", error);
    }
};


// GLAVNE FUNKCIJE REPOZITORIJUMA (one koje se izvoze) 

// Funkcija za pronalaženje SVIH korisnika
export const findAll = () => {
    return readUsers();
};

// Funkcija za pronalaženje JEDNOG korisnika po njegovom ID-ju
export const findById = (id) => {
    const users = readUsers();
    // Vraća prvog korisnika čiji se ID poklapa, ili 'undefined' ako ga ne nađe
    return users.find(user => user.id === id);
};

// Funkcija za pronalaženje JEDNOG korisnika po njegovom KORISNIČKOM IMENU
export const findByUsername = (username) => {
    const users = readUsers();
    return users.find(user => user.korisnickoIme === username);
};

// Funkcija za pronalaženje JEDNOG korisnika po njegovoj EMAIL ADRESI
export const findByEmail = (email) => {
    const users = readUsers();
    return users.find(user => user.email === email);
};

// Funkcija za ČUVANJE (dodavanje novog ili ažuriranje postojećeg) korisnika
export const save = (userToSave) => {
    const users = readUsers();
    // Provera da li korisnik kojeg čuvamo već ima ID
    const userIndex = users.findIndex(user => user.id === userToSave.id);

    if (userIndex !== -1) {
        // Ako korisnik postoji (našli smo ga po ID-ju), AŽURIRAMO ga
        users[userIndex] = { ...users[userIndex], ...userToSave };
    } else {
        // Ako ne postoji, DODAJEMO ga na kraj niza
        users.push(userToSave);
    }

    // Pišemo ceo, sada izmenjeni niz, nazad u fajl
    writeUsers(users);
    // Vraćamo sačuvanog/ažuriranog korisnika
    return userToSave;
};

// Funkcija za BRISANJE korisnika po ID-ju (ako zatreba)
export const deleteById = (id) => {
    let users = readUsers();
    const initialLength = users.length;
    // Filtriramo niz da sadrži sve korisnike OSIM onog sa datim ID-jem
    users = users.filter(user => user.id !== id);

    if (users.length < initialLength) {
        // Ako je dužina niza manja, znači da smo nekog obrisali
        writeUsers(users);
        return true; // Vraćamo true kao potvrdu
    }
    return false; // Vraćamo false ako niko nije obrisan
};