using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace PedroMayo_WebASPNET
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
        }

        void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
        }

        void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
        }
    }
}