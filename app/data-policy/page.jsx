"use client";

import { useState } from "react";
import Link from "next/link";

const DatenschutzPage = () => {
    const [language, setLanguage] = useState("de");

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold gold-shimmer-text">
                        {language === "de" ? "Datenschutzerklärung" : "Privacy Policy"}
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setLanguage("de")}
                            className={`px-3 py-1 rounded-md transition-colors ${language === "de"
                                ? "gold-bg text-black"
                                : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                }`}
                        >
                            Deutsch
                        </button>
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-3 py-1 rounded-md transition-colors ${language === "en"
                                ? "gold-bg text-black"
                                : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                }`}
                        >
                            English
                        </button>
                    </div>
                </div>

                <div className="bg-[#151515] rounded-lg gold-gradient-border p-8 shadow-lg">
                    {language === "de" && (
                        <div className="text-white space-y-6">
                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">1. Datenschutz auf einen Blick</h2>
                                <h3 className="text-lg font-semibold mb-2">Allgemeine Hinweise</h3>
                                <p className="mb-4">
                                    Der Schutz deiner persönlichen Daten ist mir ein wichtiges Anliegen. Diese Datenschutzerklärung
                                    informiert dich über Art, Umfang und Zwecke der Erhebung und Verwendung personenbezogener Daten
                                    auf dieser Website gemäß der EU-Datenschutz-Grundverordnung (DSGVO).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">2. Verantwortlicher</h2>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <p><strong>Niklas Beck</strong></p>
                                    <p>Dorfstraße 140a</p>
                                    <p>25569 Kremperheide</p>
                                    <p>Deutschland</p>
                                    <p className="mt-3">
                                        <strong>E-Mail:</strong>{" "}
                                        <a href="mailto:niklasbeck18@gmail.com" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">3. Hosting & Server</h2>
                                <h3 className="text-lg font-semibold mb-2">Vercel Inc.</h3>
                                <p className="mb-3">
                                    Diese Website wird auf Servern von Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet.
                                    Vercel erhebt und speichert automatisch Informationen in Server-Log-Dateien:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Browsertyp und -version</li>
                                    <li>Verwendetes Betriebssystem</li>
                                    <li>Referrer URL (zuvor besuchte Seite)</li>
                                    <li>Hostname des zugreifenden Rechners</li>
                                    <li>IP-Adresse</li>
                                    <li>Uhrzeit der Serveranfrage</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Speicherdauer:</strong> 30 Tage<br />
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
                                    technisch fehlerfreien Darstellung und Optimierung der Website)
                                </p>
                                <p className="mb-3">
                                    Vercel hat einen Auftragsverarbeitungsvertrag (Data Processing Agreement) mit mir abgeschlossen.
                                    Mehr Infos: <a href="https://vercel.com/legal/dpa" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Vercel DPA
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">4. Datenbank & Datenspeicherung</h2>
                                <h3 className="text-lg font-semibold mb-2">MongoDB Atlas (AWS Frankfurt)</h3>
                                <p className="mb-3">
                                    Für die Speicherung deiner Benutzerdaten nutze ich MongoDB Atlas, gehostet auf AWS-Servern in Frankfurt, Deutschland (EU).
                                </p>
                                <p className="mb-3"><strong>Welche Daten werden gespeichert?</strong></p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>Bei E-Mail-Registrierung:</strong> E-Mail-Adresse, selbstgewählter Username, verschlüsseltes Passwort (Hash)</li>
                                    <li><strong>Bei Google-Anmeldung:</strong> E-Mail-Adresse, Google-Username (änderbar in Einstellungen), Google-ID</li>
                                    <li><strong>Challenges:</strong> Challenge-Name, Dauer, Startdatum, Username, Spielinformationen, Timer</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Speicherdauer:</strong> Bis zur Löschung durch dich (siehe Abschnitt "Deine Rechte")<br />
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                                </p>
                                <p className="mb-3">
                                    MongoDB hat einen Auftragsverarbeitungsvertrag (Data Processing Agreement) mit mir abgeschlossen.
                                    Mehr Infos: <a href="https://www.mongodb.com/legal/dpa" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        MongoDB DPA
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">5. Google OAuth (Anmeldung mit Google)</h2>
                                <p className="mb-3">
                                    Du kannst dich mit deinem Google-Konto anmelden. Dabei werden folgende Daten von Google an uns übermittelt:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>E-Mail-Adresse</li>
                                    <li>Google-Name (wird als Username verwendet, änderbar in Einstellungen)</li>
                                    <li>Google-ID (zur eindeutigen Identifikation)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
                                    <strong>Anbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland<br />
                                    <strong>Datenschutz:</strong> <a href="https://policies.google.com/privacy?hl=de" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Privacy Policy
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">6. Cookies</h2>
                                <p className="mb-3">
                                    Diese Website verwendet Cookies. Das sind kleine Textdateien, die auf deinem Endgerät gespeichert werden.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">Technisch notwendige Cookies</h3>
                                <p className="mb-2">Diese Cookies sind für den Betrieb der Website erforderlich:</p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>cookieConsent:</strong> Speichert deine Cookie-Entscheidung (Speicherdauer: 12 Monate)</li>
                                    <li><strong>preferredLanguage:</strong> Speichert deine Sprachauswahl (Speicherdauer: 12 Monate)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">Analytische Cookies (nur mit Einwilligung)</h3>
                                <p className="mb-2">Diese Cookies werden nur gesetzt, wenn du im Cookie-Banner "Alle akzeptieren" gewählt hast:</p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>_ga:</strong> Google Analytics Haupt-Cookie (Speicherdauer: 2 Jahre)</li>
                                    <li><strong>_gid:</strong> Google Analytics ID (Speicherdauer: 24 Stunden)</li>
                                    <li><strong>_gat:</strong> Google Analytics Throttle (Speicherdauer: 1 Minute)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">Werbe-Cookies (nur mit Einwilligung)</h3>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>_gcl_au:</strong> Google AdSense Conversion (Speicherdauer: 3 Monate)</li>
                                    <li><strong>IDE:</strong> Google DoubleClick (Speicherdauer: 13 Monate)</li>
                                    <li><strong>test_cookie:</strong> Google DoubleClick Test (Speicherdauer: 15 Minuten)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                                </p>

                                <p className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg mt-4">
                                    <strong>Hinweis:</strong> Du kannst deine Cookie-Einwilligung jederzeit widerrufen, indem du deine Browser-Cookies löschst
                                    oder in deinen Browser-Einstellungen Cookies blockierst. Beim nächsten Besuch erscheint der Cookie-Banner erneut.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">7. Google Analytics</h2>
                                <p className="mb-3">
                                    Diese Website nutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                                </p>
                                <p className="mb-3">
                                    <strong>Tracking-ID:</strong> G-V4JSECSYVT<br />
                                    <strong>Speicherdauer:</strong> 2 Monate<br />
                                    <strong>IP-Anonymisierung:</strong> Aktiviert (deine IP-Adresse wird gekürzt)
                                </p>
                                <p className="mb-3">
                                    Google Analytics verwendet Cookies, um dein Nutzungsverhalten zu analysieren (z.B. Seitenaufrufe, Verweildauer, Herkunftsland).
                                    Die Daten werden an Google-Server in den USA übertragen.
                                </p>
                                <p className="mb-3">
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Cookie-Banner)<br />
                                    <strong>Auftragsverarbeitung:</strong> Google hat mit mir einen Data Processing Agreement abgeschlossen
                                </p>
                                <p className="mb-3">
                                    <strong>Opt-Out:</strong> Du kannst Google Analytics deaktivieren durch:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Ablehnen im Cookie-Banner</li>
                                    <li>Löschen der Cookies in deinem Browser</li>
                                    <li>Installation des <a href="https://tools.google.com/dlpage/gaoptout?hl=de" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Analytics Opt-out Browser-Add-ons
                                    </a></li>
                                </ul>
                                <p className="mb-3">
                                    Mehr Infos: <a href="https://policies.google.com/privacy?hl=de" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Datenschutzerklärung
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">8. Google AdSense</h2>
                                <p className="mb-3">
                                    Diese Website nutzt Google AdSense, einen Dienst zum Einbinden von Werbeanzeigen der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                                </p>
                                <p className="mb-3">
                                    <strong>Publisher-ID:</strong> ca-pub-1511082465942403<br />
                                    <strong>Speicherdauer:</strong> Bis zu 24 Monate
                                </p>
                                <p className="mb-3">
                                    Google AdSense verwendet Cookies und Web Beacons, um interessenbasierte Werbung anzuzeigen.
                                    Dabei werden Informationen über dein Nutzungsverhalten (z.B. besuchte Seiten) an Google übertragen und auf Servern in den USA gespeichert.
                                </p>
                                <p className="mb-3">
                                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Cookie-Banner)<br />
                                    <strong>Auftragsverarbeitung:</strong> Google hat mit mir einen Data Processing Agreement abgeschlossen
                                </p>
                                <p className="mb-3">
                                    <strong>Personalisierte Werbung deaktivieren:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Ablehnen im Cookie-Banner</li>
                                    <li><a href="https://adssettings.google.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Ads-Einstellungen
                                    </a></li>
                                    <li><a href="https://optout.aboutads.info/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Network Advertising Initiative Opt-Out
                                    </a></li>
                                </ul>
                                <p className="mb-3">
                                    Mehr Infos: <a href="https://policies.google.com/technologies/ads?hl=de" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Werbung
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">9. Datenübertragung in die USA</h2>
                                <p className="mb-3">
                                    Durch die Nutzung von Google Analytics, Google AdSense und Google OAuth werden personenbezogene Daten
                                    (z.B. IP-Adresse, Nutzungsverhalten) in die USA übertragen.
                                </p>
                                <p className="mb-3">
                                    Die USA sind von der Europäischen Kommission nicht als Land mit angemessenem Datenschutzniveau eingestuft.
                                    Die Übermittlung erfolgt auf Grundlage von <strong>Standardvertragsklauseln (SCC)</strong>, die Google mit mir abgeschlossen hat.
                                </p>
                                <p className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
                                    <strong>Hinweis:</strong> Nach Auffassung des EuGH besteht bei Datenübermittlungen in die USA die Gefahr staatlicher Zugriffe
                                    zu Überwachungszwecken, gegen die keine wirksamen Rechtsbehelfe zur Verfügung stehen.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">10. Deine Rechte (nach DSGVO)</h2>
                                <p className="mb-3">Du hast folgende Rechte bezüglich deiner personenbezogenen Daten:</p>
                                <ul className="list-disc list-inside ml-4 mb-4 space-y-2">
                                    <li><strong>Auskunft (Art. 15 DSGVO):</strong> Du kannst jederzeit Auskunft über deine gespeicherten Daten erhalten</li>
                                    <li><strong>Berichtigung (Art. 16 DSGVO):</strong> Du kannst die Korrektur falscher Daten verlangen</li>
                                    <li><strong>Löschung (Art. 17 DSGVO):</strong> Du kannst die Löschung deiner Daten verlangen</li>
                                    <li><strong>Einschränkung (Art. 18 DSGVO):</strong> Du kannst die Einschränkung der Verarbeitung verlangen</li>
                                    <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Du kannst eine Kopie deiner Daten in maschinenlesbarem Format erhalten</li>
                                    <li><strong>Widerspruch (Art. 21 DSGVO):</strong> Du kannst der Verarbeitung deiner Daten widersprechen</li>
                                    <li><strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Du kannst deine Einwilligung jederzeit widerrufen</li>
                                </ul>

                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <p className="mb-2"><strong>Account-Löschung:</strong></p>
                                    <p className="mb-3">
                                        Du kannst deinen Account jederzeit selbst in den <strong>Einstellungen</strong> löschen.
                                        Dabei werden alle deine Daten permanent entfernt:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mb-3 space-y-1 text-sm">
                                        <li>Dein Benutzerkonto (E-Mail, Username)</li>
                                        <li>Alle von dir erstellten Challenges</li>
                                        <li>Deine Statistiken und Fortschritte</li>
                                    </ul>
                                    <p className="mb-3">
                                        Alternativ kannst du die Löschung auch per E-Mail anfordern:
                                    </p>
                                    <p>
                                        <a href="mailto:niklasbeck18@gmail.com?subject=Account-Löschung" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        Die Löschung erfolgt sofort und kann nicht rückgängig gemacht werden.
                                    </p>
                                </div>

                                <p className="mt-4">
                                    <strong>Beschwerderecht bei Aufsichtsbehörde:</strong><br />
                                    Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren:
                                </p>
                                <p className="mt-2">
                                    Der Landesbeauftragte für Datenschutz Schleswig-Holstein<br />
                                    Holstenstraße 98, 24103 Kiel<br />
                                    E-Mail: <a href="mailto:mail@datenschutzzentrum.de" className="text-blue-400 hover:underline">
                                        mail@datenschutzzentrum.de
                                    </a><br />
                                    Website: <a href="https://www.datenschutzzentrum.de/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        www.datenschutzzentrum.de
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">11. SSL/TLS-Verschlüsselung</h2>
                                <p className="mb-3">
                                    Diese Website nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung.
                                    Eine verschlüsselte Verbindung erkennst du daran, dass die Adresszeile von "http://" auf "https://" wechselt
                                    und an dem Schloss-Symbol in deiner Browserzeile.
                                </p>
                                <p>
                                    Wenn die SSL/TLS-Verschlüsselung aktiviert ist, können die Daten, die du an uns übermittelst,
                                    nicht von Dritten mitgelesen werden.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">12. Änderungen dieser Datenschutzerklärung</h2>
                                <p className="mb-3">
                                    Ich behalte mir vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht
                                    oder um Änderungen meiner Leistungen umzusetzen. Für deinen erneuten Besuch gilt dann die neue Datenschutzerklärung.
                                </p>
                                <p className="text-sm text-gray-400">
                                    <strong>Stand:</strong> Januar 2025
                                </p>
                            </section>
                        </div>
                    )}

                    {language === "en" && (
                        <div className="text-white space-y-6">
                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">1. Privacy at a Glance</h2>
                                <h3 className="text-lg font-semibold mb-2">General Information</h3>
                                <p className="mb-4">
                                    The protection of your personal data is very important to me. This privacy policy informs you about
                                    the nature, scope, and purpose of the collection and use of personal data on this website in accordance
                                    with the EU General Data Protection Regulation (GDPR).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">2. Controller</h2>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <p><strong>Niklas Beck</strong></p>
                                    <p>Dorfstraße 140a</p>
                                    <p>25569 Kremperheide</p>
                                    <p>Germany</p>
                                    <p className="mt-3">
                                        <strong>Email:</strong>{" "}
                                        <a href="mailto:niklasbeck18@gmail.com" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">3. Hosting & Servers</h2>
                                <h3 className="text-lg font-semibold mb-2">Vercel Inc.</h3>
                                <p className="mb-3">
                                    This website is hosted on servers of Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                                    Vercel automatically collects and stores information in server log files:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Browser type and version</li>
                                    <li>Operating system used</li>
                                    <li>Referrer URL (previously visited page)</li>
                                    <li>Hostname of the accessing computer</li>
                                    <li>IP address</li>
                                    <li>Time of server request</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Retention period:</strong> 30 days<br />
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. f GDPR (legitimate interest in technically error-free presentation and optimization of the website)
                                </p>
                                <p className="mb-3">
                                    Vercel has concluded a Data Processing Agreement (DPA) with me.
                                    More info: <a href="https://vercel.com/legal/dpa" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Vercel DPA
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">4. Database & Data Storage</h2>
                                <h3 className="text-lg font-semibold mb-2">MongoDB Atlas (AWS Frankfurt)</h3>
                                <p className="mb-3">
                                    I use MongoDB Atlas for storing your user data, hosted on AWS servers in Frankfurt, Germany (EU).
                                </p>
                                <p className="mb-3"><strong>What data is stored?</strong></p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>Email Registration:</strong> Email address, self-chosen username, encrypted password (hash)</li>
                                    <li><strong>Google Sign-In:</strong> Email address, Google username (changeable in settings), Google ID</li>
                                    <li><strong>Challenges:</strong> Challenge name, duration, start date, username, game information, timer</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Retention period:</strong> Until deletion by you (see section "Your Rights")<br />
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. b GDPR (contract fulfillment) and Art. 6 para. 1 lit. f GDPR (legitimate interest)
                                </p>
                                <p className="mb-3">
                                    MongoDB has concluded a Data Processing Agreement (DPA) with me.
                                    More info: <a href="https://www.mongodb.com/legal/dpa" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        MongoDB DPA
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">5. Google OAuth (Sign in with Google)</h2>
                                <p className="mb-3">
                                    You can sign in with your Google account. The following data is transmitted from Google to us:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Email address</li>
                                    <li>Google name (used as username, changeable in settings)</li>
                                    <li>Google ID (for unique identification)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. b GDPR (contract fulfillment)<br />
                                    <strong>Provider:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland<br />
                                    <strong>Privacy:</strong> <a href="https://policies.google.com/privacy?hl=en" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Privacy Policy
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">6. Cookies</h2>
                                <p className="mb-3">
                                    This website uses cookies. These are small text files stored on your device.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">Technically Necessary Cookies</h3>
                                <p className="mb-2">These cookies are required for the website to function:</p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>cookieConsent:</strong> Stores your cookie decision (retention: 12 months)</li>
                                    <li><strong>preferredLanguage:</strong> Stores your language selection (retention: 12 months)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. f GDPR (legitimate interest)
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">Analytics Cookies (only with consent)</h3>
                                <p className="mb-2">These cookies are only set if you select "Accept all" in the cookie banner:</p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>_ga:</strong> Google Analytics main cookie (retention: 2 years)</li>
                                    <li><strong>_gid:</strong> Google Analytics ID (retention: 24 hours)</li>
                                    <li><strong>_gat:</strong> Google Analytics throttle (retention: 1 minute)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. a GDPR (consent)
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">Advertising Cookies (only with consent)</h3>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>_gcl_au:</strong> Google AdSense conversion (retention: 3 months)</li>
                                    <li><strong>IDE:</strong> Google DoubleClick (retention: 13 months)</li>
                                    <li><strong>test_cookie:</strong> Google DoubleClick test (retention: 15 minutes)</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. a GDPR (consent)
                                </p>

                                <p className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg mt-4">
                                    <strong>Note:</strong> You can withdraw your cookie consent at any time by deleting your browser cookies
                                    or blocking cookies in your browser settings. The cookie banner will appear again on your next visit.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">7. Google Analytics</h2>
                                <p className="mb-3">
                                    This website uses Google Analytics, a web analytics service provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.
                                </p>
                                <p className="mb-3">
                                    <strong>Tracking ID:</strong> G-V4JSECSYVT<br />
                                    <strong>Retention period:</strong> 2 months<br />
                                    <strong>IP anonymization:</strong> Enabled (your IP address is shortened)
                                </p>
                                <p className="mb-3">
                                    Google Analytics uses cookies to analyze your usage behavior (e.g., page views, time spent, country of origin).
                                    Data is transferred to Google servers in the USA.
                                </p>
                                <p className="mb-3">
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. a GDPR (consent via cookie banner)<br />
                                    <strong>Data processing:</strong> Google has concluded a Data Processing Agreement with me
                                </p>
                                <p className="mb-3">
                                    <strong>Opt-out:</strong> You can disable Google Analytics by:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Declining in the cookie banner</li>
                                    <li>Deleting cookies in your browser</li>
                                    <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout?hl=en" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Analytics Opt-out Browser Add-on
                                    </a></li>
                                </ul>
                                <p className="mb-3">
                                    More info: <a href="https://policies.google.com/privacy?hl=en" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Privacy Policy
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">8. Google AdSense</h2>
                                <p className="mb-3">
                                    This website uses Google AdSense, a service for including advertisements from Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.
                                </p>
                                <p className="mb-3">
                                    <strong>Publisher ID:</strong> ca-pub-1511082465942403<br />
                                    <strong>Retention period:</strong> Up to 24 months
                                </p>
                                <p className="mb-3">
                                    Google AdSense uses cookies and web beacons to display interest-based advertising.
                                    Information about your usage behavior (e.g., visited pages) is transmitted to Google and stored on servers in the USA.
                                </p>
                                <p className="mb-3">
                                    <strong>Legal basis:</strong> Art. 6 para. 1 lit. a GDPR (consent via cookie banner)<br />
                                    <strong>Data processing:</strong> Google has concluded a Data Processing Agreement with me
                                </p>
                                <p className="mb-3">
                                    <strong>Disable personalized advertising:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Decline in the cookie banner</li>
                                    <li><a href="https://adssettings.google.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Ads Settings
                                    </a></li>
                                    <li><a href="https://optout.aboutads.info/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Network Advertising Initiative Opt-Out
                                    </a></li>
                                </ul>
                                <p className="mb-3">
                                    More info: <a href="https://policies.google.com/technologies/ads?hl=en" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Advertising
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">9. Data Transfer to the USA</h2>
                                <p className="mb-3">
                                    Through the use of Google Analytics, Google AdSense, and Google OAuth, personal data
                                    (e.g., IP address, usage behavior) is transferred to the USA.
                                </p>
                                <p className="mb-3">
                                    The USA is not classified by the European Commission as a country with an adequate level of data protection.
                                    The transfer is based on <strong>Standard Contractual Clauses (SCC)</strong> that Google has concluded with me.
                                </p>
                                <p className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
                                    <strong>Note:</strong> According to the ECJ, there is a risk of government access for surveillance purposes
                                    for data transfers to the USA, against which no effective legal remedies are available.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">10. Your Rights (under GDPR)</h2>
                                <p className="mb-3">You have the following rights regarding your personal data:</p>
                                <ul className="list-disc list-inside ml-4 mb-4 space-y-2">
                                    <li><strong>Access (Art. 15 GDPR):</strong> You can request information about your stored data at any time</li>
                                    <li><strong>Rectification (Art. 16 GDPR):</strong> You can request the correction of incorrect data</li>
                                    <li><strong>Erasure (Art. 17 GDPR):</strong> You can request the deletion of your data</li>
                                    <li><strong>Restriction (Art. 18 GDPR):</strong> You can request the restriction of processing</li>
                                    <li><strong>Data portability (Art. 20 GDPR):</strong> You can receive a copy of your data in machine-readable format</li>
                                    <li><strong>Objection (Art. 21 GDPR):</strong> You can object to the processing of your data</li>
                                    <li><strong>Withdrawal of consent (Art. 7 para. 3 GDPR):</strong> You can withdraw your consent at any time</li>
                                </ul>

                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <p className="mb-2"><strong>Account Deletion:</strong></p>
                                    <p className="mb-3">
                                        An automatic deletion function is currently in development.
                                        Until implementation, you can request the deletion of your account and all associated data (email, username, challenges)
                                        via email:
                                    </p>
                                    <p>
                                        <a href="mailto:niklasbeck18@gmail.com?subject=Account Deletion Request" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        I will process your request within 30 days.
                                    </p>
                                </div>

                                <p className="mt-4">
                                    <strong>Right to lodge a complaint with a supervisory authority:</strong><br />
                                    You have the right to lodge a complaint with a data protection supervisory authority:
                                </p>
                                <p className="mt-2">
                                    The State Commissioner for Data Protection Schleswig-Holstein<br />
                                    Holstenstraße 98, 24103 Kiel, Germany<br />
                                    Email: <a href="mailto:mail@datenschutzzentrum.de" className="text-blue-400 hover:underline">
                                        mail@datenschutzzentrum.de
                                    </a><br />
                                    Website: <a href="https://www.datenschutzzentrum.de/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                        www.datenschutzzentrum.de
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">11. SSL/TLS Encryption</h2>
                                <p className="mb-3">
                                    This website uses SSL/TLS encryption for security reasons.
                                    You can recognize an encrypted connection by the fact that the address bar changes from "http://" to "https://"
                                    and by the lock symbol in your browser.
                                </p>
                                <p>
                                    When SSL/TLS encryption is enabled, the data you transmit to us cannot be read by third parties.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">12. Changes to This Privacy Policy</h2>
                                <p className="mb-3">
                                    I reserve the right to adapt this privacy policy so that it always complies with current legal requirements
                                    or to implement changes to my services. The new privacy policy will apply to your next visit.
                                </p>
                                <p className="text-sm text-gray-400">
                                    <strong>Last updated:</strong> January 2025
                                </p>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatenschutzPage;