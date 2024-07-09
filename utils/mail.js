const nodemailer = require('nodemailer');
const { FROM_MAIL, HOST_MAIL, PORT_MAIL } = process.env;
const { SUBJECTMAIL } = require('../constants/Mail');
const updateDataToHtml = async (html, data) => {

  for (const property in data) {
    html = html.replace("{" + property + "}", data[property]);
  }
  return html;
}
const BodyMail = (htmlTemplate) => {
  const response = {
    [SUBJECTMAIL.NEWUSER]: htmlMailWelcomeWithCredentials,
    [SUBJECTMAIL.CHANGEPASSWORD]: htmlMailChangePassword,
    [SUBJECTMAIL.PASSWORDRECOVER]: htmlMailRecoverPassword,
    [SUBJECTMAIL.NEWGESTOR]: htmlMailWelcome
  }
  return response[htmlTemplate] || htmlMailWelcome;
};
const sendEmail = async (to, subject, data) => {
  let from = 'intermediarios@libertycolombia.com';
  if (FROM_MAIL !== undefined) {
    from = FROM_MAIL
  }
  let host = 'smtprelay.lmig.com';
  if (HOST_MAIL !== undefined) {
    host = HOST_MAIL
  }

  let port = 25;
  if (PORT_MAIL !== undefined) {
    port = PORT_MAIL
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
  });

  let html = await updateDataToHtml(BodyMail(subject), data);
  return await transporter.sendMail({ from, to, subject, html });
};

let htmlMailWelcomeWithCredentials = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style type="text/css">
      ReadMsgBody{ width: 100%;}
      .ExternalClass {width: 100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
      body {-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;margin:0 !important;}
      p { margin: 1em 0;}
      table td { border-collapse: collapse;}
      img {outline:0;}
      a img {border:none;}
      @-ms-viewport{ width: device-width;}
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        .container {width: 100% !important;}
        .footer { width:auto !important; margin-left:0; }
        .mobile-hidden { display:none !important; }
        .logo { display:block !important; padding:0 !important; }
        img { max-width:100% !important; height:auto !important; max-height:auto !important;}
        .header img{max-width:100% !important;height:auto !important; max-height:auto !important;}
        .photo img { width:100% !important; max-width:100% !important; height:auto !important;}
        .drop { display:block !important; width: 100% !important; float:left; clear:both;}
        .footerlogo { display:block !important; width: 100% !important; padding-top:15px; float:left; clear:both;}
        .nav4, .nav5, .nav6 { display: none !important; }
        .tableBlock {width:100% !important;}
        .responsive-td {width:100% !important; display:block !important; padding:0 !important; }
        .fluid, .fluid-centered {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .fluid-centered {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        /* MOBILE GLOBAL STYLES - DO NOT CHANGE */
body, .tb_properties{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #1A1446 !important; line-height: 1.5 !important; padding: 0px !important; }.buttonstyles{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #FFFFFF !important; padding: 10px 30px !important; }h1{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 23px !important; color: #1A1446 !important; line-height: 1 !important; }h2{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 26px !important; color: #1A1446 !important; line-height: 1.15 !important; }h3{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 16px !important; color: #1A1446 !important; line-height: 1.15 !important; }a:not(.buttonstyles){line-height: 1.15 !important; }.mobile-hidden{display: none !important; }.responsive-td {width: 100% !important; display: block !important; padding: 0 !important;}
/* END OF MOBILE GLOBAL STYLES - DO NOT CHANGE */
      }
      @media only screen and (max-width: 640px) {
        .container { width:100% !important; }
        .mobile-hidden { display:none !important; }
        .logo { display:block !important; padding:0 !important; }
        .photo img { width:100% !important; height:auto !important;}
        .nav5, .nav6 { display: none !important;}
        .fluid, .fluid-centered {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .fluid-centered {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    </style>
    <!--[if mso]>
      <style type="text/css">
          /* Begin Outlook Font Fix */
              body, table, td {
                 font-family : Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
                 line-height : 150%;
                 font-size : 16px;
                 color : #1A1446;
              }
          /* End Outlook Font Fix */
      </style>
    <![endif]-->
  </head>
  <body bgcolor="#F5F5F5" text="#000000" style="-webkit-text-size-adjust:none;background-color : #F5F5F5; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; font-size : 16px; color : #1A1446; padding : 0px; ">
    <div style="font-size:0; line-height:0;"><custom name="opencounter" type="tracking"><custom name="usermatch" type="tracking" /></div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td align="center" valign="top">
          <custom type="header"/>
        </td>
      </tr>
      <tr>
        <td align="center">
          <table cellspacing="0" cellpadding="0" border="0" width="600" class="container" align="center">
            <tr>
              <td>
                <table class="tb_properties border_style" style="background-color : #FFFFFF; border : 0px;font-size : 16px; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; color : #1A1446; " cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" width="100%">
                  <tr>
                    <td align="center" valign="top">
                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <!-- added padding here -->
                          <td class="content_padding" style="padding : 0px; ">
                            <!-- end of comment -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr> <!-- top slot -->
                                <td align="center" class="header" valign="top">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                          <td align="left" valign="top">
                                            <table cellspacing="0" cellpadding="0" style="width:100%">
                                              <tbody>
                                              <tr>
                                                <td class="responsive-td" valign="top" style="width: 100%;">
                                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 15px 30px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="left"><img data-assetid="503143" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/dbfc6fb9-5839-41cd-8876-db99d9158252.png" alt="" height="64" width="125" style="display: block; padding: 0px; text-align: left; height: 64px; width: 125px; border: 0px;"></td></tr></table></td></tr></table>
                                                </td>
                                              </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr> <!-- main slot -->
                                <td align="center" class="header" valign="top">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                    <tr>
                                      <td align="left" valign="top">
                                        <table cellspacing="0" cellpadding="0" style="width:100%">
                                          <tbody>
                                          <tr>
                                            <td class="responsive-td" valign="top" style="width: 100%;">
                                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFD000; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 14px 30px; " class="stylingblock-content-wrapper camarker-inner"><h1 style="color: rgb(26, 20, 70); font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; font-size: 34px; font-style: normal; font-weight: normal; line-height: 1.15; text-align: center;">
 <b>Oficina en L&iacute;nea</b></h1></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td valign="top" class="responsive-td" style="width: 95%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 0px 10px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
 Bienvenido <b>{NombreCompleto}:</b></div></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;" align="justify">
 Aquí podrás encontrar toda la información relacionada a la consulta de la gestión comercial de <strong>{nombre_intermediario}</strong>.&nbsp;</div></td></tr></table></td><td valign="top" class="responsive-td" style="width: 5%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center"><img data-assetid="535311" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/05db20da-d899-4683-ae6c-c36e59a92dd1.png" alt="" height="99" width="36" style="display: block; padding: 0px; text-align: center; border: 0px solid transparent; height: 99px; width: 36px;"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 20px 20px 10px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
 <b>Ingresa al portal con las siguientes credenciales:</b></div></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px 20px 10px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td valign="top" style="width: 5%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: right;">
 
												&bull;</div></td></tr></table></td><td valign="top" style="width: 95%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
 												<b>TIPO Y N&Uacute;MERO DE IDENTIFICACI&Oacute;N</b>:<b>&nbsp;</b>{usuarioCC}</div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px 20px 20px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td valign="top" style="width: 5%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: right;">
 												&bull;</div></td></tr></table></td><td valign="top" style="width: 95%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: justify;">
												<b>CONTRASEÑA</b>:<b>&nbsp;</b><span>{password}</span></div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px 20px 20px; " class="stylingblock-content-wrapper camarker-inner"><p align="justify">Copia y pega la contraseña. Recuerda no copiar los espacios en blanco. La contraseña es temporal. Una vez verificada, debe ser cambiada en el transcurso de una hora.&nbsp;&nbsp;</p>
												</td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px 30px 10px 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td valign="top" style="width: 5%; padding-right: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center"><img data-assetid="640986" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/3c76467a-9d97-49b4-9fba-c3886f288563.png" alt="" height="115" width="18" style="display: block; padding: 0px; text-align: center; height: 115px; width: 18px; border: 0px;"></td></tr></table></td></tr></table></td><td valign="top" style="width: 95%; padding-left: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="innertd buttonblock" bgcolor="#1A1446" style=" border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px; color: #1A1446; background-color: #1A1446;"><a target="_blank" class="buttonstyles" style=" font-size: 16px; font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; color: #FFFFFF; text-align: center; text-decoration: none; display: block; line-height: 100%; background-color: #1A1446; border: 0px solid #009DDC; padding: 10px 30px; border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px;" href="{LinkportalIntermediario}" title="" alias="" conversion="false" data-linkto="{LinkportalIntermediario}">{lblLink}</a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; border-top: 6px solid #78E1E1; border-right: 0px; border-bottom: 0px; border-left: 0px; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px 30px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tr><td valign="top" style="width: 31%; padding-right: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="left"><a href="https://libertyseguros.co/" title="" alias="" conversion="false" data-linkto="https://"><img data-assetid="630012" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/a87c789d-fd68-40ad-b04b-1757044ea07b.png" alt="" height="59" width="108" style="display: block; padding: 0px; text-align: left; height: 59px; width: 108px; border: 0px;"></a></td></tr></table></td></tr></table></td><td valign="top" style="width: 38%; padding-left: 0.666667px; padding-right: 0.666667px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="right"><a href="http://www.facebook.com/LibertySegurosCO/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="630011" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/0da084ce-5cd2-46cd-8e79-8e69d9829b44.png" alt="" height="60" width="97" style="display: block; padding: 0px; text-align: right; height: 60px; width: 97px; border: 0px;"></a></td></tr></table></td></tr></table></td><td valign="top" style="width: 31%; padding-left: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tr><td class="stylingblock-content-margin-cell" style="padding: 21px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="right"><a href="http://www.linkedin.com/company/liberty-seguros-s/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="656945" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/9a7b7465-c973-40eb-b58f-c2b807094e9c.png" alt="" height="23" width="124" style="display: block; padding: 0px; text-align: right; height: 23px; width: 124px; border: 0px;"></a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>

                                            </td>
                                          </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td valign="top">
          <custom type="footer" />
        </td>
      </tr>
    </table>
  </body>
</html>`

let htmlMailWelcome = `<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css">
  ReadMsgBody{ width: 100%;}
  .ExternalClass {width: 100%;}
  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
  body {-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;margin:0 !important;}
  p { margin: 1em 0;}
  table td { border-collapse: collapse;}
  img {outline:0;}
  a img {border:none;}
  @-ms-viewport{ width: device-width;}
</style>
<style type="text/css">
  @media only screen and (max-width: 480px) {
    .container {width: 100% !important;}
    .footer { width:auto !important; margin-left:0; }
    .mobile-hidden { display:none !important; }
    .logo { display:block !important; padding:0 !important; }
    img { max-width:100% !important; height:auto !important; max-height:auto !important;}
    .header img{max-width:100% !important;height:auto !important; max-height:auto !important;}
    .photo img { width:100% !important; max-width:100% !important; height:auto !important;}
    .drop { display:block !important; width: 100% !important; float:left; clear:both;}
    .footerlogo { display:block !important; width: 100% !important; padding-top:15px; float:left; clear:both;}
    .nav4, .nav5, .nav6 { display: none !important; }
    .tableBlock {width:100% !important;}
    .responsive-td {width:100% !important; display:block !important; padding:0 !important; }
    .fluid, .fluid-centered {
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .fluid-centered {
      margin-left: auto !important;
      margin-right: auto !important;
    }
    /* MOBILE GLOBAL STYLES - DO NOT CHANGE */
body, .tb_properties{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #1A1446 !important; line-height: 1.5 !important; padding: 0px !important; }.buttonstyles{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #FFFFFF !important; padding: 10px 30px !important; }h1{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 23px !important; color: #1A1446 !important; line-height: 1 !important; }h2{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 26px !important; color: #1A1446 !important; line-height: 1.15 !important; }h3{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 16px !important; color: #1A1446 !important; line-height: 1.15 !important; }a:not(.buttonstyles){line-height: 1.15 !important; }.mobile-hidden{display: none !important; }.responsive-td {width: 100% !important; display: block !important; padding: 0 !important;}
/* END OF MOBILE GLOBAL STYLES - DO NOT CHANGE */
  }
  @media only screen and (max-width: 640px) {
    .container { width:100% !important; }
    .mobile-hidden { display:none !important; }
    .logo { display:block !important; padding:0 !important; }
    .photo img { width:100% !important; height:auto !important;}
    .nav5, .nav6 { display: none !important;}
    .fluid, .fluid-centered {
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .fluid-centered {
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }
</style>
<!--[if mso]>
  <style type="text/css">
      /* Begin Outlook Font Fix */
          body, table, td {
             font-family : Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
             line-height : 150%;
             font-size : 16px;
             color : #1A1446;
          }
      /* End Outlook Font Fix */
  </style>
<![endif]-->
</head>
<body bgcolor="#F5F5F5" text="#000000" style="-webkit-text-size-adjust:none;background-color : #F5F5F5; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; font-size : 16px; color : #1A1446; padding : 0px; ">
<div style="font-size:0; line-height:0;"><custom name="opencounter" type="tracking"><custom name="usermatch" type="tracking"></custom></custom></div>
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
  <tbody><tr>
    <td align="center" valign="top">
      <custom type="header">
    </custom></td>
  </tr>
  <tr>
    <td align="center">
      <table cellspacing="0" cellpadding="0" border="0" width="600" class="container" align="center">
        <tbody><tr>
          <td>
            <table class="tb_properties border_style" style="background-color : #FFFFFF; border : 0px;font-size : 16px; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; color : #1A1446; " cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" width="100%">
              <tbody><tr>
                <td align="center" valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody><tr>
                      <!-- added padding here -->
                      <td class="content_padding" style="padding : 0px; ">
                        <!-- end of comment -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tbody><tr> <!-- top slot -->
                            <td align="center" class="header" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                    <tr>
                                      <td align="left" valign="top">
                                        <table cellspacing="0" cellpadding="0" style="width:100%">
                                          <tbody>
                                          <tr>
                                            <td class="responsive-td" valign="top" style="width: 100%;">
                                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 15px 30px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="left"><img data-assetid="503143" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/dbfc6fb9-5839-41cd-8876-db99d9158252.png" alt="" height="64" width="125" style="display: block; padding: 0px; text-align: left; height: 64px; width: 125px; border: 0px;"></td></tr></tbody></table></td></tr></tbody></table>
                                            </td>
                                          </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr> <!-- main slot -->
                            <td align="center" class="header" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                <tr>
                                  <td align="left" valign="top">
                                    <table cellspacing="0" cellpadding="0" style="width:100%">
                                      <tbody>
                                      <tr>
                                        <td class="responsive-td" valign="top" style="width: 100%;">
                                          <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFD000; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 14px 30px; " class="stylingblock-content-wrapper camarker-inner"><h1 style="color: rgb(26, 20, 70); font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; font-size: 34px; font-style: normal; font-weight: normal; line-height: 1.15; text-align: center;">
<b>Oficina en Línea</b></h1></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" class="responsive-td" style="width: 95%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 0px 10px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
Bienvenido <b>{NombreCompleto}</b></div></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
Se ha creado con éxito tu usuario de ingreso. Ahora lo podrás utilizar con la claves asociadas a tu red comercial.</div></td></tr></tbody></table></td><td valign="top" class="responsive-td" style="width: 5%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><img data-assetid="535311" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/05db20da-d899-4683-ae6c-c36e59a92dd1.png" alt="" height="99" width="36" style="display: block; padding: 0px; text-align: center; border: 0px solid transparent; height: 99px; width: 36px;"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 20px 20px 10px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
<b>Ingresa al portal con las siguientes credenciales:</b></div></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 20px 10px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: right;">
•</div></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
<b>TIPO Y NÚMERO DE IDENTIFICACIÓN</b>:<b>&nbsp;</b>{usuarioCC}</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 20px 20px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: right;">
•</div></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: justify;">
<b>CONTRASEÑA</b>:<b>&nbsp;</b>La contraseña para ingresar al portal es la misma que utilizas para ingresar a tu equipo. Después de ingresar por primera vez, se solicitará ingresar una nueva contraseña. Por favor, ingresa la misma del paso anterior ya que si defines una nueva también se cambiará tu contraseña de ingreso al equipo.</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 30px 10px 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><img data-assetid="640986" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/3c76467a-9d97-49b4-9fba-c3886f288563.png" alt="" height="115" width="18" style="display: block; padding: 0px; text-align: center; height: 115px; width: 18px; border: 0px;"></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td class="innertd buttonblock" bgcolor="#1A1446" style=" border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px; color: #1A1446; background-color: #1A1446;"><a target="_blank" class="buttonstyles" style=" font-size: 16px; font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; color: #FFFFFF; text-align: center; text-decoration: none; display: block; line-height: 100%; background-color: #1A1446; border: 0px solid #009DDC; padding: 10px 30px; border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px;" href="http://" title="" alias="" conversion="false" data-linkto="http://">VERIFICAR USUARIO</a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; border-top: 6px solid #78E1E1; border-right: 0px; border-bottom: 0px; border-left: 0px; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 30px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 31%; padding-right: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="left"><a href="https://libertyseguros.co/" title="" alias="" conversion="false" data-linkto="https://"><img data-assetid="630012" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/a87c789d-fd68-40ad-b04b-1757044ea07b.png" alt="" height="59" width="108" style="display: block; padding: 0px; text-align: left; height: 59px; width: 108px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 38%; padding-left: 0.666667px; padding-right: 0.666667px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="right"><a href="http://www.facebook.com/LibertySegurosCO/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="630011" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/0da084ce-5cd2-46cd-8e79-8e69d9829b44.png" alt="" height="60" width="97" style="display: block; padding: 0px; text-align: right; height: 60px; width: 97px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 31%; padding-left: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 21px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="right"><a href="http://www.linkedin.com/company/liberty-seguros-s/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="656945" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/9a7b7465-c973-40eb-b58f-c2b807094e9c.png" alt="" height="23" width="124" style="display: block; padding: 0px; text-align: right; height: 23px; width: 124px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>
                                        </td>
                                      </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <custom type="footer">
    </custom></td>
  </tr>
</tbody></table>

</body></html>`;

let htmlMailChangePassword = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style type="text/css">
      ReadMsgBody{ width: 100%;}
      .ExternalClass {width: 100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
      body {-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;margin:0 !important;}
      p { margin: 1em 0;}
      table td { border-collapse: collapse;}
      img {outline:0;}
      a img {border:none;}
      @-ms-viewport{ width: device-width;}
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        .container {width: 100% !important;}
        .footer { width:auto !important; margin-left:0; }
        .mobile-hidden { display:none !important; }
        .logo { display:block !important; padding:0 !important; }
        img { max-width:100% !important; height:auto !important; max-height:auto !important;}
        .header img{max-width:100% !important;height:auto !important; max-height:auto !important;}
        .photo img { width:100% !important; max-width:100% !important; height:auto !important;}
        .drop { display:block !important; width: 100% !important; float:left; clear:both;}
        .footerlogo { display:block !important; width: 100% !important; padding-top:15px; float:left; clear:both;}
        .nav4, .nav5, .nav6 { display: none !important; }
        .tableBlock {width:100% !important;}
        .responsive-td {width:100% !important; display:block !important; padding:0 !important; }
        .fluid, .fluid-centered {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .fluid-centered {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        /* MOBILE GLOBAL STYLES - DO NOT CHANGE */
body, .tb_properties{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #1A1446 !important; line-height: 1.5 !important; padding: 0px !important; }.buttonstyles{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #FFFFFF !important; padding: 10px 30px !important; }h1{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 23px !important; color: #1A1446 !important; line-height: 1 !important; }h2{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 26px !important; color: #1A1446 !important; line-height: 1.15 !important; }h3{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 16px !important; color: #1A1446 !important; line-height: 1.15 !important; }a:not(.buttonstyles){line-height: 1.15 !important; }.mobile-hidden{display: none !important; }.responsive-td {width: 100% !important; display: block !important; padding: 0 !important;}
/* END OF MOBILE GLOBAL STYLES - DO NOT CHANGE */
      }
      @media only screen and (max-width: 640px) {
        .container { width:100% !important; }
        .mobile-hidden { display:none !important; }
        .logo { display:block !important; padding:0 !important; }
        .photo img { width:100% !important; height:auto !important;}
        .nav5, .nav6 { display: none !important;}
        .fluid, .fluid-centered {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .fluid-centered {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    </style>
    <!--[if mso]>
      <style type="text/css">
          /* Begin Outlook Font Fix */
              body, table, td {
                 font-family : Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
                 line-height : 150%;
                 font-size : 16px;
                 color : #1A1446;
              }
          /* End Outlook Font Fix */
      </style>
    <![endif]-->
  </head>
  <body bgcolor="#F5F5F5" text="#000000" style="-webkit-text-size-adjust:none;background-color : #F5F5F5; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; font-size : 16px; color : #1A1446; padding : 0px; ">
    <div style="font-size:0; line-height:0;"><custom name="opencounter" type="tracking"><custom name="usermatch" type="tracking"></custom></custom></div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
      <tbody><tr>
        <td align="center" valign="top">
          <custom type="header">
        </custom></td>
      </tr>
      <tr>
        <td align="center">
          <table cellspacing="0" cellpadding="0" border="0" width="600" class="container" align="center">
            <tbody><tr>
              <td>
                <table class="tb_properties border_style" style="background-color : #FFFFFF; border : 0px;font-size : 16px; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; color : #1A1446; " cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" width="100%">
                  <tbody><tr>
                    <td align="center" valign="top">
                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody><tr>
                          <!-- added padding here -->
                          <td class="content_padding" style="padding : 0px; ">
                            <!-- end of comment -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tbody><tr> <!-- top slot -->
                                <td align="center" class="header" valign="top">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                          <td align="left" valign="top">
                                            <table cellspacing="0" cellpadding="0" style="width:100%">
                                              <tbody>
                                              <tr>
                                                <td class="responsive-td" valign="top" style="width: 100%;">
                                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 15px 30px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="left"><img data-assetid="503143" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/dbfc6fb9-5839-41cd-8876-db99d9158252.png" alt="" height="64" width="125" style="display: block; padding: 0px; text-align: left; height: 64px; width: 125px; border: 0px;"></td></tr></tbody></table></td></tr></tbody></table>
                                                </td>
                                              </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr> <!-- main slot -->
                                <td align="center" class="header" valign="top">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                    <tr>
                                      <td align="left" valign="top">
                                        <table cellspacing="0" cellpadding="0" style="width:100%">
                                          <tbody>
                                          <tr>
                                            <td class="responsive-td" valign="top" style="width: 100%;">
                                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFD000; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 14px 30px; " class="stylingblock-content-wrapper camarker-inner"><h1 style="color: rgb(26, 20, 70); font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; font-size: 34px; font-style: normal; font-weight: normal; line-height: 1.15; text-align: center;">
 <b>Tu contraseña fue cambiada con éxito</b></h1></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" class="responsive-td" style="width: 95%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 0px 10px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
 Bienvenido <b>{NombreCompleto}:</b></div></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;" align="justify">
  Tu contraseña fue cambiada con éxito. Te invitamos a ingresar con tu usuario habitual y la nueva contraseña asignada.</div></td></tr></tbody></table></td><td valign="top" class="responsive-td" style="width: 5%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><img data-assetid="535311" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/05db20da-d899-4683-ae6c-c36e59a92dd1.png" alt="" height="99" width="36" style="display: block; padding: 0px; text-align: center; border: 0px solid transparent; height: 99px; width: 36px;"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 30px 10px 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><img data-assetid="640986" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/3c76467a-9d97-49b4-9fba-c3886f288563.png" alt="" height="115" width="18" style="display: block; padding: 0px; text-align: center; height: 115px; width: 18px; border: 0px;"></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td class="innertd buttonblock" bgcolor="#1A1446" style=" border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px; color: #1A1446; background-color: #1A1446;"><a target="_blank" class="buttonstyles" style=" font-size: 16px; font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; color: #FFFFFF; text-align: center; text-decoration: none; display: block; line-height: 100%; background-color: #1A1446; border: 0px solid #009DDC; padding: 10px 30px; border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px;" href="{LinkportalIntermediario}" title="" alias="" conversion="false" data-linkto="{LinkportalIntermediario}">{lblLink}</a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; border-top: 6px solid #78E1E1; border-right: 0px; border-bottom: 0px; border-left: 0px; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 30px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 31%; padding-right: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="left"><a href="https://libertyseguros.co/" title="" alias="" conversion="false" data-linkto="https://"><img data-assetid="630012" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/a87c789d-fd68-40ad-b04b-1757044ea07b.png" alt="" height="59" width="108" style="display: block; padding: 0px; text-align: left; height: 59px; width: 108px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 38%; padding-left: 0.666667px; padding-right: 0.666667px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="right"><a href="http://www.facebook.com/LibertySegurosCO/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="630011" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/0da084ce-5cd2-46cd-8e79-8e69d9829b44.png" alt="" height="60" width="97" style="display: block; padding: 0px; text-align: right; height: 60px; width: 97px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 31%; padding-left: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 21px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="right"><a href="http://www.linkedin.com/company/liberty-seguros-s/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="656945" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/9a7b7465-c973-40eb-b58f-c2b807094e9c.png" alt="" height="23" width="124" style="display: block; padding: 0px; text-align: right; height: 23px; width: 124px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>

                                            </td>
                                          </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody></table>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        
      
      
        
          <custom type="footer">
        
      
    
  
</custom></body>
</html>`;

let htmlMailRecoverPassword = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style type="text/css">
      ReadMsgBody{ width: 100%;}
      .ExternalClass {width: 100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
      body {-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;margin:0 !important;}
      p { margin: 1em 0;}
      table td { border-collapse: collapse;}
      img {outline:0;}
      a img {border:none;}
      @-ms-viewport{ width: device-width;}
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        .container {width: 100% !important;}
        .footer { width:auto !important; margin-left:0; }
        .mobile-hidden { display:none !important; }
        .logo { display:block !important; padding:0 !important; }
        img { max-width:100% !important; height:auto !important; max-height:auto !important;}
        .header img{max-width:100% !important;height:auto !important; max-height:auto !important;}
        .photo img { width:100% !important; max-width:100% !important; height:auto !important;}
        .drop { display:block !important; width: 100% !important; float:left; clear:both;}
        .footerlogo { display:block !important; width: 100% !important; padding-top:15px; float:left; clear:both;}
        .nav4, .nav5, .nav6 { display: none !important; }
        .tableBlock {width:100% !important;}
        .responsive-td {width:100% !important; display:block !important; padding:0 !important; }
        .fluid, .fluid-centered {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .fluid-centered {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        /* MOBILE GLOBAL STYLES - DO NOT CHANGE */
body, .tb_properties{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #1A1446 !important; line-height: 1.5 !important; padding: 0px !important; }.buttonstyles{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 14px !important; color: #FFFFFF !important; padding: 10px 30px !important; }h1{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 23px !important; color: #1A1446 !important; line-height: 1 !important; }h2{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 26px !important; color: #1A1446 !important; line-height: 1.15 !important; }h3{font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important; font-size: 16px !important; color: #1A1446 !important; line-height: 1.15 !important; }a:not(.buttonstyles){line-height: 1.15 !important; }.mobile-hidden{display: none !important; }.responsive-td {width: 100% !important; display: block !important; padding: 0 !important;}
/* END OF MOBILE GLOBAL STYLES - DO NOT CHANGE */
      }
      @media only screen and (max-width: 640px) {
        .container { width:100% !important; }
        .mobile-hidden { display:none !important; }
        .logo { display:block !important; padding:0 !important; }
        .photo img { width:100% !important; height:auto !important;}
        .nav5, .nav6 { display: none !important;}
        .fluid, .fluid-centered {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .fluid-centered {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    </style>
    <!--[if mso]>
      <style type="text/css">
          /* Begin Outlook Font Fix */
              body, table, td {
                 font-family : Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
                 line-height : 150%;
                 font-size : 16px;
                 color : #1A1446;
              }
          /* End Outlook Font Fix */
      </style>
    <![endif]-->
  </head>
  <body bgcolor="#F5F5F5" text="#000000" style="-webkit-text-size-adjust:none;background-color : #F5F5F5; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; font-size : 16px; color : #1A1446; padding : 0px; ">
    <div style="font-size:0; line-height:0;"><custom name="opencounter" type="tracking"><custom name="usermatch" type="tracking"></custom></custom></div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
      <tbody><tr>
        <td align="center" valign="top">
          <custom type="header">
        </custom></td>
      </tr>
      <tr>
        <td align="center">
          <table cellspacing="0" cellpadding="0" border="0" width="600" class="container" align="center">
            <tbody><tr>
              <td>
                <table class="tb_properties border_style" style="background-color : #FFFFFF; border : 0px;font-size : 16px; font-family : Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif; line-height : 150%; color : #1A1446; " cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" width="100%">
                  <tbody><tr>
                    <td align="center" valign="top">
                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody><tr>
                          <!-- added padding here -->
                          <td class="content_padding" style="padding : 0px; ">
                            <!-- end of comment -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tbody><tr> <!-- top slot -->
                                <td align="center" class="header" valign="top">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                          <td align="left" valign="top">
                                            <table cellspacing="0" cellpadding="0" style="width:100%">
                                              <tbody>
                                              <tr>
                                                <td class="responsive-td" valign="top" style="width: 100%;">
                                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 15px 30px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="left"><img data-assetid="503143" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/dbfc6fb9-5839-41cd-8876-db99d9158252.png" alt="" height="64" width="125" style="display: block; padding: 0px; text-align: left; height: 64px; width: 125px; border: 0px;"></td></tr></tbody></table></td></tr></tbody></table>
                                                </td>
                                              </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr> <!-- main slot -->
                                <td align="center" class="header" valign="top">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                    <tr>
                                      <td align="left" valign="top">
                                        <table cellspacing="0" cellpadding="0" style="width:100%">
                                          <tbody>
                                          <tr>
                                            <td class="responsive-td" valign="top" style="width: 100%;">
                                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFD000; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 14px 30px; " class="stylingblock-content-wrapper camarker-inner"><h1 style="color: rgb(26, 20, 70); font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; font-size: 34px; font-style: normal; font-weight: normal; line-height: 1.15; text-align: center;">
 <b>Oficina en Línea</b></h1></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" class="responsive-td" style="width: 95%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 0px 10px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">Hola <b>{NombreCompleto}:</b></div></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;" align="justify">Hemos recibido una solicitud para recuperar tu contraseña de cuenta. A continuación, encontrarás los detalles de inicio de sesión .&nbsp;</div></td></tr></tbody></table></td><td valign="top" class="responsive-td" style="width: 5%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><img data-assetid="535311" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/1/05db20da-d899-4683-ae6c-c36e59a92dd1.png" alt="" height="99" width="36" style="display: block; padding: 0px; text-align: center; border: 0px solid transparent; height: 99px; width: 36px;"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 20px 20px 10px; " class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
 <b>Ingresa al portal con las siguientes credenciales:</b></div></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 20px 10px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: right;">
 
												•</div></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%;">
 												<b>TIPO Y NÚMERO DE IDENTIFICACIÓN</b>:<b>&nbsp;</b>{usuarioCC}</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 20px 20px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: right;">
 												•</div></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 3px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td class="stylingblock-content-wrapper camarker-inner"><div style="line-height: 150%; text-align: justify;">
												<b>CONTRASEÑA</b>:<b>&nbsp;</b><span>{password}</span></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 0px 30px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #C9F3F4; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 20px 20px; " class="stylingblock-content-wrapper camarker-inner"><p align="justify">Copia y pega la contraseña. Recuerda no copiar los espacios en blanco. La contraseña es temporal. Una vez verificada, debe ser cambiada en el transcurso de una hora.&nbsp;&nbsp;</p>
												</td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 30px 10px 0px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 5%; padding-right: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><img data-assetid="640986" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/3c76467a-9d97-49b4-9fba-c3886f288563.png" alt="" height="115" width="18" style="display: block; padding: 0px; text-align: center; height: 115px; width: 18px; border: 0px;"></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 95%; padding-left: 0px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 30px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td class="innertd buttonblock" bgcolor="#1A1446" style=" border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px; color: #1A1446; background-color: #1A1446;"><a target="_blank" class="buttonstyles" style=" font-size: 16px; font-family: Calibri, Candara, Segoe, &quot;Segoe UI&quot;, Optima, Arial, sans-serif; color: #FFFFFF; text-align: center; text-decoration: none; display: block; line-height: 100%; background-color: #1A1446; border: 0px solid #009DDC; padding: 10px 30px; border-radius: 25px; -moz-border-radius: 25px; -webkit-border-radius: 25px;" href="{LinkportalIntermediario}" title="" alias="" conversion="false" data-linkto="{LinkportalIntermediario}">{lblLink}</a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; border-top: 6px solid #78E1E1; border-right: 0px; border-bottom: 0px; border-left: 0px; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px 30px; " class="stylingblock-content-wrapper camarker-inner"><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td><table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;"><tbody><tr><td valign="top" style="width: 31%; padding-right: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #1A1446; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="left"><a href="https://libertyseguros.co/" title="" alias="" conversion="false" data-linkto="https://"><img data-assetid="630012" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/a87c789d-fd68-40ad-b04b-1757044ea07b.png" alt="" height="59" width="108" style="display: block; padding: 0px; text-align: left; height: 59px; width: 108px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 38%; padding-left: 0.666667px; padding-right: 0.666667px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="right"><a href="http://www.facebook.com/LibertySegurosCO/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="630011" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/2/0da084ce-5cd2-46cd-8e79-8e69d9829b44.png" alt="" height="60" width="97" style="display: block; padding: 0px; text-align: right; height: 60px; width: 97px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td><td valign="top" style="width: 31%; padding-left: 1.33333px;"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; "><tbody><tr><td class="stylingblock-content-margin-cell" style="padding: 21px 0px 0px; "><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%; " class="stylingblock-content-wrapper"><tbody><tr><td style="padding: 0px; " class="stylingblock-content-wrapper camarker-inner"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr><td align="right"><a href="http://www.linkedin.com/company/liberty-seguros-s/" title="" alias="" conversion="false" data-linkto="http://"><img data-assetid="656945" src="http://image.comunicaciones.libertyseguros.com/lib/fe2f11717d64047f761376/m/3/9a7b7465-c973-40eb-b58f-c2b807094e9c.png" alt="" height="23" width="124" style="display: block; padding: 0px; text-align: right; height: 23px; width: 124px; border: 0px;"></a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>

                                            </td>
                                          </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody></table>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr>
        <td valign="top">
          <custom type="footer">
        </custom></td>
      </tr>
    </tbody></table>
  
</body>
</html>`;



module.exports = {
  sendEmail,
};




