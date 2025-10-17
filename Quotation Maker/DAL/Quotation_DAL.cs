using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using Quotation_Maker.Models;

namespace Quotation_Maker.DAL
{
    public class Quotation_DAL
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["QuotationMaker"].ConnectionString;

        public List<Requestor> GetAllRequestors()
        {
            List<Requestor> list = new List<Requestor>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("spr_GetReqList", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Requestor
                        {
                            requestor = reader["Requestor"].ToString()
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error or rethrow for higher layers
                throw new Exception("Database error: " + ex.Message);
            }

            return list;
        }

        public List<Items> GetAllItems()
        {
            List<Items> list = new List<Items>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("spr_GetItemList", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Items
                        {
                            itemname = reader["Item"].ToString(),
                            rate = reader["Rate"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["Rate"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error or rethrow for higher layers
                throw new Exception("Database error: " + ex.Message);
            }

            return list;
        }
    }
}