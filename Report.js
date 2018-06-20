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
  constructor(path, logger) {
    this.logger = logger;
    this.file = new MyFile(path, logger);
    this.file.readLines();
    this.path = path;
    
  }

  
}

class Mail extends Report {

	constructor(path, logger, destinataire) {
		super(path,logger);
		this.destinataire = destinataire;
		this.mailSuject;
		this.mailText;
	}

	send(){
	    var nodemailer = require('nodemailer');

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
	      subject: this.mailSuject,
	      text: this.mailText
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

class SMS extends Report {
	constructor(path, logger, numero, civilite, nom, text) {
		super(path,logger);
		this.numero = numero;
		this.smsText = text;
		this.civilite = civilite;
		this.nom = nom;
	}

	send(){

    var ovh = require('ovh')({
      appKey: '01pZ581aNeX265Kk',
      appSecret: 'Nny6LTEWuT0iEFsp02fHJMxfwK8DQoYp',
      consumerKey: 'svS4vQ52BSmiCGqJ7icfyJhBkN57CuP7'
    });

    var logger = this.logger;
    var smsText = this.smsText;
    var numero = this.numero;

     // Get the serviceName (name of your sms account)
    ovh.request('GET', '/sms', function (err, serviceName) {
      if(err) {
        logger.info(err + " " + serviceName);
      }
      else {
        logger.info("The account SMS is " + serviceName);

        // Send a simple SMS with a short number using your serviceName
        ovh.request('POST', '/sms/' + serviceName + '/jobs', {
          message: smsText,
          senderForResponse: true,
          receivers: [numero]
        }, function (errsend, result) {
          logger.info(errsend + " " + result);
        });
      }
    });
  }
}

class MailConsultationAlerte extends Mail{
  constructor(path, logger, destinataire, nom, prenom, civilite, date, heure, lien) {
  	super(path,logger, destinataire);
    this.nom = nom ;
    this.prenom = prenom;
    this.civilite = civilite;
    this.date = date;
    this.heure = heure;
    this.lien = lien;
    this.destinataire = destinataire;
    this.createSubject();
    this.createText();
  }

  createSubject(){
        var lines = this.file.getLines();
       this.mailSuject = lines[0].replace(/Civilité/i, this.civilite).replace(/NOM/i, this.nom);
  }

  createText(){
    var lines = this.file.getLines();
    var text = "";
    for (var i = 1; i < lines.length; i++) {
        text = text + lines[i] + "\n";
    }
    this.mailText = text.replace(/Civilité/i, this.civilite).replace(/Prénom/i, this.prenom).replace(/NOM/i, this.nom).replace(/date/i, this.date).replace(/heure/i, this.heure).replace(/lien hypertexte/i, this.lien);
  }

}

class MailUrgence extends Mail {
	constructor(path, logger, destinataire, date, heure, lien) {
  	super(path,logger, destinataire);
    this.lien = lien;
    this.date = date;
    this.heure = heure;
    this.createSubject();
    this.createText();
  }

  createSubject(){
        var lines = this.file.getLines();
       this.mailSuject = lines[0];
  }

  createText(){
    var lines = this.file.getLines();
    var text = "";
    for (var i = 1; i < lines.length; i++) {
        text = text + lines[i] + "\n";
    }
    this.mailText = text.replace(/lien hypertexte/i, this.lien).replace(/date/i, this.date).replace(/heure/i, this.heure);
  }
}


class SMSAlerte extends SMS {
	constructor(path, logger, numero, civilite, nom, text) {
		super(path,logger,numero, civilite, nom, text);
		this.createText();
	}

	createText(){
		var lines = this.file.getLines();
		var text = "";
		for (var i = 0; i < lines.length; i++) {
		    text = text + lines[i] + "\n";
		}
		this.smsText = text.replace(/MESURES_RELEVEE/i, this.smsText).replace(/Civilité/i, this.civilite).replace(/NOM/i, this.nom);
	}
}

class SMSUrgence extends SMS {
	constructor(path, logger, numero, civilite, nom, text) {
		super(path,logger,numero, civilite, nom, text);
		this.createText();
	}

	createText(){
	    var lines = this.file.getLines();
	    var text = "";
	    for (var i = 0; i < lines.length; i++) {
	        text = text + lines[i] + "\n";
	    }
	    this.smsText = text.replace(/URGENCE_RELEVEE/i, this.smsText).replace(/Civilité/i, this.civilite).replace(/NOM/i, this.nom);
  	}
}


var mail = new MailConsultationAlerte("./mailConsultation.txt", new Logger().getLogger(),"corentin.chatellier@consertotech.pro", "CHATELLIER", "CHATELLIER", "Mr", "17/06", "8:03", "www.google.com" );
mail.send();
var sms = new SMSUrgence("./smsUrgence.txt", new Logger().getLogger(),"0033678207112","Mr", "CHATELLIER","Kappa");
sms.send();
var sms = new SMSAlerte("./smsAlerte.txt", new Logger().getLogger(),"0033678207112","Mr", "CHATELLIER","Kappa");
sms.send();
var mail = new MailConsultationAlerte("./MailAlerte.txt", new Logger().getLogger(),"corentin.chatellier@consertotech.pro", "CHATELLIER", "CHATELLIER", "Mr", "17/06", "8:03", "www.google.com" );
mail.send();
var mail = new MailUrgence("./MailUrgence.txt", new Logger().getLogger(),"corentin.chatellier@consertotech.pro", "17/06","8:03", "www.google.com" );
mail.send();
//0033678207112
//corentin.chatellier@consertotech.pro