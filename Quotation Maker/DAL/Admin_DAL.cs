using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Quotation_Maker.Models;

namespace Quotation_Maker.DAL
{
    public class Admin_DAL
    {
        private readonly string _connectionString = ConfigurationManager.ConnectionStrings["QuotationMaker"].ConnectionString;


        #region Requestor List
        public async Task<List<RequestorList>> GetRequestorLists()
        {
            try
            {
                List<RequestorList> requestorLists = new List<RequestorList>();

                using (SqlConnection con = new SqlConnection(_connectionString))
                using (SqlCommand com = new SqlCommand("spr_GetReqList", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    SqlDataReader reader = await com.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        requestorLists.Add(new RequestorList
                        {
                            requestor = reader["Requestor"].ToString(),
                            dept = reader["Department"].ToString(),
                            localnum = Convert.ToInt32(reader["LocalNo"])
                        });
                    }
                }
                return requestorLists;
            }
            catch
            {
                throw;
            }

        }
        #endregion

        #region Insert Requestor
        public async Task<bool> AddRequestor(string requestor, string department, string localNo)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                using (SqlCommand com = new SqlCommand("spr_AddRequestor", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    com.Parameters.AddWithValue("@Requestor", requestor);
                    com.Parameters.AddWithValue("@Department", department);
                    com.Parameters.AddWithValue("@LocalNo", localNo);

                    await com.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion

        #region delete requestor 
        public async Task<bool> DeleteRequestor(string requestor, string department, string localNo)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                using (SqlCommand com = new SqlCommand("spr_DeleteRequestor", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    com.Parameters.AddWithValue("@Requestor", requestor);
                    com.Parameters.AddWithValue("@Department", department);
                    com.Parameters.AddWithValue("@LocalNo", localNo);

                    await com.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion

        #region Item List
        public async Task<List<ItemList>> GetItemList()
        {
            try
            {
                List<ItemList> ItemList = new List<ItemList>();
                using (SqlConnection con = new SqlConnection(_connectionString))
                using (SqlCommand com = new SqlCommand("spr_GetItemList", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await com.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        ItemList.Add(new ItemList
                        {
                            item = reader["Item"] == DBNull.Value ? null : reader["Item"].ToString(),
                            rate = reader["Rate"] == DBNull.Value ? (decimal?)null : Convert.ToDecimal(reader["Rate"])
                        });
                    }
                }
                return ItemList;
            }
            catch
            {
              throw;
            }
        }
        #endregion

        #region insert Item List
        public async Task<bool> InsertItem(string item, string rate)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                using(SqlCommand com = new SqlCommand("spr_AddItem", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    decimal rateValue = Convert.ToDecimal(rate.Replace(",", ""));

                    com.Parameters.AddWithValue("@Item", item);
                    com.Parameters.AddWithValue("@Rate", rateValue);

                    await com.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion        
        
        #region delete Item List
        public async Task<bool> DeleteItem(string item, string rate)
        {
            try
            {
            decimal parsedrate;

            if (!decimal.TryParse(rate.Replace(",", ""), out parsedrate))
                throw new Exception("Invalid rate format");

            using(SqlConnection con = new SqlConnection(_connectionString))
            using(SqlCommand com = new SqlCommand("spr_DeleteItem", con))
            {
                com.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();

                com.Parameters.AddWithValue("@Item", SqlDbType.NVarChar).Value = item;
                com.Parameters.AddWithValue("@Rate", SqlDbType.Decimal).Value = parsedrate;

                await com.ExecuteNonQueryAsync();
                return true;
            }
            }
            catch
            {
                throw;
            }
        }
        #endregion

        #region labor list
        public async Task<List<LaborList>> GetLaborList()
        {
            try
            {
                using(SqlConnection con = new SqlConnection(_connectionString))
                using(SqlCommand com = new SqlCommand("spr_GetLaborList", con))
                {
                    List<LaborList> labor = new List<LaborList>();
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    SqlDataReader reader = await com.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        labor.Add(new LaborList
                        {
                            labor = reader["Labor"].ToString(),
                            rate = Convert.ToDecimal(reader["Rate"])
                        });
                    }
                        return labor;
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion

        #region insert Labor
        public async Task<bool> AddLabor(string labor, string rate)
        {
            try
            {
                using(SqlConnection con = new SqlConnection(_connectionString))
                using(SqlCommand com =new SqlCommand("spr_AddLabor", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    decimal rateValue = Convert.ToDecimal(rate.Replace(",", ""));

                    com.Parameters.AddWithValue("@Labor", labor);
                    com.Parameters.AddWithValue("@Rate", rate);
                    await com.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion

        #region Delete Labor
        public async Task<bool> DeleteLabor(string Labor, string rate)
        {
            try
            {
                using(SqlConnection con = new SqlConnection(_connectionString))
                using(SqlCommand com = new SqlCommand("spr_DeleteLabor", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    decimal rateValue = Convert.ToDecimal(rate.Replace(",", ""));

                    com.Parameters.AddWithValue("@Labor", Labor);
                    com.Parameters.AddWithValue("@Rate", rateValue);
                    await com.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion
    }
}