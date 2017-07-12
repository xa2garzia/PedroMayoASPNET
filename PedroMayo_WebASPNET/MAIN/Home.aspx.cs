using DataTransferObjects;
using PedroMayo.Main.BusinessLogic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PedroMayo_WebASPNET.MAIN
{
    public partial class frmMain : System.Web.UI.Page
    {
        MainBfll mbfll = new MainBfll();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;

            Form_Load();
        }

        private void Form_Load()
        {
            List<TUsers> users = mbfll.GetUsers();            

            lstUsers.DataSource= users;
            lstUsers.DataValueField = "IDUser";
            lstUsers.DataTextField = "Name";
            lstUsers.DataBind();
        }
    }
}