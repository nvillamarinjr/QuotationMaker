using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;

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
    }
}