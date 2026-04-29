using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;

namespace Quotation_Maker.DAL
{
    public class Login_DAL
    {

        private readonly string connectionString = ConfigurationManager.ConnectionStrings["QuotationMaker"].ConnectionString;

        public bool ValidateUser(string username, string password)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("spr_ValidateUser", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();
                return (int)cmd.ExecuteScalar() > 0;
            }
        }
        public bool GetUserName(string username, out string fullName)
        {

            fullName = string.Empty;

            using (SqlConnection con = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand("spr_UsersName", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Username", username);


                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                if (reader.Read())
                {
                    fullName = reader["Name"].ToString();
                    return Convert.ToInt32(reader["IsAdmin"]) == 1;
                }

                return false;
            }


        }
    }
}