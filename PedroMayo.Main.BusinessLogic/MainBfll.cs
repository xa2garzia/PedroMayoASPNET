using DataTransferObjects;
using PedroMayo.Main.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PedroMayo.Main.BusinessLogic
{
    public class MainBfll
    {
        TUsersDAL _dal = new TUsersDAL();

        public List<TUsers> GetUsers()
        {
            /*var user = new List<string>();

            user.Add("Xabier");
            user.Add("Jose");*/

            return _dal.GetUsers();
        }

        public DataTable GetUsersDT()
        {
            return _dal.GetUsersDT();
        }
    }
}


