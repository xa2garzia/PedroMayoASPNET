using PedroMayo.Comun.Web._Controls._Basics;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace PedroMayo.Comun.Web._Controls._Basics
{
    [ParseChildren(true, "Items")]
    public partial class PMDropDownList: DropDownPanel, IPostBackEventHandler
    {
        #region Controls

        private HiddenField hidSelectedData = new HiddenField { ID = "hidSelectedData", Value = string.Empty, EnableViewState = false };
        private HiddenField hidItems = new HiddenField { ID = "hidItems", Value = string.Empty, EnableViewState = false };

        private HtmlGenericControl divList = new HtmlGenericControl("DIV") { ID = "divList", EnableViewState = false };

        private void InitializeControl()
        {
            hidSelectedData.ValueChanged += hidSelectedData_ValueChanged;
            InnerControls.Add(hidSelectedData);
            InnerControls.Add(hidItems);
            InnerControls.Add(divList);
        }

        #endregion Controls

        #region Control life cycle

        public PMDropDownList()
        {
            PostbackOnHide = false;
            Init += DropDownList_Init;
            Load += DropDownList_Load;
            PreRender += DropDownList_PreRender;

            Changed += DropDownList_Changed;
        }

        private void DropDownList_Init(object sender, EventArgs e)
        {
            InitializeControl();
        }

        private void DropDownList_Load(object sender, EventArgs e)
        {
            LoadSelection();
            if (_multiselection == false)
            {
                Text = SelectedText;
            }
        }

        protected override void OnPreRender(EventArgs e)
        {
            /*UnifikasUser user = FbaBLHelpers.UnifikasUser_GetCurrent();
            if (user.IsDeveloper())
            {
                if (_multiselection == false)
                {
                    DeveloperNote = Convert.ToString(Value);
                }
                else
                {
                    DeveloperNote = SelectedValues.ToString(";");
                }*
            }*/

            base.OnPreRender(e);
        }

        private void DropDownList_PreRender(object sender, EventArgs e)
        {
            SaveSelection();
            RenderList();
            if (SelectedItem != null)
            {
                CSSClassText = SelectedItem.CssClass;
            }
        }

        protected override void LoadViewState(object savedState)
        {
            base.LoadViewState(savedState);

            // Deseriar items
            _items.Clear();
            var strItems = (string)ViewState["Items"];
            List<string> listStrItems = SplitUnscaped(strItems, '|');
            foreach (string strItem in listStrItems)
            {
                DropDownListItem item = DropDownListItem.Deserialize(strItem);
                if (item == null) { continue; }
                _items.Add(item);
            }

            SelectedIndex = Convert.ToInt32(ViewState["SelectedIndex"]);

            _loaded = Convert.ToBoolean(ViewState["Loaded"]);
        }

        public static List<string> SplitUnscaped(string str, char splitter)
        {
            var strs = new List<string>();
            int j, i;
            int n = str.Length;

            for (j = 0, i = 0; i < n; i++)
            {
                if (str[i] == '\\') i++;
                else if (str[i] == splitter)
                {
                    strs.Add(str.Substring(j, i - j));
                    j = i + 1;
                }
            }
            if (i >= j) strs.Add(str.Substring(j, n - j));

            return strs;
        }

        protected override object SaveViewState()
        {
            // Seriar items
            var sbItems = new StringBuilder();
            string strItem = null;
            foreach (DropDownListItem item in _items)
            {
                if (strItem != null)
                {
                    sbItems.Append('|');
                }
                strItem = DropDownListItem.Serialize(item).Replace("|", "\\|");
                sbItems.Append(strItem);
            }
            ViewState["Items"] = sbItems.ToString();
            ViewState["SelectedIndex"] = SelectedIndex;

            ViewState["Loaded"] = _loaded;

            return base.SaveViewState();
        }

        #endregion Control life cycle

        #region Declarations

        private List<DropDownListItem> _items = new List<DropDownListItem>();

        private List<DropDownListItem> _selectedItems = new List<DropDownListItem>();

        private DropDownListItem _selectedItem;
        private int _selectedIndex = -1;

        private bool _multiselection = false;

        private bool _sortByText = false;

        private string _dataValueField = string.Empty;
        private string _dataTextField = string.Empty;
        private string _dataInUseField = string.Empty;
        private string _dataCSSClassField = string.Empty;

        private string _defaultItemText = string.Empty;

        private string cssClassItemNormal = "dropDownItem";
        private string cssClassItemNotInUse = "dropDownItemNotInUse";
        private string cssClassItemSelected = "dropDownItemSelected";

        private bool _translateItems = false;

        private bool _loaded = false;

        #endregion Declarations

        #region Properties

        public bool Multiselection
        {
            get { return _multiselection; }
            set { _multiselection = value; }
        }

        public string DataValueField
        {
            get { return _dataValueField; }
            set { _dataValueField = value; }
        }

        public string DataTextField
        {
            get { return _dataTextField; }
            set { _dataTextField = value; }
        }

        public string DataInUseField
        {
            get { return _dataInUseField; }
            set { _dataInUseField = value; }
        }

        public string DataCSSClassField
        {
            get { return _dataCSSClassField; }
            set { _dataCSSClassField = value; }
        }

        [PersistenceMode(PersistenceMode.InnerDefaultProperty)]
        [MergableProperty(false)]
        public List<DropDownListItem> Items
        {
            get { return _items; }
        }

        public bool SortByText
        {
            get { return _sortByText; }
            set { _sortByText = value; }
        }

        public bool AutoPostBack
        {
            get { return PostbackOnHide; }
            set { PostbackOnHide = value; }
        }

        /// <summary>
        /// Obtiene o establece el texto por defecto
        /// </summary>
        /// <value>The default item text.</value>
        /// <date>03/12/2013</date>
        /// <author>VAR</author>
        public string DefaultItemText
        {
            get { return _defaultItemText; }
            set { _defaultItemText = DefaultText = value; }
        }

        /// <summary>
        /// Obtiene o establece si se deben traducir los items de este control.
        /// </summary>
        /// <value><c>true</c> if [translate items]; otherwise, <c>false</c>.</value>
        /// <date>01/02/2016</date>
        /// <author>VAR</author>
        public bool TranslateItems
        {
            get { return _translateItems; }
            set { _translateItems = value; }
        }

        public bool Loaded
        {
            get { return _loaded; }
        }

        #region Selection

        /// <summary>
        /// Obtiene o establece el indice seleccionado
        /// </summary>
        /// <value>The index of the selected.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public int SelectedIndex
        {
            get { return _selectedIndex; }
            set
            {
                ClearSelection();
                if (value >= 0 && value < _items.Count)
                {
                    SetSelection(_items[value], value);
                }
            }
        }

        /// <summary>
        /// Obtiene o establece el valor seleccionado
        /// </summary>
        /// <value>The selected value.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public string SelectedValue
        {
            get
            {
                if (_selectedItem == null) { return string.Empty; }
                return _selectedItem.Value;
            }
            set
            {
                ClearSelection();
                int i = 0;
                foreach (DropDownListItem item in _items)
                {
                    if (item.Value == value)
                    {
                        SetSelection(item, i);
                        break;
                    }
                    i++;
                }
            }
        }

        public string Value
        {
            get { return SelectedValue; }
            set { SelectedValue = value; }
        }

        /// <summary>
        /// Obtiene o establece el texto seleccionado
        /// </summary>
        /// <value>The selected text.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public string SelectedText
        {
            get
            {
                if (_selectedItem == null) { return string.Empty; }
                if (_translateItems)
                {
                    return _selectedItem.Text;
                }
                return _selectedItem.Text;
            }
            set
            {
                ClearSelection();
                int i = 0;
                foreach (DropDownListItem item in _items)
                {
                    if (item.Text == value)
                    {
                        SetSelection(item, i);
                        break;
                    }
                    i++;
                }
            }
        }

        /// <summary>
        /// Obtiene o establece el elemento seleccionado
        /// </summary>
        /// <value>The selected item.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public DropDownListItem SelectedItem
        {
            get { return _selectedItem; }
            set
            {
                ClearSelection();
                int i = 0;
                foreach (DropDownListItem item in _items)
                {
                    if (item == value || item.Value == value.Value)
                    {
                        SetSelection(item, i);
                        break;
                    }
                    i++;
                }
            }
        }

        /// <summary>
        /// Obtiene o establece los valores seleccionados
        /// </summary>
        /// <value>The selected values.</value>
        /// <date>05/09/2016</date>
        /// <author>VAR</author>
        public List<string> SelectedValues
        {
            get { return GetSelectedValues(); }
            set { SetSelectedValues(value); }
        }

        #endregion Selection

        #endregion Properties

        #region Loading

        private DropDownListItem ItemFormDataRow(DataRow dr)
        {
            var item = new DropDownListItem();
            if (!String.IsNullOrEmpty(_dataTextField) && dr.Table.Columns.Contains(_dataTextField))
            {
                item.Text = Convert.ToString(dr[_dataTextField]);
            }
            if (!String.IsNullOrEmpty(_dataValueField) && dr.Table.Columns.Contains(_dataValueField))
            {
                item.Value = Convert.ToString(dr[_dataValueField]);
            }
            if (!String.IsNullOrEmpty(_dataInUseField) && dr.Table.Columns.Contains(_dataInUseField))
            {
                item.InUse = true;
            }
            if (!String.IsNullOrEmpty(_dataCSSClassField) && dr.Table.Columns.Contains(_dataCSSClassField))
            {
                item.CssClass = Convert.ToString(dr[_dataCSSClassField]);
            }
            return item;
        }

        public override void LoadData(DataTable dt)
        {
            _items.Clear();
            SelectedIndex = -1;
            if (dt == null || dt.Rows.Count <= 0)
            {
                Enabled = false;
                return;
            }
            foreach (DataRow dr in dt.Rows)
            {
                DropDownListItem item = ItemFormDataRow(dr);
                if (_translateItems)
                {
                    item.Text = item.Text;
                }
                _items.Add(item);
            }
            if (_sortByText)
            {
                _items.Sort((a, b) => a.Text.CompareTo(b.Text));
            }
            if (_multiselection == false)
            {
                if (string.IsNullOrEmpty(_defaultItemText))
                {
                    _items.Insert(0, new DropDownListItem { Text = "SelectOne", Value = string.Empty });
                }
                else
                {
                    _items.Insert(0, new DropDownListItem { Text = _defaultItemText, Value = string.Empty });
                }
            }
            Enabled = true;
            _loaded = true;
        }

        public void CleanData()
        {
            _loaded = false;
            _items.Clear();
            SelectedIndex = -1;
        }

        #endregion Loading

        #region Misc

        /// <summary>
        /// Borra todos los items que tengan InUse a false, excepto el seleccionado
        /// </summary>
        /// <date>03/12/2013</date>
        /// <author>VAR</author>
        public void RemoveNotInUse()
        {
            int i = 0;
            if (_multiselection == false)
            {
                while (i < _items.Count)
                {
                    if (i == _selectedIndex) { i++; continue; }
                    if (!_items[i].InUse)
                    {
                        _items.RemoveAt(i);
                        if (_selectedIndex > i)
                        {
                            _selectedIndex--;
                        }
                    }
                    else
                    { i++; }
                }
            }
            else
            {
                while (i < _items.Count)
                {
                    DropDownListItem selectedItem = null;
                    for (int j = 0; j < _selectedItems.Count; j++)
                    {
                        if (_selectedItems[j].Value == _items[i].Value)
                        {
                            selectedItem = _selectedItems[j];
                            break;
                        }
                    }
                    if (selectedItem != null) { i++; continue; }
                    if (!_items[i].InUse)
                    {
                        _items.RemoveAt(i);
                    }
                    else
                    { i++; }
                }
            }
        }

        public string FindValueStartsWith(string value)
        {
            foreach (DropDownListItem item in _items)
            {
                if (item.Value.StartsWith(value))
                {
                    return item.Value;
                }
            }
            return string.Empty;
        }

        #endregion Misc

        #region Private events

        private void hidSelectedData_ValueChanged(object sender, EventArgs e)
        {
            LoadSelection();
        }

        private void DropDownList_Changed(object sender, EventArgs e)
        {
            SelectedIndexChanged?.Invoke(this, e);
        }

        #endregion Private events

        #region Public events

        public event EventHandler SelectedIndexChanged;

        #endregion Public events

        #region Private methods

        private void LoadSelection()
        {
            var serializer = new JavaScriptSerializer();
            Dictionary<string, string> selectedData = serializer.Deserialize<Dictionary<string, string>>(hidSelectedData.Value);
            if (selectedData != null && selectedData.ContainsKey("selectedIndex"))
            {
                if (_multiselection)
                {
                    if (selectedData.ContainsKey("selectedValues"))
                    {
                        List<string> selectedValues = Convert.ToString(selectedData["selectedValues"]).Split(':').ToList();
                        SetSelectedValues(selectedValues);
                    }
                }
                else
                {
                    if (selectedData.ContainsKey("selectedIndex"))
                    {
                        SelectedIndex = Convert.ToInt32(selectedData["selectedIndex"]);
                    }
                }
            }
        }

        public string ToString(List<string> list, string separator)
        {
            var sbList = new StringBuilder();
            foreach (string value in list)
            {
                if (sbList.Length > 0) sbList.Append(separator);
                sbList.Append(value);
            }
            return sbList.ToString();
        }

        private void SaveSelection()
        {
            string strSelectionData = string.Format("{{ \"selectedIndex\": \"{0}\", \"selectedValue\": \"{1}\", \"selectedText\": \"{2}\", \"selectedValues\": \"{3}\" }}",
                    SelectedIndex,
                    SelectedValue.Replace("\"", "\\\""),
                    SelectedText.Replace("\"", "\\\""),
                    ToString(GetSelectedValues(),":"));
            hidSelectedData.Value = strSelectionData;
        }

        private List<string> GetSelectedValues()
        {
            List<string> selectedValues = new List<string>();
            foreach (DropDownListItem item in _selectedItems)
            {
                selectedValues.Add(item.Value);
            }
            return selectedValues;
        }

        private void SetSelectedValues(List<string> selectedValues)
        {
            var sbText = new StringBuilder();
            _selectedItems.Clear();
            if (selectedValues != null)
            {
                foreach (DropDownListItem item in _items)
                {
                    if (selectedValues.Contains(item.Value))
                    {
                        if (_selectedItems.Count > 0)
                        {
                            sbText.Append(", ");
                        }
                        _selectedItems.Add(item);
                        sbText.Append(item.Text);
                    }
                }
            }
            Text = sbText.ToString();
        }

        private void RenderList()
        {
            // FIX: Los calendarios dentro de popups y buscadores no ensucian el formulario
            bool isDirtable = true;

            // Iterar lista
            int i = 0;
            var sbItems = new StringBuilder();
            sbItems.Append("[ ");
            foreach (DropDownListItem item in _items)
            {
                var ctrItem = new Panel()
                {
                    ID = String.Format("item_{0}", i),
                    EnableViewState = false,
                };
                divList.Controls.Add(ctrItem);

                // Calcular clase CSS
                string itemCssClass = cssClassItemNormal;
                if (i == _selectedIndex) { itemCssClass += @" " + cssClassItemSelected; }
                if (!item.InUse) { itemCssClass += @" " + cssClassItemNotInUse; }
                if (!string.IsNullOrEmpty(item.CssClass)) { itemCssClass += @" " + item.CssClass; }

                if (_multiselection)
                {
                    // Crear el checkbox del item
                    CheckBox chkItem = new CheckBox { Text = item.Text, CssClass = itemCssClass, EnableViewState = false, };
                    if (_selectedItems.Contains(item))
                    {
                        chkItem.Checked = true;
                    }
                    chkItem.Attributes.Add("title", item.Text);
                    ctrItem.Controls.Add(chkItem);

                    // Asociar evento clientside
                    string funcClick = string.Format("DDL_M_CI('{0}',{1}, {2});", ClientID, i, isDirtable ? "true" : "false");
                    chkItem.Attributes.Add("onclick", funcClick);
                }
                else
                {
                    // Establecer item
                    ctrItem.Attributes.Add("class", itemCssClass);
                    ctrItem.Attributes.Add("title", item.Text);
                    ctrItem.Attributes.Add("tabindex", "0");
                    ctrItem.Controls.Add(new LiteralControl(item.Text));

                    // Asociar evento clientside
                    string funcClick = string.Format("DDL_C('{0}',{1}, {2});", ClientID, i, isDirtable ? "true" : "false");
                    ctrItem.Attributes.Add("onclick", funcClick);
                    ctrItem.Attributes.Add("onkeypress", string.Format("if(CheckKey(event, 13)){{ {0}; }}", funcClick));
                }

                // Añadir item a la lista de items clientside
                if (i > 0) { sbItems.Append(", "); }
                sbItems.AppendFormat("{{ \"Text\": \"{0}\", \"Value\": \"{1}\", \"CSSClass\": \"{2}\", \"IDElement\": \"{3}\" }}",
                    item.Text.Replace("\"", "\\\""),
                    item.Value.Replace("\"", "\\\""),
                    item.CssClass.Replace("\"", "\\\""),
                    ctrItem.ClientID.Replace("\"", "\\\"")
                    );

                i++;
            }
            sbItems.Append(" ]");
            hidItems.Value = sbItems.ToString();
        }

        private void ClearSelection()
        {
            _selectedItem = null;
            _selectedIndex = -1;
            Text = string.Empty;
        }

        private void SetSelection(DropDownListItem item, int i)
        {
            _selectedItem = item;
            _selectedIndex = i;
            Text = SelectedText;
        }

        #endregion Private methods

        #region Public methods

        /// <summary>
        /// Obtiene el texto asignado a un valor
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        /// <date>22/08/2014</date>
        /// <author>VAR</author>
        public string GetTextFromValue(string value)
        {
            DropDownListItem item = _items.FirstOrDefault(it => (it.Value == value));
            return item != null ? item.Text : null;
        }

        /// <summary>
        /// Obtiene todos los valores
        /// </summary>
        /// <returns></returns>
        /// <date>06/09/2016</date>
        /// <author>VAR</author>
        public List<string> GetAllValues()
        {
            return _items.Select(item => item.Value).ToList();
        }

        public void ClientSideChanged(string clientSideCode)
        {
            ScriptManager.RegisterStartupScript(this, this.GetType(), "ClientSideChanged_" + this.ClientID,
                string.Format("DropDownList_BindOnchange(\"{0}\", function(){{ {1}; }});", this.ClientID, clientSideCode),
                true);
        }

        #endregion Public methods

        #region IValidableControl

        public bool IsValid()
        {
            return true;
        }

        public bool HasValue()
        {
            if (_multiselection)
            {
                return _selectedItems.Count > 0;
            }
            else
            {
                return (_selectedIndex > 0);
            }
        }

        #endregion IValidableControl
    }

    /// <summary>
    /// Item para el DropDownList
    /// </summary>
    /// <date>02/12/2013</date>
    /// <author>VAR</author>
    public class DropDownListItem
    {
        #region Properties

        private bool _inUse = true;

        /// <summary>
        /// Obtiene o establece si el item esta en uso
        /// </summary>
        /// <value><c>true</c> if [in use]; otherwise, <c>false</c>.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public bool InUse
        {
            get { return _inUse; }
            set { _inUse = value; }
        }

        private string _text = string.Empty;

        /// <summary>
        /// Obtiene o establece el texto del item
        /// </summary>
        /// <value>The text.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public string Text
        {
            get
            {
                if (_text == null) { return _value; }
                return _text;
            }
            set { _text = value; }
        }

        private string _value = null;

        /// <summary>
        /// Obtiene o establece el valor del item
        /// </summary>
        /// <value>The value.</value>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public string Value
        {
            get
            {
                if (_value == null) { return _text; }
                return _value;
            }
            set { _value = value; }
        }

        private string _cssClass = string.Empty;

        /// <summary>
        /// Obtiene o establece el valor del item
        /// </summary>
        /// <value>The value.</value>
        /// <date>17/01/2015</date>
        /// <author>VAR</author>
        public string CssClass
        {
            get { return _cssClass; }
            set { _cssClass = value; }
        }

        #endregion Properties

        #region Persistence

        /// <summary>
        /// Serializa un item a una cadena
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns></returns>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public static string Serialize(DropDownListItem item)
        {
            return string.Format("{0};{1};{2};{3}",
                item.Value.Replace("\\", "\\\\").Replace(";", "\\;"),
                item.Text.Replace("\\", "\\\\").Replace(";", "\\;"),
                item.InUse ? 1 : 0,
                item.CssClass.Replace("\\", "\\\\").Replace(";", "\\;"));
        }

        public static List<string> SplitUnscaped(string str, char splitter)
        {
            var strs = new List<string>();
            int j, i;
            int n = str.Length;

            for (j = 0, i = 0; i < n; i++)
            {
                if (str[i] == '\\') i++;
                else if (str[i] == splitter)
                {
                    strs.Add(str.Substring(j, i - j));
                    j = i + 1;
                }
            }
            if (i >= j) strs.Add(str.Substring(j, n - j));

            return strs;
        }

        /// <summary>
        /// Deserializa un item desde una cadena
        /// </summary>
        /// <param name="str">The STR.</param>
        /// <returns></returns>
        /// <date>02/12/2013</date>
        /// <author>VAR</author>
        public static DropDownListItem Deserialize(string str)
        {
            if (string.IsNullOrEmpty(str)) { return null; }
            string value = null;
            string text = null;
            bool inUse = true;
            string cssClass = string.Empty;

            List<string> strFields = SplitUnscaped(str, ';');
            if (strFields.Count > 0)
            {
                value = strFields[0].Replace("\\\\", "\\").Replace("\\;", ";");
            }
            if (strFields.Count > 1)
            {
                text = strFields[1].Replace("\\\\", "\\").Replace("\\;", ";");
            }
            if (strFields.Count > 2)
            {
                inUse = (Convert.ToInt32(strFields[2]) != 0) ? true : false;
            }
            if (strFields.Count > 3)
            {
                cssClass = strFields[3].Replace("\\\\", "\\").Replace("\\;", ";");
            }
            return new DropDownListItem
            {
                Value = value,
                Text = text,
                InUse = inUse,
                CssClass = cssClass,
            };
        }

        #endregion Persistence
    }
}
