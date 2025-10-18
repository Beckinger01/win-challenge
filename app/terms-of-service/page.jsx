"use client";

import { useState } from "react";
import Link from "next/link";

const TermsOfServicePage = () => {
    const [language, setLanguage] = useState("de");

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold gold-shimmer-text">
                        {language === "de" ? "Nutzungsbedingungen (AGB)" : "Terms of Service"}
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
                                <h2 className="text-2xl font-bold gold-text mb-4">1. Geltungsbereich</h2>
                                <p className="mb-3">
                                    Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Website <strong>www.yourwinchallenge.com</strong>
                                    und der darauf angebotenen Dienste ("Win-Challenge"), betrieben von:
                                </p>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg mb-3">
                                    <p><strong>Niklas Beck</strong></p>
                                    <p>Dorfstraße 140a</p>
                                    <p>25569 Kremperheide</p>
                                    <p>Deutschland</p>
                                    <p className="mt-2">
                                        E-Mail: <a href="mailto:niklasbeck18@gmail.com" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                </div>
                                <p>
                                    Mit der Nutzung dieser Website und der Registrierung eines Benutzerkontos erklärst du dich mit diesen Nutzungsbedingungen einverstanden.
                                    Falls du mit den Bedingungen nicht einverstanden bist, darfst du diese Website nicht nutzen.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">2. Beschreibung der Dienste</h2>
                                <p className="mb-3">
                                    Win-Challenge ist eine Plattform für Gaming-Challenges, auf der du:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Ein Benutzerkonto erstellen kannst (via E-Mail oder Google OAuth)</li>
                                    <li>Eigene Videospiel-Challenges erstellen, verwalten und löschen kannst</li>
                                    <li>Challenges anderer Nutzer ansehen und daran teilnehmen kannst</li>
                                    <li>Deine Erfolge und Statistiken verfolgen kannst</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Beispiele für Challenges:</strong> "Hole einen Sieg in Fortnite", "Erreiche Level 50 in Game XY", "Gewinne 5 Matches hintereinander"
                                </p>
                                <p>
                                    Die Nutzung der Plattform ist derzeit kostenlos. Ich behalte mir vor, in Zukunft kostenpflichtige Premium-Funktionen anzubieten.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">3. Registrierung und Benutzerkonto</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">3.1 Altersvoraussetzung</h3>
                                <p className="mb-3">
                                    Um dich bei Win-Challenge zu registrieren, musst du <strong>mindestens 16 Jahre alt</strong> sein.
                                    Für Minderjährige unter 18 Jahren ist die Zustimmung der Erziehungsberechtigten erforderlich.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">3.2 Registrierungsmöglichkeiten</h3>
                                <p className="mb-3">Du kannst dich auf folgende Arten registrieren:</p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>E-Mail-Registrierung:</strong> Mit E-Mail-Adresse, selbstgewähltem Benutzernamen und Passwort</li>
                                    <li><strong>Google OAuth:</strong> Mit deinem Google-Konto (E-Mail, Google-Name als Username, Google-ID)</li>
                                </ul>
                                <p className="mb-3">
                                    Du verpflichtest dich, wahrheitsgemäße und vollständige Angaben zu machen und diese bei Änderungen zu aktualisieren.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">3.3 Account-Sicherheit</h3>
                                <p className="mb-3">
                                    Du bist für die Geheimhaltung deines Passworts und für alle Aktivitäten unter deinem Account verantwortlich.
                                    Bei Verdacht auf unbefugte Nutzung deines Accounts musst du mich unverzüglich informieren.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">3.4 Username</h3>
                                <p className="mb-3">
                                    Bei E-Mail-Registrierung wählst du deinen Username selbst. Bei Google-Anmeldung wird dein Google-Name als Username verwendet,
                                    den du anschließend in den Einstellungen ändern kannst.
                                </p>
                                <p className="mb-3">
                                    Dein Username darf keine beleidigenden, diskriminierenden oder irreführenden Inhalte enthalten.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">4. Erstellung und Nutzung von Challenges</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">4.1 Challenge-Erstellung</h3>
                                <p className="mb-3">
                                    Als registrierter Nutzer kannst du Videospiel-Challenges erstellen, die folgende Informationen enthalten:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Challenge-Name</li>
                                    <li>Beschreibung der Challenge</li>
                                    <li>Dauer/Zeitlimit</li>
                                    <li>Startdatum</li>
                                    <li>Spiel(e)</li>
                                    <li>Timer-Einstellungen</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.2 Verbotene Inhalte</h3>
                                <p className="mb-3">
                                    Bei der Erstellung von Challenges sind folgende Inhalte <strong>streng verboten</strong>:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Gewaltverherrlichende, pornografische oder sexuell anzügliche Inhalte</li>
                                    <li>Rassistische, diskriminierende oder hasserfüllte Inhalte</li>
                                    <li>Beleidigungen, Bedrohungen oder Belästigungen</li>
                                    <li>Illegale Aktivitäten oder Aufforderungen zu Straftaten</li>
                                    <li>Spam, Betrug oder irreführende Informationen</li>
                                    <li>Verstöße gegen geltendes Recht oder Rechte Dritter</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.3 Moderation</h3>
                                <p className="mb-3">
                                    Es gibt keine automatische Moderation von Challenges. Ich behalte mir jedoch das Recht vor,
                                    Challenges <strong>ohne Vorankündigung zu löschen</strong>, wenn ich der Meinung bin, dass sie gegen diese Nutzungsbedingungen verstoßen
                                    oder unangemessen sind.
                                </p>
                                <p className="mb-3">
                                    Eine Melde-Funktion für Nutzer ist derzeit nicht vorhanden. Bei Verstößen kannst du mich direkt per E-Mail kontaktieren.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.4 Verwaltung deiner Challenges</h3>
                                <p className="mb-3">
                                    Du kannst deine eigenen Challenges jederzeit bearbeiten oder löschen. Gelöschte Challenges können nicht wiederhergestellt werden.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.5 Kopieren von Challenges</h3>
                                <p className="mb-3">
                                    Nutzer dürfen Challenge-Namen und -Inhalte frei kopieren und für eigene Challenges verwenden.
                                    Mit der Erstellung einer Challenge stimmst du dieser freien Verwendung zu.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">5. Geistiges Eigentum und Lizenzen</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">5.1 Deine Inhalte</h3>
                                <p className="mb-3">
                                    Du behältst alle Rechte an den von dir erstellten Challenges und Inhalten. Mit der Veröffentlichung auf Win-Challenge
                                    gewährst du mir jedoch eine <strong>weltweite, nicht-exklusive, kostenlose Lizenz</strong>, diese Inhalte auf der Plattform
                                    anzuzeigen, zu speichern und anderen Nutzern zugänglich zu machen.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">5.2 Plattform-Inhalte</h3>
                                <p className="mb-3">
                                    Alle Inhalte der Website Win-Challenge (Design, Logo, Code, Texte) sind urheberrechtlich geschützt und gehören mir
                                    oder meinen Lizenzgebern. Eine Nutzung ohne meine ausdrückliche Zustimmung ist nicht gestattet.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">6. Haftung und Gewährleistung</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">6.1 Verfügbarkeit</h3>
                                <p className="mb-3">
                                    Ich bemühe mich, Win-Challenge durchgehend verfügbar zu halten, übernehme jedoch <strong>keine Garantie</strong> für
                                    die ständige Verfügbarkeit oder Fehlerfreiheit der Plattform. Es kann zu Wartungsarbeiten, technischen Störungen oder
                                    Ausfällen kommen.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">6.2 Nutzung auf eigene Gefahr</h3>
                                <p className="mb-3">
                                    Die Teilnahme an Challenges erfolgt <strong>auf eigene Gefahr</strong>. Ich übernehme keine Haftung für:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Verletzungen oder Schäden bei der Durchführung von Challenges</li>
                                    <li>Verlust von Spielfortschritten oder Daten</li>
                                    <li>Konflikte zwischen Nutzern</li>
                                    <li>Verstöße gegen Nutzungsbedingungen von Drittanbieter-Spielen</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">6.3 Haftungsbeschränkung</h3>
                                <p className="mb-3">
                                    Ich hafte nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung für einfache Fahrlässigkeit ist ausgeschlossen,
                                    außer bei Verletzung wesentlicher Vertragspflichten oder Schäden an Leben, Körper oder Gesundheit.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">6.4 Inhalte Dritter</h3>
                                <p className="mb-3">
                                    Für Inhalte, die von anderen Nutzern erstellt wurden (Challenges, Usernames, etc.), übernehme ich keine Haftung.
                                    Die Nutzer sind selbst für ihre Inhalte verantwortlich.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">7. Account-Sperrung und -Löschung</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">7.1 Sperrung</h3>
                                <p className="mb-3">
                                    Ich behalte mir das Recht vor, deinen Account <strong>ohne Vorankündigung zu sperren oder zu löschen</strong>, wenn:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Du gegen diese Nutzungsbedingungen verstößt</li>
                                    <li>Du verbotene Inhalte erstellst oder verbreitest</li>
                                    <li>Du andere Nutzer belästigst oder beleidigst</li>
                                    <li>Du die Plattform missbräuchlich nutzt (z.B. Spam, Manipulation)</li>
                                    <li>Ein berechtigtes Interesse an der Sperrung besteht</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">7.2 Account-Löschung durch dich</h3>
                                <p className="mb-3">
                                    Du kannst die Löschung deines Accounts jederzeit per E-Mail an{" "}
                                    <a href="mailto:niklasbeck18@gmail.com?subject=Account-Löschung" className="text-blue-400 hover:underline">
                                        niklasbeck18@gmail.com
                                    </a>{" "}
                                    beantragen. Eine automatische Löschfunktion ist derzeit in Entwicklung.
                                </p>
                                <p className="mb-3">
                                    Bei Account-Löschung werden alle deine Daten (E-Mail, Username, Challenges) innerhalb von 30 Tagen vollständig gelöscht.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">8. Datenschutz</h2>
                                <p className="mb-3">
                                    Der Schutz deiner persönlichen Daten ist mir wichtig. Detaillierte Informationen zur Datenverarbeitung findest du in unserer{" "}
                                    <Link href="/data-policy" className="text-blue-400 hover:underline">
                                        Datenschutzerklärung
                                    </Link>.
                                </p>
                                <p className="mb-3">
                                    Mit der Nutzung von Win-Challenge stimmst du der Verarbeitung deiner Daten gemäß der Datenschutzerklärung zu.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">9. Änderungen der Nutzungsbedingungen</h2>
                                <p className="mb-3">
                                    Ich behalte mir vor, diese Nutzungsbedingungen jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht
                                    und gelten ab dem Zeitpunkt der Veröffentlichung.
                                </p>
                                <p className="mb-3">
                                    Bei wesentlichen Änderungen werde ich dich per E-Mail informieren. Die weitere Nutzung der Plattform nach einer Änderung
                                    gilt als Zustimmung zu den neuen Bedingungen.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">10. Werbung</h2>
                                <p className="mb-3">
                                    Diese Website kann Werbung enthalten, einschließlich personalisierter Anzeigen durch Google AdSense.
                                    Du stimmst zu, dass Werbung auf der Plattform angezeigt werden darf.
                                </p>
                                <p className="mb-3">
                                    Weitere Informationen zu Cookies und Tracking findest du in unserer{" "}
                                    <Link href="/data-policy" className="text-blue-400 hover:underline">
                                        Datenschutzerklärung
                                    </Link>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">11. Schlussbestimmungen</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">11.1 Anwendbares Recht</h3>
                                <p className="mb-3">
                                    Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                                    Bei Verbrauchern gilt diese Rechtswahl nur, soweit hierdurch der durch zwingende Bestimmungen des Rechts des Staates
                                    des gewöhnlichen Aufenthaltes des Verbrauchers gewährte Schutz nicht entzogen wird.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">11.2 Gerichtsstand</h3>
                                <p className="mb-3">
                                    Gerichtsstand ist Itzehoe, Deutschland, soweit du Kaufmann, juristische Person des öffentlichen Rechts oder
                                    öffentlich-rechtliches Sondervermögen bist.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">11.3 Salvatorische Klausel</h3>
                                <p className="mb-3">
                                    Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der
                                    übrigen Bestimmungen davon unberührt.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">12. Kontakt</h2>
                                <p className="mb-3">
                                    Bei Fragen zu diesen Nutzungsbedingungen oder bei Problemen mit deinem Account kannst du mich jederzeit kontaktieren:
                                </p>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <p><strong>Niklas Beck</strong></p>
                                    <p>E-Mail:{" "}
                                        <a href="mailto:niklasbeck18@gmail.com" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                </div>
                                <p className="text-sm text-gray-400 mt-4">
                                    <strong>Stand:</strong> Januar 2025
                                </p>
                            </section>
                        </div>
                    )}

                    {language === "en" && (
                        <div className="text-white space-y-6">
                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">1. Scope</h2>
                                <p className="mb-3">
                                    These Terms of Service (TOS) govern the use of the website <strong>www.yourwinchallenge.com</strong>
                                    and the services offered on it ("Win-Challenge"), operated by:
                                </p>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg mb-3">
                                    <p><strong>Niklas Beck</strong></p>
                                    <p>Dorfstraße 140a</p>
                                    <p>25569 Kremperheide</p>
                                    <p>Germany</p>
                                    <p className="mt-2">
                                        E-mail: <a href="mailto:niklasbeck18@gmail.com" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                </div>
                                <p>
                                    By using this website and creating a user account, you agree to these Terms of Service.
                                    If you do not agree with the terms, you may not use this website.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">2. Description of Services</h2>
                                <p className="mb-3">
                                    Win-Challenge is a platform for gaming challenges where you can:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Create a user account (via email or Google OAuth)</li>
                                    <li>Create, manage, and delete your own video game challenges</li>
                                    <li>View and participate in other users’ challenges</li>
                                    <li>Track your achievements and statistics</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Examples of challenges:</strong> “Get a Victory Royale in Fortnite,” “Reach level 50 in Game XY,” “Win 5 matches in a row.”
                                </p>
                                <p>
                                    The use of the platform is currently free of charge. I reserve the right to introduce paid premium features in the future.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">3. Registration and User Account</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">3.1 Age Requirement</h3>
                                <p className="mb-3">
                                    To register on Win-Challenge, you must be <strong>at least 16 years old</strong>.
                                    For minors under 18, parental consent is required.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">3.2 Registration Options</h3>
                                <p className="mb-3">You can register in the following ways:</p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li><strong>Email registration:</strong> With your email address, chosen username, and password</li>
                                    <li><strong>Google OAuth:</strong> Using your Google account (email, Google name as username, Google ID)</li>
                                </ul>
                                <p className="mb-3">
                                    You agree to provide truthful and complete information and to update it if any changes occur.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">3.3 Account Security</h3>
                                <p className="mb-3">
                                    You are responsible for keeping your password confidential and for all activities under your account.
                                    If you suspect unauthorized use of your account, you must notify me immediately.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">3.4 Username</h3>
                                <p className="mb-3">
                                    When registering via email, you choose your own username. When registering via Google, your Google name will be used as your username,
                                    which you can later change in the settings.
                                </p>
                                <p className="mb-3">
                                    Your username may not contain offensive, discriminatory, or misleading content.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">4. Creating and Using Challenges</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">4.1 Challenge Creation</h3>
                                <p className="mb-3">
                                    As a registered user, you can create video game challenges that include the following information:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Challenge name</li>
                                    <li>Description of the challenge</li>
                                    <li>Duration/time limit</li>
                                    <li>Start date</li>
                                    <li>Game(s)</li>
                                    <li>Timer settings</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.2 Prohibited Content</h3>
                                <p className="mb-3">
                                    The following content is <strong>strictly prohibited</strong> when creating challenges:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Violent, pornographic, or sexually suggestive content</li>
                                    <li>Racist, discriminatory, or hateful content</li>
                                    <li>Insults, threats, or harassment</li>
                                    <li>Illegal activities or incitement to commit crimes</li>
                                    <li>Spam, fraud, or misleading information</li>
                                    <li>Violations of applicable laws or third-party rights</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.3 Moderation</h3>
                                <p className="mb-3">
                                    There is no automatic moderation of challenges. However, I reserve the right to
                                    <strong>delete challenges without prior notice</strong> if I believe they violate these Terms of Service
                                    or are otherwise inappropriate.
                                </p>
                                <p className="mb-3">
                                    A user reporting function is currently not available. If you notice violations, you can contact me directly via email.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.4 Managing Your Challenges</h3>
                                <p className="mb-3">
                                    You can edit or delete your own challenges at any time. Deleted challenges cannot be restored.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">4.5 Copying Challenges</h3>
                                <p className="mb-3">
                                    Users may freely copy challenge names and content to create their own challenges.
                                    By creating a challenge, you agree to this free reuse.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">5. Intellectual Property and Licenses</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">5.1 Your Content</h3>
                                <p className="mb-3">
                                    You retain all rights to the challenges and content you create. By publishing them on Win-Challenge,
                                    you grant me a <strong>worldwide, non-exclusive, royalty-free license</strong> to display, store,
                                    and make them available to other users on the platform.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">5.2 Platform Content</h3>
                                <p className="mb-3">
                                    All content on the Win-Challenge website (design, logo, code, texts) is protected by copyright
                                    and owned by me or my licensors. Use without my express permission is not allowed.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">6. Liability and Warranty</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">6.1 Availability</h3>
                                <p className="mb-3">
                                    I strive to keep Win-Challenge available at all times, but I <strong>do not guarantee</strong>
                                    continuous availability or error-free operation. Downtime may occur due to maintenance, technical issues, or outages.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">6.2 Use at Your Own Risk</h3>
                                <p className="mb-3">
                                    Participation in challenges is <strong>at your own risk</strong>. I assume no liability for:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>Injuries or damages incurred during participation</li>
                                    <li>Loss of game progress or data</li>
                                    <li>Conflicts between users</li>
                                    <li>Violations of third-party game terms of service</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">6.3 Limitation of Liability</h3>
                                <p className="mb-3">
                                    I am only liable in cases of intent or gross negligence. Liability for simple negligence is excluded,
                                    except for breaches of essential contractual obligations or damage to life, body, or health.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">6.4 Third-Party Content</h3>
                                <p className="mb-3">
                                    I am not liable for content created by other users (challenges, usernames, etc.).
                                    Users are solely responsible for their content.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">7. Account Suspension and Deletion</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">7.1 Suspension</h3>
                                <p className="mb-3">
                                    I reserve the right to <strong>suspend or delete your account without prior notice</strong> if:
                                </p>
                                <ul className="list-disc list-inside ml-4 mb-3 space-y-1">
                                    <li>You violate these Terms of Service</li>
                                    <li>You create or distribute prohibited content</li>
                                    <li>You harass or insult other users</li>
                                    <li>You misuse the platform (e.g. spam, manipulation)</li>
                                    <li>A legitimate interest in suspension exists</li>
                                </ul>

                                <h3 className="text-lg font-semibold mb-2 mt-4">7.2 Account Deletion by You</h3>
                                <p className="mb-3">
                                    You can request the deletion of your account at any time by emailing{" "}
                                    <a href="mailto:niklasbeck18@gmail.com?subject=Account Deletion" className="text-blue-400 hover:underline">
                                        niklasbeck18@gmail.com
                                    </a>.
                                    An automated deletion feature is currently in development.
                                </p>
                                <p className="mb-3">
                                    Upon deletion, all your data (email, username, challenges) will be permanently deleted within 30 days.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">8. Data Protection</h2>
                                <p className="mb-3">
                                    Protecting your personal data is important to me. Detailed information on data processing can be found in our{" "}
                                    <Link href="/data-policy" className="text-blue-400 hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </p>
                                <p className="mb-3">
                                    By using Win-Challenge, you agree to the processing of your data in accordance with the Privacy Policy.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">9. Changes to the Terms of Service</h2>
                                <p className="mb-3">
                                    I reserve the right to modify these Terms of Service at any time.
                                    Changes will be published on this page and take effect upon publication.
                                </p>
                                <p className="mb-3">
                                    For significant changes, I will notify you by email. Continued use of the platform after a change
                                    constitutes acceptance of the new terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">10. Advertising</h2>
                                <p className="mb-3">
                                    This website may contain advertisements, including personalized ads through Google AdSense.
                                    You agree that advertising may be displayed on the platform.
                                </p>
                                <p className="mb-3">
                                    Further information on cookies and tracking can be found in our{" "}
                                    <Link href="/data-policy" className="text-blue-400 hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">11. Final Provisions</h2>
                                <h3 className="text-lg font-semibold mb-2 mt-4">11.1 Applicable Law</h3>
                                <p className="mb-3">
                                    The laws of the Federal Republic of Germany apply, excluding the UN Convention on Contracts for the International Sale of Goods.
                                    For consumers, this choice of law applies only if it does not deprive them of mandatory protections
                                    granted by the law of their habitual residence.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">11.2 Jurisdiction</h3>
                                <p className="mb-3">
                                    The place of jurisdiction is Itzehoe, Germany, if you are a merchant, a legal entity under public law,
                                    or a public special fund.
                                </p>

                                <h3 className="text-lg font-semibold mb-2 mt-4">11.3 Severability Clause</h3>
                                <p className="mb-3">
                                    Should any provision of these Terms of Service be or become invalid,
                                    the validity of the remaining provisions shall not be affected.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold gold-text mb-4">12. Contact</h2>
                                <p className="mb-3">
                                    If you have questions about these Terms of Service or problems with your account, you can contact me anytime:
                                </p>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <p><strong>Niklas Beck</strong></p>
                                    <p>Email:{" "}
                                        <a href="mailto:niklasbeck18@gmail.com" className="text-blue-400 hover:underline">
                                            niklasbeck18@gmail.com
                                        </a>
                                    </p>
                                </div>
                                <p className="text-sm text-gray-400 mt-4">
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

export default TermsOfServicePage;