import React from 'react';
import { Grid, Cell, Card, CardTitle, CardText } from 'react-mdl';


/* eslint-disable max-len */
const LegalNotice = () => (
  <Grid>
    <Cell col={4} offsetDesktop={1} tablet={6} offsetTablet={1} phone={6}>
      <Card shadow={1}>
        <CardTitle>Angaben gemäß § 5 TMG:</CardTitle>
        <CardText>
          <p>
            Alexander Höreth<br />
            Redlingerstraße 10<br />
            49074 Osnabrück
          </p>
          <p>
            E-Mail: ahoereth@lawly.org
          </p>
        </CardText>
      </Card>
    </Cell>
    <Cell col={6} tablet={6} offsetTablet={1} phone={6}>
      <Card shadow={1}>
        <CardTitle>Haftung für Inhalte</CardTitle>
        <CardText>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </CardText>
      </Card>
    </Cell>
    <Cell col={10} offsetDesktop={1} tablet={6} offsetTablet={1} phone={6}>
      <Card shadow={1}>
        <CardTitle>Datenschutz</CardTitle>
        <CardText>
          <ol>
            <li>Für eine verbesserte Funktionalität der Applikation bei getrennter oder Eingeschränkter Internetverbindung werden Daten in eingeschränktem Umfang in Ihrem Browser zwischengespeichert. Bei diesen handelt es sich, außgenommen ihrer E-Mail-Adresse falls sie ein Benutzerkonto angelegt haben, um keine personenbezogenen Daten.</li>
            <li>Im Zusammenhang mit einem auf Ihren Wunsch hin möglicherweise angelegten Benutzerkonto speichern wir Ihre E-Mail-Adresse in Verbindung mit von Ihnen angelegten Gesetzessammlungen. Ihre Daten sind durch Ihr persönliches Passwort geschützt und für andere ohne Ihre explizite Einwilligung (zum Beispiel ihm Rahmen von Kollaboration) nicht zugänglich.</li>
            <li>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. (&quot;Google&quot;). Google Analytics verwendet sog. &quot;Cookies&quot;, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Die durch den Cookie erzeugten Informationen über Ihre Benutzung diese Website (einschließlich Ihrer IP-Adresse) wird an einen Server von Google in den USA übertragen und dort gespeichert. Lawly setzt hierbei allerdings auf IP-Anonymisierung, wodurch Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen WIrtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Google wird diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen.</li>
          </ol>
        </CardText>
      </Card>
    </Cell>
  </Grid>
);


LegalNotice.propTypes = {};


export default LegalNotice;
