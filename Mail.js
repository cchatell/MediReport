require('./MyFile.js');
require('./Logger.js');

/**
 * Class representing a Mail.
 *
 * @class      Mail
 */
module.exports = Mail = class {
 /**
   * Constructs the object.
   *
   * @method     constructor
   * @param      {string}  path    The path of the template
   * @param      {Logger}  logger  The logger
   */
  constructor(path, logger, nom, prenom, civilite, date, heure, lien, destinataire) {
    this.logger = logger;
    this.file = new MyFile(path, logger);
    this.file.readLines();
    this.path = path;
    this.nom = nom ;
    this.prenom = prenom;
    this.civilite = civilite;
    this.date = date;
    this.heure = heure;
    this.lien = lien;
    this.destinataire = destinataire;
  }

  createSubject(){
        var lines = this.file.getLines();
       this.subjectText = lines[0] + " " + this.civilite + " " + this.prenom + " " + this.nom;
  }

  createText(){
    var lines = this.file.getLines();
    var mailText = "";
    for (var i = 1; i < lines.length; i++) {
        mailText = mailText + lines[i] + "\n";
    }
    this.replacedText = mailText.replace(/Civilité/i, this.civilite).replace(/Prénom/i, this.prenom).replace(/NOM/i, this.nom).replace(/date/i, this.date).replace(/heure/i, this.heure).replace(/lien hypertexte/i, this.lien);
  }

  send(){
    var nodemailer = require('nodemailer');
    this.createSubject();
    this.createText();

    var transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure : true,
      auth: {
        user: 'rapports@medipep.eu',
        pass: 'yJ8LtU2R5d4t'
      }
    });

 
    var mailOptions = {
      from: 'rapports@medipep.eu',
      to: this.destinataire,
      subject: this.subjectText,
      text: this.replacedText
    };


    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}


var mail = new Mail("./mailConsultation.txt", new Logger().getLogger(), "Corentin", "CHATELLIER", "Mr", "17/06", "8:03", "www.google.com", "corentin.chatellier@consertotech.pro");
mail.send();