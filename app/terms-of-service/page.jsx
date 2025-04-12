"use client";

import { useState } from "react";

const TermsOfServicePage = () => {
    const [language, setLanguage] = useState("de"); // Default to German

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold gold-shimmer-text">
                        {language === "de" ? "Nutzungsbedingungen" : "Terms of Service"}
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
                                1. Geltungsbereich
                            </h2>
                            <p className="text-white mb-4">
                                Diese Nutzungsbedingungen regeln die Nutzung der Website www.mketzer.com, betrieben von Michael Ketzer, Rotkehlchenweg 51, 40789 Monheim am Rhein, Deutschland. Mit dem Zugriff auf diese Website erklärst du dich mit diesen Nutzungsbedingungen einverstanden. Falls du mit den Bedingungen nicht einverstanden bist, nutze diese Website bitte nicht.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                2. Inhalte und Nutzung
                            </h2>
                            <p className="text-white mb-4">
                                Alle Inhalte dieser Website dienen ausschließlich Informationszwecken. Obwohl ich mich bemühe, genaue und aktuelle Informationen bereitzustellen, übernehme ich keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte.
                            </p>
                            <p className="text-white mb-6">
                                Die Nutzung der auf dieser Website zur Verfügung gestellten Inhalte erfolgt auf eigene Gefahr. Für Schäden, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen entstehen, hafte ich nur bei Vorsatz oder grober Fahrlässigkeit.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                3. Urheberrecht
                            </h2>
                            <p className="text-white mb-4">
                                Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Jede Art der Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                            </p>
                            <p className="text-white mb-6">
                                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                4. Externe Links
                            </h2>
                            <p className="text-white mb-4">
                                Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                            </p>
                            <p className="text-white mb-6">
                                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                5. Werbung und Google AdSense
                            </h2>
                            <p className="text-white mb-4">
                                Diese Website kann Werbung enthalten, einschließlich personalisierter Anzeigen durch Google AdSense. Google verwendet Cookies und ähnliche Technologien, um Anzeigen basierend auf deinen vorherigen Besuchen dieser und anderer Websites zu schalten.
                            </p>
                            <p className="text-white mb-6">
                                Google und seine Partner können auch Cookies für Werbemessungen, Personalisierung und Berichterstattung verwenden. Weitere Informationen darüber, wie Google deine Daten verwendet, findest du in der Google-Datenschutzerklärung unter https://policies.google.com/privacy.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                6. Cookies und Tracking
                            </h2>
                            <p className="text-white mb-4">
                                Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern und bestimmte Funktionen anzubieten. Einige Cookies sind für den Betrieb der Website technisch notwendig, während andere zur Analyse des Nutzerverhaltens und zur Anzeige personalisierter Werbung verwendet werden können.
                            </p>
                            <p className="text-white mb-6">
                                Nähere Informationen zu den verwendeten Cookies findest du in unserer Datenschutzerklärung und im Cookie-Banner beim Besuch der Website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                7. Änderungsvorbehalte
                            </h2>
                            <p className="text-white mb-4">
                                Ich behalte mir vor, diese Nutzungsbedingungen jederzeit und ohne Nennung von Gründen zu ändern. Die geänderten Bedingungen werden auf dieser Seite veröffentlicht. Bitte überprüfe diese Seite regelmäßig auf Änderungen.
                            </p>
                            <p className="text-white mb-6">
                                Die weitere Nutzung der Website nach Änderung der Nutzungsbedingungen gilt als Zustimmung zu den geänderten Bedingungen.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                8. Anwendbares Recht
                            </h2>
                            <p className="text-white mb-4">
                                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Bei Verbrauchern gilt diese Rechtswahl nur, soweit hierdurch der durch zwingende Bestimmungen des Rechts des Staates des gewöhnlichen Aufenthaltes des Verbrauchers gewährte Schutz nicht entzogen wird.
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
                                1. Scope
                            </h2>
                            <p className="text-white mb-4">
                                These Terms of Service govern the use of the website www.mketzer.com, operated by Michael Ketzer, Rotkehlchenweg 51, 40789 Monheim am Rhein, Germany. By accessing this website, you agree to these Terms of Service. If you do not agree with these terms, please do not use this website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                2. Content and Use
                            </h2>
                            <p className="text-white mb-4">
                                All content on this website is for informational purposes only. Although I strive to provide accurate and up-to-date information, I make no warranties regarding the accuracy, completeness, and timeliness of the content provided.
                            </p>
                            <p className="text-white mb-6">
                                The use of the content provided on this website is at your own risk. I am only liable for damages resulting from the use or non-use of the information presented in cases of intentional or gross negligence.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                3. Copyright
                            </h2>
                            <p className="text-white mb-4">
                                The content and works published on this website are subject to German copyright law. Any type of reproduction, processing, distribution, and any kind of exploitation beyond the limits of copyright law require the written consent of the respective author or creator.
                            </p>
                            <p className="text-white mb-6">
                                Downloads and copies of this site are only permitted for private, non-commercial use.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                4. External Links
                            </h2>
                            <p className="text-white mb-4">
                                This website contains links to external third-party websites over whose content I have no influence. Therefore, I cannot accept any liability for these external contents. The respective provider or operator of the linked pages is always responsible for their content.
                            </p>
                            <p className="text-white mb-6">
                                The linked pages were checked for possible legal violations at the time of linking. Illegal content was not apparent at the time the links were created. However, a permanent content control of the linked pages is not reasonable without concrete indications of a legal violation.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                5. Advertising and Google AdSense
                            </h2>
                            <p className="text-white mb-4">
                                This website may contain advertising, including personalized ads through Google AdSense. Google uses cookies and similar technologies to serve ads based on your prior visits to this and other websites.
                            </p>
                            <p className="text-white mb-6">
                                Google and its partners may also use cookies for ad measurement, personalization, and reporting. For more information about how Google uses your data, please see Google's Privacy Policy at https://policies.google.com/privacy.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                6. Cookies and Tracking
                            </h2>
                            <p className="text-white mb-4">
                                This website uses cookies to improve the user experience and provide certain features. Some cookies are technically necessary for the operation of the website, while others may be used to analyze user behavior and display personalized advertising.
                            </p>
                            <p className="text-white mb-6">
                                For more information about the cookies used, please refer to our Privacy Policy and the Cookie Banner when visiting the website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                7. Reservation of Changes
                            </h2>
                            <p className="text-white mb-4">
                                I reserve the right to change these Terms of Service at any time and without stating reasons. The amended terms will be published on this page. Please check this page regularly for changes.
                            </p>
                            <p className="text-white mb-6">
                                Continued use of the website after changes to the Terms of Service constitutes acceptance of the amended terms.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                                8. Applicable Law
                            </h2>
                            <p className="text-white mb-4">
                                German law applies to the exclusion of the UN Convention on Contracts for the International Sale of Goods. For consumers, this choice of law applies only insofar as the protection provided by mandatory provisions of the law of the state of the consumer's habitual residence is not withdrawn.
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

export default TermsOfServicePage;