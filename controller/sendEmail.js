module.exports = function (email, token) {
    const nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Beto Carvalho - Mentoring Classes',
        html: `<table cellspacing="0" cellpadding="0" align="center">
        <tbody>
          <tr>
            <td align="center">
              <div style="
                  height: 400px;
                  width: 700px;
                  background-image: url(https://boxbrazil.tv.br/assets/images/background.jpg);
                  background-color: #d9d9d9;
                  background-size: contain;
                  border-radius: 15px;
                  border: 5px solid white;
                  box-shadow: 0px 0px 20px #00000054, inset 0px 0px 10px #00000054;
                ">
                <table style="width: 600px; height: 330px">
                  <tr>
                    <td align="center">
                      <img src="https://boxbrazil.tv.br/assets/images/Logo-beto.png" alt="Logo Beto Carvalho"
                        style="width: 300px" />
                    </td>
                  </tr>
                  <tr style="height: 50px">
                    <td align="center" cellspacing="0" cellpadding="0">
                      <h1 style="
                          text-transform: uppercase;
                          color: #c59b24;
                          font-weight: 900;
                          font-size: 30px;
                          margin: 0;
                        ">
                        Falta Pouco!
                      </h1>
                    </td>
                  </tr>
                  <tr style="height: 50px">
                    <td align="center" cellspacing="0" cellpadding="0">
                      <p style="
                          color: #545454;
                          text-transform: uppercase;
                          font-size: 16px;
                          font-weight: 600;
                        ">
                        Clique no botão abaixo e:
                      </p>
                    </td>
                  </tr>
                  <tr style="height: 20px">
                    <td align="center" cellspacing="0" cellpadding="0">
                      <a href="" style="
                          text-decoration: none;
                          color: white;
                          font-weight: 700;
                          text-transform: uppercase;
                          letter-spacing: 1px;
                          background: #c59b24;
                          padding: 10px 20px;
                          font-size: 25px;
                          border-radius: 10px;
                        ">Confirme seu E-mail</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Se não conseguir confirmar seu e-mail pelo botão, </p><a
                        href="https://containermedia.com.br/teste/confirm-account.html?token=${token}">clique aqui.</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
           return {msg: 'Erro ao enviar email', code: 500}
        } else {
            console.log('foiii')
            return {msg: 'Email enviado com sucesso', code: 200}
        }
    });
}