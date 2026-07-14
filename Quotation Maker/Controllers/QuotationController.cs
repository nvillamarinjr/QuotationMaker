using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quotation_Maker.DAL;
using System.Web.Mvc;
using System.Threading.Tasks;
using Quotation_Maker.Models;
using System.IO;
using Microsoft.Reporting.WebForms;

namespace Quotation_Maker.Controllers
{
    public class QuotationController : Controller
    {

        private readonly Quotation_DAL _dal = new Quotation_DAL();

        [HttpGet]
        public JsonResult GetRequestors()
        {
            try
            {
                var requestors = _dal.GetAllRequestors();
                return Json(requestors, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult GetItems()
        {
            try
            {
                var items = _dal.GetAllItems();
                return Json(items, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetLabor()
        {
            try
            {
                var labors = _dal.GetAllLabor();
                return Json(labors, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> InsertQuotation(string QuotationNumber, DateTime QuotationDate, string Validity, DateTime ValidUntil,
                                                string ReferenceNumber, string QuotationTo, string Requestor, string Attention, string Department, string Thru, string LocalNo,
                                                string Subject, string MaterialsSubTotal, string LaborSubTotal, string Vat, string Total, string TotalInWords)
        {
            try
            {
                byte[] pdfbyte = GenerateInsertPDF(QuotationNumber);
                var result = await _dal.InsertQuotation(QuotationNumber, QuotationDate, Validity, ValidUntil,
                                     ReferenceNumber, QuotationTo, Requestor, Attention, Department, Thru, LocalNo,
                                     Subject, MaterialsSubTotal, LaborSubTotal, Vat, Total, TotalInWords, Session["Name"].ToString(), pdfbyte);
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult SaveItems(List<ItemViewModel> items, string QuotationNumber)
        {
            try
            {
                var result = _dal.InsertItems(items, QuotationNumber, Session["Name"].ToString());
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
                var result = _dal.InsertLabor(items, QuotationNumber, Session["Name"].ToString());
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

        [HttpPost]
        public async Task<ActionResult> InsertDuplicate(string QuotationNumber)
        {
            try
            {
                byte[] pdfbyte = GenerateInsertPDF(QuotationNumber);
                var result = await _dal.DuplicateData(QuotationNumber);
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
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


        #region For viewing PDF
        [HttpGet]
        public ActionResult ViewPdf(string QuotationNumber)
        {
            string rdlcPath = Server.MapPath("~/Reports/Quotation.rdlc");

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

            string mimeType, encoding, fileNameExtension;
            string[] streams;
            Warning[] warnings;
            string deviceInfo = @"<DeviceInfo><EmbedFonts>true</EmbedFonts></DeviceInfo>";

            byte[] renderedBytes = localReport.Render(
                "PDF", deviceInfo, out mimeType, out encoding,
                out fileNameExtension, out streams, out warnings);

            // Instead of forcing download, return inline view
            Response.AppendHeader("Content-Disposition", "inline; filename=" + QuotationNumber + ".pdf");
            return File(renderedBytes, "application/pdf");
        }

        #endregion

        public ActionResult GetNumber()
        {
            try
            {
                var number = _dal.GetLatestNumber();
                return Json(new { success = true, number }, JsonRequestBehavior.AllowGet);
            }catch(Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}