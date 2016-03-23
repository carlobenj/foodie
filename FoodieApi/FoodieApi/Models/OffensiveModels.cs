using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class OffensiveModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public List<OffensiveObjectGet_Response> getOffensive()
        {
            try
            {
                List<int?> offensive_comment_ID = db.reports.Where(r => r.report_type == 11).Select(r => r.report_source_item_ID).Distinct().ToList();

                List<OffensiveObjectGet_Response> result = new List<OffensiveObjectGet_Response>();
                foreach (int id in offensive_comment_ID)
                {
                    if (db.comments.Any(c => c.comment_ID == id))
                    {
                        result.Add(
                        db.reports.Where(r => r.report_source_item_ID == id && r.report_type == 11).Select(r => new OffensiveObjectGet_Response
                        {
                            report_ID = r.report_ID,
                            report_type = r.report_type,
                            report_date = r.report_date,
                            foodict_username = r.user.user_name,
                            foodict_image = r.user.foodicts.Where(f => f.user_ID == r.report_source_user_ID).Select(f => f.foodict_image).First(),
                            comment_content = db.comments.Where(c => c.comment_ID == id).Select(c => c.comment_content).First(),

                            report_description = r.report_description,
                            report_source_user_ID = r.report_source_user_ID,
                            report_source_item_ID = r.report_source_item_ID,
                            report_isDone = r.report_isDone,

                            otherReportersCount = db.reports.Where(rp => rp.report_source_item_ID == r.report_source_item_ID && rp.report_type == 11 && rp.report_source_user_ID != r.report_source_user_ID).Select(rp => rp.report_source_user_ID).Distinct().Count()
                        }).First());
                    }
                    else
                    {
                        report r = db.reports.Where(rp => rp.report_source_item_ID == id && rp.report_type == 11).First();
                        db.reports.DeleteOnSubmit(r);
                        db.SubmitChanges();
                    }                    
                }

                return result.OrderByDescending(r => r.report_ID).ToList();
            }
            catch
            {
                return null;
            }
        }

        public OffensiveObjectPost_Response getReport(int report_ID, int type)
        {
            try
            {
                int? focus = db.reports.Where(r => r.report_ID == report_ID).Select(r => r.report_source_item_ID).First();
                //other reporters
                List<reporter> others = db.reports.Where(r => r.report_source_item_ID == focus && r.report_type == type).Select(r => new reporter
                {
                    user_ID = r.user.user_ID,
                    foodict_ID = db.foodicts.Where(f => f.user.user_ID == r.report_source_user_ID).Select(f => f.foodict_ID).First(),
                    foodict_image = db.foodicts.Where(f => f.user.user_ID == r.report_source_user_ID).Select(f => f.foodict_image).First(),
                    foodict_username = r.user.user_name,
                    report_description = r.report_description,
                    report_date = r.report_date

                }).ToList();


                switch (type)
                {

                    case 11:
                        //offensive comment
                        return db.reports.Where(r => r.report_ID == report_ID).Select(r => new OffensiveObjectPost_Response
                        {
                            report_ID = r.report_ID,
                            report_type = r.report_type,
                            report_date = r.report_date,
                            comment_content = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.comment_content).First(),
                            comment_date = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.comment_date).First(),
                            foodict_username = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.foodict.user.user_name).First(),
                            foodict_image = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.foodict.foodict_image).First(),

                            report_description = r.report_description,
                            report_source_user_ID = r.report_source_user_ID,
                            report_source_item_ID = r.report_source_item_ID,
                            report_isDone = r.report_isDone,
                            reporters = others
                        }).First();
                    default:
                        return null;
                }
            }
            catch
            {
                return null;
            }
            
        }
        public bool penalty(int report_ID, int report_source_item_ID, int report_type, int penalty_amount)
        {
            try
            {
                foodict fd = new foodict();
                List<report> rt = new List<report>(); 
                report rpts = db.reports.Where(r => r.report_ID == report_ID).First();
                foodict fdts = db.foodicts.Where(f => f.user_ID == rpts.report_source_user_ID).First();
                int award = penalty_amount > 10 ? penalty_amount : 10;
                switch (report_type)
                {
                    case 11:
                        //offensive comment
                        comment ct = db.comments.Where(c => c.comment_ID == report_source_item_ID).First();
                        fd = db.foodicts.Where(f => f.foodict_ID == ct.comment_source_foodict_ID).First();

                        //penalize foodict
                        if (fd.foodict_foodie_points >= penalty_amount)
                        {
                            fd.foodict_foodie_points -= penalty_amount;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, ct.comment_ID, 212, penalty_amount, ct.post.post_title, ct.comment_content);
                        }
                        else
                        {
                            fd.foodict_foodie_points = 0;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, ct.comment_ID, 212, fd.foodict_foodie_points, ct.post.post_title, ct.comment_content);
                        }
                        db.SubmitChanges();

                        //delete item
                        db.comments.DeleteOnSubmit(ct);
                        db.SubmitChanges();


                        //delete report                        
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 10 || r.report_type == 11)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, ct.comment_ID, 0, award);
                        return true;
                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }

        }
        public bool delete(int report_ID, int report_source_item_ID, int report_type)
        {
            try
            {
                List<report> rt = new List<report>();
                report rpts = db.reports.Where(r => r.report_ID == report_ID).First();
                foodict fdts = db.foodicts.Where(f => f.user_ID == rpts.report_source_user_ID).First();
                int award = 10;
                switch (report_type)
                {
                    case 11:
                        //offensive comment
                        comment ct = db.comments.Where(c => c.comment_ID == report_source_item_ID).First();
                        foodict fd = db.foodicts.Where(f => f.foodict_ID == ct.comment_source_foodict_ID).First();
                        //delete item
                        db.comments.DeleteOnSubmit(ct);
                        db.SubmitChanges();


                        //create noti
                        fts.createNotification(0, 0, fd.foodict_ID, ct.comment_ID, 211, 0, ct.post.post_title, ct.comment_content);

                        //delete report
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 10 || r.report_type == 11)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, ct.comment_ID, 0, award);
                        return true;
                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }

        }
    }

    /*GET*/
    public class OffensiveObjectGet_Response
    {
        public int report_ID { get; set; }
        public int report_type { get; set; }

        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string target_foodict_username { get; set; }
        public string post_title { get; set; }
        public string report_item_image { get; set; }
        public string comment_content { get; set; }

        public int report_source_user_ID { get; set; }
        public int? report_source_item_ID { get; set; }
        public string report_description { get; set; }
        public DateTime report_date { get; set; }
        public bool report_isDone { get; set; }
        public int otherReportersCount { get; set; }
    }
    public class OffensiveObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<OffensiveObjectGet_Response> result { get; set; }
    }

    /*POST*/
    public class OffensiveObjectPost_Request
    {
        public string api_key { get; set; }
        public int administrator_ID { get; set; }
        public int report_ID { get; set; }
        public int report_type { get; set; }
    }
    public class OffensiveObjectPost_Response
    {
        public int report_ID { get; set; }
        public int report_type { get; set; }

        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string target_foodict_username { get; set; }
        public string post_title { get; set; }
        public string post_image { get; set; }
        public string post_text { get; set; }
        public DateTime? post_date { get; set; }
        public int bitesCount { get; set; }
        public string report_item_image { get; set; }
        public string comment_content { get; set; }
        public DateTime? comment_date { get; set; }

        public int report_source_user_ID { get; set; }
        public int? report_source_item_ID { get; set; }
        public string report_description { get; set; }
        public DateTime report_date { get; set; }
        public bool report_isDone { get; set; }
        public List<reporter> reporters { get; set; }
    }

    public class OffensiveObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public OffensiveObjectPost_Response result { get; set; }
    }

    /*PUT*/
    public class OffensiveObjectPut_Request
    {
        public string api_key { get; set; }
        public int administrator_ID { get; set; }
        public int report_ID { get; set; }
        public int report_source_item_ID { get; set; }
        public int report_type { get; set; }
        public int penalty_amount { get; set; }
    }
    public class OffensiveObjectPut_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

    /*DELETE*/
    public class OffensiveObjectDelete_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}