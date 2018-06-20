require('./MyFile.js');
require('./Logger.js');


class Report {
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
       this.subjectText = lines[0].replace(/Civilité/i, this.civilite).replace(/NOM/i, this.nom);
  }

  createText(){
    var lines = this.file.getLines();
    var mailText = "";
    for (var i = 1; i < lines.length; i++) {
        mailText = mailText + lines[i] + "\n";
    }
    this.replacedText = mailText.replace(/Civilité/i, this.civilite).replace(/Prénom/i, this.prenom).replace(/NOM/i, this.nom).replace(/date/i, this.date).replace(/heure/i, this.heure).replace(/lien hypertexte/i, this.lien);
  }

  sendMail(){
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

  sendSMS(){

    this.createText();

    var ovh = require('ovh')({
      appKey: '01pZ581aNeX265Kk',
      appSecret: 'Nny6LTEWuT0iEFsp02fHJMxfwK8DQoYp',
      consumerKey: 'svS4vQ52BSmiCGqJ7icfyJhBkN57CuP7'
    });

    var logger = this.logger;
    var replacedText = this.replacedText;
    var destinataire = this.destinataire;

     // Get the serviceName (name of your sms account)
    ovh.request('GET', '/sms', function (err, serviceName) {
      if(err) {
        logger.info(err + " " + serviceName);
      }
      else {
        logger.info("The account SMS is " + serviceName);

        // Send a simple SMS with a short number using your serviceName
        ovh.request('POST', '/sms/' + serviceName + '/jobs', {
          message: replacedText,
          senderForResponse: true,
          receivers: [destinataire]
        }, function (errsend, result) {
          logger.info(errsend + " " + result);
        });
      }
    });
  }
}

class Mail extends Report {
  
}

class SMS extends Report {

}

module.exports = class MailAlerte extends Mail{

}

module.exports = class MailUrgence extends Mail {

}

module.exports = class MailConsultation extends Mail {

}

module.exports = class SMSAlerte extends SMS {

}

module.exports = class SMSUrgence extends SMS {

}


var report = new Report("./mailConsultation.txt", new Logger().getLogger(), "Corentin", "CHATELLIER", "Mr", "17/06", "8:03", "www.google.com", "corentin.chatellier@consertotech.pro" );
report.sendMail();
//0033678207112
//corentin.chatellier@consertotech.pro