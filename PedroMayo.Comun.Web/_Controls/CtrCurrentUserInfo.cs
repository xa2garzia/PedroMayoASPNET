using PedroMayo.Comun.Escritorio._Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace PedroMayo.Comun.Web.Components
{
    /// <summary>
    /// IPostBackEventHandler para manejar los postback realizados por el control
    /// </summary>
    
    public class CtrCurrentUserInfo : WebControl, IPostBackEventHandler
    {
        private UpdatePanel _updHeader = new UpdatePanel { ID = "updHead", UpdateMode = UpdatePanelUpdateMode.Conditional };

        private HtmlGenericControl _divUserData;
        private HtmlGenericControl _divUserDataField;
        private HtmlGenericControl _divUserDataPanel;

        private HtmlGenericControl _divImgUser;
        private readonly Image _imgUser = new Image();
        private readonly Label _lblDisplayName = new Label();

        private readonly LinkButton _lnkbtnLogout = new LinkButton();

        #region Constructor

        public CtrCurrentUserInfo()
        {
            Init += CtrCurrentUserInfo_Init;
        }

        #endregion Constructor

        #region Control Life Cycle Events

        private void CtrCurrentUserInfo_Init(object sender, EventArgs e)
        {
            InitializeComponent();

            _lblDisplayName.Text = "Xabier";
        }

        #endregion Control Life Cycle Events

        private void InitializeComponent()
        {
            // Panel desplegable
            _divUserData = HtmlUtils.CreateDiv("headerUserData");

            _divUserDataField = HtmlUtils.CreateDiv("headerUserDataField");
            _divUserData.Controls.Add(_divUserDataField);

            // Usuario
            _lblDisplayName.ID = "lblDisplayName";
            _lblDisplayName.EnableViewState = false;
            _lblDisplayName.Attributes.Add("unselectable", "on");
            _lblDisplayName.CssClass = "spanDisplayName";

            _divImgUser = HtmlUtils.CreateDiv("divImgUser");
            _divImgUser.Attributes.Add("unselectable", "on");
            _imgUser.ID = "imgUser";
            _imgUser.EnableViewState = false;
            _imgUser.Attributes.Add("unselectable", "on");
            //_imgUser.ToolTip = Utilities.GetResourceString("User");
            _imgUser.ToolTip = "User";
            _imgUser.AlternateText = "User";
            _divUserDataField.Controls.Add(_lblDisplayName);
            _divUserDataField.Controls.Add(new LiteralControl("<br>"));
            _divUserDataField.Attributes.Add("tabindex", "0");
            _divImgUser.Controls.Add(_imgUser);
            _divUserDataField.Controls.Add(_divImgUser);

            _divUserDataPanel = HtmlUtils.CreateDiv("headerPanel headerUserDataPanel");
            _divUserDataPanel.ID = "divUserDataPanel";
            _divUserData.Controls.Add(_divUserDataPanel);            

            // Logout
            _lnkbtnLogout.ID = "lnkbtnLogout";
            _lnkbtnLogout.ToolTip = "LogOutTitle";
            _lnkbtnLogout.Text = "LogOut";
            //_lnkbtnLogout.Click += lnkbtnLogout_Click;
            _lnkbtnLogout.EnableViewState = false;
            _lnkbtnLogout.OnClientClick = string.Format("return confirmLogout(\"{0}\");", "AreYouSureToLogout");

            //_divUserDataPanel.Controls.Add(_lnkbtnLogout);

            _updHeader.ContentTemplateContainer.Controls.Add(_divUserData);

            Controls.Add(_updHeader);
        }

        #region IPostBackEventHandler

        public void RaisePostBackEvent(string eventArgument)
        {
            if (eventArgument == "SetCulture")
            {
            }
            if (eventArgument == "SetWorkCenter")
            {
            }
        }

        #endregion IPostBackEventHandler
    }
}

