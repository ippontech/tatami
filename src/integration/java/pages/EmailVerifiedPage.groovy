package pages

import geb.Page;

class EmailVerifiedPage extends Page {
    static url = "tatami/register" // to be use with a param 'key' ?key=86273322226868972417"
 
    static at = { $("p").text().contains("Vous allez recevoir votre mot de passe par e-mail")}
 
}