using Quotation_Maker.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Quotation_Maker.DAL
{
    public class UpdateQuotation_DAL
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["QuotationMaker"].ConnectionString;


        public List<QuotationDataModel> GetQuotationData()
        {

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    List<QuotationDataModel> list = new List<QuotationDataModel>();
                    SqlCommand cmd = new SqlCommand("spr_EditQuotation", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new QuotationDataModel
                        {
                            QuotationNumber = reader["QuotationNumber"].ToString(),
                            QuotationDate = Convert.ToDateTime(reader["QuotationDate"].ToString()),
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
                            Username = reader["Username"].ToString(),
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

        public List<ItemViewModel> GetDeliveryItem(string QuotationNumber)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                using (SqlCommand com = new SqlCommand("spr_GetDeliveryItem", con))
                {
                    List<ItemViewModel> list = new List<ItemViewModel>();
                    con.OpenAsync();
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@QuotationNumber", QuotationNumber);

                    SqlDataReader reader = com.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new ItemViewModel
                        {
                            ItemDescription = reader["ItemDescription"].ToString(),
                            Qty = Convert.ToInt32(reader["Qty"].ToString()),
                            Unit = reader["Unit"].ToString()
                        });
                    }
                    return list;
                }
            }
            catch
            {
                throw;
            }

        }
        public List<ItemViewModel> GetDeliveryItemList(string InvNo)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                using (SqlCommand com = new SqlCommand("spr_GetDeliveryItemList", con))
                {
                    List<ItemViewModel> list = new List<ItemViewModel>();
                    con.OpenAsync();
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@InvNo", InvNo);

                    SqlDataReader reader = com.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new ItemViewModel
                        {
                            ItemDescription = reader["ItemDescription"].ToString(),
                            Qty = Convert.ToInt32(reader["Qty"].ToString()),
                            Unit = reader["Unit"].ToString()
                        });
                    }
                    return list;
                }
            }
            catch
            {
                throw;
            }

        }

        public List<DeliveryReceiptList> GetDeliveryReceipt(string InvNo)
        {
            try
            {
                using(SqlConnection con = new SqlConnection(connectionString))
                using(SqlCommand com = new SqlCommand("spr_GetDeliveryReceipt", con))
                {
                    List<DeliveryReceiptList> list = new List<DeliveryReceiptList>(); 
                    con.Open();
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@InvNo", InvNo);

                    SqlDataReader reader = com.ExecuteReader();
                        while (reader.Read())
                        {
                        list.Add(new DeliveryReceiptList
                        {
                            DeliveredTo = reader["DeliveredTo"].ToString(),
                            InvNo = reader["InvNo"].ToString(),
                            Date = Convert.ToDateTime(reader["Date"].ToString()),
                            Address = reader["Address"].ToString(),
                            ReferenceNo = reader["ReferenceNo"].ToString(),
                            PONo = reader["PONo"].ToString(),
                            PRNo = reader["PRNo"].ToString(),
                            PlateNo = reader["PlateNo"].ToString(),
                            Requestor = reader["Requestor"].ToString(),
                            PreparedBy = reader["PreparedBy"].ToString()
                        });
                        }
                    return list;
                }
            }
            catch
            {
                throw;
            }
        }

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
                            Count = Convert.ToInt32(reader["Count"].ToString()),
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
                            Qty = Convert.ToInt32(reader["Qty"].ToString()),
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
                            QuotationDate = Convert.ToDateTime(reader["QuotationDate"].ToString()),
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

        #region update quotation
        public async Task<bool> UpdateQuotation(string QuotationNumber, DateTime QuotationDate, string Validity, DateTime ValidUntil,
                                                string ReferenceNumber, string QuotationTo, string Requestor, string Attention, string Department, string Thru, string LocalNo,
                                                string Subject, string MaterialsSubTotal, string LaborSubTotal, string Vat, string Total, string TotalInWords, string Username)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                using (SqlCommand com = new SqlCommand("spr_UpdateQuotation", con))
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

                    await com.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> updatepdf(byte[] PDF, string QuotationNumber)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                using(SqlCommand com = new SqlCommand("spr_UpdatePDF", con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    com.Parameters.AddWithValue("@QuotationNumber", QuotationNumber); 
                    com.Parameters.AddWithValue("@PDF", PDF);

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

        #region Update and insert item
        public bool UpdateItem(List<ItemViewModel> items, string QuotationNumber, string username)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    using (SqlCommand com = new SqlCommand("spr_DeleteListOfItems", conn))
                    {
                        com.CommandType = CommandType.StoredProcedure;
                        com.Parameters.AddWithValue("@QuotationNumber", QuotationNumber);
                        com.ExecuteNonQuery();
                    }

                    foreach (var item in items)
                    {
                        using (SqlCommand cmd = new SqlCommand("spr_UpdateItem", conn))
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
        public bool InsertDeliveryItemsData(string InvNo, string DeliveredTo, DateTime Date, string Address, string ReferenceNo, string PONo, string PRNo, string Requestor, string PlateNo, string username, string PreparedBy)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    using (SqlCommand com = new SqlCommand("spr_InsertDeliveryReceipt", conn))
                    {
                        com.CommandType = CommandType.StoredProcedure;
                        com.Parameters.AddWithValue("@InvNo", InvNo);
                        com.Parameters.AddWithValue("@DeliveredTo", DeliveredTo);
                        com.Parameters.AddWithValue("@Date", Date);
                        com.Parameters.AddWithValue("@Address", Address);
                        com.Parameters.AddWithValue("@ReferenceNo", ReferenceNo);
                        com.Parameters.AddWithValue("@PONo", PONo);
                        com.Parameters.AddWithValue("@PRNo", PRNo);
                        com.Parameters.AddWithValue("@Requestor", Requestor);
                        com.Parameters.AddWithValue("@PlateNo", PlateNo);
                        com.Parameters.AddWithValue("@Username", username);
                        com.Parameters.AddWithValue("@PreparedBy", PreparedBy);
                        com.ExecuteNonQuery();
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


        #region insert Delivery item
        public bool InsertDeliveryItems(List<ItemViewModel> items, string InvNo, string username)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    foreach (var item in items)
                    {
                        using (SqlCommand cmd = new SqlCommand("spr_InsertDeliveryListOfItems", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@InvNo", InvNo);
                            cmd.Parameters.AddWithValue("@ItemDescription", item.ItemDescription);
                            cmd.Parameters.AddWithValue("@Qty", item.Qty);
                            cmd.Parameters.AddWithValue("@Unit", item.Unit);
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
        public bool UpdateLabor(List<LaborViewModel> items, string QuotationNumber, string username)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand com = new SqlCommand("spr_DeleteLaborDescription", conn))
                    {
                        com.CommandType = CommandType.StoredProcedure;
                        com.Parameters.AddWithValue("@QuotationNumber", QuotationNumber);
                        com.ExecuteNonQuery();
                    }
                    foreach (var item in items)
                    {
                        using (SqlCommand cmd = new SqlCommand("spr_UpdateLabor", conn))
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
                using (SqlConnection con = new SqlConnection(connectionString))
                using (SqlCommand com = new SqlCommand("spr_GenerateNo", con))
                {
                    List<QuotationDataModel> number = new List<QuotationDataModel>();
                    com.CommandType = CommandType.StoredProcedure;
                    con.Open();

                    using (SqlDataReader reader = com.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            number.Add(new QuotationDataModel
                            {
                                InvNo = reader["InvNo"].ToString()
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