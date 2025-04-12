"use client";

import { useState } from "react";

const ImpressumPage = () => {
  const [language, setLanguage] = useState("de"); // Default to German

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gold-shimmer-text">
            {language === "de" ? "Impressum" : "Legal Notice (Impressum)"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("de")}
              className={`px-3 py-1 rounded-md transition-colors ${
                language === "de"
                  ? "gold-bg text-black"
                  : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
              }`}
            >
              Deutsch
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-md transition-colors ${
                language === "en"
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
                Angaben gemäß § 5 TMG
              </h2>
              <p className="text-white mb-6">
                <strong>Niklas Beck</strong>
                <br />
                Dorfstraße 140a
                <br />
                25569 Kremperheide
                <br />
                Deutschland
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Kontakt
              </h2>
              <p className="text-white mb-2">
                <strong>Telefon:</strong> 015252590744{" "}
                <span className="text-gray-400 text-sm italic">
                  *(Angabe gemäß § 5 TMG – bitte keine Werbeanrufe)*
                </span>
              </p>
              <p className="text-white mb-2">
                <strong>E-Mail:</strong>{" "}
                <a
                  href="mailto:niklasbeck18@gmail.com"
                  className="text-blue-400 hover:underline"
                >
                  niklasbeck18@gmail.com
                </a>
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Streitbeilegung
              </h2>
              <p className="text-white mb-6">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Haftung für Inhalte
              </h2>
              <p className="text-white mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf dieser Website nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="text-white mb-6">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Haftung für Links
              </h2>
              <p className="text-white mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Daher können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p className="text-white mb-6">
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Urheberrecht
              </h2>
              <p className="text-white mb-4">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p className="text-white mb-4">
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Inhalte Dritter sind als solche gekennzeichnet.
              </p>
              <p className="text-white">
                Solltest du trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          )}

          {/* English Content */}
          {language === "en" && (
            <div>
              <h2 className="text-xl font-semibold mt-2 mb-3 gold-text">
                Information according to § 5 TMG
              </h2>
              <p className="text-white mb-6">
                <strong>Niklas Beck</strong>
                <br />
                Dorfstraße 140a
                <br />
                25569 Kremperheide
                <br />
                Germany
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Contact
              </h2>
              <p className="text-white mb-2">
                <strong>Phone:</strong> 015252590744{" "}
                <span className="text-gray-400 text-sm italic">
                  *(Please no advertising calls)*
                </span>
              </p>
              <p className="text-white mb-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:niklasbeck18@gmail.com"
                  className="text-blue-400 hover:underline"
                >
                  niklasbeck18@gmail.com
                </a>
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Dispute Resolution
              </h2>
              <p className="text-white mb-6">
                We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Liability for Content
              </h2>
              <p className="text-white mb-4">
                As a service provider, we are responsible for our own content on these pages in accordance with general legislation pursuant to Section 7(1) of the German Telemedia Act (TMG). According to Sections 8 to 10 TMG, however, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
              </p>
              <p className="text-white mb-6">
                Obligations to remove or block the use of information under general law remain unaffected. However, liability in this regard is only possible from the point in time at which a concrete infringement of the law becomes known. If we become aware of any such legal infringements, we will remove the relevant content immediately.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Liability for Links
              </h2>
              <p className="text-white mb-4">
                Our website contains links to external third-party websites over whose content we have no control. Therefore, we cannot accept any liability for these external contents. The respective provider or operator of the linked pages is always responsible for their content.
              </p>
              <p className="text-white mb-6">
                The linked pages were checked for possible legal violations at the time of linking. Illegal content was not apparent at the time the links were created. However, continuous monitoring of the content of the linked pages is not reasonable without specific indications of a legal violation. If we become aware of any legal infringements, we will remove such links immediately.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 gold-text">
                Copyright
              </h2>
              <p className="text-white mb-4">
                The content and works created by the site operator on these pages are subject to copyright law. Duplication, processing, distribution, and any form of commercialization of such material beyond the scope of copyright law require the written consent of its respective author or creator.
              </p>
              <p className="text-white mb-4">
                Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. Third-party content is identified as such.
              </p>
              <p className="text-white">
                Should you nevertheless become aware of a copyright infringement, please notify us accordingly. Upon becoming aware of any such legal infringements, we will remove the affected content immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImpressumPage;