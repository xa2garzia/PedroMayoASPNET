using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace PedroMayo.Comun.Web._Controls._Basics
{
    public abstract class DropDownPanel : UserControl, IPostBackEventHandler//, IFocusableControl
    {
        #region Declarations

        /// <summary>
        /// Vandera que marca si el control esta activo.
        /// </summary>
        private bool _enabled = true;

        /// <summary>
        /// Vandera que indica si se realizara postback cuando se recoja el dropdown.
        /// </summary>
        private bool _postbackOnHide = true;

        #region Styling Declarations

        /// <summary>
        /// Clase CSS control.
        /// </summary>
        private string _cssClass = "dropDownControl";

        /// <summary>
        /// Clase CSS extra del control.
        /// </summary>
        private string _cssClassExtra = "width20";

        #endregion Styling Declarations

        #endregion Declarations

        #region Controls

        /// <summary>
        /// dropDownList usado para desplegar el dropdown.
        /// </summary>
        private HtmlGenericControl _fieldControl;

        /// <summary>
        /// Div transparente para dropdown
        /// </summary>
        private HtmlGenericControl _divTransControls;

        /// <summary>
        /// Div transparente para fuera del dropdown, para ocutarlo clickando fuera
        /// </summary>
        private HtmlGenericControl _divTransBackground;

        /// <summary>
        /// Control para contener el estado del dropdown
        /// </summary>
        private HiddenField _hidStatus;

        /// <summary>
        /// Control que envuelve el contenido contenido
        /// </summary>
        private HtmlGenericControl _divContentWrapper;

        /// <summary>
        /// Control para el panel con el contenido
        /// </summary>
        private HtmlGenericControl _divContent;

        /// <summary>
        /// Control que envuelve a todos los controles
        /// </summary>
        private HtmlGenericControl _divWrapper;

        #endregion Controls

        #region Properties

        /// <summary>
        /// Activa o desactiva el control.
        /// </summary>
        public bool Enabled
        {
            get { return _enabled; }
            set { _enabled = value; }
        }

        /// <summary>
        /// Obtiene o establece el realizar postback cuando se recoge el dropdown.
        /// </summary>
        /// <value><c>true</c> if [postback on hide]; otherwise, <c>false</c>.</value>
        /// <date>08/10/2013</date>
        /// <author>VAR</author>
        public bool PostbackOnHide
        {
            get { return _postbackOnHide; }
            set { _postbackOnHide = value; }
        }

        /// <summary>
        /// Obtiene los controles internos.
        /// </summary>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        public ControlCollection InnerControls
        {
            get { return _divContent.Controls; }
        }

        private string _text = string.Empty;

        /// <summary>
        /// Obtiene o establece el texto.
        /// </summary>
        /// <value>The text.</value>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        public string Text
        {
            get { return _text; }
            set
            {
                _text = value;
                PrepareText();
            }
        }

        private string _defaultText = null;

        /// <summary>
        /// Obtiene o establece el texto por defecto.
        /// </summary>
        /// <value>The text.</value>
        /// <date>04/12/2013</date>
        /// <author>VAR</author>
        public string DefaultText
        {
            get
            {
                if (string.IsNullOrEmpty(_defaultText))
                {
                    return "Select One";//Utilities.GetResourceString("SelectOne");
                }
                return _defaultText;
            }
            set { _defaultText = value; }
        }

        public string DeveloperNote { get; set; }

        #region Styling Properties

        private string _cssClassText = string.Empty;
        private string _baseCssClassText = "dropDown width100percent ";

        /// <summary>
        /// Obtiene o establece la clase CSS para el texto
        /// </summary>
        /// <value>The CSS class text.</value>
        /// <date>09/10/2013</date>
        /// <author>VAR</author>
        protected string CSSClassText
        {
            get { return _cssClassText; }
            set
            {
                _cssClassText = value;
                PrepareTextCssClass();
            }
        }

        /// <summary>
        /// Clase CSS extra del control.
        /// </summary>
        public string CssClassExtra
        {
            get { return _cssClassExtra; }
            set { _cssClassExtra = value; }
        }

        private int _maxHeight = 400;

        public int MaxHeight
        {
            get { return _maxHeight; }
            set { _maxHeight = value; }
        }

        #endregion Styling Properties

        private DataTable _sourceDataTable = null;

        /// <summary>
        /// Obtiene o establece la fuente de datos
        /// </summary>
        /// <value>The data source.</value>
        /// <date>26/03/2014</date>
        /// <author>VAR</author>
        public object DataSource
        {
            get { return _sourceDataTable; }
            set
            {
                _sourceDataTable = value as DataTable;
                if (_sourceDataTable == null && value is DataSet)
                {
                    _sourceDataTable = ((DataSet)value).Tables[0];
                }
                LoadData(_sourceDataTable);
            }
        }

        public string FocusableControlID
        {
            get
            {
                return _divWrapper.ClientID;
            }
        }

        #endregion Properties

        #region Control Life Cycle Events

        /// <summary>
        /// Constructor que estructura el control de usuario
        /// </summary>
        public DropDownPanel()
        {
            InstanciateControls();

            PreRender += DropDownPanel_PreRender;
        }

        private void InstanciateControls()
        {
            _fieldControl = new HtmlGenericControl { ID = "fieldText" };
            _fieldControl.Attributes.Add("unselectable", "on");
            
            _hidStatus = new HiddenField { ID = "hidStatus" };
            
            _divWrapper = new HtmlGenericControl("div") { ID = "divWrapper" };
            _divWrapper.Attributes.Add("tabindex", "0");
            {

                _divTransControls = new HtmlGenericControl("div") { ID = "divTransControls" };
                _divTransControls.Attributes.Add("class", "divTransDropDownPanel");
                _divWrapper.Controls.Add(_divTransControls);


                _divTransBackground = new HtmlGenericControl("div") { ID = "divTransBackground" };
                _divTransBackground.Attributes.Add("class", "divTransBackground");
                _divWrapper.Controls.Add(_divTransBackground);

                //
                var divFieldControl = new HtmlGenericControl("div") { ID = "divFieldControl" };
                divFieldControl.Attributes.Add("class", "dropDownPanel");
                divFieldControl.Controls.Add(_fieldControl);
                _divWrapper.Controls.Add(divFieldControl);


                _divWrapper.Controls.Add(_hidStatus);

                _divContentWrapper = new HtmlGenericControl("div") { ID = "divContentWrapper" };
                _divContentWrapper.Attributes.Add("class", "dropDownCont");
                {
                    _divContent = new HtmlGenericControl("div") { ID = "divContent" };
                    _divContent.Attributes.Add("class", "dropDownList");
                }

                _divContentWrapper.Controls.Add(_divContent);
                _divWrapper.Controls.Add(_divContentWrapper);
            }

            Controls.Add(_divWrapper);
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            // Establecer el tooltip del capturador de eventos
            _divTransControls.Attributes.Add("title", _fieldControl.InnerText.Replace(", ", "\r\n"));
        }

        /// <summary>
        /// Restores the view-state information from a previous user control request that was saved by the <see cref="M:System.Web.UI.UserControl.SaveViewState"/> method.
        /// </summary>
        /// <param name="savedState">An <see cref="T:System.Object"/> that represents the user control state to be restored.</param>
        protected override void LoadViewState(object savedState)
        {
            base.LoadViewState(savedState);

            _enabled = /*ConversionHelper.ToBoolean(ViewState["Enabled"] ?? true);*/ true;
            _text = Convert.ToString(ViewState["Text"] ?? string.Empty);
            _defaultText = Convert.ToString(ViewState["DefaultText"] ?? string.Empty);
            _cssClassText = Convert.ToString(ViewState["CSSClassText"] ?? string.Empty);
        }

        /// <summary>
        /// Saves any user control view-state changes that have occurred since the last page postback.
        /// </summary>
        /// <returns>
        /// Returns the user control's current view state. If there is no view state associated with the control, it returns null.
        /// </returns>
        protected override object SaveViewState()
        {
            ViewState["Enabled"] = _enabled;
            ViewState["Text"] = _text;
            ViewState["DefaultText"] = _defaultText;
            ViewState["CSSClassText"] = _cssClassText;

            return base.SaveViewState();
        }

        /// <summary>
        /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
        /// </summary>
        private void DropDownPanel_PreRender(object sender, EventArgs e)
        {
            // Establecer las clases CSS
            _divWrapper.Attributes.Add("class", string.IsNullOrEmpty(_cssClassExtra) ? _cssClass : (_cssClass + " " + _cssClassExtra));

            // Limpiar estado cambiado
            if (_hidStatus.Value == "changed") { _hidStatus.Value = "hidden"; }

            // Ocultar o mostrar segun estado anterior
            bool hidden = (_hidStatus.Value == String.Empty || _hidStatus.Value == "hidden" || !_enabled);
            _divContentWrapper.Attributes.Add("style", hidden ? "display:none;" : "display:block;");

            // Eventos JS para el despliege del dropdown
            string funcToggle = ClientSideToggle();
            _divTransControls.Attributes.Add("onclick", _enabled ?
                    funcToggle :
                    "return false;");
            _divWrapper.Attributes.Add("onkeypress", _enabled ?
                    string.Format("if(CheckKey(event, 13)){{{0}}}", funcToggle) :
                    "return false;");
            _fieldControl.Disabled = !_enabled;

            _divTransBackground.Attributes.Add("style", hidden ? "display:none;" : "display:block;");
            _divTransBackground.Attributes.Add("onclick", ClientSideHide());

            // Script de cerrado cuando se clicka fuera
            var sbHide = new StringBuilder();
            sbHide.AppendFormat("AddEvent(document, \"blur\", function(event){{");
            sbHide.AppendFormat("   DropDownPanel_OnBlur({0}_cfg);", ClientID);
            sbHide.AppendFormat("}}, true);");
            ScriptManager.RegisterStartupScript(this, typeof(DropDownPanel),
                "DropDownPanel_Init_" + ClientID,
                sbHide.ToString(),
                true);

            // JSON configuration
            var sbJsonConfig = new StringBuilder();
            sbJsonConfig.AppendFormat("var {0}_cfg = {{", ClientID);
            sbJsonConfig.AppendFormat("  fieldControl: \"{0}\",", _fieldControl.ClientID);
            sbJsonConfig.AppendFormat("  divTransControls: \"{0}\",", _divTransControls.ClientID);
            sbJsonConfig.AppendFormat("  divTransBackground: \"{0}\",", _divTransBackground.ClientID);
            sbJsonConfig.AppendFormat("  hidStatus: \"{0}\",", _hidStatus.ClientID);
            sbJsonConfig.AppendFormat("  divContentWrapper: \"{0}\",", _divContentWrapper.ClientID);
            sbJsonConfig.AppendFormat("  divContent: \"{0}\",", _divContent.ClientID);
            sbJsonConfig.AppendFormat("  divWrapper: \"{0}\",", _divWrapper.ClientID);
            sbJsonConfig.AppendFormat("  funcChanged: function(){{ {0}; }},",
                Page.ClientScript.GetPostBackEventReference(this, "Changed"));
            sbJsonConfig.AppendFormat("  postbackOnHide: {0},", (_postbackOnHide ? "true" : "false"));
            sbJsonConfig.AppendFormat("  maxHeight: {0},", _maxHeight);
            sbJsonConfig.AppendFormat("  baseCssClassText: \"{0}\",", _baseCssClassText);
            sbJsonConfig.AppendFormat("  defaultText: \"{0}\",", DefaultText);
            sbJsonConfig.AppendFormat("  empty: null");
            sbJsonConfig.AppendFormat("}};");
            ScriptManager.RegisterStartupScript(this, typeof(DropDownPanel),
                string.Format("JsonConfig_{0}", ClientID),
                sbJsonConfig.ToString(),
                true);

            if (_postbackOnHide)
            {
                //if (Utilities.InsideControlType<UpdatePanel>(this))
                {
                    // Registrar como control asincrono si esta dentro de algun update panel
                    ScriptManager scriptManager = ScriptManager.GetCurrent(Page);
                    if (scriptManager != null)
                    {
                        scriptManager.RegisterAsyncPostBackControl(this);
                    }
                }
            }

            if (string.IsNullOrEmpty(DeveloperNote) == false)
            {
                HtmlGenericControl spanDeveloperNote = new HtmlGenericControl("span");
                spanDeveloperNote.Attributes.Add("class", "DevHalfHidden");
                spanDeveloperNote.InnerHtml = DeveloperNote;
                Controls.Add(spanDeveloperNote);
            }
            PrepareText();
            PrepareTextCssClass();
        }

        #endregion Control Life Cycle Events

        #region Public events

        public event EventHandler Changed;

        /// <summary>
        /// Evento que se lanza cuando se cambia la seleccion.
        /// </summary>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        protected virtual void OnChanged(EventArgs e)
        {
            Changed?.Invoke(this, e);
        }

        #endregion Public events

        #region IPostBackEventHandler Members

        /// <summary>
        /// Raises the post back event.
        /// </summary>
        /// <param name="eventArgument">The event argument.</param>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        public void RaisePostBackEvent(string eventArgument)
        {
            if (eventArgument == "Changed")
            {
                OnChanged(null);

                /*while (this != null)
                {
                    if ((this is UpdatePanel) && ((UpdatePanel)this).UpdateMode == UpdatePanelUpdateMode.Conditional)
                    {
                        ((UpdatePanel)this).Update();
                        return;
                    }
                    this = this.Parent;
                }*/
            }
        }

        #endregion IPostBackEventHandler Members

        #region ClientSideHelper

        /// <summary>
        /// Obtiene la llamada a la funcion de lado de cliente para intercambiar visibilidad del dropdown.
        /// </summary>
        /// <returns></returns>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        public string ClientSideToggle()
        {
            return string.Format("DropDownPanel_Toggle({0}_cfg);", ClientID);
        }

        /// <summary>
        /// Obtiene la llamada a la funcion de lado de cliente para establecer el texto
        /// </summary>
        /// <param name="text">El texto</param>
        /// <param name="textIsLiteral">Indica si el texto es el literal a pasar o una variable del lado de cliente</param>
        /// <returns></returns>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        public string ClienteSideSetText(string text, bool textIsLiteral)
        {
            if (textIsLiteral)
            {
                return string.Format("DropDownPanel_SetText({0}_cfg, '{1}');", ClientID, text);
            }
            return string.Format("DropDownPanel_SetText({0}_cfg, {1});", ClientID, text);
        }

        /// <summary>
        /// Obtiene la llamada a la funcion de lado de cliente para establecer la clase CSS del texto
        /// </summary>
        /// <param name="text">El texto</param>
        /// <param name="textIsLiteral">Indica si el texto es el literal a pasar o una variable del lado de cliente</param>
        /// <returns></returns>
        /// <date>27/01/2015</date>
        /// <author>VAR</author>
        public string ClienteSideSetCssClassText(string cssClass, bool cssClassIsLiteral)
        {
            if (cssClassIsLiteral)
            {
                return string.Format("DropDownPanel_SetCssClassText({0}_cfg, '{1}');", ClientID, cssClass);
            }
            return string.Format("DropDownPanel_SetCssClassText({0}_cfg, {1});", ClientID, cssClass);
        }

        /// <summary>
        /// Obtiene la llamada a la funcion de lado de cliente para ocultar el dropdown.
        /// </summary>
        /// <returns></returns>
        /// <date>07/10/2013</date>
        /// <author>VAR</author>
        public string ClientSideHide()
        {
            return string.Format("DropDownPanel_Hide({0}_cfg);", ClientID);
        }

        #endregion ClientSideHelper

        #region Private methods

        private void PrepareText()
        {
            if (string.IsNullOrEmpty(_text))
            {
                _fieldControl.InnerText = DefaultText;
            }
            else
            {
                _fieldControl.InnerText = _text;
            }
        }

        private void PrepareTextCssClass()
        {
            if (string.IsNullOrEmpty(_cssClassText))
            {
                _fieldControl.Attributes.Add("class", _baseCssClassText);
            }
            else
            {
                _fieldControl.Attributes.Add("class", _baseCssClassText + _cssClassText);
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Oculta el dropdown
        /// </summary>
        /// <date>08/10/2013</date>
        /// <author>VAR</author>
        public void Hide()
        {
            _hidStatus.Value = "hidden";
        }

        /// <summary>
        /// Carga el contenido desde un datatable
        /// </summary>
        /// <param name="dt">The DataTable.</param>
        /// <date>08/10/2013</date>
        /// <author>VAR</author>
        /// <date>26/03/2014</date>
        /// <author>VAR</author>
        public abstract void LoadData(DataTable dt);

        #endregion Public Methods
    }
}
