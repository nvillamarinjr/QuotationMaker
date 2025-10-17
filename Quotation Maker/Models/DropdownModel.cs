using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quotation_Maker.Models
{
    public class Requestor
    {
        public string requestor { get; set; }
    }

    public class Items
    {
        public string itemname { get; set; }
        public decimal rate { get; set; } 
    }
}