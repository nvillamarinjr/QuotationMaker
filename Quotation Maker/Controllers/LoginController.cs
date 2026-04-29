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
            if (!isValid)
                return Json(new { success = false, error = "Invalid username or password" });

            bool isAdmin = userDAL.GetUserName(username, out string fullName);
            // Server-side protection
            Session["IsAdmin"] = isAdmin;   
            Session["Name"] = fullName;

            return Json(new
            {
                success = true,
                fullName = fullName,
                isAdmin = isAdmin
            });
        }

        [HttpPost]
        public ActionResult KeepAlive()
        {
            Session["ResetSession"] = DateTime.Now;
            return new HttpStatusCodeResult(200);
        }



        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();

            Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();

            return RedirectToAction("Login", "Home");
        }
    }
}