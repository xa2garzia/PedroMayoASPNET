using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.HtmlControls;

namespace PedroMayo.Comun.Escritorio._Utils
{
    internal class HtmlUtils
    {
        internal static HtmlGenericControl CreateDiv(string cssClass, string id = null)
        {
            var div = new HtmlGenericControl("DIV");
            if (!string.IsNullOrEmpty(cssClass))
            {
                div.Attributes.Add("class", cssClass);
            }
            if (!string.IsNullOrEmpty(id))
            {
                div.ID = id;
            }
            return div;
        }
    }
}
