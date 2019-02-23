const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const secret = require('./config.js');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gameofwolves12@gmail.com',
        pass: 'peno12perseus'
    }
});

const Schema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        index: true         // index to optimise queries that search on username
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: /\S+@\S+\.\S+/,
        index: true         // index to optimise queries that search on email
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifCode: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    featureVector: {
        type: Object,
        // required: true
    },
    attack: {
        type: Number,
        default: 100
    },
    defence: {
        type: Number,
        default: 100
    },
    health: {
        type: Number,
        default: 100
    },
    level: {
        type: Number,
        default: 1
    },
    experience: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

Schema.plugin(uniqueValidator, {message: 'The {PATH} you gave ({VALUE}) is already in use'});

Schema.pre('save', async function(){
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
});

Schema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

Schema.methods.createToken = function() {
    let exp = 1;            // Number of days before expiry
    exp *= 60 * 60 * 24;    // days * 60 sec * 60 min * 24 h

    return jwt.sign({
        id: this._id,
        name: this.name
    }, secret, {expiresIn : exp});
};

Schema.methods.checkToken = function(token) {
    return this.name === token.name;
};

Schema.methods.getUserData = function() {
    return {
        name: this.name,
        attack: this.attack,
        defence: this.defence,
        health: this.health,
        level: this.level,
        experience: this.experience,
    };
};

Schema.methods.sendVerifMail = function() {
    this.verifCode = Math.trunc(100000 + 899998*(Math.random()));
    this.save();

    let message = this.name + ",\n\n\nUse the following code to activate your account:\n\n" +
        this.verifCode.toString() + "\n\n\nThe Game of Wolves team";

    const options = {
        from: 'Game Of Wolves',
        to: this.email,
        subject: 'Verify your e-mail',
        html: `
        <body style="margin: 0; padding: 0;" bgcolor="#910f0f">
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
           <tr>
            <td align="center" bgcolor="#910f0f" style="padding: 40px 0 30px 0;">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAyMjQgMjI0IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNHYtMjI0aDIyNHYyMjR6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE4OC4xMzM3NSw0LjQ3MTI1Yy0wLjgwNjQsMC4wMDU2IC0xLjYwNjg1LDAuMjM0NSAtMi4zMDEyNSwwLjY4MjVjLTAuNDQ4LDAuMjY4OCAtMi41NTYwNSwxLjU2NjI1IC01Ljg3MTI1LDMuODA2MjVjMCwwIC0wLjIyNTc1LDAuMTc3NDUgLTAuNjczNzUsMC40NDYyNWMtNi4wMDMyLDQuNDggLTUwLjI2MzUsMzguMTI2NTUgLTYyLjgwNzUsNzUuNzEzNzVsMjIuNCwtNC40OGMwLDAgLTQxLjg4NjYsMzcuNjczNjUgLTU2LjgwNSwxMDAuOTMxMjVjMCwtMC4wNDQ4IC0xLjk5NSw4LjgzMDE1IC0yLjU1NSwxNC43NDM3NWMwLjc2MTYsMS43NDcyIDEuNTIzMiwzLjUzNDY1IDIuMjQsNS40MTYyNWMwLjA0NDgsMC4xMzQ0IDIuNTA0Niw2LjcxODk1IDMuNTM1LDEwLjEyMzc1YzAuNTgyNCwxLjg4MTYgMi4zMzM4LDMuMTg1IDQuMzA1LDMuMTg1aDQ0LjhjMS45NzEyLDAgMy43MjI2LC0xLjMwMzQgNC4zMDUsLTMuMTg1YzE2Ljg0NDgsLTU0Ljc5MDQgNTMuNDAwNTUsLTYzLjc4ODkgNTQuOTIzNzUsLTY0LjEwMjVjMS4zODg4LC0wLjMxMzYgMi41NTAxLC0xLjI5ODUgMy4xMzI1LC0yLjY0MjVsMTMuNDQsLTMxLjM2YzAuNjI3MiwtMS40MzM2IDAuNDUwOCwtMy4wOTQzNSAtMC40OSwtNC4zNDg3NWwtMjEuNDYzNzUsLTMwLjA1NjI1bDQuMzkyNSwtNzAuMTEzNzVjMC4wODk2LC0xLjY1NzYgLTAuNzYyNjUsLTMuMjcwMDUgLTIuMTk2MjUsLTQuMTIxMjVjLTAuNjk0NCwtMC40MjU2IC0xLjUwMzYsLTAuNjQ0MzUgLTIuMzEsLTAuNjM4NzV6TTM1LjE3NSw0LjUzMjVjLTAuNDMyNiwwLjA2NTEgLTAuODU2OCwwLjE5MjE1IC0xLjI2LDAuMzkzNzVjLTEuNjU3NiwwLjc2MTYgLTIuNjQ0NiwyLjUxMyAtMi41NTUsNC4zMDVsNC4zOTI1LDcwLjExMzc1bC0yMS40NjM3NSwzMC4wNTYyNWMtMC45NDA4LDEuMjU0NCAtMS4xMTcyLDIuOTE1MTUgLTAuNDksNC4zNDg3NWwxMy40NCwzMS4zNmMwLjU4MjQsMS4zNDQgMS43NDM3LDIuMzI4OSAzLjEzMjUsMi42NDI1YzAuMTM0NCwwLjA0NDggNS4yMDM0NSwxLjIwNTA1IDEyLjQxNjI1LDUuNDE2MjVjMC4yNjg4LDAuMTM0NCA2LjkzNjY1LDQuMzk2MzUgMTAuMzg2MjUsNy4yMTg3NWwxLjY2MjUsLTEwLjAzNjI1bDMuNDAzNzUsLTIwLjQzMTI1aC0xMy40NGM3LjQ4MTYsLTM4LjM5MzYgMzMuMjM4NDUsLTY5LjYxNjQgNDIuNjkxMjUsLTgwLjAxbC00OC42NSwtNDQuMjY2MjVjLTEuMDA4LC0wLjkwNzIgLTIuMzY4NDUsLTEuMzA2NTUgLTMuNjY2MjUsLTEuMTExMjV6TTYyLjcyLDEwMy4wNGMwLDAgMy45ODU1OSwyMi40IDE1LjkzMzc1LDIyLjRoMTkuOTA2MjV6TTE2MS4yOCwxMDMuMDRjMCwwIC0zLjk4OTY1LDIyLjQgLTE1Ljk1MTI1LDIyLjRoLTE5Ljg4ODc1ek05NC4wOCwxNjUuNzZoMzUuODRsLTE3LjkyLDI2Ljg4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" alt="Creating Email Magic" width="300" height="230" style="display: block;" />
            </td>
          </tr>
          <tr>
           <td align="center">
           </td>
          </tr>
          <tr>
           <td align="center" bgcolor="white"><font color="black" style="font-family:times new roman;">
             <h3>Dear ${this.name},</h3>
             <h4>We are happy to welcome you to the world of <font color="#910f0f">Game of Wolves</font>!</br>To start your adventure, you first have to verificate this e-mail.</h4>
             <h4>This is your verification code: </h4>
             <div style="display:inline-block"><h1 style="border:3px; border-style:solid; border-color:#910f0f">  ${this.verifCode.toString()}  </h1></div>
             <h4>Enjoy your playing time, </br>The Game Of Wolves Team</h4>
           </font></td>
          </tr>
         </table>
        </body>
`,

    };

    transporter.sendMail(options, function(error, res){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + res.response);
        }
    });
};

Schema.methods.verify = function(code) {
    if(this.verifCode === code) {
        this.verified = true;
        this.save();
        return true;
    }
    return false;
};

module.exports = mongoose.model('User', Schema);
