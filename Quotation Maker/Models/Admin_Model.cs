using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quotation_Maker.Models
{
    public class Admin_Model
    {
    }

    public class RequestorList
    {
        public string requestor { get; set; }
        public string dept { get; set; }
        public int localnum { get; set; }
    }

    public class DeliveryReceiptList
    {
        public string InvNo { get; set; }
        public string DeliveredTo { get; set; }
        public DateTime Date { get; set; }
        public string Address{ get; set; }
        public string ReferenceNo { get; set; }
        public string PONo { get; set; }
        public string PRNo { get; set; }
        public string Requestor { get; set; }
        public string PreparedBy { get; set; }
        public string PlateNo { get; set; }
    }
    public class ItemList
    {
        public string item { get; set; }
        public decimal? rate { get; set; }
    }

    public class LaborList
    {
        public string labor { get; set; }
        public decimal rate { get; set; }
    }


    public class ItemViewModel
    {
        public string ItemDescription { get; set; }
        public int Qty { get; set; }
        public string Unit { get; set; }
        public string Rate { get; set; }
        public string Amount { get; set; }
    }
    public class LaborViewModel
    {
        public string LaborDescription { get; set; }
        public int Count { get; set; }
        public string WorkingDay { get; set; }
        public string Rate { get; set; }
        public string Amount { get; set; }
    }
    public class QuotationDataModel
    {
        public string QuotationNumber { get; set; }
        public DateTime QuotationDate { get; set; }
        public string Validity { get; set; }
        public DateTime ValidUntil { get; set; }
        public string ReferenceNumber { get; set; }
        public string InvNo { get; set; }
        public string Requestor { get; set; }
        public string QuotationTo { get; set; }
        public string Attention { get; set; }
        public string Department { get; set; }
        public string Thru { get; set; }
        public string LocalNo { get; set; }
        public string Subject { get; set; }
        public string LaborSubTotal { get; set; }
        public string Item { get; set; }
        public string MaterialsSubTotal { get; set; }
        public string Vat { get; set; }
        public string Total { get; set; }
        public string TotalInWords { get; set; }
        public string Username { get; set; }
    }
}