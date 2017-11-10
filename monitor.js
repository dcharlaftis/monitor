
nodemailer = require('nodemailer');
var config = require("./config-monitor.js");
var sys = require('sys')
var exec = require('child_process').exec;
var child, child2;
var reportData, serverName;

var smtpTransport = nodemailer.createTransport( {
    service: "Gmail",
    auth: {
        user: config.user,
        pass: config.pass
    }
});

var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

//send email to username
function notify(data) {
    var mailOptions = {
        from: config.from,
        to: config.to, // comma separated list of receivers
        subject: config.subject, // Subject line
        html: '<b>' + data + '</b>' // html body};
     }
    smtpTransport.sendMail(mailOptions, function(err) {
        if (err)
            console.log("ohhh", err);
        else
        	console.log('Message sent.');
	});
}
    ///////////////////////
    //execute hostname command
   
        child2 = exec("hostname", function (error, stdout, stderr) {
           sys.print('stdout: ' + stdout);
           sys.print('stderr: ' + stderr);
           serverName = stdout
           reportData = stdout;
           if (error !== null) {
           console.log('exec error: ' + error);
           }
        });
          
    /////////////////////////    

    //also, send report every n hours
    var hours = config.hours;
    var interval = hours * 60 * 60 * 1000; //in millisecs 
        
    setInterval(function(){ 
        var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        
        //execute disk usage command
        child = exec(config.command, function (error, stdout, stderr) {
           sys.print('stdout: ' + stdout);
           sys.print('stderr: ' + stderr);
           reportData = stdout;
           if (error !== null) {
           console.log('exec error: ' + error);
           }
        });

        
        var mailOptions = {
            from: config.from,
            to: config.to, // comma separated list of receivers
            subject: date + ": "+config.report_subject + " from host " + serverName,      // Subject line
            html: '<p><b>' + " Report for date " + date +'</b></p>' +
                  '<p>'   + "Disk usage: " + '</p>' +
                  '<p>'   + reportData + '</p>' 
        }
        

        smtpTransport.sendMail(mailOptions, function(err) {
            if (err)
                console.log("ohhh2", err);
            else
                console.log('Report message sent.');
            });
    }, interval );
