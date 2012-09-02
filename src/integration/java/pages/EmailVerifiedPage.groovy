package pages

import geb.Page;

class EmailVerifiedPage extends Page {
    static url = "tatami/register" // to be use with a param 'key' ?key=86273322226868972417"
 
    static at = { $("p",text:contains("Your password will be e-mailed to you"))}
 
}
