using Microsoft.Reporting.WebForms;
using Quotation_Maker.DAL;
using Quotation_Maker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Quotation_Maker.Controllers
{
    public class EditQuotationController : Controller
    {
        private readonly UpdateQuotation_DAL _dal = new UpdateQuotation_DAL();
        // GET: EditQuotation
        public JsonResult GetQuotationData()
        {
            try 
            {
                var result = _dal.GetQuotationData();
                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetItemList(string QuotationNumber)
        {
            try
            {
                var result = _dal.GetItemList(QuotationNumber);
                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDeliveryItemList(string QuotationNumber)
        {
            try
            {
                var result = _dal.GetDeliveryItem(QuotationNumber);
                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetLabor(string QuotationNumber)
        {
            try
            {
                var result = _dal.GetLaborList(QuotationNumber);
                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateQuotation(string QuotationNumber, DateTime QuotationDate, string Validity, DateTime ValidUntil,
                                                string ReferenceNumber, string QuotationTo, string Requestor, string Attention, string Department, string Thru, string LocalNo,
                                                string Subject, string MaterialsSubTotal, string LaborSubTotal, string Vat, string Total, string TotalInWords, byte[] PDF)
        {
            try
            {
                var result = await _dal.UpdateQuotation(QuotationNumber, QuotationDate, Validity, ValidUntil,
                                     ReferenceNumber, QuotationTo, Requestor, Attention, Department, Thru, LocalNo,
                                     Subject, MaterialsSubTotal, LaborSubTotal, Vat, Total, TotalInWords, Session["Name"].ToString());
                byte[] pdfbyte = GenerateInsertPDF(QuotationNumber);
                var result1 = await _dal.updatepdf(pdfbyte, QuotationNumber);
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult InsertDeliveryItems(string InvNo, string DeliveredTo, DateTime Date, string Address, string ReferenceNo, string PONo, string PRNo, string Requestor, string PlateNo, string PreparedBy)
        {
            try
            {
                var result = _dal.InsertDeliveryItemsData(InvNo, DeliveredTo, Date, Address, ReferenceNo, PONo, PRNo, Requestor, PlateNo, Session["Name"].ToString(), PreparedBy);
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex) {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult SaveDeliveryItems(List<ItemViewModel> items, string InvNo)
        {
            try
            {
                var result = _dal.InsertDeliveryItems(items, InvNo, Session["Name"].ToString());
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult SaveItems(List<ItemViewModel> items, string QuotationNumber)
        {
            try
            {
                var result = _dal.UpdateItem(items, QuotationNumber, Session["Name"].ToString());
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult SaveLabor(List<LaborViewModel> items, string QuotationNumber)
        {
            try
            {
                var result = _dal.UpdateLabor(items, QuotationNumber, Session["Name"].ToString());
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GeneratePdf(string QuotationNumber)
        {
            // Path to your RDLC file
            string rdlcPath = Server.MapPath("~/Reports/Quotation.rdlc");

            // Create LocalReport instance
            LocalReport localReport = new LocalReport
            {
                ReportPath = rdlcPath
            };


            var laborList = _dal.GetLaborList(QuotationNumber);
            var itemList = _dal.GetItemList(QuotationNumber);
            var quotationData = _dal.GetQuotationData(QuotationNumber);

            localReport.DataSources.Clear();
            localReport.DataSources.Add(new ReportDataSource("LaborDescription", laborList));
            localReport.DataSources.Add(new ReportDataSource("ItemDescription", itemList));
            localReport.DataSources.Add(new ReportDataSource("QuotationData", quotationData));

            ReportParameter param = new ReportParameter("QuotationParam", QuotationNumber);
            localReport.SetParameters(new ReportParameter[] { param });

            // Render report to PDF
            string mimeType, encoding, fileNameExtension;
            string[] streams;
            string deviceInfo = @"<DeviceInfo>
                                     <EmbedFonts>true</EmbedFonts>
                                 </DeviceInfo>";
            Warning[] warnings;

            byte[] renderedBytes = localReport.Render(
                "PDF", deviceInfo, out mimeType, out encoding,
                out fileNameExtension, out streams, out warnings);
            // Return PDF file
            return File(renderedBytes, "application/pdf", $"{QuotationNumber}.pdf");

        }
        [HttpGet]
        public ActionResult GenerateDeliveryPdf(string InvNo)
        {
            // Path to your RDLC file
            string rdlcPath = Server.MapPath("~/Reports/DeliveryReceipt.rdlc");

            // Create LocalReport instance
            LocalReport localReport = new LocalReport
            {
                ReportPath = rdlcPath
            };


            var ItemList = _dal.GetDeliveryItemList(InvNo);
            var Details = _dal.GetDeliveryReceipt(InvNo);
            localReport.DataSources.Clear();
            localReport.DataSources.Add(new ReportDataSource("GetDeliveryItemList", ItemList));
            localReport.DataSources.Add(new ReportDataSource("GetDeliveryReceipt", Details));

            ReportParameter param = new ReportParameter("InvNo", InvNo);
            localReport.SetParameters(new ReportParameter[] { param });

            // Render report to PDF
            string mimeType, encoding, fileNameExtension;
            string[] streams;
            string deviceInfo = @"<DeviceInfo>
                                     <EmbedFonts>true</EmbedFonts>
                                 </DeviceInfo>";
            Warning[] warnings;

            byte[] renderedBytes = localReport.Render(
                "PDF", deviceInfo, out mimeType, out encoding,
                out fileNameExtension, out streams, out warnings);
            // Return PDF file
            return File(renderedBytes, "application/pdf", $"{InvNo}.pdf");

        }

        #region for insert
        [HttpGet]
        public byte[] GenerateInsertPDF(string QuotationNumber)
        {
            // Path to your RDLC file
            string rdlcPath = Server.MapPath("~/Reports/Quotation.rdlc");

            // Create LocalReport instance
            LocalReport localReport = new LocalReport
            {
                ReportPath = rdlcPath
            };


            var laborList = _dal.GetLaborList(QuotationNumber);
            var itemList = _dal.GetItemList(QuotationNumber);
            var quotationData = _dal.GetQuotationData(QuotationNumber);

            localReport.DataSources.Clear();
            localReport.DataSources.Add(new ReportDataSource("LaborDescription", laborList));
            localReport.DataSources.Add(new ReportDataSource("ItemDescription", itemList));
            localReport.DataSources.Add(new ReportDataSource("QuotationData", quotationData));

            ReportParameter param = new ReportParameter("QuotationParam", QuotationNumber);
            localReport.SetParameters(new ReportParameter[] { param });

            // Render report to PDF
            string mimeType, encoding, fileNameExtension;
            string[] streams;
            string deviceInfo = @"<DeviceInfo>
                                     <EmbedFonts>true</EmbedFonts>
                                 </DeviceInfo>";
            Warning[] warnings;

            byte[] renderedBytes = localReport.Render(
                "PDF", deviceInfo, out mimeType, out encoding,
                out fileNameExtension, out streams, out warnings);
            // Return PDF file
            return (renderedBytes);

        }
        #endregion

        public ActionResult GetNumber()
        {
            try
            {
                var number = _dal.GetLatestNumber();
                return Json(new { success = true, number }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Index()
        {
            return View();
        }
    }
}