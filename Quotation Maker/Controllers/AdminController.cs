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
    public class AdminController : Controller
    {
        private readonly Admin_DAL _dal = new Admin_DAL();


        #region requestor List
        [HttpGet]
        public async Task<ActionResult> GetRequestorList()
        {
            try
            {
                List<RequestorList> reqlist = await _dal.GetRequestorLists();
                return Json(reqlist, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json( ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion


        #region ItemList
        [HttpGet]
        public async Task<ActionResult> GetItemList()
        {
            try
            {
                List<ItemList> itemlist = await _dal.GetItemList();
                return Json(itemlist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json( ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Labor List
        [HttpGet]
        public async Task<ActionResult> GetLaborList()
        {
            try
            {
                List<LaborList> laborlist = await _dal.GetLaborList();
                return Json(laborlist, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region insert Requestor
        [HttpPost]
        public async Task<ActionResult> AddRequestor(string requestor, string department, string localNo)
        {
            try
            {
                var success = await _dal.AddRequestor(requestor, department, localNo);
                return Json(new { success = success }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json( ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Delete requestor
        public async Task<ActionResult> DeleteRequestor(string requestor, string department, string localNo)
        {
            try
            {
            var success = await _dal.DeleteRequestor(requestor, department, localNo);
            return Json(new { success = success }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region insert item
        [HttpPost]
        public async Task<ActionResult> AddItem(string item, string rate)
        {
            try
            {
                var success = await _dal.InsertItem(item, rate);
                return Json( new {success = success}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region delete item
        [HttpPost]
        public async Task<ActionResult> DeleteItem(string item, string rate)
        {
            try
            {
                var success = await _dal.DeleteItem(item, rate);
                return Json(new {success =success}, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json( ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region insert labor
        [HttpPost]
        public async Task<ActionResult> AddLabor(string labor, string rate)
        {
            try
            {
                var success = await _dal.AddLabor(labor, rate);
                return Json(new {success = success}, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region delete labor
        public async Task<ActionResult> DeleteLabor(string labor, string rate)
        {
            try
            {
                var success = await _dal.DeleteLabor(labor, rate);
                return Json(new { success = success }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) 
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }
    }
}