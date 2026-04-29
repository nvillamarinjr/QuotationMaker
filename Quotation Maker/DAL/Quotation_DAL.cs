using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
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
                            requestor = reader["Requestor"].ToString(),
                            dept = reader["Department"].ToString(),
                            localnum = reader["LocalNo"] == DBNull.Value ? 0 : Convert.ToInt32(reader["LocalNo"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {

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
                            Unit = reader["Unit"].ToString(),
                            rate = reader["Rate"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["Rate"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
            return list;
        }

        public List<Labor> GetAllLabor()
        {
            List<Labor> list = new List<Labor>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("spr_GetLaborList", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Labor
                        {
                            desc = reader["Labor"].ToString(),
                            laborrate = reader["Rate"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["Rate"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
            return list;
        }

        #region getrdlcdata
        public List<LaborViewModel> GetLaborList(string QuotationNubmer)
        {

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    List<LaborViewModel> list = new List<LaborViewModel>();
                    SqlCommand cmd = new SqlCommand("spr_GetLaborDescription", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@QuotationNumber", QuotationNubmer);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new LaborViewModel
                        {
                            LaborDescription = reader["LaborDescription"].ToString(),
                            Count = Convert.ToInt32( reader["Count"].ToString()),
                            WorkingDay = reader["WorkingDay"].ToString(),
                            Rate = reader["Rate"].ToString(),
                            Amount = reader["Amount"].ToString()
                        });
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }
        public List<ItemViewModel> GetItemList(string QuotationNubmer)
        {

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    List<ItemViewModel> list = new List<ItemViewModel>();
                    SqlCommand cmd = new SqlCommand("spr_GetItemDescription", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@QuotationNumber", QuotationNubmer);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new ItemViewModel
                        {
                            ItemDescription = reader["ItemDescription"].ToString(),
                            Qty = Convert.ToInt32( reader["Qty"].ToString()),
                            Unit = reader["Unit"].ToString(),
                            Rate = reader["Rate"].ToString(),
                            Amount = reader["Amount"].ToString()
                        });
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }
        public List<QuotationDataModel> GetQuotationData(string QuotationNubmer)
        {

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    List<QuotationDataModel> list = new List<QuotationDataModel>();
                    SqlCommand cmd = new SqlCommand("spr_GetQuotationData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@QuotationNumber", QuotationNubmer);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new QuotationDataModel
                        {
                            QuotationNumber = reader["QuotationNumber"].ToString(),
                            QuotationDate = Convert.ToDateTime( reader["QuotationDate"].ToString()),
                            Validity = reader["Validity"].ToString(),
                            ValidUntil = Convert.ToDateTime(reader["ValidUntil"].ToString()),
                            ReferenceNumber = reader["ReferenceNumber"].ToString(),
                            QuotationTo = reader["QuotationTo"].ToString(),
                            Requestor = reader["Requestor"].ToString(),
                            Attention = reader["Attention"].ToString(),
                            Department = reader["Department"].ToString(),
                            Thru = reader["Thru"].ToString(),
                            LocalNo = reader["LocalNo"].ToString(),
                            Subject = reader["Subject"].ToString(),
                            MaterialsSubTotal = reader["MaterialsSubTotal"].ToString(),
                            LaborSubTotal = reader["LaborSubTotal"].ToString(),
                            Vat = reader["Vat"].ToString(),
                            Total = reader["Total"].ToString(),
                            TotalInWords = reader["TotalInWords"].ToString(),
                        });
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + ex.Message);
            }
        }
        #endregion


        #region insert quotation
        public async Task<bool> InsertQuotation(string QuotationNumber, DateTime QuotationDate, string Validity, DateTime ValidUntil, 
                                                string ReferenceNumber, string QuotationTo, string Requestor, string Attention, string Department, string Thru, string LocalNo,
                                                string Subject, string MaterialsSubTotal, string LaborSubTotal, string Vat, string Total, string TotalInWords, string Username, byte[] pdfbyte)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                using (SqlCommand com = new SqlCommand("spr_InsertQuotation", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    com.Parameters.AddWithValue("@QuotationNumber", QuotationNumber);
                    com.Parameters.AddWithValue("@QuotationDate", QuotationDate);
                    com.Parameters.AddWithValue("@Validity", Validity);
                    com.Parameters.AddWithValue("@ValidUntil", ValidUntil);
                    com.Parameters.AddWithValue("@ReferenceNumber", ReferenceNumber);
                    com.Parameters.AddWithValue("@QuotationTo", QuotationTo);
                    com.Parameters.AddWithValue("@Requestor", Requestor);
                    com.Parameters.AddWithValue("@Attention", Attention);
                    com.Parameters.AddWithValue("@Department", Department);
                    com.Parameters.AddWithValue("@Thru", Thru);
                    com.Parameters.AddWithValue("@LocalNo", LocalNo);
                    com.Parameters.AddWithValue("@Subject", Subject);
                    com.Parameters.AddWithValue("@MaterialSubTotal", MaterialsSubTotal);
                    com.Parameters.AddWithValue("@LaborSubTotal", LaborSubTotal);
                    com.Parameters.AddWithValue("@Vat", Vat);
                    com.Parameters.AddWithValue("@Total", Total);
                    com.Parameters.AddWithValue("@TotalInWords", TotalInWords);
                    com.Parameters.AddWithValue("@Username", Username);
                    com.Parameters.AddWithValue("@PDF", pdfbyte);

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

        #region insert item
            public bool InsertItems(List<ItemViewModel> items, string QuotationNumber, string username)
            {
                try
                {
                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        foreach (var item in items)
                        {
                            using (SqlCommand cmd = new SqlCommand("spr_InsertListOfItems", conn))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@QuotationNumber", QuotationNumber);
                                cmd.Parameters.AddWithValue("@ItemDescription", item.ItemDescription);
                                cmd.Parameters.AddWithValue("@Qty", item.Qty);
                                cmd.Parameters.AddWithValue("@Unit", item.Unit);
                                cmd.Parameters.AddWithValue("@Rate", item.Rate);
                                cmd.Parameters.AddWithValue("@Amount", item.Amount);
                                cmd.Parameters.AddWithValue("@Username", username);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                    return true;
                }
                catch
                {
                    throw;
                }
            }
        #endregion

        #region InsertLabor
        public bool InsertLabor(List<LaborViewModel> items, string QuotationNumber, string username)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    foreach (var item in items)
                    {
                        using (SqlCommand cmd = new SqlCommand("spr_InsertLabor", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@QuotationNumber", QuotationNumber);
                            cmd.Parameters.AddWithValue("@Labor", item.LaborDescription);
                            cmd.Parameters.AddWithValue("@Count", item.Count);
                            cmd.Parameters.AddWithValue("@WorkingDay", item.WorkingDay);
                            cmd.Parameters.AddWithValue("@Rate", item.Rate);
                            cmd.Parameters.AddWithValue("@Amount", item.Amount);
                            cmd.Parameters.AddWithValue("@Username", username);

                            cmd.ExecuteNonQuery();
                        }
                    }
                }
                return true;
            }
            catch
            {
                throw;
            }
        }
        #endregion

        #region GetLatestQuotationNumber
        public List<QuotationDataModel> GetLatestNumber()
        {
            try
            {
                using(SqlConnection con = new SqlConnection(connectionString))
                using(SqlCommand com = new SqlCommand("spr_GenerateQuotationNumber", con))
                {
                    List<QuotationDataModel> number = new List<QuotationDataModel>();
                    com.CommandType = CommandType.StoredProcedure;
                    con.Open();

                    using (SqlDataReader reader = com.ExecuteReader()) {
                        while (reader.Read())
                        {
                            number.Add(new QuotationDataModel
                            {
                                QuotationNumber = reader["QuotationNumber"].ToString()
                            });
                        }
                    }
                    return number;
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