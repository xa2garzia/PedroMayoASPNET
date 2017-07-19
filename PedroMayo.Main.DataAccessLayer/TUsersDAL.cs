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
            string constr = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename='|DataDirectory|\PedroMayo.mdf';Integrated Security=True";
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

        public DataTable GetUsersDT()
        {
            SqlDataReader result;
            DataTable dt = new DataTable();

            //string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            string constr = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename='|DataDirectory|\PedroMayo.mdf';Integrated Security=True";
            using (SqlConnection con = new SqlConnection(constr))
            {
                using (SqlCommand cmd = new SqlCommand("SELECT IdUser, Name FROM dbo.TUsers"))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    con.Open();

                    //result = cmd.ExecuteReader();
                    
                    SqlDataAdapter a = new SqlDataAdapter(cmd);
                    a.Fill(dt);


                    con.Close();
                }
            }



            //IDataReader

            //return result.AutoMap<>.ToList();
            return dt;
        }
    }
}
