using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class ReportModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public bool sendReport(ReportObject_Post obj)
        {
            try
            {
                report r = new report()
                {
                    report_type = obj.report_type,
                    report_source_user_ID = obj.user_ID,
                    report_source_item_ID = obj.report_item_ID,
                    report_description = obj.report_description,
                    report_date = DateTime.UtcNow,
                    report_isDone = false
                };

                db.reports.InsertOnSubmit(r);
                db.SubmitChanges();
                return true;
            }
            catch
            {
                return false;
            }   
        }

        public bool deleteReport(int report_source_item_ID, int report_type)
        {
            try
            {
                List<report> rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && r.report_type == report_type).ToList();
                db.reports.DeleteAllOnSubmit(rt);
                db.SubmitChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }


    /*POST*/
    public class ReportObject_Post
    {
        public string api_key { get; set; }
        public int user_ID { get; set; }
        public int report_type { get; set; }
        public int report_item_ID { get; set; }
        public string report_description { get; set; }
    }

    public class ReportObject_PostResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

    /*DELETE*/
    public class ReportObjectDelete_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }


}