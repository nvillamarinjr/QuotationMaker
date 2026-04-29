using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Quotation_Maker.Filters
{
    public class SessionAuthorizeAttribute : ActionFilterAttribute
    {        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var session = HttpContext.Current.Session;
            if (session["Name"] == null)
            {
                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary
                    {
                    {"controller", "Home" },
                    {"action", "Login" },
                    {"timeout", "true" }
                    });
            }
            base.OnActionExecuting(filterContext);
        }
    }
}