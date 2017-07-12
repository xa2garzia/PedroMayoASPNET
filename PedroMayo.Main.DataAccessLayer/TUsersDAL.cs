using DataTransferObjects;
using PedroMayo.Comun;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PedroMayo.Main.DataAccessLayer
{
    public class TUsersDAL
    {
        public List<TUsers> GetUsers()
        {
            SqlDataReader result;
            List<TUsers> users = new List<TUsers>();


            //string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            string constr = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename='C:\Users\xgb\Documents\Visual Studio 2015\Projects\PedroMayo_WebASPNET\PedroMayo_WebASPNET\App_Data\PedroMayo.mdf';Integrated Security=True";
            using (SqlConnection con = new SqlConnection(constr))
            {
                using (SqlCommand cmd = new SqlCommand("SELECT IdUser, Name FROM dbo.TUsers"))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    con.Open();

                    result = cmd.ExecuteReader();

                    users = DataRecordHelper.ConvertTo<TUsers>(result);                    

                    con.Close();
                }
            }

            

            //IDataReader

            //return result.AutoMap<>.ToList();
            return users;
        }
    }
}
