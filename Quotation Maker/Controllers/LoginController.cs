using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Quotation_Maker.DAL;

namespace Quotation_Maker.Controllers
{
    public class LoginController : Controller
    {
        private Login_DAL userDAL = new Login_DAL();

        [HttpPost]
        public JsonResult UserLogin(string username, string password)
        {
            bool isValid = userDAL.ValidateUser(username, password);
            if (isValid)
                return Json(new { success = true });
            else
                return Json(new { success = false, error = "Invalid username or password" });
        }
    }
}