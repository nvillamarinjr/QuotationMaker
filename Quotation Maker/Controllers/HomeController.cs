using Quotation_Maker.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Quotation_Maker.Controllers
{
    public class HomeController : Controller
    {
        [SessionAuthorize]
        [NoCacheAtribute]
        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }
        [SessionAuthorize]
        [NoCacheAtribute]
        public ActionResult Admin()
        {
            return View();
        }
        [SessionAuthorize]
        [NoCacheAtribute]
        public ActionResult QuotationHistory()
        {
            return View();
        }
    }
}