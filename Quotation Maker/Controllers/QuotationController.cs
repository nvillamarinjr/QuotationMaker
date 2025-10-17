using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quotation_Maker.DAL;
using System.Web.Mvc;

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
    }
}