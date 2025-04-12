"use client";

import { useState } from "react";

const DatenschutzPage = () => {
    const [language, setLanguage] = useState("de"); // Default to German

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
                    {/* German Content */}
                    {language === "de" && (
                        <div>
                            <h2 className="text-xl font-semibold mt-2 mb-3 gold-text">
                                1. Datenschutz auf einen Blick
                            </h2>
                            <p className="text-white mb-4">
                                Der Schutz deiner persönlichen Daten ist mir ein wichtiges Anliegen. Diese Datenschutzerklärung informiert dich über Art, Umfang und Zwecke der Erhebung und Verwendung personenbezogener Daten auf dieser Website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                2. Verantwortlicher
                            </h2>
                            <p className="text-white mb-6">
                                <strong>Niklas Beck</strong>
                                <br />
                                Dorfstraße 140a
                                <br />
                                25569 Kreperheide
                                <br />
                                Deutschland
                                <br /><br />
                                <strong>E-Mail:</strong>{" "}
                                <a
                                    href="mailto:niklasbeck18@gmail.com"
                                    className="text-blue-400 hover:underline"
                                >
                                    niklasbeck18@gmail.com
                                </a>
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                3. Datenerfassung auf dieser Website
                            </h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">
                                Cookies
                            </h3>
                            <p className="text-white mb-4">
                                Diese Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf deinem Endgerät gespeichert werden und bestimmte Konfigurationen und Daten zum Austausch mit unserem System über deinen Browser speichern.
                            </p>
                            <p className="text-white mb-4">
                                Wir unterscheiden zwischen zwei Arten von Cookies:
                            </p>
                            <ul className="list-disc list-inside text-white mb-4 ml-4">
                                <li>Technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind</li>
                                <li>Optionale Cookies für Analyse- und Werbezwecke (z.B. für Google AdSense)</li>
                            </ul>
                            <p className="text-white mb-4">
                                Bei deinem ersten Besuch auf unserer Website erscheint ein Cookie-Banner, in dem du darüber informiert wirst, welche Cookies wir verwenden und wo du detaillierte Informationen dazu findest. Du hast die Möglichkeit, selbst zu entscheiden, welche Arten von Cookies du akzeptieren möchtest.
                            </p>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">
                                Server-Log-Dateien
                            </h3>
                            <p className="text-white mb-4">
                                Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die dein Browser automatisch übermittelt. Dies sind:
                            </p>
                            <ul className="list-disc list-inside text-white mb-4 ml-4">
                                <li>Browsertyp und -version</li>
                                <li>Verwendetes Betriebssystem</li>
                                <li>Referrer URL</li>
                                <li>Hostname des zugreifenden Rechners</li>
                                <li>Uhrzeit der Serveranfrage</li>
                                <li>IP-Adresse</li>
                            </ul>
                            <p className="text-white mb-6">
                                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                4. Analyse-Tools und Werbung
                            </h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">
                                Google AdSense
                            </h3>
                            <p className="text-white mb-4">
                                Diese Website nutzt Google AdSense, einen Dienst zum Einbinden von Werbeanzeigen der Google Ireland Limited ("Google"). Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                            </p>
                            <p className="text-white mb-4">
                                Google AdSense verwendet Cookies, die auf deinem Computer gespeichert werden und die eine Analyse der Benutzung der Website ermöglichen. Google AdSense verwendet auch sogenannte Web Beacons (unsichtbare Grafiken). Durch diese Web Beacons können Informationen wie der Besucherverkehr auf diesen Seiten ausgewertet werden.
                            </p>
                            <p className="text-white mb-4">
                                Die durch Cookies und Web Beacons erzeugten Informationen über die Benutzung dieser Website (einschließlich deiner IP-Adresse) und Auslieferung von Werbeformaten werden an einen Server von Google in den USA übertragen und dort gespeichert. Diese Informationen können von Google an Vertragspartner von Google weitergegeben werden. Google wird deine IP-Adresse jedoch nicht mit anderen von dir gespeicherten Daten zusammenführen.
                            </p>
                            <p className="text-white mb-4">
                                Die Speicherung von AdSense-Cookies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Wir haben ein berechtigtes Interesse an der Analyse des Nutzerverhaltens, um unser Webangebot und unsere Werbung zu optimieren. Wenn du eingewilligt hast, kannst du deine Einwilligung jederzeit widerrufen, indem du ein Opt-out-Cookie setzt oder deine Cookie-Einstellungen in deinem Browser änderst.
                            </p>
                            <p className="text-white mb-6">
                                Weitere Informationen zur Datennutzung durch Google, zu Einstellungs- und Widerspruchsmöglichkeiten findest du in der Datenschutzerklärung von Google: <a href="https://policies.google.com/privacy?hl=de" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy?hl=de</a>
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                5. Deine Rechte
                            </h2>
                            <p className="text-white mb-4">
                                Du hast jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten personenbezogenen Daten zu erhalten. Du hast außerdem ein Recht auf Berichtigung oder Löschung dieser Daten. Wenn du eine Einwilligung zur Datenverarbeitung erteilt hast, kannst du diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem hast du das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung deiner personenbezogenen Daten zu verlangen.
                            </p>
                            <p className="text-white mb-6">
                                Hierzu sowie zu weiteren Fragen zum Thema Datenschutz kannst du dich jederzeit an die im Impressum angegebene Adresse wenden.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                6. Hinweis zur Datenübertragung in die USA
                            </h2>
                            <p className="text-white mb-6">
                                Auf dieser Website werden unter anderem durch die Nutzung von Google AdSense Inhalte oder Dienste von Anbietern mit Sitz in den USA eingebunden. Die USA werden von der Europäischen Kommission nicht als Land mit einem angemessenen Datenschutzniveau nach Art. 45 DSGVO eingestuft. Die Übermittlung erfolgt unter anderem auf Grundlage von Standardvertragsklauseln, die von der EU-Kommission bereitgestellt werden.
                            </p>
                            <p className="text-white mb-6">
                                Bitte beachte, dass nach Auffassung des EuGH für Daten, die in die USA übermittelt werden, die Gefahr staatlicher Zugriffe zu Zwecken der Überwachung besteht, gegen die keine wirksamen Rechtsbehelfe zur Verfügung stehen. Dies können insbesondere Dienste wie Google AdSense betreffen.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                7. SSL- bzw. TLS-Verschlüsselung
                            </h2>
                            <p className="text-white mb-4">
                                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die du an mich als Seitenbetreiber sendest, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in deiner Browserzeile.
                            </p>
                            <p className="text-white mb-6">
                                Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die du an mich übermittelst, nicht von Dritten mitgelesen werden.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                8. Kontaktformular
                            </h2>
                            <p className="text-white mb-4">
                                Wenn du mir per Kontaktformular Anfragen zukommen lässt, werden deine Angaben aus dem Anfrageformular inklusive der von dir dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei mir gespeichert. Diese Daten gebe ich nicht ohne deine Einwilligung weiter.
                            </p>
                            <p className="text-white mb-6">
                                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern deine Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf meinem berechtigten Interesse an der effektiven Bearbeitung der an mich gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                9. Änderung dieser Datenschutzerklärung
                            </h2>
                            <p className="text-white mb-4">
                                Ich behalte mir vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen meiner Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services. Für deinen erneuten Besuch gilt dann die neue Datenschutzerklärung.
                            </p>
                            <p className="text-white">
                                Stand: April 2025
                            </p>
                        </div>
                    )}

                    {/* English Content */}
                    {language === "en" && (
                        <div>
                            <h2 className="text-xl font-semibold mt-2 mb-3 gold-text">
                                1. Privacy at a Glance
                            </h2>
                            <p className="text-white mb-4">
                                The protection of your personal data is important to me. This privacy policy informs you about the nature, scope, and purpose of the collection and use of personal data on this website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                2. Responsible Party
                            </h2>
                            <p className="text-white mb-6">
                                <strong>Niklas Beck</strong>
                                <br />
                                Dorfstraße 140a
                                <br />
                                25569 Kremperheide
                                <br />
                                Germany
                                <br /><br />
                                <strong>Email:</strong>{" "}
                                <a
                                    href="mailto:niklasbeck18@gmail.com"
                                    className="text-blue-400 hover:underline"
                                >
                                    niklasbeck18@gmail.com
                                </a>
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                3. Data Collection on This Website
                            </h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">
                                Cookies
                            </h3>
                            <p className="text-white mb-4">
                                This website uses cookies. These are small text files that are stored on your device and store certain configurations and data for exchange with our system via your browser.
                            </p>
                            <p className="text-white mb-4">
                                We distinguish between two types of cookies:
                            </p>
                            <ul className="list-disc list-inside text-white mb-4 ml-4">
                                <li>Technically necessary cookies required for the operation of the website</li>
                                <li>Optional cookies for analytics and advertising purposes (e.g., for Google AdSense)</li>
                            </ul>
                            <p className="text-white mb-4">
                                When you first visit our website, a cookie banner appears informing you about the cookies we use and where you can find detailed information about them. You have the option to decide which types of cookies you want to accept.
                            </p>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">
                                Server Log Files
                            </h3>
                            <p className="text-white mb-4">
                                The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits. These are:
                            </p>
                            <ul className="list-disc list-inside text-white mb-4 ml-4">
                                <li>Browser type and version</li>
                                <li>Operating system used</li>
                                <li>Referrer URL</li>
                                <li>Hostname of the accessing computer</li>
                                <li>Time of the server request</li>
                                <li>IP address</li>
                            </ul>
                            <p className="text-white mb-6">
                                This data is not merged with other data sources. The collection of this data is based on Art. 6 para. 1 lit. f GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of his website - for this purpose, the server log files must be collected.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                4. Analytics and Advertising
                            </h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">
                                Google AdSense
                            </h3>
                            <p className="text-white mb-4">
                                This website uses Google AdSense, a service for including advertisements from Google Ireland Limited ("Google"). The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.
                            </p>
                            <p className="text-white mb-4">
                                Google AdSense uses cookies that are stored on your computer and that enable an analysis of the use of the website. Google AdSense also uses web beacons (invisible graphics). These web beacons can be used to evaluate information such as visitor traffic on these pages.
                            </p>
                            <p className="text-white mb-4">
                                The information generated by cookies and web beacons about the use of this website (including your IP address) and the delivery of advertising formats are transmitted to a Google server in the USA and stored there. This information may be passed on by Google to contractual partners of Google. However, Google will not merge your IP address with other data stored by you.
                            </p>
                            <p className="text-white mb-4">
                                AdSense cookies are stored based on Art. 6 para. 1 lit. a GDPR (consent) and Art. 6 para. 1 lit. f GDPR (legitimate interest). We have a legitimate interest in analyzing user behavior in order to optimize both our website and our advertising. If you have given your consent, you can revoke it at any time by setting an opt-out cookie or by changing your cookie settings in your browser.
                            </p>
                            <p className="text-white mb-6">
                                For more information about how Google uses data and your settings and opt-out options, please see Google's privacy policy: <a href="https://policies.google.com/privacy?hl=en" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy?hl=en</a>
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                5. Your Rights
                            </h2>
                            <p className="text-white mb-4">
                                You have the right to receive information about the origin, recipients, and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent for data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances.
                            </p>
                            <p className="text-white mb-6">
                                For this and other questions regarding data protection, you can contact the address given in the legal notice at any time.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                6. Note on Data Transfer to the USA
                            </h2>
                            <p className="text-white mb-4">
                                Among other things, this website incorporates content or services from providers based in the USA through the use of Google AdSense. The USA is not classified by the European Commission as a country with an adequate level of data protection according to Art. 45 GDPR. The transfer is based, among other things, on standard contractual clauses provided by the EU Commission.
                            </p>
                            <p className="text-white mb-6">
                                Please note that according to the ECJ, there is a risk of government access for surveillance purposes for data transferred to the USA, against which no effective legal remedies are available. This may particularly affect services such as Google AdSense.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                7. SSL or TLS Encryption
                            </h2>
                            <p className="text-white mb-4">
                                This site uses SSL or TLS encryption for security reasons and to protect the transmission of confidential content, such as requests you send to me as the site operator. You can recognize an encrypted connection by the fact that the address line of the browser changes from "http://" to "https://" and by the lock symbol in your browser line.
                            </p>
                            <p className="text-white mb-6">
                                When SSL or TLS encryption is activated, the data you transmit to me cannot be read by third parties.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                8. Contact Form
                            </h2>
                            <p className="text-white mb-4">
                                If you send me inquiries via the contact form, your information from the inquiry form, including the contact data you provide there, will be stored by me for the purpose of processing the inquiry and in case of follow-up questions. I will not share this data without your consent.
                            </p>
                            <p className="text-white mb-6">
                                The processing of this data is based on Art. 6 para. 1 lit. b GDPR, if your request is related to the fulfillment of a contract or is necessary for the implementation of pre-contractual measures. In all other cases, the processing is based on my legitimate interest in the effective processing of the inquiries addressed to me (Art. 6 para. 1 lit. f GDPR) or on your consent (Art. 6 para. 1 lit. a GDPR).
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                9. Changes to This Privacy Policy
                            </h2>
                            <p className="text-white mb-4">
                                I reserve the right to adapt this privacy policy so that it always complies with current legal requirements or to implement changes to my services in the privacy policy, e.g., when introducing new services. The new privacy policy will then apply to your next visit.
                            </p>
                            <p className="text-white">
                                Last updated: April 2025
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatenschutzPage;