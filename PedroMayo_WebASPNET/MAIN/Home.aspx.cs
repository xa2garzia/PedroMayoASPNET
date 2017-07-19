using DataTransferObjects;
using PedroMayo.Main.BusinessLogic;
using System;
using System.Collections.Generic;
using System.Data;
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

            DataTable usersDt = mbfll.GetUsersDT();

            PMDropDownList1.Items.Clear();

            //DataTable dt = MasterBL.Departments_GetRegsBy(oidWorkCenter);
            if (usersDt.Rows.Count == 0)
            {
                PMDropDownList1.Enabled = false;
                return;
            }

            PMDropDownList1.DataValueField = "Name";
            PMDropDownList1.DataTextField = "Name";
            PMDropDownList1.DataInUseField = "InUse";
            PMDropDownList1.LoadData(usersDt);
            PMDropDownList1.Enabled = true;

            /*if (oidDepartments != null)
                ddlDepartment.SelectedValues = oidDepartments;*/

            PMDropDownList1.LoadData(usersDt);
        }
    }
}