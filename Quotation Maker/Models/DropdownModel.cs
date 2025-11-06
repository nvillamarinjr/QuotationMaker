using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quotation_Maker.Models
{
    public class Requestor
    {
        public string requestor { get; set; }
        public string dept { get; set; }
        public int localnum { get; set; }
    }

    public class Items
    {
        public string itemname { get; set; }
        public decimal rate { get; set; } 
    }

    public class Labor
    {
        public string desc { get; set; }
        public decimal laborrate { get; set; }
    }

}